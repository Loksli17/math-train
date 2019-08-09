const config   = require('../config');
const mysql = require('../lib/database/mysql');
const async      = require('async');
let query = async () => {
    let remove = await mysql.promise().query('Delete from catalog where 1');
    let mysqlQuary = "Insert into catalog(title,catalog_group_id) VALUES(?,?)";
    let catalogs = [
        {
            id              : 1,
            title           : 'Легко',
            catalog_group_id: 1 ,
        },
        {
            id              : 2,
            title           : 'Средне',
            catalog_group_id: 2 ,
        },
        {
            id              : 3,
            title           : 'Сложно',
            catalog_group_id: 3 ,
        },
        {
            id              : 4,
            title           : 'Очень сложно',
            catalog_group_id: 3,
        },

    ];
    let create = await async.parallel([
            function(callback){
                mysql.promise().query(mysqlQuary, catalogs[0], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.promise().query(mysqlQuary, catalogs[1], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.promise().query(mysqlQuary, catalogs[2], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.promise().query(mysqlQuary, catalogs[4], function(err, result){
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
            console.log(result);
        }
    )
};
query();
