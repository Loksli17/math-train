const mysql = require('./../lib/database/mysql');


exports.index  =  function (req,res) {
    mysql.query('SELECT id,title FROM catalog ','', function (err, rows) {
        console.log(rows.title);
        res.render('tasks/difficulty',  {
            rows : rows,
        });
    });

};
