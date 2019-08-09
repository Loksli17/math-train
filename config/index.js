const settings = {
    db: {
        mongoose:{
            name: 'math_train',
            url : 'mongodb://localhost:27017/',
        },
        mysql:{
            host    : 'localhost',
            database: 'math_train',
            user    : 'root',
            password: '1234',
        },
    },
    app: {
        port: 3000,
        name: 'math_train',
    },
    cookie: {
        secret: '34Jmf7*8kL;>G',
    },
    session: {
        secret: 'GiU9%$3#kLz>',
    },
    user: {
        passSecret: '6Jhn-Nm<',
    }
};

module.exports = settings;
