const express = require("express")
const router = express.Router()

const { Login } = require("./controller/Middleware")
const { CreateTask, GetTaskbyState, PromoteTask2Done } = require("./controller/API")

router.route("/CreateTask").post(Login, CreateTask)
router.route("/GetTaskbyState").post(Login, GetTaskbyState)
router.route("/PromoteTask2Done").post(Login, PromoteTask2Done)

module.exports = router
