const User = require("../models/user");
const Order = require("../models/order");
const {sendOrderMail} = require("./smtpService");
const {ORDERSTATUS} = require("../models/enum/enum")
const {UserDoesntExistError, OrderDoesntExistError, OrderError} = require("../configs/customError")
const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);

exports.getSubscriptionsByUser = async (userId) =>{
    let user = await User.findById(userId);
    if (!user) throw new UserDoesntExistError()

    let query = {
        query: 'metadata[\'user_id\']:\''+user._id.toString()+'\'',
    }
    let subList = await stripe.subscriptions.search(query);
    let invoicesList = []
    let invoices

    for (const sub of subList.data) {
        if(sub.plan.active){
            let query = {
                query: 'subscription:\''+sub.id+'\'',
            }
            invoices = await stripe.invoices.search(query);

            for(const invo of invoices.data){
                invoicesList.push({
                    id: invo.id,
                    invoiceUrl: invo.hosted_invoice_url,
                    startDate: new Date(sub.start_date * 1000)
                })
            }
        }
    }
    return invoicesList
}

exports.getProductList = async () =>{
    let query = {
        query: "active: \'true\' AND metadata[\'boutique\']: \'ligne\'",
        limit: 100
    }
    let products = await stripe.products.search(query);

    let prodList = []

    for(const prod of products.data){
        const price = await stripe.prices.retrieve(
            prod.default_price
        );

        prodList.push(prodToDto(prod, price))
    }
    return prodList
}

function prodToDto(prod, price){
    let unitAmount = price.unit_amount_decimal.slice(0, price.unit_amount_decimal.length-2) + "." + price.unit_amount_decimal.slice(price.unit_amount_decimal.length-2);
    return {
        id: prod.id,
        images: prod.images,
        description: prod.description,
        name: prod.name,
        price: {
            id: price.id,
            currency: price.currency,
            unit_amount: unitAmount,
        }
    }
}

exports.getProductDto = (prod, price) => {
    return prodToDto(prod, price)
}

exports.buyProductList = async (productIdList) => {
    let items = getAllLineItems(productIdList)

    return stripe.checkout.sessions.create({
        mode: 'payment',
        allow_promotion_codes: true,
        shipping_address_collection: {
            allowed_countries: ["FR"]
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'eur',
                    },
                    display_name: 'Livraison standard',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    }
                }
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1000,
                        currency: 'eur',
                    },
                    display_name: 'Livraison rapide',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 2,
                        },
                    }
                }
            },
        ],
        payment_method_types: ['card'],
        line_items: items,
        success_url: process.env.WEBSECURE+process.env.FRONT_URI+"/#/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.WEBSECURE+process.env.FRONT_URI+'/#/fail',
    });
}

exports.webhookTrigger = async (event) =>{
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object

            let total = data.amount_total.toString();
            let price = total.slice(0, total.length-2) + "." + total.slice(total.length-2);

            let order = new Order({
                name: data.customer_details.name,
                street: data.customer_details.address.line1,
                postalCode: data.customer_details.address.postal_code,
                city: data.customer_details.address.city,
                status: "preparation",
                mail: data.customer_details.email,
                price: price,
                csId: data.id,
                requestDate: new Date(),
                shippingMethod: getShipping(data.shipping_rate, data.shipping_options),
                item: [],
            })

            let lineItems = await stripe.checkout.sessions.listLineItems(order.csId);

            for(let item of lineItems.data){
                order.item.push({
                    name: item.description,
                    quantity: item.quantity
                })
            }
            let newOrder = await order.save()

            sendOrderMail(newOrder, ORDERSTATUS.PREPARATION)
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type : ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return "";
}

exports.updateOrderStatus = async (status, orderId) => {
    let order = await Order.findById(orderId)
    if(!order) throw new OrderDoesntExistError()

    if(!statusExist(status)) throw new OrderError("The status doesnt exist.")

    return Order.findByIdAndUpdate(orderId, {
        status: status
    }).then((data)=> {
        sendOrderMail(data, status)
    })
}

exports.getOrderByStatus = async (status) => {
    if(!statusExist(status)) throw new OrderError("The status doesnt exist.")

    return Order.find({
        status: status
    })
}

exports.getAllOrder = async () => {
    return Order.find()
}

function getShipping(shippingRate, shippingOptions){
    for(let option of shippingOptions){
        if(option.shipping_rate === shippingRate){
            return option.shipping_amount===0?"standard":"fast"
        }
    }
    return ""
}

function statusExist(status) {
    for(let val of Object.values(ORDERSTATUS)){
        if(status.toLowerCase() === val.toLowerCase()){
            return true
        }
    }
    return false;
}

function getAllLineItems(prodList){
    let items = []

    for(const prod of prodList){
        let pd = {
            price_data: {
                currency: 'eur',
                product: prod.id,
                unit_amount: prod.price.unit_amount.replace(".", "")
            },
            quantity: 1,
            adjustable_quantity: {
                enabled: true
            }
        }
        items.push(pd)
    }
    return items
}

