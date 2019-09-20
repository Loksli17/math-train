const TaskModel = require('../models/mysql/TaskModel');
const PostModel = require('../models/mysql/PostModel');
const mail = require('./emaiController');

exports.actionIndex = async function(req, res){

    let Task = new TaskModel();
    let Post = new PostModel();


    // let subQuery = await Post.find('all', {
    //     select: ['1', 'text', '3', 'view', '5', '6', '7', '8'],
    //     sql: true,
    // });
    //
    // let tasks = await Task.find('all', {
    //     where: "id = 1",
    //     union: subQuery,
    // });

    // console.log(tasks);


    let save = await Post.save({title: 7, text: 5});
    // console.log(save);

    res.render('index/index');
};
