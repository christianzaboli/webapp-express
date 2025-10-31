const mysql = require('mysql2');

const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'Borgosatollo1',
database: 'movies_db'
});

connection.connect((err) => {
if (err) throw err;
console.log('Connected to MySQL!');
});

module.exports = connection;