// model.js
const db = require('../config/config');

exports.getAllPages = (pageId, callback) => {
    db.query(
        `SELECT ca.key, ca.value FROM pages p 
         JOIN components c ON p.page_id = c.page_id 
         JOIN component_attributes ca ON c.component_id = ca.component_id 
         WHERE p.page_id = ?;`,
        [pageId],
        (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null, results);
        }
    );
};

// Add other methods for handling database queries
