import React, { useContext, useState, useEffect } from "react"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"
import CreateApplication from "./CreateApplication"
import CreateTask from "./CreateTask"
import CreatePlan from "./CreatePlan"
import PlanBar from "./PlanBar"
import ColorBar from "./ColourBar"
import PromoteTaskModal from "./PromoteTaskModal"
import EditTaskModal from "./EditTaskModal"
import DemoteTaskModal from "./DemoteTaskModal"
import ViewTaskModal from "./ViewTaskModal"

function TMSMain() {
  const appDispatch = useContext(DispatchContext)
  const [applications, setApplications] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedEditApp, setSelectedEditApp] = useState("")
  const [selectedApp, setSelectedApp] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [plans, setPlans] = useState([])
  const [tasks, setTasks] = useState([])
  const [username, setUsername] = useState("")
  const [resetSelectedApp, setResetSelectedApp] = useState(false)
  const [permission, setPermission] = useState({ pl: false, pm: false, create: false, open: false, todo: false, doing: false, done: false })

  async function getUsername() {
    try {
      const response = await Axios.get(`/get/profile`)
      setUsername(response.data.username)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  async function fetchApplication() {
    try {
      const response = await Axios.get(`/tms/applications`)
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchApplication elseif)" })
        return
      }
      setApplications(response.data)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchApplication catch(e))" })
    }
  }

  async function fetchGroups() {
    try {
      const response = await Axios.get(`/all_groups`)
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchGroups() elseif)" })
        return
      }
      setGroups(response.data)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator.(fetchGroups() catch)" })
    }
  }

  async function fetchPlans() {
    let applicationName = selectedApp.App_Acronym
    try {
      const response = await Axios.post(`/tms/plans`, { applicationName })
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchApplication elseif)" })
        return
      }
      setPlans(response.data)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchApplication catch(e))" })
    }
  }

  async function fetchTasks() {
    let applicationName = selectedApp.App_Acronym
    try {
      const response = await Axios.post(`/tms/tasks`, { applicationName })
      if (response.data.result === "BSJ370") {
        appDispatch({ type: "loggedOut" })
        appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        return
      } else if (response.data === false) {
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchTasks elseif)" })
        return
      }
      setTasks(response.data)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator. (fetchTasks catch(e))" })
    }
  }

  function handleCloseEdit() {
    appDispatch({ type: "errorToast", data: "Application not updated." })
    var modal = document.getElementById("appModal")
    var form = modal.querySelector("form")
    form.reset()
    setSelectedEditApp("")
  }

  function resetSetTask() {
    setSelectedTask("")
  }

  async function handleUpdateApplication() {
    let description = document.getElementById("editApplicationDescription").value
    let startDate = document.getElementById("editApplicationStartDate").value
    let endDate = document.getElementById("editApplicationEndDate").value
    let create = document.getElementById("editApplicationCreate").value
    let open = document.getElementById("editApplicationOpen").value
    let toDo = document.getElementById("editApplicationToDo").value
    let doing = document.getElementById("editApplicationDoing").value
    let done = document.getElementById("editApplicationDone").value
    let appName = document.getElementById("editApplicationName").value

    let dateValidate

    if (startDate === "" && endDate === "") {
      dateValidate = true
    } else {
      dateValidate = Boolean(endDate >= startDate)
    }

    let validation = Boolean(dateValidate)

    if (validation) {
      try {
        const response = await Axios.put(`/tms/update_application`, { description, startDate, endDate, create, open, toDo, doing, done, appName })
        if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
          return
        }

        if (response.data === true) {
          appDispatch({ type: "successToast", data: `${selectedEditApp.App_Acronym} updated.` })
          var modal = document.getElementById("appModal")
          var form = modal.querySelector("form")
          form.reset()
          fetchApplication()
          // setResetSelectedApp(true)
          setSelectedEditApp("")
          return
        } else {
          appDispatch({ type: "errorToast", data: `No updates made to ${selectedEditApp.App_Acronym}` })
          return
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (handleUpdateApplication catch(e))" })
      }
    } else {
      var modal = document.getElementById("appModal")
      var form = modal.querySelector("form")
      form.reset()
      appDispatch({ type: "errorToast", data: `${selectedEditApp.App_Acronym} not updated. Please check input fields again.` })
    }
  }

  async function fetchPermission() {
    const responsePL = await Axios.post(`/group/checkgroup`, { group_name: "Project Lead" })
    const responsePM = await Axios.post(`/group/checkgroup`, { group_name: "Project Manager" })
    const responseCreate = await Axios.post(`/group/checkgroup`, { group_name: selectedApp.App_permit_Create })
    const responseOpen = await Axios.post(`/group/checkgroup`, { group_name: selectedApp.App_permit_Open })
    const responseTodo = await Axios.post(`/group/checkgroup`, { group_name: selectedApp.App_permit_toDoList })
    const responseDoing = await Axios.post(`/group/checkgroup`, { group_name: selectedApp.App_permit_Doing })
    const responseDone = await Axios.post(`/group/checkgroup`, { group_name: selectedApp.App_permit_Done })

    setPermission({ pl: responsePL.data, pm: responsePM.data, create: responseCreate.data, open: responseOpen.data, todo: responseTodo.data, doing: responseDoing.data, done: responseDone.data })
  }

  useEffect(() => {
    applications.map(application => {
      if (application.App_Acronym === selectedEditApp.App_Acronym) {
        setSelectedApp(application)
        setSelectedEditApp("")
        setResetSelectedApp(false)
      }
    })
  }, [resetSelectedApp])

  useEffect(() => {
    fetchApplication()
    fetchGroups()
    fetchPlans()
    fetchTasks()
    getUsername()
    fetchPermission()
  }, [selectedApp])

  return (
    <div>
      {permission.pl ? <CreateApplication fetchApplication={fetchApplication} /> : <></>}
      {/* Area to view all applications ===== From Here */}
      <div className="d-flex flex-wrap align-items-center justify-content-center overflow-y-auto p-3" style={{ height: "90vh" }}>
        {applications.map(application => {
          return (
            <div key={application.App_Acronym} className="d-flex align-items-center p-3">
              <div className="input-group">
                <a
                  id={"patch" + application.App_Acronym}
                  href="#kanBan"
                  className="btn btn-light border"
                  type="button"
                  onClick={() => {
                    setSelectedApp(application)
                  }}
                  style={{ width: "30vh" }}
                >
                  {application.App_Acronym}
                </a>
                {permission.pl ? (
                  <button
                    className="border btn-light btn"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#appModal"
                    onClick={() => {
                      setSelectedEditApp(application)
                      setSelectedApp("")
                    }}
                  >
                    <svg className="bi bi-wrench" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                      <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z" />
                    </svg>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Area to view all applications ===== To Here */}

      {/* Modal for Edit Application ===== From Here */}
      <div className="modal fade" id="appModal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header pb-2">
              <h1 className="modal-title fs-4" id="appNameModal">
                {selectedEditApp.App_Acronym}
              </h1>
              <button onClick={handleCloseEdit} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-1">
              <form id="editAppplicationForm">
                <h5 className="offcanvas-title">Details</h5>
                <div className="d-flex">
                  <div className="pe-3">
                    <label htmlFor="editApplicationName" className="form-label mb-0 mt-1">
                      Name
                    </label>
                    <input defaultValue={selectedEditApp.App_Acronym} disabled type="text" className="form-control" id="editApplicationName" />
                  </div>
                  <div>
                    <label htmlFor="editApplicationRnumber" className="form-label mb-0 mt-1">
                      R-number
                    </label>
                    <input defaultValue={selectedEditApp.App_Rnumber} disabled className="form-control" id="editApplicationRnumber" />
                  </div>
                </div>
                <div>
                  <label htmlFor="editApplicationDescription" className="form-label mb-0 mt-1">
                    Description
                  </label>
                  <textarea defaultValue={selectedEditApp.App_Description} type="text" className="form-control" id="editApplicationDescription" rows="12" />
                </div>
                <div className="d-flex">
                  <div className="pe-3">
                    <label htmlFor="editApplicationStartDate" className="form-label mb-0 mt-1">
                      Start Date
                    </label>
                    <input defaultValue={selectedEditApp.App_startDate} type="date" className="form-control" id="editApplicationStartDate" />
                  </div>
                  <div>
                    <label htmlFor="editApplicationEndDate" className="form-label mb-0 mt-1">
                      End Date
                    </label>
                    <input defaultValue={selectedEditApp.App_endDate} type="date" className="form-control" id="editApplicationEndDate" />
                  </div>
                </div>
                <h5 className="offcanvas-title pt-2">Access Management</h5>
                <div className="d-flex">
                  <div className="pe-3">
                    <label htmlFor="editApplicationCreate" className="form-label mb-0 mt-1">
                      Create
                    </label>
                    <select defaultValue={selectedEditApp.App_permit_Create} className="form-select" id="editApplicationCreate">
                      <option value=""></option>
                      {groups.map(group => {
                        return (
                          <option selected={group.group_name === selectedEditApp.App_permit_Create} key={"create" + group.group_name} value={group.group_name}>
                            {/* <option key={"create" + group.group_name} value={group.group_name}> */}
                            {group.group_name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="pe-3">
                    <label htmlFor="editApplicationOpen" className="form-label mb-0 mt-1">
                      Open
                    </label>
                    <select defaultValue={selectedEditApp.App_permit_Open} className="form-select" id="editApplicationOpen">
                      <option value=""></option>
                      {groups.map(group => {
                        return (
                          <option selected={group.group_name === selectedEditApp.App_permit_Open} key={"open" + group.group_name} value={group.group_name}>
                            {/* <option key={"open" + group.group_name} value={group.group_name}> */}
                            {group.group_name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="editApplicationToDo" className="form-label mb-0 mt-1">
                      To-Do
                    </label>
                    <select defaultValue={selectedEditApp.App_permit_toDoList} className="form-select" id="editApplicationToDo">
                      <option value=""></option>
                      {groups.map(group => {
                        return (
                          <option selected={group.group_name === selectedEditApp.App_permit_toDoList} key={"open" + group.group_name} value={group.group_name}>
                            {/* <option key={"open" + group.group_name} value={group.group_name}> */}
                            {group.group_name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="pe-3">
                    <label htmlFor="editApplicationDoing" className="form-label mb-0 mt-1">
                      Doing
                    </label>
                    <select defaultValue={selectedEditApp.App_permit_Doing} className="form-select" id="editApplicationDoing">
                      <option value=""></option>
                      {groups.map(group => {
                        return (
                          <option selected={group.group_name === selectedEditApp.App_permit_Doing} key={"open" + group.group_name} value={group.group_name}>
                            {/* <option key={"open" + group.group_name} value={group.group_name}> */}
                            {group.group_name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="editApplicationDone" className="form-label mb-0 mt-1">
                      Done
                    </label>
                    <select defaultValue={selectedEditApp.App_permit_Done} className="form-select" id="editApplicationDone">
                      <option value=""></option>
                      {groups.map(group => {
                        return (
                          <option selected={group.group_name === selectedEditApp.App_permit_Done} key={"open" + group.group_name} value={group.group_name}>
                            {/* <option key={"open" + group.group_name} value={group.group_name}> */}
                            {group.group_name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseEdit} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button onClick={handleUpdateApplication} type="button" className="btn btn-primary" data-bs-dismiss="modal">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Edit Application ===== To Here */}

      {/* Section for create plan/task ===== From Here */}
      <div className="d-flex justify-content-between align-items-center pe-4">
        <h4 className="ps-3" value="selectedApp.App_Acronym">
          {selectedApp.App_Acronym}
        </h4>
        {permission.pm && selectedApp !== "" ? <CreatePlan applicationName={selectedApp.App_Acronym} fetchPlans={fetchPlans} plans={plans} /> : <></>}
        {Boolean(permission.pl || permission.create) && selectedApp !== "" ? <CreateTask username={username} application={selectedApp} fetchTasks={fetchTasks} fetchApplication={fetchApplication} plans={plans} /> : <></>}
      </div>
      {/* Section for create plan/task ===== To Here */}

      {/* Plan bar ===== From Here */}
      <PlanBar plans={plans} fetchPlans={fetchPlans} permission={permission} selectedApp={selectedApp} />
      {/* Plan bar ===== To Here */}

      {/* Task Overview ===== From Here */}
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <div className="card col m-1">
          <div className="card-header text-center">Open Tasks</div>
          {/* Populate Open Task Card ===== From Here */}
          {tasks.map(task => {
            if (task.Task_state === 1) {
              return (
                <div className="card text-center ms-2 me-2 mt-1">
                  <ColorBar task={task} plans={plans} />
                  <div className="card-header pt-1 pb-1">
                    <div>{task.Task_id}</div>
                    <div>{task.Task_name}</div>
                  </div>
                  {permission.open ? (
                    <div className="d-flex justify-content-between ps-5 pe-5">
                      <div style={{ width: "16px", height: "16px" }}></div>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#EditTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </button>
                      <button
                        className="btn p-0"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#PromoteTaskModal"
                        onClick={() => {
                          setSelectedTask(task)
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#ViewTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          })}
          {/* Populate Open Task Card ===== To Here */}
        </div>
        <div className="card col m-1">
          <div className="card-header text-center">To-do Tasks</div>
          {/* Populate Todo Task Card ===== From Here */}
          {tasks.map(task => {
            if (task.Task_state === 2) {
              return (
                <div className="card text-center ms-2 me-2 mt-1" id={task.Task_id}>
                  <ColorBar task={task} plans={plans} />
                  <div className="card-header pt-1 pb-1">
                    <div>{task.Task_id}</div>
                    <div>{task.Task_name}</div>
                  </div>
                  {permission.todo ? (
                    <div className="d-flex justify-content-between ps-5 pe-5">
                      <div style={{ width: "16px", height: "16px" }}></div>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#EditTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </button>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#PromoteTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#ViewTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          })}
          {/* Populate Todo Task Card ===== To Here */}
        </div>
        <div className="card col m-1">
          <div className="card-header text-center">Doing Tasks</div>
          {/* Populate Doing Task Card ===== From Here */}
          {tasks.map(task => {
            if (task.Task_state === 3) {
              return (
                <div className="card text-center ms-2 me-2 mt-1" id={task.Task_id}>
                  <ColorBar task={task} plans={plans} />
                  <div className="card-header pt-1 pb-1">
                    <div>{task.Task_id}</div>
                    <div>{task.Task_name}</div>
                  </div>
                  {permission.doing ? (
                    <div className="d-flex justify-content-between ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#DemoteTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                        </svg>
                      </button>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#EditTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </button>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#PromoteTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#ViewTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          })}
          {/* Populate Doing Task Card ===== To Here */}
        </div>
        <div className="card col m-1">
          <div className="card-header text-center">Done Tasks</div>
          {/* Populate Done Task Card ===== From Here */}
          {tasks.map(task => {
            if (task.Task_state === 4) {
              return (
                <div className="card text-center ms-2 me-2 mt-1" id={task.Task_id}>
                  <ColorBar task={task} plans={plans} />
                  <div className="card-header pt-1 pb-1">
                    <div>{task.Task_id}</div>
                    <div>{task.Task_name}</div>
                  </div>
                  {permission.done ? (
                    <div className="d-flex justify-content-between ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#DemoteTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                        </svg>
                      </button>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#EditTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </button>
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#PromoteTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center ps-5 pe-5">
                      <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#ViewTaskModal" onClick={() => setSelectedTask(task)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            }
          })}
          {/* Populate Done Task Card ===== To Here */}
        </div>
        <div className="card col m-1">
          <div className="card-header text-center">Closed Tasks</div>
          {/* Populate Closed Task Card ===== From Here */}
          {tasks.map(task => {
            if (task.Task_state === 5) {
              return (
                <div className="card text-center ms-2 me-2 mt-1" id={task.Task_id}>
                  <ColorBar task={task} plans={plans} />
                  <div className="card-header pt-1 pb-1">
                    <div>{task.Task_id}</div>
                    <div>{task.Task_name}</div>
                  </div>
                  <div className="d-flex justify-content-center ps-5 pe-5">
                    <button className="btn p-0" type="button" data-bs-toggle="modal" data-bs-target="#ViewTaskModal" onClick={() => setSelectedTask(task)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            }
          })}
          {/* Populate Closed Task Card ===== To Here */}
        </div>
      </div>
      {/* Task Overview ===== To Here */}
      <PromoteTaskModal selectedApp={selectedApp} fetchTasks={fetchTasks} username={username} selectedTask={selectedTask} plans={plans} resetSetTask={resetSetTask} />
      <EditTaskModal selectedApp={selectedApp} fetchTasks={fetchTasks} username={username} selectedTask={selectedTask} plans={plans} resetSetTask={resetSetTask} />
      <DemoteTaskModal selectedApp={selectedApp} fetchTasks={fetchTasks} username={username} selectedTask={selectedTask} plans={plans} resetSetTask={resetSetTask} />
      <ViewTaskModal selectedApp={selectedApp} selectedTask={selectedTask} plans={plans} />
    </div>
  )
}

export default TMSMain
