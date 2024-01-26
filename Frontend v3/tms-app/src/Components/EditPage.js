import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import validator from "validator"
import { validatePassword } from "../Utils/ValidatePassword"
import DispatchContext from "../DispatchContext"

function EditPage() {
  const appDispatch = useContext(DispatchContext)

  const [username, setUsername] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [groups, setGroups] = useState([])

  async function getUsername() {
    try {
      const response = await Axios.get(`/get/profile`)
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        return
      }
      setUsername(response.data.username)
      setUserEmail(response.data.email)
    } catch (e) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  // function to get user's group
  async function fetchGroups() {
    const response = await Axios.get("/get/group")
    if (response.data.result === "BSJ370") {
      appDispatch({ type: "loggedOut" })
      appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
      return
    } else if (response.data === false) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      return
    }
    setGroups(response.data)
  }

  useEffect(() => {
    getUsername()
    fetchGroups()
  }, [])

  // function to update user's password
  async function updatePassword() {
    if (validatePassword(password)) {
      try {
        const response = await Axios.post("/update/pwd", { password })
        if (response.data.result === "true") {
          appDispatch({ type: "successToast", data: "Password is updated." })
          setPassword("")
        } else {
          appDispatch({ type: "errorToast", data: "Please contact an administrator." })
          setPassword("")
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        setPassword("")
      }
    } else {
      appDispatch({ type: "errorToast", data: "Password not updated." })
      setPassword("")
    }
  }

  // function to update user's email
  async function updateEmail() {
    if (validator.isEmail(email)) {
      try {
        const response = await Axios.post("/update/email", { email })
        if (response.data.result === "true") {
          appDispatch({ type: "successToast", data: "Email is updated." })
          setEmail("")
          getUsername()
        } else {
          appDispatch({ type: "errorToast", data: "Please contact an administrator." })
          setEmail("")
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        setEmail("")
      }
    } else {
      appDispatch({ type: "errorToast", data: "Email not updated." })
      setEmail("")
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "50vh" }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">{username}</h4>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label className="control-label">Update Password:</label>
            <div className="col input-group">
              <input value={password} placeholder="New Password" onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
              <button onClick={updatePassword} className="btn btn-primary" type="button">
                Update
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Update email:</label>
            <div className="col input-group">
              <input value={email} placeholder={userEmail} onChange={e => setEmail(e.target.value)} type="text" className="form-control" />
              <button onClick={updateEmail} className="btn btn-primary" type="button">
                Update
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Groups:</label>
            <div className="col">
              <select multiple className="form-control">
                {groups.map(item => {
                  return <option key={item.groupName}>{item.groupName}</option>
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPage
