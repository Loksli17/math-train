const mysql = require('../../lib/database/mysql');

function modelMysql(_tableName){
    this.tableName = _tableName;
};

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
            query = 'SELECT ' + fields + ' from ' + this.tableName + conditionsQuery + ' LIMIT 1';
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
    var task = await mysql.promise().query(query, id);
    task = task[0][0];
    return task;
}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.remove = async function(conditions){
    let where = '',
        query = '';

    if(conditions == undefined){
        conditions = {};
    }else if(conditions.where != undefined){
        where += conditions.where;
    }

    query = 'DELETE FROM ' + this.tableName + ' WHERE ' + where;

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


//@return true or fales of validation
modelMysql.prototype.validate = async function(object){
    if(this.rules != undefined){

        let errors = {
            required: '',
        };

        if(this.rules.required != undefined){
            //countObject
            let countObject = 0;
            for(let key in object){
                countObject++;
            }

            let required = this.rules.required;
            let flag = 0;

            for(let i in required){
                flag = 0;
                for(let key in object){
                    if(required[i] == key && object[key]){
                        break;
                    }else{
                        flag++;
                    }
                }
                if(flag == countObject){
                    errors.required = required[i];
                    return errors;
                }
            }
        }
    }else{
        return true;
    }
}


//@return true or false of updating
modelMysql.prototype.save = async function(object, id, sql){

    let query    = "",
        result   = "",
        validation = this.validate(object); //получит либо true либо ошибки валидации

    if(!validation){
        //дальше пойдет обработка результата валидации
        throw 'Model wasn`t validated';
        return false;
    }

    if(id == undefined){
        //insert
        query = 'INSERT ' + this.tableName + ' SET ?';
        result = await mysql.promise().query(query, [object]);
    }else{
        //update
        id = Number(id);
        if(isNaN(id)){
            throw 'Error: param id must be a number';
            return false;
        }
        query = 'UPDATE ' + this.tableName + ' SET ? WHERE id = ?';
        result = await mysql.promise().query(query, [object, id]);
    }

    return (!result[0].warningStatus) ? true : false;
}


module.exports = modelMysql;
