const {check} = require("express-validator");
const Newsletter = require("../models/newsletter");
const User = require("../models/user");
const {ROLE} = require("../models/enum/enum");
const {NewsletterDoesntExistError, NewsletterError} = require("../configs/customError");
const {sendNewsletter} = require("../services/smtpService")

exports.newsletterCreation = [
    check("message", "Message is required").not().isEmpty(),
    check("object", "Object is required").not().isEmpty(),
    check("receiver", "Receiver is required").not().isEmpty(),
];

exports.createNewsletter = async (body) => {
    if(!checkReceiver(body.receiver)) throw NewsletterError("Newsletter receiver doesnt exist")
    let newsletter = new Newsletter({
        message: body.message,
        object: body.object,
        receiver: body.receiver.toLowerCase(),
        date: new Date()
    })
    let nl = await newsletter.save()

    if(body.receiver.toLowerCase() === ROLE.client){
        let userList = await User.find({
            role: ROLE.client
        })
        sendNewsletter(body.object, body.message, userList)
    }else if(body.receiver.toLowerCase() === ROLE.veterinary){
        let userList = await User.find({
            role: ROLE.veterinary
        })
        sendNewsletter(body.object, body.message, userList)
    }

    return nl
}


exports.getAllNewsletter = async () => {
    return Newsletter.find()
}

exports.deleteNewsletter = async (id) => {
    let nl = await Newsletter.findById(id)
    if(!nl) throw new NewsletterDoesntExistError()

    return Newsletter.deleteOne({_id: id})
}

function checkReceiver(receiver){
    return receiver.toLowerCase() === ROLE.client.toLowerCase()
        || receiver.toLowerCase() === ROLE.veterinary.toLowerCase()
}

