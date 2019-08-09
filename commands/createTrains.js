const mysql = require('../lib/database/mysql');
const async = require('async');

let task = [
    {
        
    }
];

let query = async () => {
    let delete = await mysql.query('delete from task where id > 0');
    let create = await async.parallel([
            function(callback){
                mysql.query('insert into task set values(``, `Простые операции над множествами`, `Даны два случайно созданных множества. Определить их объединение, пересечение, разность, и симметрическую разность. Заглавные и прописные буквы являются разными элементами.<br>
P.S. Ответы вводить без пробелов и других символов`, `simpleSets`, `1`, `выполнить 4 простых операции над двумя множествами`, `0`, `0`)')
            },
        ],
        function(err, result){
            console.log(result);
        }
    );
};

query();
