const express = require("express")
const router = express.Router()

// Importing User controller methods
// done checking: verifyUser, loginUser, getUsername, getGroups
const { getUsers, verifyUser, newUser, updateEmail, updatePassword, updateActiveStatus, loginUser, getUsername } = require("../contollers/userController")

// Importing Group controller methods
//done checking: checkGroup
const { getGroups, checkGroup, getUserGroups, newGroup, addUserToGroup, rmvUserFrGroup } = require("../contollers/groupController")

const { isAutheticatedUser, authorizedAdmin } = require("../middlewares/auth")

// router.use(isAutheticatedUser)

// GET, POST, PUT, DELETE methods are defined here

// for users
// for all accounts, without JWTToken
router.route("/user/login").post(loginUser)

// for verifying token
router.route("/user/verify").get(verifyUser)

// for non-admin
router.route("/user/getusername").get(getUsername)
router.route("/user/update_email").put(isAutheticatedUser, updateEmail)
router.route("/user/update_password").put(isAutheticatedUser, updatePassword)

// for admin
router.route("/users").get(isAutheticatedUser, authorizedAdmin, getUsers)
router.route("/user/create").post(isAutheticatedUser, authorizedAdmin, newUser)
router.route("/user/update_email_admin").put(isAutheticatedUser, authorizedAdmin, updateEmail)
router.route("/user/update_password_admin").put(isAutheticatedUser, authorizedAdmin, updatePassword)
router.route("/user/update_activeStatus").put(isAutheticatedUser, authorizedAdmin, updateActiveStatus)

// for groups
// for all accounts, without JWTToken
router.route("/group/checkgroup").post(checkGroup)

// for non-admin
router.route("/group/user").get(getUserGroups)

// for admin
router.route("/groups").get(isAutheticatedUser, authorizedAdmin, getGroups)
router.route("/group/create").post(isAutheticatedUser, authorizedAdmin, newGroup)
router.route("/group/add_user_to_group").post(isAutheticatedUser, authorizedAdmin, addUserToGroup)
router.route("/group/rmv_user_fr_group").post(isAutheticatedUser, authorizedAdmin, rmvUserFrGroup)

module.exports = router
