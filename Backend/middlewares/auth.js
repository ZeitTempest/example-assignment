const jwt = require("jsonwebtoken")
const connectDatabase = require("../config/database") // Importing Database for connection

// Check if the user is authenticated or not
exports.isAutheticatedUser = (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(200).send("A100") // there is no token
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_Secret)
      connectDatabase.getConnection(function (err, connection) {
        if (err) {
          res.status(200).send(false) // connection error
        }
        const query = "SELECT active_status FROM users WHERE username = ?"
        const data = decoded.username

        connection.query(query, data, (err, results) => {
          if (err) {
            res.status(200).send(false) // connection query error
            return
          } else if (results[0].active_status == 1) {
            next() // token is valid and token's account is active
          } else {
            res.status(200).send("A100") // token's account is not active
          }
        })
        connection.release()
      })
    } catch (e) {
      res.status(200).send("A100") // token has malformed
    }
  }
}

// Check if user is admin role.
exports.authorizedAdmin = (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(200).send("A100") // there is no token
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_Secret)
      connectDatabase.getConnection(function (err, connection) {
        if (err) {
          res.status(200).send(false) // connection error
        }
        const query = "SELECT group_name FROM user_groups WHERE username = ? AND group_name = 'Admin'"
        const data = decoded.username

        connection.query(query, data, (err, results) => {
          if (err) {
            res.status(200).send(false) // connection query error
            return
          } else if (results.length == 1) {
            next() // token is valid and token's account is admin
          } else {
            res.status(200).send("A100") // token's account is not admin
          }
        })
        connection.release()
      })
    } catch (e) {
      res.status(200).send("A100") // token has malformed
    }
  }
}
