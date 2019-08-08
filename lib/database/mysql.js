const mysql = require('mysql2');
const config= require('./../../config/config');

const mysqlConnection = mysql.createConnection({
   host    : config.db.mysql.host,
   user    : config.db.mysql.user,
   database: config.db.mysql.database,
   password: config.db.mysql.password,
});

mysqlConnection.connect(function (err) {
   if (err){
       console.log("Error with connection to mysql server: "+err)
   }else {
       console.log("Connected to mysql server")
   }

});

module.exports = mysqlConnection;