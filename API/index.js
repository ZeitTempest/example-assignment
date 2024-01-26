const express = require("express")
const app = express()
const cors = require("cors")

const dotenv = require("dotenv") // Importing Env
const bodyParser = require("body-parser") // Importing Body Parser

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" })

// Set up body parser
app.use(bodyParser.json())

// Set up CORS
app.use(cors())

// Importing all ALLOWED routes
const api = require("./router")
const { ErrorManager, ProtectedRoute } = require("./controller/ErrorMgr")

app.use("/", api, ErrorManager)

// To protect AGAINST all other routes
app.use("/*", ProtectedRoute)

app.use(function (err, req, res, next) {
  if (err.statusCode === 400) {
    res.status(200).json({ result: "KEE018" })
    return
  } else if (true) {
    res.status(200).json({ result: "KEE018" })
    return
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})
