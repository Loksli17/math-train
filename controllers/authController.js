const bodyParser   = require('body-parser');
const crypto       = require('crypto');

const mongoose        = require('./../lib/database/mongoose');
const User            = require('./../models/mongoose/userModel');
const config          = require('./../config');
const emailController = require('./emaiController');


exports.sendEmail = function(req,res){
    if (req.cookies.userUdentity == undefined){
        res.render('auth/indicateEmail', {layout: null});
    }else{
        res.redirect('/');
    }
};


exports.setNewPassword = function(req, res){

    if (req.cookies.userUdentity == undefined){
        let error            = '';
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
            res.redirect('/auth/login');
        }else{
            error = 'Пароли не совпадают';
            res.render('auth/setPassword',{
                error : error,
            });
        }
    }else{
        res.redirect('/');
    }
};


exports.checkHash = function(req, res){
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


exports.pageRestore = async function (req, res) {

    if (req.cookies.userUdentity == undefined){
        let email = req.body.email + '';
        email = email.toLowerCase();
        let error = '';
        let user  = await User.findOne({email: email});

        if (user != null){
            let random = Math.random()+'';

            let hash = crypto.createHash('sha256', config.user.passSecret).update(random).digest('hex');

            req.session.userHash            = hash;
            req.session.userEmail           = user.email;
            req.session.passwordTryCounter  = 0;

            await  emailController.sendHash(email+'',hash)
                .then(function () {
                    res.render('auth/restorePassword');
                })
                .catch(function () {
                error = "Произошла ошибка, попробуйте еще раз";
                        res.render('auth/indicateEmail', {
                            error: error,
                            layout: null
                        });
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


exports.actionLogin = function(req, res){
   if (req.cookies.userUdentity == undefined){
       res.render('auth/login', {layout: null});
   }else{
       res.redirect('/');
   }
};

exports.actionLoginPost = async function(req, res){

    let error       = ''; //ошибки заполения
    let login       = req.body.login;
    let password    = req.body.password;
    let rememberMe  = req.body.rememberME;

    let hash = crypto.createHash('sha256', config.user.passSecret).update(password).digest('hex');

    if (login != '' && password !=''){
        user = await User.findOne({$or: [{email : login}, {login: login}]});

        if(user != null && user.pass==hash){

            var user = {
                id     : user._id,
                login  : user.login,
                email  : user.email,
                isAdmin: user.isAdmin,
            };

            if (rememberMe == 'on'){
                res.cookie("userUdentity", user,
                    {expires:  new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),});
            }else{
                res.cookie("userUdentity", user,
                    {expires :  new Date(Date.now() + 1000 * 60 * 60 * 24),});
            }
            res.redirect('/');
        }else{
            error = "Неправильный логин или пароль";
            res.render('auth/login', {
                layout: null,
                error: error,
            });
        }
    }else{
        error = 'Все поля должны быть заполены';
        res.render('auth/login', {
            layout: null,
            error: error,
        });
    }
};


exports.actionLogout = function (req, res){
  if (req.cookies.userUdentity != undefined){
      res.clearCookie('userUdentity');
      res.redirect('/auth/login');
  }else{
      res.redirect('/');
  }
};


exports.actionSignup = function(req, res){
    if(req.cookies.userUdentity == undefined){
        res.render('auth/signup', {
            layout: null,
        })
    }else{
        res.redirect('/');
    }
};


exports.pageSingupSuccess = async function(req,res){
  if (req.session.user != undefined && req.query.user==req.session.emailHash){

      await User(req.session.user).save();
      var id = await User.findOne({email: email.toLowerCase()});
      id = id._id;

      var user = {
          id     : id,
          login  : login,
          email  : email,
          isAdmin: 0,
      };
      res.cookie('userUdentity', user, {
          expires :  new Date(Date.now() + 1000 * 60 * 60 * 7),
      });
      req.session.user = undefined;
      req.session.emailHash = undefined;

      req.render('auth/endRegister',{
          info : "Регистрация прошла успешно",
      });
  }else if (req.session.user!= undefined){
      req.render('auth/endRegister',{
          info : "Пожалуйста проверьте почту",
      })
  }else{
      req.status(404);
      req.render("server/404");
  }
};

exports.actionSignupPost = async function(req, res){
    let post = req.body;

    let error = '',
        pass  = post.password,
        pass2 = post.passwordSecond,
        email = post.email,
        login = post.login,
        subNews = post.subNews;
    if (subNews == undefined){
        subNews = false;
    }

    if(login == "" || pass  == "" || pass2 == "" || email == ""){
        error = "Есть незаполненные поля";
        res.render('auth/signup', {
            layout: null,
            error: error,
        });
    }else{
        if(pass != pass2){
            error = "Введенные пароли не совпадают";
            res.render('auth/signup', {
                layout: null,
                error: error,
            });
        }else{
            var user = await User.findOne({email: email});

            if(user != null){
                error = "Введенный E-mail уже используется";
                res.render('auth/signup', {
                    layout: null,
                    error: error,
                });
            }else{
                //сохранение пользователя
<<<<<<< HEAD
                let random = Math.random()+'';
                let emailHashl = crypto.createHash('sha256', config.user.passSecret).update(random).digest('hex');

                let url = req.protocol + '://' + req.get('host') + "/regSuccess?user="+emailHashl;
                console.log(url);

                console.log(post.email);

                await emailController.sendRegHash(email+'',url,login)
                    .then(function () {
                        let hash = crypto.createHash('sha256', config.user.passSecret).update(pass).digest('hex');
                        req.session.user = {
                            login  : login,
                            email  : email.toLowerCase(),
                            pass   : hash,
                            isAdmin: 0,
                            subNews: subNews,
                        };
                        req.session.emailHash = emailHash;
                        res.redirect('/regSuccess');
                    })
                    .catch(function () {
                        error = "Произошла ошибка, пожайлуста, попробуйте еще раз";
                        res.render('auth/signup', {
                            layout: null,
                            error : error,
                        })
                    });

                // await  emailController.sendHash(email+'',emailHashl)
                //     .then(function () {
                //         res.redirect('/regSuccess');
                //     })
                //     .catch(function () {
                //         error = "Произошла ошибка, пожайлуста, попробуйте еще раз";
                //                 res.render('auth/singup', {
                //                     layout: null,
                //                     error : error,
                //                 })
                //     });



                // var save = await User({
                //     login  : login,
                //     email  : email.toLowerCase(),
                //     pass   : hash,
                //     isAdmin: 0,
                //     subNews: subNews,
                // }).save();

                // var id = await User.findOne({email: email.toLowerCase()});
                // id = id._id;
                //
                // var user = {
                //     id     : id,
                //     login  : login,
                //     email  : email,
                //     isAdmin: 0,
                // };
                // res.cookie('userUdentity', user, {
                //     expires :  new Date(Date.now() + 1000 * 60 * 60 * 7),
                // });
                // res.redirect('/');
=======

                let hash = crypto.createHash('sha256', config.user.passSecret).update(pass).digest('hex');

                var save = await User({
                    login  : login,
                    email  : email.toLowerCase(),
                    pass   : hash,
                    isAdmin: 0,
                    subNews: subNews,
                }).save();

                var id = await User.findOne({email: email.toLowerCase()});
                id = id._id;

                var user = {
                    id     : id,
                    login  : login,
                    email  : email,
                    isAdmin: 0,
                };
                res.cookie('userUdentity', user, {
                    expires :  new Date(Date.now() + 1000 * 60 * 60 * 7),
                });
                res.redirect('/');
>>>>>>> c78e14fdd16c0ace1cf52af6c090a505431d0eca
            }
        }
    }
};
