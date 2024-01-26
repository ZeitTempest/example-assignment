import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"

function PromoteTaskModal({ selectedTask, username, fetchTasks, plans, resetSetTask }) {
  const appDispatch = useContext(DispatchContext)
  const [taskUpdatedPlan, setTaskUpdatedPlan] = useState(false)
  const [taskNotes, setTaskNotes] = useState("")

  async function sendEmail() {
    let taskID = selectedTask.Task_id
    let taskName = selectedTask.Task_name
    let taskOwner = username

    try {
      const response = await Axios.post(`/tms/send_email`, { taskID, taskName, taskOwner })
      if (response) {
        appDispatch({ type: "successToast", data: `Project Lead groups has been notified.` })
      }
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: `Please contact an administrator. (sendEmail catch(e))` })
    }
  }

  async function handlePromoteTask() {
    const taskNewState = selectedTask.Task_state + 1

    let taskNewPlan

    if (selectedTask.Task_state === 2 || selectedTask.Task_state === 3) {
      taskNewPlan = selectedTask.Task_plan
    } else {
      if (taskUpdatedPlan || taskUpdatedPlan === "") {
        taskNewPlan = taskUpdatedPlan
      } else {
        taskNewPlan = selectedTask.Task_plan
      }
    }

    let dateTime = new Date()

    const taskNotesComplete = `
==============================
Notes: ${taskNotes}
------------------------------
UserID: ${username}
Action: Promote Task to ${["Open", "To-do", "Doing", "Done", "Closed"][taskNewState - 1]} state
Date/Time: ${dateTime}
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
${selectedTask.Task_notes}`

    let taskOwner = username
    let taskID = selectedTask.Task_id

    let validation = !Boolean(taskNewPlan === "" || taskNewPlan === false)

    if (validation) {
      try {
        const response = await Axios.put(`/tms/update_task_status`, { taskNotesComplete, taskNewPlan, taskNewState, taskOwner, taskID })
        if (response.data.result === "BSJ370") {
          appDispatch({ type: "loggedOut" })
          appDispatch({ type: "errorToast", data: "Token expired. You have been logged out." })
          return
        }

        if (response.data === true) {
          appDispatch({ type: "successToast", data: `${selectedTask.Task_id} has been promoted.` })
          var modal = document.getElementById("PromoteTaskModal")
          var form = modal.querySelector("form")
          form.reset()
          setTaskNotes("")
          setTaskUpdatedPlan(false)

          if (taskNewState === 4) {
            sendEmail()
            fetchTasks()
            resetSetTask()
          } else {
            fetchTasks()
            resetSetTask()
          }

          return
        } else {
          appDispatch({ type: "errorToast", data: `No updates made to ${selectedTask.Task_id}` })
          return
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator. (handleUpdateApplication catch(e))" })
      }
    } else {
      appDispatch({ type: "errorToast", data: `No updates made to ${selectedTask.Task_id}. Please check input fields again.` })
      resetSetTask()
    }
  }

  function closeTaskModal() {
    setTaskUpdatedPlan(false)
    setTaskNotes("")
    var modal = document.getElementById("PromoteTaskModal")
    var form = modal.querySelector("form")
    form.reset()
    resetSetTask()
  }

  return (
    <>
      <div className="modal fade" id="PromoteTaskModal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header pt-1 pb-1">
              <div>
                <h1 className="modal-title fs-3">{`Promote Task - ${selectedTask.Task_name} (${["Open", "To-do", "Doing", "Done", "Closed"][selectedTask.Task_state - 1]})`}</h1>
                Created by {selectedTask.Task_creator} on {selectedTask.Task_createDate}
              </div>
              <button type="button" className="ms-2 btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-1">
              <form>
                <div className="d-flex pb-2">
                  <div className="d-flex">
                    <div className="pe-2">
                      <label htmlFor="taskID" className="form-label mb-0 mt-1">
                        Task ID
                      </label>
                      <input value={selectedTask.Task_id} disabled type="text" className="form-control" id="taskID" />

                      <label htmlFor="taskOwner" className="form-label mb-0 mt-1">
                        Task Owner
                      </label>
                      <input value={selectedTask.Task_owner} disabled type="text" className="form-control" id="taskOwner" />
                    </div>
                    <div className="pe-2">
                      <label htmlFor="taskName" className="form-label mb-0 mt-1">
                        Task Name
                      </label>
                      <input value={selectedTask.Task_name} disabled type="text" className="form-control" id="taskName" />
                      <label htmlFor="taskPlan" className="form-label mb-0 mt-1">
                        Plan
                      </label>
                      <select
                        onChange={e => {
                          setTaskUpdatedPlan(e.target.value)
                        }}
                        disabled={Boolean(selectedTask.Task_state === 2 || selectedTask.Task_state === 3 || selectedTask.Task_state === 4)}
                        className="form-select"
                        id="planDropDownList"
                        style={{ width: "30vh" }}
                      >
                        <option value="">No Plans Selected</option>
                        {plans.map(plan => {
                          return (
                            <option selected={selectedTask.Task_plan === plan.Plan_MVP_name} key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                              {/* <option key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}> */}
                              {plan.Plan_MVP_name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="taskDescription" className="form-label mb-0 mt-1">
                        Task Description
                      </label>
                      <textarea value={selectedTask.Task_description} disabled type="text" className="form-control" id="taskDescription" cols="40" rows="4" />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label htmlFor="taskNotes" className="form-label mb-0 mt-1">
                      Notes
                    </label>
                    <textarea value={selectedTask.Task_notes} disabled type="text" className="form-control" id="taskNotes" rows="12" />
                  </div>
                  <div>
                    <label htmlFor="taskAddNotes" className="form-label mb-0 mt-1">
                      Add Notes
                    </label>
                    <textarea
                      onChange={e => {
                        setTaskNotes(e.target.value)
                      }}
                      type="text"
                      className="form-control"
                      id="taskAddNotes"
                      rows="12"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={closeTaskModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button onClick={handlePromoteTask} type="button" className="btn btn-primary" data-bs-dismiss="modal">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PromoteTaskModal
