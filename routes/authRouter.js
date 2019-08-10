const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.all('/login', authController.actionLogin);
authRouter.all('/signup', authController.actionSignup);

module.exports = authRouter;
