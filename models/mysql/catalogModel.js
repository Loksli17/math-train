const modelMysql = require('../../lib/Orm/mysqlOrm');


//model of tasks-mysql
function CatalogModel(){
    tableName = 'catalog';
    modelMysql.call(this, tableName);
}

//наследование
CatalogModel.prototype = Object.create(modelMysql.prototype);
CatalogModel.prototype.constructor = CatalogModel;

CatalogModel.prototype.rules = {
  required : ['title','catalog_group_id'],
};

module.exports = CatalogModel;