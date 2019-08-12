const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/loginaction',authController.actionLogin);
<<<<<<< HEAD
=======
authRouter.post('/pagerestore',authController.pageRestore);

authRouter.all('/sendemail', authController.sendEmail);
>>>>>>> 543dbe1f2e93b90b16d37bba6bc10e3c72af1c20
authRouter.all('/login', authController.pageLogin);

authRouter.post('/singup-post');
authRouter.get('/signup', authController.actionSignup);

module.exports = authRouter;
