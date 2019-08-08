const mongoose = require('mongoose');

let userSchema = mongoose.Schema({

    login: {
        type    : String,
        required: true,
        validate: (value) => {
            return value != undefind,
        },
    },
    email: {
        type    : String,
        required: true,
        unique  : true,
        validate: (value) => {
            return value != undefind,
        },
    },
    pass: {
        type    : String,
        required: true,
        validate: (value) => {
            return value != undefind,
        },
    },
});


let user = mongoose.model('users', userSchema);
module.exports = user;
