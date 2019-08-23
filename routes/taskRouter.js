const express = require('express');
const taskController  = require('./../controllers/taskController');

const taskRouter  = express.Router();

taskRouter.use('/',taskController.index);

module.exports = taskRouter;