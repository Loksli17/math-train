const mysql = require('../lib/database/mysql');
const async = require('async');

let mysqlQuery = 'INSERT INTO `task` SET ?';
let tasks = [
    {
        id          : '1',
        title       : 'Простые операции над множествами',
        text        : 'Даны два случайно созданных множества. Определить их объединение, пересечение, разность, и симметрическую разность. Заглавные и прописные буквы являются разными элементами.<br> P.S. Ответы вводить без пробелов и других символов',
        code_file   : 'simpleSets',
        isReady     : '1',
        desciption  : 'выполнить 4 простых операции над двумя множествами',
        count_result: '0',
        catalog_id  : '1'
    },
    {
        id          : '2',
        title       : 'Тенажер',
        text        : 'Текст',
        code_file   : 'simpleSets',
        isReady     : '0',
        desciption  : 'Описание',
        count_result: '0',
        catalog_id  : '1'
    },
    {
        id          : '3',
        title       : 'Тренажер',
        text        : 'Текст',
        code_file   : 'simpleSets',
        isReady     : '0',
        desciption  : 'Описание',
        count_result: '0',
        catalog_id  : '1'
    },
];


let query = async () => {
    let remove = await mysql.promise().query('DELETE FROM `task` WHERE 1');
    let create = await async.parallel([
            function(callback){
                mysql.query(mysqlQuery, tasks[0], function(err, result){
                    if(err){
                        console.log();
                        throw err;
                    }
                    callback(err, result);
                })
            },
            function(callback){
                mysql.query(mysqlQuery, tasks[1], function(err, result){
                    if(err){
                        console.log();
                        throw err;
                    }
                    callback(err, result);
                })
            },
            function(callback){
                mysql.query(mysqlQuery, tasks[2], function(err, result){
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
