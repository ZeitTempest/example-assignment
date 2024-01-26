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

// Importing all routes
const users = require("./routes/routerV2")

app.use("/", users)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})
