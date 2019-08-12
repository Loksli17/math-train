const bodyParser   = require('body-parser');
const crypto       = require('crypto');
const nodemailer   = require('nodemailer');

const mongoose     = require('./../lib/database/mongoose');
const User         = require('./../models/userModel');
const config       = require('./../config');

exports.sendEmail = function(req,res){
    if (req.cookies.userUdentity==undefined){
        res.render('auth/indicateEmail', {layout: null});
    }else{
        res.redirect('/');
    }

};
exports.setNewPassword = function(req,res){
    let errors           = [];
    let password         = req.body.newPassword+'';
    let repeatedPassword = req.body.repeatNewPassword+'';


    if (password==repeatedPassword){
        User.findOne({email : req.session.userEmail},function (err,user) {
            user.pass = crypto.createHash('sha256', config.user.passSecret).update(password).digest('hex');
            user.login = user.login;
            user.save();
        });

        res.redirect('/');
    }else{
        errors.push('Пароли не совпадают');
        res.render('auth/setPassword',{
            errors : errors,
        })
    }
};

exports.checkHash = function(req,res){
    console.log('Computer"s hash: '+req.session.userHash);
    userHash = req.body.random;


    if(userHash==req.session.userHash){
        res.render('auth/setPassword');
    }else{
        req.session.passwordTryCounter +=1;
        if (req.session.passwordTryCounter==config.user.passwordTryCounter){
            req.session.destroy(function() {
                res.redirect('/auth/login');
            });
        }else{

            res.render('auth/restorePassword');
        }
    }
};

exports.pageRestore=async function (req,res) {

    if (req.cookies.userUdentity==undefined){
        let email  = req.body.Email+'';
        email = email.toLowerCase();

        let errors = [];



        let user =await User.findOne({email: email});


        if (user != null){
            let random = Math.random()+'';

            let hash = crypto.createHash('sha256', config.user.passSecret).update(random).digest('hex');

            req.session.userHash            = hash;
            req.session.userEmail           = user.email;
            req.session.passwordTryCounter = 0;

            let smtpTransport  = await nodemailer.createTransport({
                service: "Yandex",
                auth: {
                    user: config.email.user,
                    pass: config.email.pass,
                }
            });

            var mail = {
                from: "math.project@yandex.ru",
                to: email,
                subject: "Restore password",
                text: "Your hash",
                html: hash,
            };

            smtpTransport.sendMail(mail, function(error, response){
                if(error){
                    console.log(error);
                    errors.push("Произошла ошибка, попробуйте еще раз");
                    res.render('auth/indicateEmail', {
                        errors: errors,
                        layout: null
                    });
                }else{
                    
                    res.render('auth/restorePassword');
                }
                smtpTransport.close();
            });

        }else{
            errors.push('Пользователь с такой почтой не найден');
            res.render('auth/login', {
                layout: null,
                errors: errors,
            })
        }

    }else{
        res.redirect('/');
    }
};

exports.pageLogin = function(req, res){
   if (req.cookies.userUdentity==undefined){

       res.render('auth/login', {layout: null});
   }else{
       res.redirect('/');

   }
};

exports.actionLogin = async function(req,res){

    let errors = [];//ошибки заполения

    let login       = req.body.login;
    let password    = req.body.password;
    let rememberMe  = req.body.rememberME;

    let hash = crypto.createHash('sha256', config.user.passSecret).update(password).digest('hex');

    if (login != '' && password !=''){
        user = await User.findOne({email : login});

        if(user!=null&&user.pass==hash){

            if (rememberMe=='on'){
                res.cookie("userUdentity",user.email,
                    {expires:  new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),});

            }else{
                res.cookie("userUdentity",user.email,
                    {expires :  new Date(Date.now() + 1000 * 60 * 60 * 24),});
            }
            res.redirect('/');
        }else{
            errors.push("Неправильный логин или пароль");

            res.render('auth/login', {
                layout: null,
                errors: errors,
            })
        }
    }else{
        errors.push('Все поля должны быть заполены');
        res.render('auth/login', {
            layout: null,
            errors: errors,
        })
    }
};

exports.actionSignup = function(req, res){
    res.render('auth/singup', {layout: null});
};

exports.logout = function (req,res) {
  if (req.cookies.userUdentity!=undefined){
      res.clearCookie('userUdentity');
  }
};