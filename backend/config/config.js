const mysql = require('mysql');

// Create a pool
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as per your requirement
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
    connection.release(); // Release the connection
});

module.exports = pool;
