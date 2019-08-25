const modelMysql = require('../../lib/Orm/mysqlOrm');


//model of tasks-mysql
function TagModel(){
    tableName = 'tag';
    modelMysql.call(this, tableName);
}

//наследование
TagModel.prototype = Object.create(modelMysql.prototype);
TagModel.prototype.constructor = TagModel;

TagModel.prototype.rules = {
    required : ['title'],
};

module.exports = TagModel;