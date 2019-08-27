const mysql = require('./../lib/database/mysql');
const Pagination = require('./../lib/pagination');

const CatalogModel    = require ('./../models/mysql/catalogModel');
const TagModel        = require ('./../models/mysql/tagModel');
const TaskModel       = require('./../models/mysql/taskModel');
const TaskHasTagModel = require('./../models/mysql/taskHasTagModel');


exports.index  = async function (req,res) {

    let Task  =  new TaskModel();
    let Catalog = new CatalogModel();
    let Tag     = new TagModel();

    console.log(req.query);

    let id_tag_quary = '';
    let id_catalog_quary = '';
    let where = '';

    let disciplines = {};
    let catalogs = {};
    let tags  = {};

    if (req.query.catalog != undefined || req.query.tag != undefined){

        tags = await Tag.find('all', {
            order : 'id_parent',
        });

        catalogs = await Catalog.find('all' );

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

        if (req.query.catalog != undefined){
            id_catalog_quary = '(';
            for (let i = 0 ;i  < req.query.catalog.length ; i++){
                if (i!= req.query.catalog.length-1){
                    id_catalog_quary =id_catalog_quary+' catalog.id = '+req.query.catalog[i]+' or ';
                }else{
                    id_catalog_quary = id_catalog_quary+'catalog.id = '+req.query.catalog[i] +' )';
                }
            }

            for (let i = 0; i< catalogs.length;i ++){
                for (let j = 0; j < req.query.catalog .length; j++){
                    if(catalogs[i].id == req.query.catalog[j]){
                        catalogs[i].checked = 'checked';
                    }
                }
            }
        }

        if ((req.query.catalog != undefined) && ( req.query.tag!= undefined)){
            id_tag_quary = ' AND ';
        }

        if (req.query.tag != undefined){
            id_tag_quary = id_tag_quary+'( ';

            for (let i = 0 ;i  < req.query.tag.length ; i++){
                if (i!= req.query.tag.length - 1){
                    id_tag_quary =id_tag_quary + 'tag.id = ' + req.query.tag[i] + ' or ';
                }else{
                    id_tag_quary = id_tag_quary + 'tag.id = ' + req.query.tag[i] + ' )';
                }
            }

            for (let i = 0; i < tags.length; i++){
                if (tags[i].id_parent == null){
                    disciplines[tags[i].id]   = {};
                    disciplines[tags[i].id].name = tags[i].title;
                    disciplines[tags[i].id].tags = [];

                }else{
                    let find = false;
                    for(let j = 0; j<req.query.tag.length; j++){
                        if (tags[i].id == req.query.tag[j]){
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
        }

        where = id_catalog_quary + id_tag_quary;

    }else{
        where = '1 = 1 ';

        tags = await Tag.find('all', {
            order : 'id_parent',
        });

        catalogs = await Catalog.find('all' );


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
    }

    // let page  = 1,
    //     count = 0;
    // if(req.query.page != undefined){
    //     page = req.query.page;
    // }

    // count = await Task.find('count', {
    //     join: [ ['inner', 'catalog','catalog.id  = task.catalog_id'],
    //         [ 'inner','task_has_tag', 'task.id = task_has_tag.task_id '],
    //         ['inner','tag','task_has_tag.tag_id = tag.id'],
    //     ],
    //     group: 'task.id',
    //     where: where,
    // });
    //
    // console.log(count);
    // let pagination = new Pagination({
    //     pageSize  : 4,
    //     limit     : 3,
    //     page      : page,
    //     url       : '/tasks/filter',
    //     count     : count,
    // });

    let tasks = await Task.find('all',{
        join: [
            ['inner', 'catalog','catalog.id  = task.catalog_id'],
        ],
        select: ['task.id', 'catalog.title as ctitle', 'task.title', 'task.text', 'task.isReady', 'task.count_result'],
        where: where,
        group: 'task.id',
        order: 'isReady',
        orderDesc: true,
        // limit: pagination.skip + ', ' + pagination.limit,
    });

    console.log(tasks);

    res.render('tasks/index',{
        tasks       : tasks,
        catalogs    : catalogs,
        disciplines : disciplines,
        // pages: pagination.getPages(),
    });

};



exports.actionTask = async function(req, res){
    let get = req.query;
    let id = get.id;

    //провека пришедшего id
    id = Number(id);
    if(!id){
        res.status(404);
        res.render('server/404', {error: 'Тренажер на найден'});
        return;
    }

    //поиск тренажера по id
    let Task = new TaskModel();
    let task = await Task.find('one', {
        select: ['task.id', 'task.title', 'task.text', 'task.isReady', 'catalog.title AS ctitle', 'task.code_file AS codeFile'],
        join: [
            ['inner', 'catalog', 'task.catalog_id = catalog.id'],
        ],
        where: 'task.id = ' + id,
    });

    //проверка тренажера
    if(task == undefined){
        res.status(404);
        res.render('server/404', {error: 'Тренажер на найден'});
        return;
    }

    if(!task.isReady){
        res.render('tasks/notReady', {layout: null});
        return;
    }

    let TaskHasTag = new TaskHasTagModel();
    let tags = await TaskHasTag.find('all', {
        select: ['title'],
        join: [
            ['inner', 'tag', 'task_has_tag.tag_id = tag.id'],
        ],
        where: 'task_id = ' + task.id,
    });

    //подключение серверного модуля тренажера
    const trainModel = require('./../lib/trains/' + task.codeFile);
    let train = new trainModel();
    let data = train.getData();

    res.render('tasks/task', {
        task: task,
        tags: tags,
        data: data,
    });
};
