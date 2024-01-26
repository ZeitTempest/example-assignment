exports.ErrorManager = (error, req, res, next) => {
  switch (error.type) {
    case "authentication":
      res.status(200).json({
        result: "KEE010"
      })
      console.log(error.loc)
      break
    case "group":
      res.status(200).json({
        result: "KEE011"
      })
      console.log(error.loc)
      break
    case "validation":
      res.status(200).json({
        result: "KEE012"
      })
      console.log(error.loc)
      break
    case "appNotFound":
      res.status(200).json({
        result: "KEE013"
      })
      console.log(error.loc)
      break
    case "planNotFound":
      res.status(200).json({
        result: "KEE014"
      })
      console.log(error.loc)
      break
    case "missingParams":
      res.status(200).json({
        result: "KEE015"
      })
      console.log(error.loc)
      break
    case "database":
      res.status(200).json({
        result: "KEE016"
      })
      console.log(error.loc)
      break
    case "taskNotFound":
      res.status(200).json({
        result: "KEE017"
      })
      console.log(error.loc)
      break
    case "invalidURL":
      res.status(200).json({
        result: "KEE018"
      })
      console.log(error.loc)
      break
    case "emailError":
      console.log(error.loc)
      console.log(error.msg)
      break
    case "emailDatabaseError":
      console.log(error.loc)
      console.log(error.msg)
  }
}

exports.ProtectedRoute = (req, res, next) => {
  res.status(200).json({ result: "KEE018" })
}

// KEE010 - AUTHENTICAION FAIL
// KEE011 - USER NOT IN RIGHT GROUP
// KEE012 - VALIDATION FAIL
// KEE013 - INVALID APPLICATION/APP NOT FOUND
// KEE014 - INVALID PLAN
// KEE015 - MISSING BODY PARAMETERS
// KEE016 - NO DATABASE CONNECTION
// KEE017 - TASK NOT FOUND
// KEE018 - INVALID URL
