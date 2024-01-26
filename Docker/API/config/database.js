const mysql = require("mysql")

const connectDatabase = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB,
  debug: process.env.DB_DEBUG === "true"
})

module.exports = connectDatabase
