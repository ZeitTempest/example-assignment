import React, { useContext, useState, useEffect } from "react"
import Axios from "axios"
import validator from "validator"
import DispatchContext from "../../DispatchContext"

function CreatePlan({ applicationName, fetchPlans, plans }) {
  const appDispatch = useContext(DispatchContext)
  const [planName, setPlanName] = useState("")
  const [planStartDate, setPlanStartDate] = useState("")
  const [planEndDate, setPlanEndDate] = useState("")
  const [planColour, setPlanColour] = useState("#000000")

  async function handleCreatePlan() {
    let mandatoryFieldsCheck = !Boolean(planName === "" || planStartDate === "" || planEndDate === "")
    let planNameValidation = validator.isAscii(planName)
    let planNameValidation2 = !Boolean(planName[0] === " ")
    let dateValidate

    if (planStartDate === "" && planEndDate === "") {
      dateValidate = true
    } else {
      dateValidate = Boolean(planEndDate >= planStartDate)
    }

    let validation = Boolean(mandatoryFieldsCheck && planNameValidation && planNameValidation2 && dateValidate)

    if (validation) {
      try {
        const response = await Axios.post(`/tms/create_plan`, { planName, planStartDate, planEndDate, planColour, applicationName })
        if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
          return
        }

        if (response.data === true) {
          appDispatch({ type: "successToast", data: `${planName} is created.` })
          setPlanName("")
          setPlanStartDate("")
          setPlanEndDate("")
          setPlanColour("#000000")
          fetchPlans()
          return
        } else {
          appDispatch({ type: "errorToast", data: `Plan not created. Please check input fields.` })
          return
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (handleCreatePlan catch(e))" })
      }
    } else {
      appDispatch({ type: "errorToast", data: `Plan not created. Please check input fields.` })
    }
  }

  return (
    <>
      <div className="input-group" style={{ width: "120vh" }}>
        <div className="form-floating">
          <input type="text" className="form-control" id="createPlanName" placeholder="Plan Name" value={planName} onChange={e => setPlanName(e.target.value)} />
          <label htmlFor="createPlanName">Plan Name</label>
        </div>
        <div className="form-floating">
          <input type="date" className="form-control" id="createPlanStartDate" value={planStartDate} onChange={e => setPlanStartDate(e.target.value)} />
          <label htmlFor="createPlanStartDate">Start Date</label>
        </div>
        <div className="form-floating">
          <input type="date" className="form-control" id="createPlanEndDate" value={planEndDate} onChange={e => setPlanEndDate(e.target.value)} />
          <label htmlFor="createPlanEndDate">End Date</label>
        </div>
        <div className="form-floating">
          <input type="color" className="form-control" id="createPlanColor" value={planColour} onChange={e => setPlanColour(e.target.value)} />
          <label htmlFor="createPlanColor" style={{ width: "24vh" }}>
            Plan Colour
          </label>
        </div>
        <button className="btn btn-secondary" onClick={handleCreatePlan}>
          Create
        </button>
      </div>
    </>
  )
}

export default CreatePlan
