const nodemailer = require("nodemailer")
const connectDatabase = require("../config/database") // Importing Database for connection

// Sends email => /tms/send_email
exports.sendEmail = async (req, res, next) => {
  const mailUsers = []
  const mailList = []

  const getMail = await new Promise((resolve, reject) => {
    connectDatabase.getConnection(function (err, connection) {
      if (err) {
        resolve(false)
      }
      const query1 = "SELECT username FROM tms_database.user_groups WHERE group_name = 'Project Lead';"
      connection.query(query1, (err, results) => {
        if (err) {
          resolve(false)
        }

        results.forEach(result => {
          if (result.username !== "") {
            mailUsers.push(result.username)
          } else {
            return
          }
        })

        const query2 = "SELECT email FROM users WHERE username IN (?)"
        connection.query(query2, [mailUsers], (err, results) => {
          if (err) {
            resolve(false)
          }

          results.forEach(result => {
            if (result.email !== "") {
              mailList.push(result.email)
            }
          })
          resolve(true)
        })
      })
      connection.release()
    })
  })

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "theresia.klocko@ethereal.email",
      pass: "p8afHSnV1xap9TZN7d"
    }
  })

  const content = {
    from: `"Task Management System" <no-reply@tms.com>`,
    to: `${mailList}`,
    subject: `${req.body.taskID}: ${req.body.taskName} has been promoted to Done by ${req.body.taskOwner}.`,
    text: `Dear Project Lead,

  ${req.body.taskOwner} has promoted ${req.body.taskID}: ${req.body.taskName} to Done for your kind action.

  Thank you.
  TMS Management System

  ______________________________________________________
  This is a system generated email. Please do not reply.
    `
  }

  transporter.sendMail(content, function (err, info) {
    if (err) {
      console.log(err)
      res.status(200).send(false)
      return
    }
    res.status(200).send(true)
  })
}
