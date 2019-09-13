const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    login: {
        type    : String,
        required: true,
        validate: (value) => {
            return value != undefined
        },
    },
    email: {
        type    : String,
        required: true,
        unique  : true,
        validate: (value) => {
            return value != undefined
        },
    },
    pass: {
        type    : String,
        required: true,
        validate: (value) => {
            return value != undefined
        },
    },
    isAdmin: {
        type   : Boolean,
        default: '0',
    },
    subNews : {
       type : Boolean,
       required: true,
    }
});


let user = mongoose.model('users', userSchema);
module.exports = user;
