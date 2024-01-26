const connectDatabase = require("../config/database")
const validator = require("validator")
const bcrypt = require("bcrypt")

exports.Login = async (req, res, next) => {
  console.log(req.url)

  if (!["/CreateTask", "/PromoteTask2Done", "/GetTaskbyState"].includes(req.url)) {
    console.log("caught here")
    next((error = { type: "invalidURL", loc: new Error().stack }))
    return
  }

  // try {
  //   // checking if Username, Password parameter exists
  //   // MANDATORY FIELDS
  //   let validateU = validator.isAlphanumeric(req.body.Username) // checks Username is alphanumeric => T/F
  //   let validatePW = validator.isAscii(req.body.Password) // checks Password is ASCII => T/F
  //   let validation = validateU && validatePW // check all validation  => T/F

  //   // if Username || Password is wrong data type => KEE010
  //   if (!validation) {
  //     next((error = { type: "authentication", loc: new Error().stack }))
  //     console.log("failvalid")
  //     return
  //   }
  // } catch (e) {
  //   // if Username || Password do not exists => PARAMETER ERROR
  //   next((error = { type: "missingParams", loc: new Error().stack }))
  //   return
  // }

  connectDatabase.getConnection((err, connection) => {
    if (err) {
      // if database is offline ==> DATABASE ERROR
      next((error = { type: "database", loc: new Error().stack }))
      return
    }

    const query = "SELECT password, active_status FROM users WHERE username = ?"
    const data = [req.body.Username]
    connection.query(query, data, async (err, results) => {
      if (err) {
        // usually this error is given only if there is syntax error of some sort ==> DATABASE ERROR
        next((error = { type: "database", loc: new Error().stack }))
        return
      }

      if (!results[0]) {
        // if Username || Password is not found => KEE010
        next((error = { type: "authentication", loc: new Error().stack }))
        return
      } else {
        const result = results[0]
        const pwChecker = await bcrypt.compare(req.body.Password, result.password) // returns true false
        const active_statusChecker = result.active_status === 1 // returns true false

        if (result && pwChecker && active_statusChecker) {
          next() // Username && Password is correct and account is active ==> next()
        } else {
          // if Username && Password is correct but account is inactive ==> KEE010
          next((error = { type: "authentication", loc: new Error().stack }))
        }
      }
    })

    connection.release
  })
}
