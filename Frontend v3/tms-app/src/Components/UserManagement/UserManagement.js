import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import validator from "validator"
import { validatePassword } from "../../Utils/ValidatePassword"
import Select from "react-select"
import DispatchContext from "../../DispatchContext"
// Import sub-components
import CreateUsers from "./CreateUsers"
import CreateGroup from "./CreateGroups"

function UserManagement() {
  const appDispatch = useContext(DispatchContext)

  const [username, setUsername] = useState("")
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [groupList, setGroupList] = useState([])

  async function setUserTable() {
    // get group data
    try {
      const response = await Axios.get(`/admin/get/allgroup`)

      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        return
      }
      const processedData = []
      response.data.forEach(group => {
        const existingUser = processedData.find(user => user.username === group.username)

        if (existingUser) {
          // If the user already exists, add the current group name to their list of groups
          existingUser.groupName.push(group.groupName)
        } else {
          // If the user doesn't exist, create a new object for them and add their username and group name
          processedData.push({
            username: group.username,
            groupName: [group.groupName]
          })
        }
      })

      setGroupList(processedData[0].groupName)

      const for_options = []

      processedData.forEach(user => {
        const options = []
        user.groupName.forEach(group => {
          options.push({
            value: group,
            label: group,
            usernameInState: username,
            isFixed: group === "admin" && (user.username === username || user.username === "admin")
          })
        })
        for_options.push({ username: user.username, groups: options })
      })
      setGroups(for_options)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }

    // get users data
    try {
      const response = await Axios.get(`/admin/get/allprofile`)
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        return
      }
      setUsers(response.data)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  async function getUsername() {
    try {
      const response = await Axios.get(`/get/profile`)
      setUsername(response.data.username)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  useEffect(() => {
    getUsername()
    if (username !== "") {
      setUserTable()
    }
  }, [username])

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 } : base
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base
    }
  }

  function defVal(user) {
    const group = groups.find(group => group.username === user)
    if (group) {
      return group.groups
    }
  }

  // function to update password
  async function handleUpdatePassword(password, username) {
    if (validatePassword(password)) {
      try {
        const response = await Axios.post("/admin/update/pwd", { password, username })
        if (response.data.result === "true") {
          appDispatch({ type: "successToast", data: `password is updated for ${username}` })
        } else if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        } else {
          appDispatch({ type: "errorToast", data: "Please contact an administrator." })
        }
      } catch (e) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } else {
      appDispatch({ type: "errorToast", data: "Password not updated. Check password again" })
    }
  }

  // function to update email
  async function handleUpdateEmail(email, username) {
    try {
      const response = await Axios.post("/admin/update/email", { email, username })
      console.log(response.data)
      if (response.data.result === "true") {
        appDispatch({ type: "successToast", data: `Email is updated for ${username}` })
      } else if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
      } else {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
      setUserTable()
    } catch (e) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  // function to update active status
  async function handleUpdateActive(activeStatus, username) {
    try {
      console.log(activeStatus)
      const response = await Axios.post("/admin/update/activestatus", { activeStatus, username })
      console.log(response.data)

      if (response.data.result === "true") {
        if (activeStatus) {
          appDispatch({ type: "successToast", data: `${username} has been activated.` })
        } else {
          appDispatch({ type: "successToast", data: `${username} has been deactivated` })
        }
      } else if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
      } else {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } catch (e) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  // function to add user to group
  async function handleGroupSelect(groupName, username) {
    try {
      const addOrRemove = "add"
      const response = await Axios.post("/admin/update/group", { groupName, username, addOrRemove })
      if (response.data.result === "true") {
        appDispatch({ type: "successToast", data: `${username} has been added to ${groupName}` })
      } else if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
      } else {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } catch (e) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  // function to remove user from group
  async function handleGroupRemove(groupName, username) {
    try {
      const addOrRemove = "remove"
      const response = await Axios.post("/admin/update/group", { groupName, username, addOrRemove })
      if (response.data.result === "true") {
        appDispatch({ type: "successToast", data: `${username} has been removed from ${groupName}` })
      } else if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
      } else {
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } catch (e) {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  // function to handle action type in group select
  function handleAction(a, change, u_username) {
    if (change.action === "select-option") {
      const u_group = change.option.value
      handleGroupSelect(u_group, u_username)
    } else if (change.action === "remove-value") {
      const u_group = change.removedValue.value
      handleGroupRemove(u_group, u_username)
    } else {
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  return (
    <div>
      <div className="align-items-center justify-content-center m-5">
        <div className="d-flex">
          <CreateUsers setUserTable={setUserTable} />
          <CreateGroup setUserTable={setUserTable} />
          <div className="form-floating">
            <select style={{ height: "140px" }} className="form-select" multiple aria-label="multiple select example">
              {groupList.map(group => {
                return <option key={group}>{group}</option>
              })}
            </select>
            <label htmlFor="floatingTextarea2">Groups</label>
          </div>
        </div>
        {/* <br /> */}
        <hr className="rounded"></hr>
        {/* <br /> */}
        <div>
          <h2 className="d-flex">
            <div className="p-2">User Management</div>
          </h2>
        </div>
        {/* START user management table START */}
        <table id="userTable" className="table table-hover">
          <thead>
            <tr>
              <th className="col-2" scope="col">
                Username
              </th>
              <th className="col-2" scope="col" data-editable="true">
                Password
              </th>
              <th className="col-2" scope="col">
                Email
              </th>
              <th className="col-auto" scope="col">
                Groups
              </th>
              <th className="col-sm-2" scope="col">
                Active Status
              </th>
              {/* <th scope="col">Update</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              return (
                <tr key={user.username}>
                  {/* username here */}
                  <td className="col-md-auto">
                    <input className="form-control" type="text" value={user.username} readOnly disabled />
                  </td>
                  {/* password here */}
                  <td className="col-sm">
                    <div className="input-group mb-3">
                      <input
                        onBlur={e => {
                          handleUpdatePassword(e.target.value, user.username)
                          e.target.value = ""
                        }}
                        type="password"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                  </td>
                  {/* email here */}
                  <td className="col-md-auto">
                    <div className="input-group mb-3">
                      <input
                        onBlur={e => {
                          if (e.target.value !== user.email && validator.isEmail(e.target.value)) {
                            handleUpdateEmail(e.target.value, user.username)
                          } else if (e.target.value !== user.email && e.target.value === "") {
                            handleUpdateEmail(null, user.username)
                          } else {
                            e.target.value = user.email
                            appDispatch({ type: "errorToast", data: "Email not updated. Please check input again." })
                          }
                        }}
                        type="email"
                        className="form-control"
                        defaultValue={user.email}
                      />
                    </div>
                  </td>
                  {/* group here */}
                  <td className="col-md-2">
                    <Select
                      styles={styles}
                      id={`selection option ${user.username}`}
                      isClearable={false}
                      isMulti
                      options={groups[0].groups}
                      defaultValue={defVal(user.username)}
                      placeholder="No Groups Assigned"
                      onChange={(a, b) => {
                        handleAction(a, b, user.username)
                      }}
                    />
                  </td>
                  {/* active status here */}
                  <td style={{ paddingLeft: "30px", paddingTop: "15px" }}>
                    <input
                      onChange={e => {
                        e.target.checked === true ? handleUpdateActive(1, user.username) : handleUpdateActive(0, user.username)
                      }}
                      type="checkbox"
                      defaultChecked={user.activeStatus}
                      disabled={user.username === "admin" || user.username === username}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* END user management table END */}
      </div>
    </div>
  )
}

export default UserManagement
