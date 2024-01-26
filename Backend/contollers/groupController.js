const connectDatabase = require("../config/database") // Importing Database for connection
const jwt = require("jsonwebtoken")

async function checkGroup(username, group_name) {
  return new Promise((resolve, reject) => {
    connectDatabase.getConnection(function (err, connection) {
      if (err) {
        resolve(false)
      }
      const query = "SELECT * FROM user_groups WHERE username = ? AND group_name = ?"
      data = [username, group_name]
      connection.query(query, data, (err, results) => {
        if (err) {
          resolve(false)
        }

        if (results.length === 1) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      connection.release()
    })
  })
}

// receives token and group_name => check if user is in group_name => returns true/false
// exports.checkGroup = (req, res, next) => {
exports.checkGroup = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(200).send(false)

    return
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_Secret)
      let result = await checkGroup(decoded.username, req.body.group_name)
      if (result === true) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    } catch (e) {
      console.log(e)
      res.status(200).send(false)
    }
  }
}

// Get the groups that user is in => /group/user
// receives token => retrieve all groups that user is in => returns object of groups
exports.getUserGroups = (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(200).send(false)
    return
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_Secret)
      connectDatabase.getConnection(function (err, connection) {
        if (err) {
          res.status(200).send(false)
          return
        }
        const query = "SELECT group_name FROM user_groups WHERE username = ?;"
        const data = decoded.username

        connection.query(query, data, (err, results) => {
          if (err) {
            res.status(200).send(false)
            return
          } else {
            res.status(200).json(results)
          }
        })
        connection.release()
      })
    } catch (e) {
      console.log(e)
      res.status(200).send(false)
    }
  }
}

// Get all Group => /groups
// returns all group data
exports.getGroups = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT * FROM user_groups ORDER BY username;"
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err)
        return
      }

      // Return the results in json
      res.status(200).json({ groups: results })
    })
    connection.release()
  })
}

// Add user to group => /group/add_user_to_group
// receives group_name/username => add line to user_groups => returns true/false
exports.addUserToGroupAdmin = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "INSERT INTO user_groups (group_name, username) VALUES (?, ?)"

    const data = [req.body.u_group_name, req.body.u_username]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
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

// Remove user to group => /group/rmv_user_fr_group_admin
// receives group_name/username => delete line in user_groups => returns true/false
exports.rmvUserFrGroupAdmin = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "DELETE FROM user_groups WHERE (group_name = ?) and (username = ?)"

    const data = [req.body.u_group_name, req.body.u_username]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
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

// Create a new Group => /group/create_group_admin
// receives group_name => add line to user_groups => returns true/false
exports.createGroupAdmin = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "INSERT INTO user_groups (group_name, username) VALUES (?, '')"

    const data = [req.body.new_group]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
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

// Get all Group => /all_groups
// returns all group_names only
exports.getAllGroups = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT group_name FROM user_groups WHERE username = ''"
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
