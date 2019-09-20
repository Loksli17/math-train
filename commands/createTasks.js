const mysql = require('../lib/database/mysql');
const async = require('async');

let mysqlQueryTask = 'INSERT INTO `task` SET ?';
let mysqlQueryTht = 'INSERT INTO `task_has_tag` SET ?';

let tasks = [
    {
        id          : '1',
        title       : 'Простые операции над множествами',
        text        : 'Даны два случайно созданных множества. Определить их объединение, пересечение, разность, и симметрическую разность. Заглавные и прописные буквы являются разными элементами.<br> P.S. Ответы вводить без пробелов и других символов',
        code_file   : 'simpleSets',
        isReady     : '1',
        description : 'выполнить 4 простых операции над двумя множествами',
        count_result: '0',
        catalog_id  : '1'
    },
    {
        id          : '2',
        title       : 'Работа с неориентированным графом',
        text        : 'Для данного неориентированного графа построить матрицу смежности, матрицу инцидентности, матрицу расстояний, найти экцентриситеты вершин, радиус и диаметр графа',
        code_file   : 'undirectedGraph',
        isReady     : '0',
        description : 'Описание',
        count_result: '0',
        catalog_id  : '2'
    },
    {
        id          : '3',
        title       : 'Тренажер',
        text        : 'Текст',
        code_file   : 'simpleSets',
        isReady     : '0',
        description : 'Описание',
        count_result: '0',
        catalog_id  : '1'
    },
];

let taskHasTag = [
    {
        id     : '1',
        task_id: '1',
        tag_id : '3',
    },
    {
        id     : '2',
        task_id: '2',
        tag_id : '2',
    },
    {
        id     : '3',
        task_id: '1',
        tag_id : '2',
    },
]


let query = async () => {
    let removeTashHasTag = await mysql.promise().query('DELETE FROM `task_has_tag` WHERE 1');
    let removeTask = await mysql.promise().query('DELETE FROM `task` WHERE 1');

    let createTask = await async.parallel([
            function(callback){
                mysql.query(mysqlQueryTask, tasks[0], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.query(mysqlQueryTask, tasks[1], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.query(mysqlQueryTask, tasks[2], function(err, result){
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
            console.log('Creating task was success');
        }
    );

    let createTaskHasTag = await async.parallel([
            function(callback){
                 mysql.query(mysqlQueryTht, taskHasTag[0], function(err, result){
                     if(err){
                         console.log(err);
                         throw err;
                     }
                     callback(err, result);
                 });
            },
            function(callback){
                mysql.query(mysqlQueryTht, taskHasTag[1], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.query(mysqlQueryTht, taskHasTag[2], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            }
    ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating task_has_tag was success');
        }
    )

};

query();
