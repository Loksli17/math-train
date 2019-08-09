const mysql = require('../lib/database/mysql');
const async = require('async');

let mysqlQuery = 'INSERT INTO `catalog_group` SET ?';
let groups = [
    {
        id   : '1',
        title: 'Сложности',
    },
    {
        id   : '2',
        title: 'Название',
    },
    {
        id   : '3',
        title: 'Название',
    }
];


let query = async () => {
    let removeСatalog = await mysql.promise().query('DELETE FROM `catalog` WHERE 1');
    let removeСatalogGroup = await mysql.promise().query('DELETE FROM `catalog_group` WHERE 1');

    let create = await async.parallel([
            function(callback){
                mysql.promise().query(mysqlQuery, groups[0], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.promise().query(mysqlQuery, groups[1], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.promise().query(mysqlQuery, groups[2], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
        ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating was success');
        }
    )
}

query();
