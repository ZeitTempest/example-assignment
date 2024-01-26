const mysql = require("mysql")

const connectDatabase = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "P@ssw0rd123",
  database: "tms_database",
  debug: false
})

module.exports = connectDatabase
