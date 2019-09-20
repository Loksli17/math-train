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
    string: ['title', 'text'],
    integer: ['view'],
    required : ['title', 'view', 'text', 'description', 'image'],
};

PostModel.prototype.rulesMesseges = {
    string: 'Поле должно быть строкой',
    integer: 'Поле должно быть числом',
    required: 'Данное поле является обязательным',
}

module.exports = PostModel;
