const mongoose     = require('./../lib/database/mongoose');
const nodemailer   = require('nodemailer');

const config       = require('./../config');
const User         = require('./../models/mongoose/userModel');

exports.sendHash = async function (email,hash) {

    let smtpTransport  = await nodemailer.createTransport({
        service: "Yandex",
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        }
    });

    var mail = {
        from   : config.email.mail,
        to     : email,
        subject: "Restore password",
        text   : "Your hash",
        html   : hash,
    };

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
            smtpTransport.close();
            return reject();

        }else{
            smtpTransport.close();
            return resolve();
        }

    });
};

exports.sendNews =async function (newsUrl,newsTitle) {
    let mail = {};
    let users = await User.find({subNews : true});
       let smtpTransport  = await nodemailer.createTransport({
        service: "Yandex",
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        }
    });

    users.forEach(function (user) {

        mail = {
            from   : config.email.mail,
            to     : user.email,
            subject: newsTitle,
            text   : "Breaking news!",
            html   : "<h1>Здравствуйте "+user.login+" !</h1>" +
                "Вы получили это письмо потому что вы подписаны на рассылку новосей," +
                " из последних новостей: <a href="+newsUrl+">"+newsUrl+"</a>",
        };
        smtpTransport.sendMail(mail,function (err) {
            if(err){
                console.log(err);
            }
        })
    });

    smtpTransport.close();

};