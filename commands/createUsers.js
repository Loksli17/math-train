const config   = require('../config');
<<<<<<< HEAD
const mongoose = require("../lib/database/mongoose");
const User     = require('../models/userModel');
=======
const mongoose = require('../lib/database/mongoose');
>>>>>>> 9a2f3193bdb804399f08ff7e29aae35abd535456
const async    = require('async');
const crypto   = require('crypto');


let query = async () => {
    let remove = await User.remove({});

    let create = await async.parallel([
            function(callback){
                let user = new User({
                    login  : 'Loksli',
                    email  : 'ami0504@mail.ru',
                    pass   : crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                    isAdmin: '1',
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
            function(callback){
                let user = new User({
                        login  : 'Uxa',
                        email  : 'ami0505@mail.ru',
                        pass   : crypto.createHash('sha256', config.user.passSecret).update('1234').digest('hex'),
                        isAdmin: '0',
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
            function(callback){
                let user = new User({
                    login  : 'Virtus.protTop1',
                    email  : 'ami0506@mail.ru',
                    pass   : crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                    isAdmin: '0',
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
            function(callback){
                let user = new User({
                    login  : 'One',
                    email  : 'smh@mail.com',
                    pass   : crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                    isAdmin: '1',
                    });
                 user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
            function(callback){
                let user = new User({
                    login  : 'Uxa322',
                    email  : 'ami0508@mail.ru',
                    pass   : crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                    isAdmin: '0',
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
            function(callback){
                let user = new User({
                    login  : 'Uxa228',
                    email  : 'ami0509@mail.ru',
                    pass   : crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                    isAdmin: '0',
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, user);
                });
            },
        ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating was success')
        });
};

query();
