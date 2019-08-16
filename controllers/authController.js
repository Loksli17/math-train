const bodyParser   = require('body-parser');
const crypto       = require('crypto');
const nodemailer   = require('nodemailer');

const mongoose     = require('./../lib/database/mongoose');
const User         = require('./../models/userModel');
const config       = require('./../config');

exports.sendEmail = function(req,res){
    if (req.cookies.userUdentity == undefined){
        res.render('auth/indicateEmail', {layout: null});
    }else{
        res.redirect('/');
    }

};

exports.setNewPassword = function(req,res){

    if (req.cookies.userUdentity == undefined){
        let error           = '';
        let password         = req.body.newPassword+'';
        let repeatedPassword = req.body.repeatNewPassword+'';

        if (password == repeatedPassword){
            User.findOne({email : req.session.userEmail},function (err,user) {

                user.pass = crypto.createHash('sha256', config.user.passSecret)
                    .update(password)
                    .digest('hex');

                user.login = user.login;
                user.save();
            });

            res.redirect('/');
        }else{
            error  = 'Пароли не совпадают';
            res.render('auth/setPassword',{
                error : error,
            })
        }
    }else{
        res.redirect('/');
    }
};

exports.checkHash = function(req,res){

    if (req.cookies.userUdentity == undefined){

        userHash = req.body.random;

        if(userHash == req.session.userHash){
            res.render('auth/setPassword');
        }else{
            req.session.passwordTryCounter +=1;
            if (req.session.passwordTryCounter == config.user.passwordTryCounter){
                req.session.destroy(function() {
                    res.redirect('/auth/login');
                });
            }else{

                res.render('auth/restorePassword');
            }
        }
    }else{
        res.redirect('/');
    }

};

exports.pageRestore=async function (req,res) {

    if (req.cookies.userUdentity == undefined){
        let email  = req.body.email+'';
        email = email.toLowerCase();

        let error = '';
        let user =await User.findOne({email: email});


        if (user != null){
            let random = Math.random()+'';

            let hash = crypto.createHash('sha256', config.user.passSecret).update(random).digest('hex');

            req.session.userHash            = hash;
            req.session.userEmail           = user.email;
            req.session.passwordTryCounter  = 0;

            let smtpTransport  = await nodemailer.createTransport({
                service: "Yandex",
                auth: {
                    user: config.email.user,
                    pass: config.email.pass,
                }
            });

            var mail = {
                from: config.email.mail,
                to: email,
                subject: "Restore password",
                text: "Your hash",
                html: hash,
            };

            smtpTransport.sendMail(mail, function(error, response){
                if(error){
                    console.log(error);
                    error = "Произошла ошибка, попробуйте еще раз";
                    res.render('auth/indicateEmail', {
                        error: error,
                        layout: null
                    });
                }else{

                    res.render('auth/restorePassword');
                }
                smtpTransport.close();
            });

        }else{
            error = 'Пользователь с такой почтой не найден';
            res.render('auth/login', {
                layout: null,
                error: error,
            })
        }

    }else{
        res.redirect('/');
    }
};

exports.pageLogin = function(req, res){
   if (req.cookies.userUdentity == undefined){

       res.render('auth/login', {layout: null});
   }else{
       res.redirect('/');

   }
};

exports.actionLogin = async function(req,res){

    let error = '';//ошибки заполения

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
            error = "Неправильный логин или пароль";

            res.render('auth/login', {
                layout: null,
                errors: error,
            })
        }
    }else{
        error = 'Все поля должны быть заполены';
        res.render('auth/login', {
            layout: null,
            error: error,
        })
    }
};

exports.actionLogout = function (req,res){
  if (req.cookies.userUdentity != undefined){
      res.clearCookie('userUdentity');
      res.redirect('/auth/login');
  }else{
      res.redirect('/');
  }
};

exports.actionSignup = function(req, res){
    if(req.cookies.userUdentity == undefined){
        res.render('auth/singup', {
            layout: null,
        })
    }else{
        res.redirect('/');
    }
};

exports.actionSignupPost = async function(req, res){
    let post = req.body;

    let error = '',
        pass  = post.password,
        pass2 = post.passwordSecond,
        email = post.email,
        login = post.login;

    if(login == "" || pass  == "" || pass2 == "" || email == ""){
        error = "Есть незаполненные поля";
        res.render('auth/singup', {
            error: error,
        });
    }else{
        if(pass != pass2){
            error = "Введенные пароли не совпадают";
            res.render('auth/singup', {
                error: error,
            });
        }else{
            var user = await User.findOne({email: email});

            if(user != null){
                error = "Ввыеденный E-mail уже используется";
                res.render('auth/singup', {
                    error: error,
                });
            }else{
                //сохранение пользователя
                let hash = crypto.createHash('sha256', config.user.passSecret).update(pass).digest('hex');
                User({
                    login  : login,
                    email  : email.toLowerCase(),
                    pass   : hash,
                    isAdmin: 0,
                }).save();

                var user = {
                    login  : login,
                    email  : email,
                    isAdmin: 0,
                };
                res.cookie('userUdentity', user, {
                    expires :  new Date(Date.now() + 1000 * 60 * 60 * 7),
                });
                res.redirect('/');
            }
        }
    }


};
