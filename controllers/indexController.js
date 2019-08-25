const TaskModel = require('../models/mysql/TaskModel');


exports.actionIndex = async function(req, res){
    // let Task = new TaskModel();
    // let tasks = await Task.save({title: 'task', text: 'text', description: 'desc', catalog_id: 1, isReady: 0});
    // console.log(tasks);
    res.render('index');
};
