const express = require('express');
const taskController  = require('./../controllers/taskController');

const taskRouter  = express.Router();

taskRouter.all('/',     taskController.index);
taskRouter.all('/task', taskController.actionTask);
taskRouter.all('/task-answer', taskController.actionTaskAnswer);

module.exports = taskRouter;
