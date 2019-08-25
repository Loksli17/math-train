const express = require('express');
const taskController  = require('./../controllers/taskController');

const taskRouter  = express.Router();

taskRouter.all('/filter',taskController.filter);
taskRouter.all('/',      taskController.index);

module.exports = taskRouter;