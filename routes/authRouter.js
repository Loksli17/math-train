const express = require('express');

const authController = require('../controllers/authController');

const authRouter = express.Router();


authRouter.post('/loginaction',authController.actionLogin);

authRouter.all('/savepassword',authController.setNewPassword);
authRouter.all('/pagerestore',authController.pageRestore);
authRouter.all('/sendemail', authController.sendEmail);

authRouter.all('/login', authController.pageLogin);

authRouter.get('/signup', authController.actionSignup);
authRouter.post('/singup-post', authController.actionSignupPost);

authRouter.all('/logout', authController.actionLogout);

module.exports = authRouter;
