const mysql = require('../lib/database/mysql');
const async = require('async');

let mysqlQuery = 'INSERT INTO `tag` SET ?';
let tags = [
    {
        id              : '1',
        title           : 'Дискрентая математика',
    },
    {
        id              : '2',
        title           : 'Графы',
        id_parent       : '1' ,
    },
    {
        id              : '3',
        title           : 'Множества',
        id_parent       : '1',
    },
];


let query = async () => {
    let remove = await mysql.promise().query('DELETE FROM `tag` WHERE 1');
    let create = await async.parallel([
            function(callback){
                mysql.query(mysqlQuery, tags[0], function(err, result){
                    if(err){
                        console.log();
                        throw err;
                    }
                    callback(err, result);
                })
            },
            function(callback){
                mysql.query(mysqlQuery, tags[1], function(err, result){
                    if(err){
                        console.log();
                        throw err;
                    }
                    callback(err, result);
                })
            },
            function(callback){
                mysql.query(mysqlQuery, tags[2], function(err, result){
                    if(err){
                        console.log();
                        throw err;
                    }
                    callback(err, result);
                })
            },
        ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating was success');
        }
    );
};

query();