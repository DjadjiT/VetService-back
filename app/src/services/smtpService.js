const nodemailer = require("nodemailer");
const {MAILACTION} = require("../models/enum/enum")

function getTransporter(){
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
}

function getMailOptions(receiver, object, msg){
    return {
        from: process.env.SMTP_MAIL,
        to: receiver,
        subject: object,
        text: msg
    };
}

function getMailOptionsForUserList(object, msg, userList){
    return {
        from: process.env.SMTP_MAIL,
        to: getUserMailList(userList),
        subject: object,
        text: msg
    };
}

function getUserMailList(userlist) {
    return userlist.map(a => a.email);
}

exports.sendNewsletter = async (object, msg, userList) =>{
    let transporter = getTransporter()
    let mailOptions = getMailOptionsForUserList(object, msg, userList)

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendMailTo = async (user, action) =>{
    let transporter = getTransporter()

    let msg = ""
    let object = ""
    switch (action){
        case MAILACTION.REGISTER:
            object = "Bienvenue à VetServices."
            msg = "Bonjour, et bienvenue, "+user.lastName+" "+user.firstName+" sur vetservice ici vous pouvez faire plein de truc.\n Comme acheter des produits et prendre des rendez-vous" +
                "Lors de votre première connexion, je vous conseil de créer un carnet de santé pour vos animaux."
            break;
        case MAILACTION.REGISTERVET:
            object = "Bienvenue à VetServices."
            msg = "Bonjour, et bienvenue, "+user.lastName+" "+user.firstName+ " sur vetservice ici vous pouvez faire plein de truc.\n Comme acheter des produits et faire des rendez-vous.\n\n" +
                "Pour le moment votre compte n'est pas actif.\nNous vous tiendrons informer de la validation de votre compte de la part d'un admin."
            break;
        case MAILACTION.REGISTERADMIN:
            object = "Bienvenue à VetServices"
            msg = "Bonjour & bienvenue sur vetservice, vous êtes un admin. Votre portez de lourde responsabilité sur vos épaules.\nVotre mot de passe est: "+user.password+"\nBon courage."
            break;
        case MAILACTION.UPDATE:
            object = "Votre compte a été modifié"
            msg = "La modification de votre compte a bien eu lieu."
            break;
        case MAILACTION.VALIDATION:
            object = "Votre compte a été validé."
            msg = "Voilà compte validé"
            break;
        case MAILACTION.DEACTIVATION:
            object = "Votre compte a été déactivé."
            msg = "Voilà compte désactivé"
            break;
        case MAILACTION.REFUSE:
            object = "Votre demande de compte pro n'as pas été accepté."
            msg = "Après vérification des informations présentes, nous avons décider de ne pas accorder suite à votre demande de création de compte professionel, sur notre plateforme vetService. " +
                "\nDans 3 jours, votre profil sera supprimé, vous pourrez alors recréer un profil pour refaire votre demande." +
                "\nSi vous considérez que cela n'est pas justifié, vous pouvez contacter le service administratif pour plus d'informations."
            break;
        case MAILACTION.DELETE:
            object = "Votre compte a été supprimé."
            msg = "Voilà compte supprimé."
            break;
    }

    let mailOptions = getMailOptions(user.email, object, msg)

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendHRMailTo = async (user, action, hr) =>{
    let transporter = getTransporter()

    let msg = ""
    let object = ""

    switch (action){
        case MAILACTION.HRCREATION:
            object = "Vous avez un nouveau carnet de santé."
            msg = "Le carnet de santé de "+hr.name+" a été crée avec succès."
            break;
        case MAILACTION.HRDELETION:
            object = "Votre carnet de santé a été supprimé."
            msg = "Le carnet de santé de "+hr.name+" a été supprimé."
            break;
        case MAILACTION.HRMODIFICATION:
            object = "Votre carnet de santé a été modifé."
            msg = "Le carnet de santé de "+hr.name+" a été modifié."
            break;
    }

    let mailOptions = getMailOptions(user.email, object, msg)

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendAppointmentMailTo = async (action, appointment, client, vet) =>{
    let transporter = getTransporter()

    let msg = ""
    let object = ""
    let date = new Date(appointment.date)
    let receiver = ""
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric"};
    let strDate = date.toLocaleDateString(undefined, options)
    strDate = strDate[0].toUpperCase() + strDate.slice(1)
    let mailOptions

    switch (action){
        case MAILACTION.APPOINTMENT:
            object = "Vous avez un nouveau rendez vous le : "+strDate
            receiver = [client.email, vet.email]
            msg = "Vous avez un rendez-vous le "+strDate+" avec le Dr."+vet.lastName+" "+vet.firstName+".\n\n" +
                "Adresse du praticien : "+vet.institutionName+", au "+vet.street+" "+vet.postalCode+", "+vet.city+"."


            mailOptions = getMailOptions(client.email, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            msg = "Vous avez un rendez-vous le "+strDate+" avec "+client.lastName+" "+client.firstName+"."

            mailOptions = getMailOptions(vet.email, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            break;
        case MAILACTION.APPOINTMENTUPDATE:
            object = "Votre rendez vous a été déplacé au : "+strDate
            msg = "Votre rendez vous avec le Dr."+vet.lastName+" "+vet.firstName+" a été déplacé au : "+strDate+
                "\nVous trouverez  votre practicien, à : "+vet.institutionName+", situé au : "+vet.street+" "+vet.postalCode+","+vet.city+"."

            mailOptions = getMailOptions(client.email, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            msg = "Votre rendez vous avec "+client.lastName+" "+client.firstName+" a été déplacé au : "+strDate+"."

            mailOptions = getMailOptions(vet.email, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            break;
        case MAILACTION.APPOINTMENTDELETE:
            object = "Votre rendez vous du "+strDate+" a été annulé."
            msg = "Votre rendez vous du "+strDate+" a été annulé."
            receiver = [client.email, vet.email]

            mailOptions = getMailOptions(receiver, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            mailOptions = getMailOptions(vet.email, object, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            break;
        default:
            break
    }
}

exports.sendOrderMail = async (order, status) => {
    let transporter = getTransporter()

    let msg = ""
    if(status === "preparation"){
        msg = "Votre commande a été enregistrée. Nous la préparons dans les plus brefs délais.\n\n"
        msg+="Nous vous tiendrons informer de l'avancement de la commande."
    }else if(status === "shipped"){
        msg = "Votre commande a été envoyé. Vous la recevrez dans quelques jours.\n\n"
        msg+="Nous vous tiendrons informer de la livraison de la commande."
    }else if(status === "delivered"){
        msg = "Votre commande a été livré. Merci de votre achat chez https://vetService.fr.\n\n"
    }
    msg+="Récapitulatif de commande : \n" +getOrderItem(order)
    msg+="Total : "+order.price+"€\n"
    msg+="Adresse d'expédition : "+order.street+", "+order.postalCode+" "+order.city
    let object = "Votre commande "+order._id+" est en cours de préparation"

    let mailOptions = getMailOptions(order.mail, object, msg)

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function getOrderItem(order) {
    let msg = "Commande n°"+order._id+"\n\n"
    for(let item of order.item){
        msg+=item.quantity+"x "+item.name+"\n"
    }
    msg+="\n"
    return msg
}
