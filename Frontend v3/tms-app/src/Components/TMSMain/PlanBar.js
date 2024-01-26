import React, { useContext, useState } from "react"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"

function PlanBar({ plans, fetchPlans, permission }) {
  const [selectedPlan, setSelectedPlan] = useState("")
  const appDispatch = useContext(DispatchContext)

  function handleCloseEdit() {
    if (permission.pm) {
      appDispatch({ type: "errorToast", data: "Plan not updated." })
    }
    var modal = document.getElementById("planModal")
    var form = modal.querySelector("form")
    form.reset()
    fetchPlans()
  }

  async function handleEditPlan() {
    let planName = selectedPlan.Plan_MVP_name
    let applicationName = selectedPlan.Plan_appAcronym
    let planEditStartDate = document.getElementById("editPlanStartDate").value
    let planEditEndDate = document.getElementById("editPlanEndDate").value
    let planEditColour = document.getElementById("editPlanColour").value

    let mandatoryFieldsCheck = !Boolean(planName === "" || planEditStartDate === "" || planEditEndDate === "")
    let dateValidate

    if (planEditStartDate === "" && planEditEndDate === "") {
      dateValidate = true
    } else {
      dateValidate = Boolean(planEditEndDate >= planEditStartDate)
    }

    let validation = Boolean(mandatoryFieldsCheck && dateValidate)

    if (validation) {
      try {
        const response = await Axios.put(`/tms/update_plan`, { planName, applicationName, planEditColour, planEditEndDate, planEditStartDate })
        if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
          return
        }

        if (response.data === true) {
          appDispatch({ type: "successToast", data: `${planName} updated.` })
          var modal = document.getElementById("planModal")
          var form = modal.querySelector("form")
          form.reset()
          fetchPlans()
          return
        } else {
          appDispatch({ type: "errorToast", data: `No updates made to ${planName}` })
          return
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (handleUpdateApplication catch(e))" })
      }
    } else {
      var modal = document.getElementById("planModal")
      var form = modal.querySelector("form")
      form.reset()
      appDispatch({ type: "errorToast", data: `No updates made to ${planName}. Please check input fields again.` })
    }
  }

  return (
    <>
      {/* div to scroll to here!!! */}
      <div id="kanBan" className="d-flex align-items-center ms-3 mt-1" style={{ height: "7vh" }}>
        {plans.map(plan => {
          return (
            <div key={plan.Plan_MVP_name} className="d-flex align-items-center me-2">
              <button
                className="d-flex align-items-center border btn-light btn"
                data-bs-toggle="modal"
                data-bs-target="#planModal"
                onClick={() => {
                  setSelectedPlan(plan)
                }}
                style={{ height: "5vh" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={plan.Plan_colour} className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                </svg>
                <div>{plan.Plan_MVP_name}</div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal for Edit Application ===== From Here */}
      <div className="modal fade" id="planModal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog modal-lg" style={{ width: "100vh" }}>
          <div className="modal-content">
            <div className="modal-header pb-2">
              <h1 className="modal-title fs-4" id="planNameModal">
                Plan {selectedPlan.Plan_MVP_name}
              </h1>
              <button onClick={handleCloseEdit} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-1">
              <form id="editPlanForm">
                <h5 className="offcanvas-title">Details</h5>
                <div className="d-flex">
                  <div className="pe-3">
                    <label htmlFor="editPlanStartDate" className="form-label mb-0 mt-1">
                      Start Date
                    </label>
                    <input defaultValue={selectedPlan.Plan_startDate} disabled={!permission.pm} type="date" className="form-control" id="editPlanStartDate" />
                  </div>
                  <div className="pe-3">
                    <label htmlFor="editPlanEndDate" className="form-label mb-0 mt-1">
                      End Date
                    </label>
                    <input defaultValue={selectedPlan.Plan_endDate} disabled={!permission.pm} type="date" className="form-control" id="editPlanEndDate" />
                  </div>
                  <div className="pe-3">
                    <label htmlFor="editPlanColour" className="form-label mb-0 mt-1">
                      Plan Colour
                    </label>
                    <input defaultValue={selectedPlan.Plan_colour} disabled={!permission.pm} type="color" className="form-control form-control-color" id="editPlanColour" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {permission.pm ? (
                <div>
                  <button onClick={handleCloseEdit} type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button onClick={handleEditPlan} type="button" className="btn btn-primary" data-bs-dismiss="modal">
                    Confirm
                  </button>
                </div>
              ) : (
                <button onClick={handleCloseEdit} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Edit Application ===== To Here */}
    </>
  )
}

export default PlanBar
