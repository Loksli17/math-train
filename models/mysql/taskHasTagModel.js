const modelMysql = require('../../lib/Orm/mysqlOrm');

//model of tasks-mysql
function TaskHasTagModel(){
    tableName = 'task_has_tag';
    modelMysql.call(this, tableName);
}

//наследование
TaskHasTagModel.prototype = Object.create(modelMysql.prototype);
TaskHasTagModel.prototype.constructor = TaskHasTagModel;

module.exports = TaskHasTagModel;
