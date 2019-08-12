const express = require('express');

const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/loginaction',authController.actionLogin);
<<<<<<< HEAD
authRouter.post('/setnewpassword',authController.checkHash);
=======

authRouter.post('/pagerestore',authController.pageRestore);
>>>>>>> 70570bf9bc6b5ad3b7f9737f37b0dad526dc955a

authRouter.all('/savepassword',authController.setNewPassword);
authRouter.all('/pagerestore',authController.pageRestore);
authRouter.all('/sendemail', authController.sendEmail);

authRouter.all('/login', authController.pageLogin);

authRouter.get('/signup', authController.actionSignup);
authRouter.post('/singup-post', authController.actionSignupPost);

authRouter.all('/logout', authController.actionLogout);

module.exports = authRouter;
