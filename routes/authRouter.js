const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/loginaction',authController.actionLogin);

authRouter.all('/login', authController.pageLogin);
authRouter.all('/signup', authController.actionSignup);

module.exports = authRouter;
