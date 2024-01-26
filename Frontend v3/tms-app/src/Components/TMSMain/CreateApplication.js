import React, { useContext, useState, useEffect } from "react"
import Axios from "axios"
import validator from "validator"
import DispatchContext from "../../DispatchContext"

function CreateApplication({ fetchApplication }) {
  const appDispatch = useContext(DispatchContext)
  const [appName, setAppName] = useState("")
  const [appRNum, setAppRNum] = useState("")
  // for offcanvas
  const [appNameOC, setAppNameOC] = useState("")
  const [appRNumOC, setAppRNumOC] = useState("1")
  const [appDescription, setAppDescription] = useState("")
  const [appStartDate, setAppStartDate] = useState(null)
  const [appEndDate, setAppEndDate] = useState(null)
  const [appCreate, setAppCreate] = useState("")
  const [appOpen, setAppOpen] = useState("")
  const [appToDo, setAppToDo] = useState("")
  const [appDoing, setAppDoing] = useState("")
  const [appDone, setAppDone] = useState("")
  const [groups, setGroups] = useState([])

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

  async function handleFastCreateApplication() {
    let mandatoryFieldsCheck = !Boolean(appName === "" || appRNum === "")
    let rNumValidate = validator.isInt(appRNum, { gt: 0, allow_leading_zeroes: false })
    let appNameValidate = validator.isAlpha(appName)

    let validation = Boolean(mandatoryFieldsCheck && rNumValidate && appNameValidate)

    if (validation) {
      try {
        const [appDescription, appStartDate, appEndDate, appOpen, appToDo, appDoing, appDone] = ["", "", "", "", "", "", ""]
        const response = await Axios.post("/tms/create_application", { appName, appRNum, appDescription, appStartDate, appEndDate, appCreate, appOpen, appToDo, appDoing, appDone })
        if (response.data === true) {
          appDispatch({ type: "successToast", data: "New Application is created." })
          setAppName("")
          setAppRNum("")
          fetchApplication()
        } else if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        } else {
          console.log(appStartDate, appEndDate)
          appDispatch({ type: "errorToast", data: "New Application not created. Please check input fields again." })
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } else {
      appDispatch({ type: "errorToast", data: "New Application not created. Please check input fields again." })
    }
  }

  async function handleSubmitCreateApplication() {
    let mandatoryFieldsCheck = !Boolean(appNameOC === "" || appRNumOC === "")
    let rNumValidate = validator.isInt(appRNumOC, { gt: 0, allow_leading_zeroes: false })
    let appNameValidate = validator.isAlpha(appNameOC)
    let appDescriptionValidate = validator.isAscii(appDescription)
    let dateValidate

    if (appStartDate === "" && appEndDate === "") {
      setAppStartDate(null)
      setAppEndDate(null)
      dateValidate = true
    } else {
      dateValidate = Boolean(appEndDate >= appStartDate)
    }

    let validation = Boolean(mandatoryFieldsCheck && rNumValidate && appNameValidate && dateValidate && appDescriptionValidate)

    if (validation) {
      try {
        const response = await Axios.post("/tms/create_application", { appNameOC, appRNumOC, appDescription, appStartDate, appEndDate, appCreate, appOpen, appToDo, appDoing, appDone })

        if (response.data === true) {
          appDispatch({ type: "successToast", data: "New Application is created." })
          setAppNameOC("")
          setAppRNumOC("1")
          setAppDescription("")
          setAppStartDate(null)
          setAppEndDate(null)
          setAppCreate("")
          setAppOpen("")
          setAppToDo("")
          setAppDoing("")
          setAppDone("")
          fetchApplication()
          document.getElementById("createAppplicationForm").reset()
        } else if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
        } else {
          appDispatch({ type: "errorToast", data: "New Application not created. Please check input fields again." })
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    } else {
      appDispatch({ type: "errorToast", data: "New Application not created. Please check input fields again." })
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <>
      <div className="d-flex justify-content-center" style={{ height: "10vh" }}>
        <div className="input-group mb-2" style={{ height: "5vh", width: "90vh" }}>
          <input onChange={e => setAppName(e.target.value)} value={appName} placeholder="New Application Name" type="text" className="form-control" />
          <input onChange={e => setAppRNum(e.target.value)} placeholder="Application R-Number" type="text" value={appRNum} className="form-control" />
          {!Boolean(!appName && !appRNum) ? (
            <button className="btn btn-primary" onClick={handleFastCreateApplication}>
              Fast Create
            </button>
          ) : (
            <button id="createAppButton" className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#createAppFormOC">
              Create App
            </button>
          )}
        </div>
      </div>

      {/* add a reset button, justify content of the buttons to the end */}
      {/* offcanvas starts here */}
      <div className="offcanvas offcanvas-start" id="createAppFormOC" style={{ width: "70vh" }}>
        <div className="offcanvas-header pb-1">
          <h3 className="offcanvas-title">New Application</h3>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body pt-0">
          <h5 className="offcanvas-title">Details</h5>
          <form id="createAppplicationForm">
            <div className="d-flex">
              <div className="pe-3">
                <label htmlFor="applicationName" className="form-label mb-0 mt-1">
                  Name
                </label>
                <input onChange={e => setAppNameOC(e.target.value)} value={appNameOC} type="text" className="form-control" id="applicationName" />
              </div>
              <div>
                <label htmlFor="applicationRnumber" className="form-label mb-0 mt-1">
                  R-number
                </label>
                <input onChange={e => setAppRNumOC(e.target.value)} value={appRNumOC} type="text" className="form-control" id="applicationRnumber" />
              </div>
            </div>
            <div>
              <label htmlFor="applicationDescription" className="form-label mb-0 mt-1">
                Description
              </label>
              <textarea onChange={e => setAppDescription(e.target.value)} value={appDescription} type="text" className="form-control" id="applicationDescription" rows="10" />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <label htmlFor="applicationStartDate" className="form-label mb-0 mt-1">
                  Start Date
                </label>
                <input onChange={e => setAppStartDate(e.target.value)} type="date" className="form-control" id="applicationStartDate" style={{ width: "30vh" }} />
              </div>
              <div>
                <label htmlFor="applicationEndDate" className="form-label mb-0 mt-1">
                  End Date
                </label>
                <input onChange={e => setAppEndDate(e.target.value)} type="date" className="form-control" id="applicationEndDate" style={{ width: "30vh" }} />
              </div>
            </div>
            <hr className="border" />
            <h5 className="offcanvas-title pt-2">Access Management</h5>
            <div>
              <label htmlFor="Create" className="form-label mb-0 mt-1">
                Create
              </label>
              <select onChange={e => setAppCreate(e.target.value)} className="form-select" id="Create" style={{ width: "30vh" }}>
                <option value=""></option>
                {groups.map(group => {
                  return (
                    <option key={"create" + group.group_name} value={group.group_name}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label htmlFor="Open" className="form-label mb-0 mt-1">
                Open
              </label>
              <select onChange={e => setAppOpen(e.target.value)} className="form-select" id="Open" style={{ width: "30vh" }}>
                <option value=""></option>
                {groups.map(group => {
                  return (
                    <option key={"open" + group.group_name} value={group.group_name}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label htmlFor="To-Do" className="form-label mb-0 mt-1">
                To-Do
              </label>
              <select onChange={e => setAppToDo(e.target.value)} className="form-select" id="To-Do" style={{ width: "30vh" }}>
                <option value=""></option>
                {groups.map(group => {
                  return (
                    <option key={"toDo" + group.group_name} value={group.group_name}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label htmlFor="Doing" className="form-label mb-0 mt-1">
                Doing
              </label>
              <select onChange={e => setAppDoing(e.target.value)} className="form-select" id="Doing" style={{ width: "30vh" }}>
                <option value=""></option>
                {groups.map(group => {
                  return (
                    <option key={"doing" + group.group_name} value={group.group_name}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label htmlFor="Done" className="form-label mb-0 mt-1">
                Done
              </label>
              <select onChange={e => setAppDone(e.target.value)} className="form-select" id="Done" style={{ width: "30vh" }}>
                <option value=""></option>
                {groups.map(group => {
                  return (
                    <option key={"done" + group.group_name} value={group.group_name}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <button onClick={handleSubmitCreateApplication} type="button" className="btn btn-primary mt-3" data-bs-dismiss="offcanvas">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateApplication
