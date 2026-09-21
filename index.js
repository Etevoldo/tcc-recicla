'use strict';

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3307',
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