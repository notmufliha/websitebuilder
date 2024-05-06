// model.js
const db = require('../config/config');

exports.getAllPages = (callback) => {
    db.query('SELECT * FROM pages', (error, results) => {
        if (error) {
            console.error('Error fetching pages:', error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
};

// Add other methods for handling database queries
