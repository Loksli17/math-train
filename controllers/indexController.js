const TaskModel = require('../models/mysql/TaskModel');
const PostModel = require('../models/mysql/PostModel');

exports.actionIndex = async function(req, res){

    let Task = new TaskModel();
    let Post = new PostModel();

    let tasks = await Task.find('all', {
        like: [
            ['text', '%о%'],
        ],
        where: 'id = 1',
    });

    console.log(tasks);

    let save = await Post.save({title: 'название', text: 'текст', image: '1.jpg', view: 1, description: null});
    // console.log(save);

    res.render('index/index');
};
