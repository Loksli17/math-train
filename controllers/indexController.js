const TaskModel = require('../models/mysql/TaskModel');

exports.actionIndex = async function(req, res){

    let Task = new TaskModel();
    let tasks = await Task.find('all', {limit: '0, 1'});

    res.render('index/index');
};
