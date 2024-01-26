const connectDatabase = require("../config/database") // Importing Database for connection

// Create a new Application => /tms/create_application
// receives appName/appRNum (& 7 other etc.) => insert into application => returns true/false
exports.createApplication = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "INSERT INTO application (`App_Acronym`, `App_Description`, `App_Rnumber`, `App_startDate`, `App_endDate`,`App_permit_Create`, `App_permit_Open`, `App_permit_toDoList`, `App_permit_Doing`, `App_permit_Done`) VALUES (?,?,?,?,?,?,?,?,?,?)"
    let data

    if (req.body.appName) {
      data = [req.body.appName, req.body.appDescription, req.body.appRNum, req.body.appStartDate, req.body.appEndDate, req.body.appCreate, req.body.appOpen, req.body.appToDo, req.body.appDoing, req.body.appDone]
    } else {
      data = [req.body.appNameOC, req.body.appDescription, req.body.appRNumOC, req.body.appStartDate, req.body.appEndDate, req.body.appCreate, req.body.appOpen, req.body.appToDo, req.body.appDoing, req.body.appDone]
    }

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        console.log(err)
        return
      }

      if (results) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Get all application details => /tms/applications
// returns all application data
exports.getApplication = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT * FROM application"
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err)
        return
      }

      // Return the results in json
      res.status(200).send(results)
    })
    connection.release()
  })
}

// Update user password as admin => /user/update_password_admin
// receives appName and updated fields => finds appName => update fields => returns true/false
exports.updateApplication = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE application SET `App_Description` = ?, `App_startDate` = ?, `App_endDate` = ?,`App_permit_Create` = ?, `App_permit_Open` = ?, `App_permit_toDoList` = ?, `App_permit_Doing` = ?, `App_permit_Done` = ? WHERE (`App_Acronym` = ?);"

    const data = [req.body.description, req.body.startDate, req.body.endDate, req.body.create, req.body.open, req.body.toDo, req.body.doing, req.body.done, req.body.appName]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }

      if (results.changedRows === 1) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Create a new Plan => /tms/create_plan
// receives appPlan/appStartDate/appEndDate/appColour => insert into plan => returns true/false
exports.createPlan = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "INSERT INTO plan (`Plan_MVP_name`, `Plan_startDate`, `Plan_endDate`, `Plan_appAcronym`, `Plan_colour`) VALUES (?,?,?,?,?)"
    const data = [req.body.planName, req.body.planStartDate, req.body.planEndDate, req.body.applicationName, req.body.planColour]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        console.log(err)
        return
      }

      if (results) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Get all plan details => /tms/plans
// returns all plan data
exports.getPlan = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT * FROM plan WHERE Plan_appAcronym = ?"
    data = [req.body.applicationName]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(err)
        return
      }

      // Return the results in json
      res.status(200).send(results)
    })
    connection.release()
  })
}

// Update plan start date => /tms/update_plan
// Get planName, planStartDate, planEndDate, planColour, applicationName => update all fields => returns true/false
exports.updatePlan = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE plan SET `Plan_startDate` = ?, `Plan_endDate` = ?, `Plan_colour` = ? WHERE `Plan_MVP_name`=? AND `Plan_appAcronym` = ?"

    const data = [req.body.planEditStartDate, req.body.planEditEndDate, req.body.planEditColour, req.body.planName, req.body.applicationName]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }

      if (results.changedRows === 1) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Create a new Task => /tms/create_task
// receives taskName/taskDescription/taskPlan/appName/taskCreator/taskOwner/taskCreateDate => queries for current Rnumber => insert new task => update new Rnumber
exports.createTask = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }

    const currentRNumber = await new Promise((resolve, reject) => {
      connectDatabase.getConnection(function (err, connection) {
        if (err) {
          resolve(false)
        }
        const query1 = "SELECT App_Rnumber FROM application WHERE App_Acronym = ?"
        const data1 = [req.body.appName]
        connection.query(query1, data1, (err, results) => {
          if (err) {
            resolve(false)
          }

          resolve(results[0].App_Rnumber)
        })
      })
    })

    const taskID = req.body.appName + "_" + currentRNumber

    const query2 = "INSERT INTO task (`Task_name`, `Task_description`, `Task_notes`, `Task_id`, `Task_plan`, `Task_app_Acronym`, `Task_state`, `Task_creator`, `Task_owner`, `Task_createDate`) VALUES (?,?,?,?,?,?,'1',?,?,?)"
    let data2

    if (req.body.taskName) {
      data2 = [req.body.taskName, req.body.taskDescription, req.body.taskNotes, taskID, req.body.taskPlan, req.body.appName, req.body.taskCreator, req.body.taskOwner, req.body.taskCreateDate]
    } else {
      data2 = [req.body.taskNameOC, req.body.taskDescription, req.body.taskNotes, taskID, req.body.taskPlan, req.body.appName, req.body.taskCreator, req.body.taskOwner, req.body.taskCreateDate]
    }
    connection.query(query2, data2, (err, results) => {
      if (err) {
        res.status(200).send(false)
        console.log(err)
        return
      }

      if (!results) {
        res.status(200).send(false)
        return
      }
    })

    const newRNumber = BigInt(currentRNumber) + 1n

    const query3 = "UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?"
    const data3 = [newRNumber, req.body.appName]
    connection.query(query3, data3, (err, results) => {
      if (err) {
        res.status(200).send(false)
        console.log(err)
        return
      }

      if (results) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Get all task => /tms/tasks
// returns all tasks data
exports.getTask = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT * FROM task WHERE Task_app_Acronym = ?"
    data = [req.body.applicationName]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(err)
        return
      }

      // Return the results in json
      res.status(200).send(results)
    })
    connection.release()
  })
}

// Update plan start date => /tms/update_task_status
// Get taskID/taskNewStatus => update all fields => returns true/false
exports.updateTaskStatus = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE task SET Task_notes = ?, Task_plan = ?, Task_state = ?, Task_owner = ?  WHERE Task_id = ? "

    const data = [req.body.taskNotesComplete, req.body.taskNewPlan, req.body.taskNewState, req.body.taskOwner, req.body.taskID]
    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }

      if (results.changedRows === 1) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}
