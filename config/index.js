const settings = {
    email:{
        user: 'math.project@yandex.ru',
        pass: 'jSXq7RJ;LMx_%nH',
        mail: "math.project@yandex.ru",
    },
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
        passSecret        : '6Jhn-Nm<',
        passwordTryCounter: 5,
    }
};

module.exports = settings;
