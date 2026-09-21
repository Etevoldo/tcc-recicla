'use strict';

const mysql = require('mysql2');

console.log('i live');

const connection = mysql.createConnection({
    host: 'db',
    port: '3306',
    user: 'root',
    password: 'secret',
    database: 'reciclaapi'
});


connection.connect();

connection.query('SELECT * FROM buyers', function(error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();