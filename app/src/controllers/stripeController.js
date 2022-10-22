const {UserDoesntExistError, UserError} = require("../configs/customError")
const {getSubscriptionsByUser, getProductList, buyProduct} = require("../services/stripeService")

exports.getMySuscription = async (req, res) =>{
    try{
        let result = await getSubscriptionsByUser(req.userId)
        console.log(result)
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

exports.buyProduct = async (req, res) =>{
    try{
        let session = await buyProduct(req.query.priceId, req.query.productId)
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
