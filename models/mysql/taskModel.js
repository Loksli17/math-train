const modelMysql = require('../../lib/Orm/mysqlOrm');

//model of tasks-mysql
function TaskModel(){
    tableName = 'Task';
    modelMysql.call(this, tableName);
}

//наследование
TaskModel.prototype = Object.create(modelMysql.prototype);
TaskModel.prototype.constructor = TaskModel;

TaskModel.prototype.rules = {
    required: ['title', 'text', 'description', 'catalog_id'],
};

module.exports = TaskModel;
