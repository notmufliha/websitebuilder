
// controller.js
const model = require('../model/model.js');

exports.getAllPages = (req, res) => {
    model.getAllPages((error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
};

// Add other methods for handling user requests

// const postsController = {
//     getAll: async (req, res) => {
//         try {
//             const [rows, fields] = await pool.query("select * from pages")
//             res.json({
//                 data: rows
//             })
//         } catch (error) {
//             console.log(error)
//             res.json({
//                 status: "error"
//             })
//         }
//     },
//     getById: async (req, res) => {
//         try {
//             const { id } = req.params
//             const [rows, fields] = await pool.query("select * from posts where id = ?", [id])
//             res.json({
//                 data: rows
//             })
//         } catch (error) {
//             console.log(error)
//             res.json({
//                 status: "error"
//             })
//         }
//     },
//     create: async (req, res) => {
//         try {
//             const { title, content } = req.body
//             const sql = "insert into posts (title, content) values (?, ?)"
//             const [rows, fields] = await pool.query(sql, [title, content])
//             res.json({
//                 data: rows
//             })
//         } catch (error) {
//             console.log(error)
//             res.json({
//                 status: "error"
//             })
//         }
//     },
//     update: async (req, res) => {
//         try {
//             const { title, content } = req.body
//             const { id } = req.params
//             const sql = "update posts set title = ?, content = ? where id = ?"
//             const [rows, fields] = await pool.query(sql, [title, content, id])
//             res.json({
//                 data: rows
//             })
//         } catch (error) {
//             console.log(error)
//             res.json({
//                 status: "error"
//             })
//         }
//     }, 
//     delete: async (req, res) => {
//         try {
//             const { id } = req.params
//             const [rows, fields] = await pool.query("delete from posts where id = ?", [id])
//             res.json({
//                 data: rows
//             })
//         } catch (error) {
//             console.log(error)
//             res.json({
//                 status: "error"
//             })
//         }
//     }

// }

// module.exports = postsController