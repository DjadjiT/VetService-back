const User = require("../models/user");
const {UserDoesntExistError, UserError} = require("../configs/customError")
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
    }
    let products = await stripe.products.search(query);

    let prodList = []

    for(const prod of products.data){
        const price = await stripe.prices.retrieve(
            prod.default_price
        );

        let unitAmount = price.unit_amount_decimal.slice(0, 2) + "." + price.unit_amount_decimal.slice(2);

        prodList.push({
            id: prod.id,
            images: prod.images,
            description: prod.description,
            name: prod.name,
            price: {
                id: price.id,
                currency: price.currency,
                unit_amount: unitAmount,
            }
        })
    }
    return prodList
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
        success_url: process.env.WEBSECURE+process.env.FRONT_URI,
        cancel_url: process.env.WEBSECURE+process.env.FRONT_URI+'/#/fail',
    });
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
