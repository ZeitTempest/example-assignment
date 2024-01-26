import React from "react"

function ViewTaskModal({ selectedTask, plans }) {
  return (
    <>
      <div className="modal fade" id="ViewTaskModal" data-bs-backdrop="static" data-bs-keyboard="false">
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
                      <input value={selectedTask.Task_plan} disabled type="text" className="form-control" id="taskPlan" />
                    </div>
                    <div>
                      <label htmlFor="taskDescription" className="form-label mb-0 mt-1">
                        Description
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
                    <textarea value={selectedTask.Task_notes} disabled type="text" className="form-control" id="taskNotes" rows="20" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewTaskModal
