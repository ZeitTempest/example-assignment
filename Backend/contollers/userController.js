const connectDatabase = require("../config/database") // Importing Database for connection
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// loginUser => /user/login
// receives username and password => checks if active => returns token
// else returns false
exports.loginUser = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT password, active_status FROM users WHERE username = ?"
    const data = [req.body.username]

    connection.query(query, data, async (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }
      if (!results[0]) {
        res.status(200).send(false)
      } else {
        const result = results[0]
        const pwChecker = await bcrypt.compare(req.body.password, result.password) // returns true false
        const active_statusChecker = result.active_status === 1 // returns true false

        if (result && pwChecker && active_statusChecker) {
          const token = jwt.sign({ username: req.body.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME })
          res.status(200).json({ token: token })
        } else {
          console.log(result, pwChecker, active_statusChecker)
          res.status(200).send(false)
        }
      }
    })
    connection.release()
  })
}

// Verify user's profile => /user/verify
// receives token => verify user is active => returns true/false
exports.verifyUser = (req, res, next) => {
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

        const query = "SELECT active_status FROM users WHERE username = ?"
        const data = decoded.username

        connection.query(query, data, (err, results) => {
          const result = results[0]
          if (err) {
            res.status(200).send(false)
            return
          }

          if (result) {
            res.status(200).send(true)
          } else {
            res.status(200).send(false)
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

// Identify username => /user/getusername
// receives token => verify user is active => returns username
exports.getUsername = (req, res, next) => {
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
        const query = "SELECT active_status FROM users WHERE username = ?"
        const data = decoded.username

        connection.query(query, data, (err, results) => {
          const result = results[0]
          if (err) {
            res.status(200).send(false)
            return
          }

          if (result.active_status === 1) {
            res.status(200).json({ username: decoded.username })
          } else {
            res.status(200).send(false)
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

// Update user password => /user/update_password
// receives token => verify token => updates password => returns true/false
exports.updatePassword = (req, res, next) => {
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
      connectDatabase.getConnection(async function (err, connection) {
        if (err) {
          res.status(200).send(false)
        }
        const query = "UPDATE users SET password = ? WHERE username = ?"
        const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.HASH))
        const data = [hashedPassword, decoded.username]

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
    } catch (e) {
      console.log(e)
      res.status(200).send(false)
    }
  }
}

// Update user email => /user/update_email
// receives token => verify token => updates email => returns true/false
exports.updateEmail = (req, res, next) => {
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
        const query = "UPDATE users SET email = ? WHERE username = ?"
        const data = [req.body.email, decoded.username]

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
    } catch (e) {
      console.log(e)
      res.status(200).send(false)
    }
  }
}

// Get all users => /users
// returns all user data
exports.getUsers = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "SELECT username, email, active_status FROM users"
    connection.query(query, (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }
      res.status(200).json({ users: results })
    })
    connection.release()
  })
}

// Update user password as admin => /user/update_password_admin
// receives username/password => finds username => update password => returns true/false
exports.updatePasswordAdmin = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE users SET password = ? WHERE username = ?"
    const hashedPassword = await bcrypt.hash(req.body.u_password, parseInt(process.env.HASH))
    const data = [hashedPassword, req.body.u_username]

    connection.query(query, data, (err, results) => {
      if (err) {
        res.status(200).send(false)
        return
      }

      if (results.changedRows === 1) {
        res.status(200).send(true)
      } else if (results.changedRows === 0) {
        res.status(200).send("A100")
      } else {
        console.log(results.changedRows)
        res.status(200).send(false)
      }
    })
    connection.release()
  })
}

// Update user email as admin => /user/update_email_admin
// receives username/email => finds username => update email => returns true/false
exports.updateEmailAdmin = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE users SET email = ? WHERE username = ?"
    const data = [req.body.u_email, req.body.u_username]

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

// Update user active status as admin => /user/update_activeStatus_admin
// receives username/activeStatus => finds username => update active_status => returns true/false
exports.updateActiveStatusAdmin = (req, res, next) => {
  connectDatabase.getConnection(function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = "UPDATE users SET active_status = ? WHERE username = ?"
    const data = [req.body.u_activestatus, req.body.u_username]

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

// Create a new User => /user/create_user_admin
// receives username/email/password/active_status => insert into users => returns true/false
exports.createUserAdmin = (req, res, next) => {
  connectDatabase.getConnection(async function (err, connection) {
    if (err) {
      res.status(200).send(false)
      return
    }
    const query = `INSERT INTO users (username, email, password, active_status) VALUES ( ?, ?, ?, ?)`

    const hashedPassword = await bcrypt.hash(req.body.c_password, parseInt(process.env.HASH))

    const data = [req.body.c_username, req.body.c_email, hashedPassword, true]

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
