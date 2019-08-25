const TaskModel = require('../models/mysql/TaskModel');


exports.actionIndex = async function(req, res){
<<<<<<< HEAD
    // let Task = new TaskModel();
    // let tasks = await Task.save({title: 'task', text: 'text', description: 'desc', catalog_id: 1, isReady: 0});
    // console.log(tasks);
    res.render('index');
};
=======
    let Task = new TaskModel();
    let tasks = await Task.save({
        title: 'название',
        text: 'текст',
        description: 'описание',
        catalog_id: 1,
    });
    console.log(tasks);
    res.send();
}
>>>>>>> 2abc892f1a8d2f7982282c876ad5541093a7ad7c
