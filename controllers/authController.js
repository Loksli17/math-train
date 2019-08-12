const cookieParser = require('cookie-parser');
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

exports.pageRestore=async function (req,res) {

    if (req.cookies.userUdentity==undefined){
        let email  = req.body.Email+'';
        let errors = [];

        console.log(email);


        let user = User.findOne({email: email});
        if (user != null){
            let random = Math.random()+'';

            let hash = crypto.createHash('sha256', config.user.passSecret).update(random).digest('hex');

            let smtpTransport  = await nodemailer.createTransport({
                service: "Yandex",
                auth: {
                    user: 'math.project@yandex.ru',
                    pass: 'jSXq7RJ;LMx_%nH',
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
                }else{
                    console.log("Message sent: " + mail);
                }
                smtpTransport.close();
            });
            res.redirect('/');
        }else{
            errors.push('Пользователь с такой почтой не найден')ж
            
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

<<<<<<< HEAD
exports.pageSignup = function(res, req){
    if(res.cookies.userUdentity != undefined){
        res.render('auth/singup', {
            layout: null,
        })
    }
}
=======
exports.actionSignup = function(req, res){
    res.render('auth/singup', {layout: null});
};

exports.logout = function (req,res) {
  if (req.cookies.userUdentity!=undefined){
      res.clearCookie('userUdentity');
  }
};

>>>>>>> 543dbe1f2e93b90b16d37bba6bc10e3c72af1c20
