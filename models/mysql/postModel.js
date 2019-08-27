const modelMysql = require('../../lib/Orm/mysqlOrm');

//model of tasks-mysql
function PostModel(){
    tableName = 'post';
    modelMysql.call(this, tableName);
}

//наследование
PostModel.prototype = Object.create(modelMysql.prototype);
PostModel.prototype.constructor = PostModel;

PostModel.prototype.rules = {
    required : ['title','view','text','description','image'],
};

module.exports = PostModel;