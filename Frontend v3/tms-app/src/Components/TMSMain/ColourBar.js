import React from "react"

function ColorBar({ plans, task }) {
  const plan_exist = plans.find(({ Plan_MVP_name }) => Plan_MVP_name === task.Task_plan)

  const style = {
    height: "5px",
    backgroundColor: plan_exist ? plan_exist.Plan_colour : "#808080",
    border: "none",
    opacity: 1
  }
  return (
    <>
      <hr id="colourBar" className="m-0 rounded-top" style={style} />
    </>
  )
}

export default ColorBar
