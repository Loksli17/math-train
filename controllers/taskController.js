const mysql = require('./../lib/database/mysql');
const Pagination = require('./../lib/pagination');

const CatalogModel  = require ('./../models/mysql/catalogModel');
const TagModel      = require ('./../models/mysql/tagModel');
const TaskModel     = require('./../models/mysql/taskModel');


exports.index  = async function (req,res) {
    let Catalog = new CatalogModel();
    let Tag     = new TagModel();
    let Task    = new TaskModel();

    let tasks  = await Task.find('all', {
        order : 'isReady',
        orderDesc : true,
    });

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

    let pagination = new Pagination({
        pageSize  : 4,
        limit     : 5,
        page      : req.query.page,
        url       : '/index',
        count     : tasks.length,
    });
    console.log(pagination);

    res.render('tasks/index',{
        tasks       : tasks,
        catalogs    : catalogs,
        disciplines : disciplines,
        pages: pagination.getPages(),

    });

};


exports.filter = async function (req,res) {
    let Task  =  new TaskModel();
    let Catalog = new CatalogModel();
    let Tag     = new TagModel();

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

    if ((tag_id.length == 0)&&(catalog_id.length == 0)){
        id_catalog_quary = '1=1';
    }

    let tasks = await Task.find('all',{
        join: [
            ['inner', 'catalog','catalog.id  = task.catalog_id'],
            ['inner','task_has_tag', 'task.id= task_has_tag.task_id '],
            ['left','tag','task_has_tag.tag_id = tag.id'],
        ],
        select: ['task.id', 'catalog.title as ctitle', 'task.title', 'task.text', 'task.isReady', 'task.count_result'],
        where: [id_catalog_quary+id_tag_quary],
        group: 'task.id',
        order: 'isReady',
    });


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
            let find = false;
            for(let j = 0; j<tag_id.length; j++){
                if (tags[i].id == tag_id[j]){
                    find = true;
                    disciplines[tags[i].id_parent].tags.push({
                        name : tags[i].title,
                        id   : tags[i].id,
                        checked : 'checked',
                    });
                    break;
                }
            }
            if (find == false){
                disciplines[tags[i].id_parent].tags.push({
                    name : tags[i].title,
                    id   : tags[i].id,
                });
            }
        }
    }

    for (let i = 0; i< catalogs.length;i ++){
        for (let j = 0; j < catalog_id.length; j++){
            if(catalogs[i].id == catalog_id[j]){
                catalogs[i].checked = 'checked';
            }
        }
    }

    res.render('tasks/index',{
        tasks       : tasks,
        catalogs    : catalogs,
        disciplines : disciplines,
    });
};


exports.actionTask = async function(req, res){
    let get = req.query;
    let id = get.id;

    //провека пришедшего id
    id = Number(id);
    console.log(id);
    if(!id){
        res.status(404);
        res.render('server/404', {error: 'Тренажер на найден'});
        return;
    }

    //поиск тренажера по id
    let Task = new TaskModel();
    let task = await Task.find('one', {
        select: ['task.title', 'task.text', 'task.isReady', 'catalog.title AS ctitle'],
        join: [
            ['inner', 'catalog', 'task.catalog_id = catalog.id']
        ],
    });

    console.log(task);

    res.render('tasks/task', {
        task: task
    });
}
