const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const crypto       = require('crypto');

const mongoose     = require('./../lib/database/mongoose');
const User         = require('./../models/userModel');
const config       = require('./../config');


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