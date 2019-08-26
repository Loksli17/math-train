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


    res.render('tasks/difficulty',{

        catalogs    : catalogs,
        disciplines : disciplines,

    });
};

exports.filter = async function (req,res) {

    let Task  =  new TaskModel();

    let tag_id = [];
    let catalog_id = [];

    for ( tag in req.body){

        if (tag.slice(0,3)=='tag'){
            tag_id.push(req.body[tag]);

        } if (tag.slice(0,7)=='catalog'){
            catalog_id.push(req.body[tag]);
        }
    }


    let id_tag_quary = '';
    let id_catalog_quary = '';


    if (catalog_id.length != 0){
        id_catalog_quary = '(';
    }
    for (let i = 0 ;i  < catalog_id.length ; i++){
        if (i!= catalog_id.length-1){
            id_catalog_quary =id_catalog_quary+' catalog.id = '+catalog_id[i]+' or ';
        }else{
            id_catalog_quary = id_catalog_quary+'catalog.id = '+catalog_id[i] +' )';
        }
    }

     if ((catalog_id.length != 0) && ( tag_id.length!= 0)){
         id_tag_quary = ' AND ';
     }

    if (tag_id.length != 0){
        id_tag_quary = id_tag_quary+'( ';
    }
    for (let i = 0 ;i  < tag_id.length ; i++){
        if (i!= tag_id.length-1){
            id_tag_quary =id_tag_quary+'tag.id = '+tag_id[i]+' or ';
        }else{
            id_tag_quary = id_tag_quary+'tag.id = '+tag_id[i]+' )';
        }
    }




    let tasks = await Task.find('all',{


       join: [ ['inner', 'catalog','catalog.id  = task.catalog_id'],
       [ 'inner','task_has_tag', 'task.id= task_has_tag.task_id '],
       ['left','tag','task_has_tag.tag_id = tag.id'],
           ],
        where:[id_catalog_quary+id_tag_quary],

      // sql : true,

    });


    res.send(tasks);
};
