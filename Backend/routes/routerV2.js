const express = require("express")
const router = express.Router()

// Importing User controller methods
// prettier-ignore
const { 
  loginUser, 
  verifyUser, 
  getUsername, 
  getUsers, 
  updatePassword, 
  updateEmail, 
  updatePasswordAdmin, 
  updateEmailAdmin,
  updateActiveStatusAdmin,
  createUserAdmin
} = require("../contollers/userController")

// Importing Group controller methods
// prettier-ignore
const { 
  checkGroup, 
  getUserGroups, 
  getGroups,
  addUserToGroupAdmin,
  rmvUserFrGroupAdmin,
  createGroupAdmin,
  getAllGroups
} = require("../contollers/groupController")

// Importing interceptors
// prettier-ignore
const { 
  isAutheticatedUser,
  authorizedAdmin
 } = require("../middlewares/auth")

// Importing TMS controller methods
// prettier-ignore
const {
  createApplication,
  getApplication,
  updateApplication,
  createPlan,
  getPlan,
  updatePlan,
  createTask,
  getTask,
  updateTaskStatus,
 } = require('../contollers/TMSController')

// Importing sending email methods
const { sendEmail } = require("../contollers/nodemailer")

// GET, POST, PUT, DELETE methods are defined here

// functions
router.route("/user/login").post(loginUser) // (username, password) => (token)

// update user's profile with token
router.route("/user/verify").get(verifyUser) // (token) => (true/false)
router.route("/user/getusername").get(getUsername) // (token) => (username)
router.route("/user/update_password").put(isAutheticatedUser, updatePassword) // (token) => (true/false)
router.route("/user/update_email").put(isAutheticatedUser, updateEmail) // (token) => (true/false)
router.route("/group/user").get(isAutheticatedUser, getUserGroups) // (token) => (object of groups)
router.route("/group/checkgroup").post(isAutheticatedUser, checkGroup) // (token, group_name) => (true/false)

// admin update user // NEED TO AUTH TOKEN IS ADMIN
// get details of all users
router.route("/users").get(isAutheticatedUser, getUsers) // () => (user details)
router.route("/groups").get(isAutheticatedUser, authorizedAdmin, getGroups) // () => (All group details)
router.route("/all_groups").get(isAutheticatedUser, getAllGroups) // () => (group_name details where username === "")

// to perform user updates as admin
router.route("/user/update_password_admin").put(isAutheticatedUser, authorizedAdmin, updatePasswordAdmin) // (username, password) => (true/false)
router.route("/user/update_email_admin").put(isAutheticatedUser, authorizedAdmin, updateEmailAdmin) // (username, email) => (true/false)
router.route("/user/update_activeStatus_admin").put(isAutheticatedUser, authorizedAdmin, updateActiveStatusAdmin) // (username, activeStatus) => (true/false)
router.route("/group/add_user_to_group_admin").post(isAutheticatedUser, authorizedAdmin, addUserToGroupAdmin) // (username, group_name) => (true/false)
router.route("/group/rmv_user_fr_group_admin").post(isAutheticatedUser, authorizedAdmin, rmvUserFrGroupAdmin) // (username, group_name) => (true/false)
router.route("/group/create_group_admin").post(createGroupAdmin) // (group_name) => (true/false)
router.route("/user/create_user_admin").post(isAutheticatedUser, authorizedAdmin, createUserAdmin) // (username, password, email) => (true/false)

// to perform TMS functions
router.route("/tms/create_application").post(createApplication) // (application details x9) => (true/false)
router.route("/tms/applications").get(getApplication) // () => (application details)
router.route("/tms/update_application").put(updateApplication) // (appName & updated_fields) => (true/false)
router.route("/tms/create_plan").post(createPlan) // (application details x4) => (true/false)
router.route("/tms/plans").post(getPlan) // (appName) => (plan details)
router.route("/tms/update_plan").put(updatePlan) // (appName & planName/planStartDate/planEndDate/planColour) => (true/false)
router.route("/tms/create_task").post(createTask) // (task details x8) => (true/false)
router.route("/tms/tasks").post(getTask) // (appName) => (task details)
router.route("/tms/update_task_status").put(updateTaskStatus) // (taskID/taskNewStatus) => (true/false)

// to perform Email functions
router.route("/tms/send_email").post(sendEmail) // (objects) => (send email) => (true/false)

module.exports = router
