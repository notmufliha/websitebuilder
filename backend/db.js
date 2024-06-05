import mysql from 'mysql2'

// Configure your MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'grapesjs',
  multipleStatements: true,
})

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }
  console.log('connected as id ' + connection.threadId)
})

export default connection
