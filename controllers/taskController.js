const mysql = require('./../lib/database/mysql');
const Pagination = require('./../lib/pagination');
const fs = require('fs');

const CatalogModel    = require ('./../models/mysql/catalogModel');
const TagModel        = require ('./../models/mysql/tagModel');
const TaskModel       = require('./../models/mysql/taskModel');
const TaskHasTagModel = require('./../models/mysql/taskHasTagModel');
const Result          = require('./../models/mongoose/resultModel');
const checkGet        = require('./../lib/checkGet');


exports.index  = async function(req, res) {

    let Task       = new TaskModel();
    let Catalog    = new CatalogModel();
    let Tag        = new TagModel();
    let TaskHasTag = new TaskHasTagModel();

    let idTagQuery     = '';
    let idCatalogQuery = '';
    let where          = '';

    let disciplines = {};
    let catalogs    = {};
    let tags        = [];

    if (req.query.catalog != undefined || req.query.tag != undefined){
        tags = await Tag.find('all', {
            order : 'id_parent',
        });

        catalogs = await Catalog.find('all' );

        for (let i = 0; i < tags.length; i++){
            if (tags[i].id_parent == null){
                disciplines[tags[i].id]      = {};
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
            idCatalogQuery = '(';
            for (let i = 0; i < req.query.catalog.length; i++){
                if (i!= req.query.catalog.length-1){
                    idCatalogQuery = idCatalogQuery + 'catalog.id = ' + req.query.catalog[i] + ' or ';
                }else{
                    idCatalogQuery = idCatalogQuery + 'catalog.id = ' + req.query.catalog[i] + ' )';
                }
            }

            for (let i = 0; i < catalogs.length; i++){
                for (let j = 0; j < req.query.catalog.length; j++){
                    if(catalogs[i].id == req.query.catalog[j]){
                        catalogs[i].checked = 'checked';
                    }
                }
            }
        }

        if ((req.query.catalog != undefined) && (req.query.tag != undefined)){
            idTagQuery = ' AND ';
        }

        if (req.query.tag != undefined){
            req.query.tag = checkGet.check(req.query.tag);
            idTagQuery = idTagQuery + '( ';

            for (let i = 0 ;i  < req.query.tag.length ; i++){
                if (i!= req.query.tag.length - 1){
                    idTagQuery = idTagQuery + 'tag_id = ' + req.query.tag[i] + ' or ';
                }else{
                    idTagQuery = idTagQuery + 'tag_id = ' + req.query.tag[i] + ' )';
                }
            }

            for (let i = 0; i < tags.length; i++){
                if (tags[i].id_parent == null){
                    disciplines[tags[i].id]      = {};
                    disciplines[tags[i].id].name = tags[i].title;
                    disciplines[tags[i].id].tags = [];
                }else{
                    let find = false;
                    for(let j = 0; j < req.query.tag.length; j++){
                        if (tags[i].id == req.query.tag[j]){
                            find = true;
                            disciplines[tags[i].id_parent].tags.push({
                                name    : tags[i].title,
                                id      : tags[i].id,
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
        where = idCatalogQuery + idTagQuery;
    }else{
        where = '1 = 1 ';

        tags = await Tag.find('all', {
            order : 'id_parent',
        });

        catalogs = await Catalog.find('all');

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

    //пагинация
    let page  = 1,
        url   = req.originalUrl,
        count = 0;

    if(req.query.page != undefined){
        page = req.query.page;
        url = req.originalUrl.substring(0, req.originalUrl.length - 7);
    }

    //count для пагинации
    var relations = await TaskHasTag.find('all', {
        join: [
            ['inner', 'task', 'task.id = task_has_tag.task_id'],
            ['inner', 'catalog', 'catalog.id  = task.catalog_id'],
        ],
        where: where,
    });
    let minusCount = 0;
    for(let i = 0; i < relations.length; i++){
        for(let j = i; j < relations.length; j++){
            if(relations[i].task_id == relations[j].task_id){
                minusCount++;
            }
        }
    }
    minusCount = minusCount - relations.length;
    count = relations.length - minusCount;

    if(!count){
        res.render('tasks/index',{
            tasks       : [],
            catalogs    : catalogs,
            disciplines : disciplines,
        });
        return;
    }

    if(page > count && count != 0){
        res.status(404);
        res.render('server/404', {layout: null});
        return;
    }

    let pagination = new Pagination({
        pageSize  : 4,
        limit     : 4,
        page      : page,
        url       : url,
        count     : count,
    });

    let tasks = await Task.find('all',{
        join: [
            ['inner', 'catalog','catalog.id  = task.catalog_id'],
            ['inner', 'task_has_tag', 'task.id= task_has_tag.task_id '],
        ],
        select   : ['task.id', 'catalog.title as ctitle', 'task.title', 'task.description', 'task.isReady', 'task.count_result', 'task.img'],
        where    : where,
        group    : 'task_id',
        order    : 'isReady',
        orderDesc: true,
        limit    : pagination.skip + ', ' + pagination.limit,
    });

    //получение связей между тегами и добавление тегов для тренажеров
    let ids = '';
    for(let i = 0; i < tasks.length; i++){
        ids += tasks[i].id;
        tasks[i].tags = new Array();
        if(i != tasks.length - 1){
            ids += ',';
        }
    }

    relations = await TaskHasTag.find('all', {
        where: 'task_id in (' + ids + ')',
    });

    for(let i = 0; i < tasks.length; i++){
        for(let j = 0; j < relations.length; j++){
            if(tasks[i].id == relations[j].task_id){
                var tagId = relations[j].tag_id;
                for(let k = 0; k < tags.length; k++){
                    if(tags[k].id == tagId){
                        tasks[i].tags.push(tags[k].title);
                    }
                }
            }
        }
        switch(tasks[i].ctitle){
            case "Легко":
                tasks[i].cltitle = "easy";
                break;
            case "Средне":
                tasks[i].cltitle = "middle";
                break;
            case "Сложно":
                tasks[i].cltitle = "hard";
                break;
            case "Очень сложно":
                tasks[i].cltitle = "very-hard";
                break;
        }
    }

    res.render('tasks/index',{
        tasks       : tasks,
        catalogs    : catalogs,
        disciplines : disciplines,
        pages       : pagination.getPages(),
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
        res.render('server/404', {
            error: 'Тренажер не найден',
            layout: null,
        });
        return;
    }

    if(!task.isReady && !req.cookies.userUdentity.isAdmin){
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

    //проверка существования файла
    console.log();
    const checkFile = fs.existsSync('lib/trains/' + task.codeFile + '.js');
    //подключение серверного модуля тренажера
    if(!checkFile){
        res.status('404');
        res.render('server/404', {
            error : 'Не найден рабочий файл тренажера',
            layout: null,
        });
        return;
    }

    let results = await Result.find({task_id: id, user_id: req.cookies.userUdentity.id}, null, {limit: 5});
    const trainModel = require('./../lib/trains/' + task.codeFile);
    let train = new trainModel();
    let data = train.getData();

    switch(task.ctitle){
        case "Легко":
            task.cltitle = "easy";
            break;
        case "Средне":
            task.cltitle = "middle";
            break;
        case "Сложно":
            task.cltitle = "hard";
            break;
        case "Очень сложно":
            task.cltitle = "very-hard";
            break;
    }

    res.render('tasks/task', {
        id     : id,
        task   : task,
        tags   : tags,
        data   : data,
        file   : 'trains/' + task.codeFile,
        results: results,
    });
};



exports.actionTaskAnswer = async function(req, res){
    if(req.xhr || req.accepts('json, html' ) === 'json' ){
        let Task = new TaskModel(),
            data = req.query;
        let id = data.id;

        id = Number(id);
        if(!id){
            res.send({success: false});
            return;
        }

        let task = await Task.findById(data.id);

        if(!task){
            res.send({success: false});
            return;
        }

        const trainModel = require('./../lib/trains/' + task.code_file);
        let train = new trainModel();
        let answer = train.checkAnswer(data);

        //увелечение кол-ва ответов
        task.count_result = Number(task.count_result);
        task.count_result++;
        Task.save(task, task.id);

        answer.task_id = task.id;
        answer.user_id = req.cookies.userUdentity.id;
        await Result(answer).save();

        res.send({
            success: true,
            result: answer.isRight,
        });
    }else{
        res.status(404);
        res.render('server/404', {
            layout: null,
        });
    }
}
