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

    let news  = await News.find({});
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

    // console.log(news[0]);
    // console.log(tasks[0]);
    // console.log(posts[0]);

    let find_news = [];
    news.forEach(function(result, iter){
        for (let i = 0; i<result.title.length; i++ ){
            if (result.title.slice(i,i+searchindData.length)==searchindData){
                find_news.push(result);
                break;
            }
        }
    });
    news = news.filter(function (obj) {
        return find_news.indexOf(obj)==-1;
    });
    console.log(news);
    news.forEach(function(result, iter){
        for (let i = 0; i<result.text.length; i++ ){
            if (result.text.slice(i,i+searchindData.length)==searchindData){
                find_news.push(result);
                break;
            }
        }
    });

    let find_tasks = [];
    console.log(posts);

    res.render('search/results',{
        news : find_news,
        tasks: tasks,
        posts: posts,
    })
};