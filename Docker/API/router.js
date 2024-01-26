const express = require("express")
const router = express.Router()

const { Login } = require("./controller/Middleware")
const { CreateTask, GetTaskbyState, PromoteTask2Done } = require("./controller/API")

router.route(process.env.EP_CREATETASK).post(Login, CreateTask)
router.route(process.env.EP_GETTASKBYSTATE).post(Login, GetTaskbyState)
router.route(process.env.EP_PROMOTETASK2DONE).post(Login, PromoteTask2Done)

module.exports = router
