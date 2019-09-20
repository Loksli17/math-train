const TaskModel = require('../models/mysql/TaskModel');
const PostModel = require('../models/mysql/PostModel');
const mail = require('./emaiController');

exports.actionIndex = async function(req, res){

    let Task = new TaskModel();
    let Post = new PostModel();

<<<<<<< HEAD

    // let subQuery = await Post.find('all', {
    //     select: ['1', 'text', '3', 'view', '5', '6', '7', '8'],
    //     sql: true,
    // });
    //
    // let tasks = await Task.find('all', {
    //     where: "id = 1",
    //     union: subQuery,
    // });
=======
    let tasks = await Task.find('all', {
        like: [
            ['text', '%о%'],
        ],
        where: 'id = 1',
    });
>>>>>>> 24faab9a615d6b20f1ceee5496af2259adb88661

    console.log(tasks);

    let save = await Post.save({title: 'название', text: 'текст', image: '1.jpg', view: 1, description: null});
    // console.log(save);

    res.render('index/index');
};
