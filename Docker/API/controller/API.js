const connectDatabase = require("../config/database")
const validator = require("validator")
const nodemailer = require("nodemailer")

async function checkGroup(username, group_name) {
  return new Promise((resolve, reject) => {
    connectDatabase.getConnection(function (err, connection) {
      if (err) {
        resolve(false)
      }
      const query = "SELECT username FROM user_groups WHERE username = ? AND group_name = ?"
      data = [username, group_name]
      connection.query(query, data, (err, results) => {
        if (err) {
          resolve(false)
        }

        if (results.length === 1) {
          resolve(results[0].username)
        } else {
          resolve(false)
        }
      })
      connection.release()
    })
  })
}

async function sendEmail(req, res, next, permDoneGroup) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW
    }
  })

  connectDatabase.getConnection(function (err, connection) {
    const mailUsers = []

    if (err) {
      next((error = { type: "emailDatabaseError", loc: new Error().stack, msg: err }))
    }
    const data1 = permDoneGroup
    const query1 = "SELECT username FROM tms_database.user_groups WHERE group_name = ?;"
    connection.query(query1, data1, (err, results) => {
      if (err) {
        next((error = { type: "emailDatabaseError", loc: new Error().stack, msg: err }))
      }

      results.forEach(result => {
        if (result.username !== "") {
          mailUsers.push(result.username)
        }
      })

      const query2 = "SELECT email FROM users WHERE username IN (?)"
      connection.query(query2, [mailUsers], (err, results) => {
        if (err) {
          next((error = { type: "emailDatabaseError", loc: new Error().stack, msg: err }))
        }

        results.forEach(result => {
          if (result.email !== "") {
            const content = {
              from: `"Task Management System" <no-reply@tms.com>`,
              to: `${result.email}`,
              subject: `${req.body.Task_id} has been promoted to Done by ${req.body.Username}.`,
              text: `Dear Project Lead,
            
              ${req.body.Username} has promoted ${req.body.Task_id} to Done for your kind approval.
            
              Thank you.
              TMS Management System
            
              ______________________________________________________
              This is a system generated email. Please do not reply.
                `
            }

            transporter.sendMail(content, function (err, info) {
              if (err) {
                next((error = { type: "emailError", loc: new Error().stack, msg: err }))
                return
              }
            })
          }
        })
      })
    })
    connection.release()
  })
}

exports.CreateTask = async (req, res, next) => {
  try {
    // checking if Task_app_Acronym, Task_name, Task_description, Task_plan parameter exists
    // MANDATORY FIELDS
    let validateAppName = validator.isAlpha(req.body.Task_app_Acronym) && req.body.Task_app_Acronym !== "" // checks Task_app_Acronym is alphabets => T/F
    let validateTaskName = validator.isAscii(req.body.Task_name) && req.body.Task_name !== "" // checks Task_name is ASCII => T/F

    // OPTIONAL FIELDS
    let validateTaskDescription
    let validateTaskPlan
    // checks Task_description, Task_plan is ASCII => T/F
    req.body.Task_description === "" ? (validateTaskDescription = true) : (validateTaskDescription = validator.isAscii(req.body.Task_description))
    req.body.Task_plan === "" ? (validateTaskPlan = true) : (validateTaskPlan = validator.isAscii(req.body.Task_plan))

    let validation = validateAppName && validateTaskName && validateTaskDescription && validateTaskPlan // check all validation  => T/F

    if (!validation) {
      // if Task_app_Acronym || Task_name || Task_description || Task_plan is wrong data type => KEE010
      // if Task_app_Acronym || Task_name is empty ==> KEE010
      next((error = { type: "validation", loc: new Error().stack }))
      return
    }
  } catch (e) {
    // if Task_app_Acronym || Task_name || Task_description || Task_plan do not exists => NO BODY PARSED ERROR
    next((error = { type: "missingParams", loc: new Error().stack }))
    return
  }

  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      // if database is offline ==> DATABASE ERROR
      next((error = { type: "database", loc: new Error().stack }))
      return
    }

    const appDetails = await new Promise((resolve, reject) => {
      const query1 = "SELECT App_Rnumber, App_permit_Create, App_Acronym FROM application WHERE App_Acronym = ?"
      const data1 = [req.body.Task_app_Acronym]
      connection.query(query1, data1, (err, results) => {
        if (err) {
          // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
          next((error = { type: "database", loc: new Error().stack }))
          return
        }

        try {
          resolve({ currentRNumber: results[0].App_Rnumber, permissionCreate: results[0].App_permit_Create, App_Acronym: results[0].App_Acronym }) // Task_app_Acronym is correct
        } catch (e) {
          // if Task_app_Acronym is wrong ==> KEE014
          next((error = { type: "appNotFound", loc: new Error().stack }))
          return
        }
      })
    })

    const username = await checkGroup(req.body.Username, appDetails.permissionCreate)

    if (!username) {
      // if Username is not in App_permit_Create ==> KEE011
      next((error = { type: "group", loc: new Error().stack }))
      return
    }

    const Plan_MVP_name = await new Promise((resolve, reject) => {
      if (req.body.Task_plan === "") {
        resolve("")
        return
      }

      const query2 = "SELECT Plan_MVP_name FROM plan WHERE Plan_appAcronym = ? AND Plan_MVP_name = ?"
      const data2 = [req.body.Task_app_Acronym, req.body.Task_plan]
      connection.query(query2, data2, (err, results) => {
        if (err) {
          // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
          next((error = { type: "database", loc: new Error().stack }))
          return
        }
        try {
          resolve(results[0].Plan_MVP_name)
        } catch (e) {
          // if Task_plan is wrong ==> KEE014
          next((error = { type: "planNotFound", loc: new Error().stack }))
          return
        }
      })
    })

    const taskID = appDetails.App_Acronym + "_" + appDetails.currentRNumber
    const taskCreateDate = new Date().toLocaleDateString().replaceAll("/", "-")
    const taskNotes = `
==============================
UserID: ${req.body.Username}
State: Task Created.
Date/Time: ${new Date()}
==============================`

    const query3 = "INSERT INTO task (`Task_name`, `Task_description`, `Task_notes`, `Task_id`, `Task_plan`, `Task_app_Acronym`, `Task_state`, `Task_creator`, `Task_owner`, `Task_createDate`) VALUES (?,?,?,?,?,?,'1',?,?,?)"
    const data3 = [req.body.Task_name, req.body.Task_description, taskNotes, taskID, Plan_MVP_name, appDetails.App_Acronym, username, username, taskCreateDate]

    connection.query(query3, data3, (err, results) => {
      // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
      if (err) {
        next((error = { type: "database", loc: new Error().stack }))
        return
      }
      // by here, task would have been created in the database.
    })

    const newRNumber = BigInt(appDetails.currentRNumber) + 1n

    const query4 = "UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?"
    const data4 = [newRNumber, req.body.Task_app_Acronym]
    connection.query(query4, data4, (err, results) => {
      // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
      if (err) {
        next((error = { type: "database", loc: new Error().stack }))
        return
      }

      // new task is created and App_Rnumber has been incremented.
      if (results) {
        res.status(200).json({
          Task_id: taskID
        })
      }
    })
    connection.release()
  })
}

exports.GetTaskbyState = (req, res, next) => {
  try {
    // checking if Task_app_Acronym, Task_state parameter exists
    // MANDATORY FIELDS
    let validateAppName = validator.isAlpha(req.body.Task_app_Acronym) && req.body.Task_app_Acronym !== "" // checks Task_app_Acronym is alphabets => T/F
    let validateTaskState = validator.isAlpha(req.body.Task_state) && ["Open", "toDo", "Doing", "Done", "Closed"].includes(req.body.Task_state) // checks Task_state is either ["open", "toDoList", "Doing", "Done", "Closed"] => T/F

    let validation = validateAppName && validateTaskState // check all validation  => T/F

    if (!validation) {
      // if Task_app_Acronym || Task_state is wrong data type or empty
      next((error = { type: "validation", loc: new Error().stack }))
      return
    }
  } catch (e) {
    // if Task_app_Acronym || Task_state do not exists
    next((error = { type: "missingParams", loc: new Error().stack }))
    return
  }

  const taskState = ["Open", "toDo", "Doing", "Done", "Closed"].indexOf(req.body.Task_state) + 1

  const query = "SELECT * FROM task WHERE Task_app_Acronym = ? AND Task_state = ?"
  const data = [req.body.Task_app_Acronym, taskState]

  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      // if database is offline
      next((error = { type: "database", loc: new Error().stack }))
      return
    }
    connection.query(query, data, (err, results) => {
      // usually this error is given only if there is syntax error of some sort
      if (err) {
        next((error = { type: "database", loc: new Error().stack }))
        return
      }

      // translating back the Task_state to ["Open", "toDo", "Doing", "Done", "Closed"]
      results.map(result => {
        result.Task_state = ["Open", "toDo", "Doing", "Done", "Closed"][result.Task_state - 1]
      })

      if (results) {
        // sends back task by state in defined application
        res.status(200).json({
          tasklist: results
        })
      }
    })
    connection.release()
  })
}

exports.PromoteTask2Done = async (req, res, next) => {
  try {
    // checking if Task_id, Task_notes parameter exists
    // MANDATORY FIELDS
    let validateTaskID = validator.isAlphanumeric(req.body.Task_id, "en-US", { ignore: "_" }) && req.body.Task_id !== "" // checks Task_id is isAscii => T/F

    // OPTIONAL FIELDS
    let validateTaskNotes
    // checks Task_notes is ASCII => T/F
    req.body.Task_notes === "" ? (validateTaskNotes = true) : (validateTaskNotes = validator.isAscii(req.body.Task_notes))
    let validation = validateTaskID && validateTaskNotes // check all validation  => T/F

    if (!validation) {
      // if Task_notes is wrong data type or empty => KEE012
      next((error = { type: "validation", loc: new Error().stack }))
      return
    }
  } catch (e) {
    // if Task_app_Acronym || Task_name || Task_description || Task_plan do not exists => NO BODY PARSED ERROR
    next((error = { type: "missingParams", loc: new Error().stack }))
    return
  }

  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
      next((error = { type: "database", loc: new Error().stack }))
      return
    }

    const taskDetails = await new Promise((resolve, reject) => {
      const query1 = "SELECT Task_app_Acronym, Task_state, Task_notes FROM task WHERE Task_id = ?"
      const data1 = [req.body.Task_id]
      connection.query(query1, data1, (err, results) => {
        if (err) {
          // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
          next((error = { type: "database", loc: new Error().stack }))
          return
        }

        try {
          resolve({ appName: results[0].Task_app_Acronym, taskState: results[0].Task_state, taskNotes: results[0].Task_notes }) // Task_app_Acronym is correct
        } catch (e) {
          // if Task_id is wrong ==> KEE017
          next((error = { type: "taskNotFound", loc: new Error().stack }))
          return
        }
      })
    })

    if (taskDetails.taskState !== 3) {
      // if Task_id is not in doing state ==> KEE017
      next((error = { type: "taskNotFound", loc: new Error().stack }))
      return
    }

    const appPermission = await new Promise((resolve, reject) => {
      const query2 = "SELECT App_permit_Doing, App_permit_Done FROM application WHERE App_Acronym = ?"
      const data2 = [taskDetails.appName]
      connection.query(query2, data2, (err, results) => {
        if (err) {
          // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
          next((error = { type: "database", loc: new Error().stack }))
          return
        }

        resolve({ doing: results[0].App_permit_Doing, done: results[0].App_permit_Done })
      })
    })

    const username = await checkGroup(req.body.Username, appPermission.doing)

    if (!username) {
      // if Username is not in App_permit_Create ==> KEE011
      next((error = { type: "group", loc: new Error().stack }))
      return
    }

    const taskNotesComplete = `
==============================
UserID: ${username}
Action: Promote Task to Done state
Date/Time: ${new Date()}
------------------------------
Notes: ${req.body.Task_notes}
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
${taskDetails.taskNotes}`

    const query3 = "UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_app_Acronym = ? AND Task_id = ?"
    const data3 = [taskNotesComplete, 4, username, taskDetails.appName, req.body.Task_id]
    connection.query(query3, data3, (err, results) => {
      // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
      if (err) {
        next((error = { type: "database", loc: new Error().stack }))
        return
      }

      // task has been promoted.
      if (results) {
        sendEmail(req, res, next, (permDoneGroup = appPermission.done))
        res.status(200).json({
          result: "true"
        })
      }
    })
  })
}
