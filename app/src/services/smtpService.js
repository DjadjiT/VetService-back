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

function getMailOptions(receiver, subject, msg){
    return {
        from: process.env.SMTP_MAIL,
        to: receiver,
        subject: subject,
        text: msg
    };
}


exports.sendMailTo = async (user, action, date) =>{
    let transporter = getTransporter()

    let msg = ""
    let subject = ""
    switch (action){
        case MAILACTION.INSCRIPTION:
            msg = "Bienvenue à VetServices."
            break;
        case MAILACTION.VALIDATION:
            msg = "Votre compte a été validé."
            break;
        case MAILACTION.DEACTIVATION:
            msg = "Votre compte a été désactivé."
            break;
        case MAILACTION.HRMODIFICATION:
            break;
        case MAILACTION.HRMODIFICATION:
            break;
    }

    let mailOptions = getMailOptions()

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
    let subject = ""
    let date = new Date(appointment.date)
    let receiver = ""
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric"};
    let strDate = date.toLocaleDateString(undefined, options)
    strDate = strDate[0].toUpperCase() + strDate.slice(1)
    let mailOptions

    switch (action){
        case MAILACTION.APPOINTMENTFORVET:
            msg = "Vous avez un nouveau rendez vous le : "+strDate
            subject = "Vous avez un rendez-vous le "+strDate+" avec le client."+client.lastName+" "+client.firstName+"."

            mailOptions = getMailOptions(vet.email, subject, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            break;
        case MAILACTION.APPOINTMENTFORCLIENT:
            msg = "Vous avez un nouveau rendez vous le : "+strDate
            receiver = client.email
            subject = "Vous avez un rendez-vous le "+strDate+" avec le Dr."+vet.lastName+" "+vet.firstName+"."

            mailOptions = getMailOptions(client.email, subject, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            break;
        case MAILACTION.APPOINTMENTUPDATE:
            msg = "Votre rendez vous a été déplacé au : "+strDate
            subject = "Votre rendez vous a été déplacé au : "+strDate
            receiver = client.email

            mailOptions = getMailOptions(client.email, subject, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            mailOptions = getMailOptions(vet.email, subject, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            break;
        case MAILACTION.APPOINTMENTDELETE:
            msg = "Votre rendez vous du "+strDate+" a été annulé."
            subject = "Votre rendez vous du "+strDate+" a été annulé."

            mailOptions = getMailOptions(client.email, subject, msg)

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            mailOptions = getMailOptions(vet.email, subject, msg)

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
