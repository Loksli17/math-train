const TaskModel = require('../models/mysql/TaskModel');


exports.actionIndex = async function(req, res){

    // let Task = new TaskModel();
    // let tasks = await Task.save({
    //     title: 'название',
    //     text: 'текст',
    //     description: 'описание',
    //     catalog_id: 1,
    // });
    // console.log(tasks);
    // res.send();
    res.render('index');
};

