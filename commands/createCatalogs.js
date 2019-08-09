const config   = require('../config');
const mysql = require('../lib/database/mysql');
const async      = require('async');
let query = async () => {
    let remove = await mysql.promise().query('Delete from catalog where 1');
    let mysqlQuary = "Insert into catalog(title,catalog_group_id) VALUES(?,?)"
    let create = await await  async.parallel([
                                function (callback) {
                                    let catalog = ['Math',1];
                                    mysql.query(mysqlQuary,catalog,function (err,result) {
                                        if (err){
                                            console.log(err);
                                            throw err;
                                        }else{
                                            callback(err,result);
                                        }
                                    })
                                },
                                function () {
                                    let catalog = ['',2];
                                    mysql.query(mysqlQuary,catalog,function (err,result) {
                                        if (err){
                                            console.log(err);
                                            throw err;
                                        }else{
                                            callback(err,result);
                                        }
                                    })
                                },function(){
                                    let catalog = []



                                },



                              ])
};

query();