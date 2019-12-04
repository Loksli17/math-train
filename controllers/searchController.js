const mongoose = require('./../lib/database/mongoose');

const News     = require('./../models/mongoose/newsModel');

const postModel     = require('./../models/mysql/postModel');
const taskModel     = require('./../models/mysql/taskModel');

exports.index  = function (req,res) {
    res.render('search/index');
};
exports.searchAction = async function (req,res) {
    let searchindData = req.body.searchindData;

    let Task = new taskModel();
    let Post = new postModel();

    let find_news  = await News.find({$or:[{ title :{ $regex: '.*'+searchindData+'.*'} }, {text: {$regex: '.*'+searchindData+'.*'}}]});
    let tasks = await Task.find('all');
    //let posts = await Post.find('all');


    let posts = await Post.find('all' ,{
        join: [
            ['inner', 'post_has_tag','post_has_tag.post_id = post.id'],
            ['inner', 'tag','post_has_tag.tag_id = tag.id']
        ],

        select: ['post.id','tag.title as ttitle','post.view','post.text','post.description','post.image'],
        order: 'id',
        orderDesc: true,

    });

    



    res.render('search/results',{
        news : find_news,
        tasks: tasks,
        posts: posts,
    })
};