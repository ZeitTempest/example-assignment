import React, { useEffect, useState, useContext } from "react"
import StateContext from "../../StateContext"
import validator from "validator"
import Axios from "axios"
import { validatePassword } from "../utils/ValidatePassword"
import DispatchContext from "../../DispatchContext"

function EditPage() {
  const appDispatch = useContext(DispatchContext)
  // to identify user profile <<POLICE perform token check!!!>>
  async function fetchProfile() {
    try {
      const response = await Axios.get(`/user/verify`)
      response.data[0].active_status == 1 ? appDispatch({ type: "username", data: response.data[0].username }) : ""
      response.data[0].group_name == "Admin" ? appDispatch({ type: "isAdmin" }) : ""
      console.log()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const appState = useContext(StateContext)
  const [u_password, setu_password] = useState("")
  const [u_email, setu_email] = useState("")
  const [groups, setGroups] = useState([])

  // function to get user's group
  async function fetchGroups() {
    const username = appState.username
    const response = await Axios.post("/group/user", { username })
    setGroups(response.data.groups)
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  // function to update password
  async function handleUpdatePassword() {
    const u_username = appState.username
    if (validatePassword(u_password)) {
      try {
        const response = await Axios.put("/user/update_password", { u_password, u_username })
        if (response.data) {
          console.log(`password is updated for ${u_username}`)
          console.log(response.data)
        } else {
          console.log("backend did not respond well.")
          console.log(response.data)
        }
      } catch (e) {
        console.log(e)
        console.log("something is wrong")
      }
    } else {
      console.log("Password not updated")
    }
    setu_password("")
  }

  // function to update email
  async function handleUpdateEmail() {
    const u_username = appState.username
    if (validator.isEmail(u_email)) {
      try {
        const response = await Axios.put("/user/update_email", { u_email, u_username })
        if (response.data) {
          console.log(`email is updated for ${u_username}`)
          console.log(response.data)
        } else {
          console.log("backend did not response well")
          console.log(response.data)
        }
      } catch (e) {
        console.log(e)
        console.log("something is wrong")
      }
    } else {
      console.log("Email not updated")
    }
    setu_email("")
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "50vh" }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">{appState.username}</h4>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label className="control-label">Update Password:</label>
            <div className="col input-group">
              <input value={u_password} placeholder="New Password" onChange={e => setu_password(e.target.value)} type="password" className="form-control" />
              <button onClick={handleUpdatePassword} className="btn btn-primary" type="button">
                Update
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Update Email:</label>
            <div className="col input-group">
              <input value={u_email} placeholder="New Email" onChange={e => setu_email(e.target.value)} type="text" className="form-control" />
              <button onClick={handleUpdateEmail} className="btn btn-primary" type="button">
                Update
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Groups:</label>
            <div className="col">
              <select multiple className="form-control">
                {groups.map(item => {
                  return <option key={item.group_name}>{item.group_name}</option>
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
