import React, { useState, useContext } from "react"
import Axios from "axios"
import validator from "validator"
import DispatchContext from "../../DispatchContext"

function CreateGroup({ setUserTable }) {
  const appDispatch = useContext(DispatchContext)
  // for creating new group
  const [c_groupname, setc_groupname] = useState("")

  // function for create group button
  async function handleCreateGroup() {
    let validation = validator.isAlphanumeric(c_groupname)

    if (validation) {
      if (c_groupname !== "") {
        try {
          const groupName = c_groupname.trim()
          const response = await Axios.post("/admin/update/creategroup", { groupName })
          if (response.data.result === "true") {
            appDispatch({ type: "successToast", data: "New group is created." })
            setc_groupname("")
            setUserTable()
          } else if (response.data.result === "BSJ370") {
            appDispatch({ type: "loggedOut" })
            appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
          } else {
            appDispatch({ type: "errorToast", data: "Group not created. Please check for duplicate group name." })
          }
        } catch (e) {
          appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        }
      } else {
        appDispatch({ type: "errorToast", data: "Please check input fields again." })
      }
    } else {
      appDispatch({ type: "errorToast", data: "Please check input fields again." })
    }
  }

  return (
    <>
      <div>
        <h2 className="p-2">Create Group</h2>
        <div className="col-10">
          <div className="input-group">
            <input onChange={e => setc_groupname(e.target.value)} value={c_groupname} placeholder="Group Name" type="text" className="form-control" />
            <button onClick={handleCreateGroup} className="btn btn-primary" type="button">
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateGroup
