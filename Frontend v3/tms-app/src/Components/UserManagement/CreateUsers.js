import React, { useState, useContext } from "react"
import Axios from "axios"
import validator from "validator"
import { validatePassword } from "../../Utils/ValidatePassword"
import DispatchContext from "../../DispatchContext"

function CreateUsers({ setUserTable }) {
  const appDispatch = useContext(DispatchContext)
  // function for create user button
  // for creating new users
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [email, setemail] = useState("")
  const [activeStatus, setactiveStatus] = useState(1)

  async function handleCreateUser() {
    console.log("email: " + email)
    let email_checker = true
    if (email) {
      email_checker = validator.isEmail(email)
    }

    if (validator.isAlphanumeric(username) && validatePassword(password) && email_checker) {
      try {
        const response = await Axios.post("/admin/update/createuser", { username, password, email, activeStatus })
        console.log(response.data)
        if (response.data.result === "true") {
          appDispatch({ type: "successToast", data: "New user is created." })
          setusername("")
          setpassword("")
          setemail("")
          setactiveStatus(1)
          setUserTable()
        } else if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        } else {
          appDispatch({ type: "errorToast", data: "User not created. Please check for duplicate username." })
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } else {
      appDispatch({ type: "errorToast", data: "Please check input fields again." })
    }
  }

  return (
    <div>
      <h2 className="p-2">Create User</h2>
      <div className="col-10">
        <div className="d-flex">
          <input
            className="me-2"
            type="checkbox"
            defaultChecked
            value={activeStatus}
            onChange={e => {
              e.target.checked ? setactiveStatus(1) : setactiveStatus(0)
            }}
          />
          {activeStatus === 1 ? <label className="align-self-center">Active</label> : <label className="align-self-center">Inactive</label>}
          <div className="input-group ms-2">
            <input onChange={e => setusername(e.target.value)} value={username} placeholder="Username" name="username" type="text" className="form-control" />
            <input onChange={e => setpassword(e.target.value)} value={password} placeholder="Password" type="password" className="form-control" />
            <input onChange={e => setemail(e.target.value)} value={email} placeholder="Email" type="text" className="form-control" />
            <button onClick={handleCreateUser} className="btn btn-primary" type="button">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUsers
