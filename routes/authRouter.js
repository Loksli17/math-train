const express = require('express');

const authController = require('../controllers/authController');

const authRouter = express.Router();

//login
authRouter.all('/login', authController.actionLogin);
authRouter.post('/loginaction', authController.actionLoginPost);

//logout
authRouter.all('/logout', authController.actionLogout);


//setPassword
authRouter.all('/setnewpassword', authController.checkHash);
authRouter.all('/savepassword', authController.setNewPassword);
authRouter.all('/pagerestore', authController.pageRestore);
authRouter.all('/sendemail', authController.sendEmail);

//signup
authRouter.get('/signup', authController.actionSignup);
authRouter.post('/singup-post', authController.actionSignupPost);
authRouter.all('/regSuccess', authController.pageSingupSuccess);



module.exports = authRouter;
