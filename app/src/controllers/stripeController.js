const {UserDoesntExistError, OrderDoesntExistError} = require("../configs/customError")
const {getSubscriptionsByUser, getProductList, buyProductList, webhookTrigger,
    getOrderByStatus, updateOrderStatus, getAllOrder} = require("../services/stripeService")


exports.getMySuscription = async (req, res) =>{
    try{
        let result = await getSubscriptionsByUser(req.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.getUserSuscription = async (req, res) =>{
    try{
        let result = await getSubscriptionsByUser(req.params.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.getProductList = async (req, res) =>{
    try{
        let result = await getProductList()
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.buyProducts = async (req, res) =>{
    try{
        let session = await buyProductList(req.body)
        return  res.status(200).json({
            sessionId: session.id
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.webHookCompleteOrder = async (req, res) =>{
    try{
        let result = await webhookTrigger(req.body)
        return res.status(201).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

exports.getOrderByStatus = async (req, res) =>{
    try{
        let result = await getOrderByStatus(req.query.status)
        return res.status(200).json(result)
    }catch (err){
        if(err instanceof OrderDoesntExistError){
            return res.status(404).json(err.message);
        }else {
            console.error(err.message);
            return res.status(400).json(err.message);
        }
    }
}

exports.getOrders = async (req, res) =>{
    try{
        let result = await getAllOrder()
        return res.status(200).json(result)
    }catch (err){
        if(err instanceof OrderDoesntExistError){
            return res.status(404).json(err.message);
        }else {
            console.error(err.message);
            return res.status(400).json(err.message);
        }
    }
}

exports.putOrder = async (req, res) =>{
    try{
        let result = await updateOrderStatus(req.body.status, req.params.id)
        return res.status(200).json(result)
    }catch (err){
        if(err instanceof OrderDoesntExistError){
            return res.status(404).json(err.message);
        }else {
            console.error(err.message);
            return res.status(400).json(err.message);
        }
    }
}

