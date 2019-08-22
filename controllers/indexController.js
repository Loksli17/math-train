const mysql = require('../lib/database/mysql');



//моделька
//find - 'one' редактировать!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function modelMysql(_tableName, object){
    this.tableName = _tableName;
};

modelMysql.prototype.rules = {
    required: ['title', 'text', 'description', 'catalog_id'],
}

modelMysql.prototype.create = function(newTask, func){
    mysql.query('insert into  ' + this.tableName + ' set ?', newTask, func);
}


modelMysql.prototype.find = async function(method, conditions){

    let query           = "",
        conditionsQuery = "",
        fields          = new Array();

    if(conditions == undefined){
        conditions = {};
    }

    if(conditions.select != undefined){
        if(!Array.isArray(conditions.select)){
            throw "Error: select must be an array";
            return;
        }
        for(let i = 0; i < conditions.select.length; i++){
            fields += conditions.select[i];
            if(i != conditions.select.length - 1){
                fields += ', ';
            }
        }
    }else{
        fields = '*';
    }

    //conditions concat to query
    if(conditions.join != undefined){
        if(!Array.isArray(conditions.join)){
            throw 'Error: join must be an array of array';
        }
        for(let i = 0; i < conditions.join.length; i++){
            conditionsQuery += ' ' + conditions.join[i][0] + ' JOIN ' + conditions.join[i][1] + ' ON ' + conditions.join[i][2];
        }
    }

    if(conditions.where != undefined){
        conditionsQuery += ' WHERE ' + conditions.where;
    }

    if(conditions.group != undefined){
        conditionsQuery += ' GROUP BY ' + conditions.group;
        if(conditions.groupDesc != undefined){
            conditionsQuery += ' DESC';
        }
    }

    if(conditions.having != undefined){
        conditionsQuery += ' HAVING ' + conditions.having;
    }

    if(conditions.order != undefined){
        conditionsQuery += ' ORDER BY ' + conditions.order;
        if(conditions.orderDesc != undefined && conditions.orderDesc){
            conditionsQuery += ' DESC';
        }
    }

    if(conditions.limit != undefined){
        if(method != 'one'){
            conditionsQuery += ' LIMIT ' + conditions.limit;
        }
    }

    switch(method){
        case 'all':
            query = 'SELECT ' + fields + ' from ' + this.tableName + conditionsQuery;
            break;
        case 'one':
            query = 'SELECT ' + fields + ' from ' + this.tableName + ' limit 1';
            break;
        case 'count':
            query = 'SELECT COUNT(*) from ' + this.tableName + ' ' + conditionsQuery;
            break;
        default:
            throw "Error: method must be 'all' or 'one' or 'count'";
            return;
    }

    if(conditions.sql != undefined && conditions.sql){
        return query;
    }

    var result = await mysql.promise().query(query);

    switch(method){
        case 'all':
            result = result[0];
            break;
        case 'one':
            result = result[0][0];
            break;
        case 'count':
            result = result[0][0]['COUNT(*)'];
            console.log(result);
            break;
    }

    return result;
}


//@return OBJECT
modelMysql.prototype.findById = async function(id){
    if(id == undefined){
        throw 'Error: param id was undefined';
        return false;
    }
    id = Number(id);
    if(isNaN(id)){
        throw 'Error: param id must be a number';
        return false;
    }
    let query = 'SELECT * FROM ' + this.tableName + ' WHERE id = ?';
    var tasks = await mysql.promise().query(query, id);
    tasks = tasks[0][0];
    return tasks;
}

//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.remove = async function(options, conditions){
    if(options == undefined){
        throw "Error: options was undefined, maybe you mean remove('all')?";
        return false;
    }else if(options == 'all'){
        options = 1;
    }
    let query = 'DELETE FROM ' + this.tableName + ' WHERE ' + options;
    if(conditions.sql != undefined && conditions.sql){
        return query;
    }
    let result = await mysql.promise().query(query);
    return (!result[0].warningStatus) ? true : false;
}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.removeById = async function(id){
    if(id == undefined){
        throw 'Error: param id was undefined';
        return false;
    }
    id = Number(id);
    if(isNaN(id)){
        throw 'Error: param id must be a number';
        return false;
    }
    //deleting
    let query = 'DELETE FROM ' + this.tableName + ' WHERE id = ?';
    let result = await mysql.promise().query(query, [id]);
    return (!result[0].warningStatus) ? true : false;
}


//@return object of mysql - mysqlQuery
modelMysql.prototype.query = async function(query){
    let result = await mysql.promise().query(query);
    return result;
}


modelMysql.prototype.validate = async function(object){
    console.log(this.rules);
}

//@return true or false of updating
modelMysql.prototype.save = async function(object, id){

    let query = "";

    this.validate(object);

    if(id == undefined){
        //insert
        query = 'INSERT ' + this.tableName + ' SET ?';
        let result = await mysql.promise().query(query, [object]);
    }else{
        //update
        id = Number(id);
        if(isNaN(id)){
            throw 'Error: param id must be a number';
            return false;
        }
        query = 'UPDATE ' + this.tableName + ' SET ? WHERE id = ?';
        let result = await mysql.promise().query(query, [object, id]);
    }

    return (!result[0].warningStatus) ? true : false;
}





exports.actionIndex = async function(req, res){
    let Task = new modelMysql('task');
    let update = Task.save({title: 'test', text: 'test', description: 'описание', catalog_id: '1'});
    let tasks = await Task.find('all', {
        join: [
            ['inner', 'catalog', 'catalog_id = catalog.id'],
            ['inner', 'task_has_tag', 'task.id = task_has_tag.task_id']
        ],
        sql: true,
        select: ['task.id', 'task.title', 'catalog.title', 'task_has_tag.tag_id']
    });
    let task = await Task.find('one', {where: 'id > 1'});

    res.send({task, update});

    // res.render('index', {
    //     date: tasks,
    // });
};
