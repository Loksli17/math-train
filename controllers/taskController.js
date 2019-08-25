const mysql = require('./../lib/database/mysql');
const CatalogModel  = require ('./../models/mysql/catalogModel');
const TagModel      = require ('./../models/mysql/tagModel');
const TaskModel     = require('./../models/mysql/taskModel');

exports.index  = async function (req,res) {
    let Catalog = new CatalogModel();
    let Tag     = new TagModel();

    let tags     = await Tag.find('all', {
        order : 'id_parent',
    });

    let catalogs = await Catalog.find('all' );

    disciplines = {};
    for (let i = 0; i < tags.length; i++){
        if (tags[i].id_parent == null){
            disciplines[tags[i].id]   = {};
            disciplines[tags[i].id].name = tags[i].title;
            disciplines[tags[i].id].tags = [];

        }else{
            disciplines[tags[i].id_parent].tags.push({
                name : tags[i].title,
                id   : tags[i].id,
            });
        }
    }

    console.log(disciplines);
    res.render('tasks/difficulty',{

        catalogs    : catalogs,
        disciplines : disciplines,

    });
};

exports.filter = async function (req,res) {
    console.log(req.body);
    let Task  =  new TaskModel();
    let tag_id = [];
    for ( tag in req.body){

        if (tag.slice(0,3)=='tag'){
            console.log(tag+':'+req.body[tag] +"LOL");
            //tag_id.push(req.body[tag]);

        }else if (tag.slice(0,6)=='catalog'){

        }
    }

    let tasks = await Task.find('all',{
       join: ['inner','task_has_tag', 'task_has_tag.task_id = task.id'],
       where:['id = 3 or id = 5 '],
        sql : true,
    });

    res.send(tasks);
};
