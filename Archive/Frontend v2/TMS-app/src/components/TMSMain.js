import React, { useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function TMSMain() {
  const appState = useContext(StateContext)

  // to identify user profile <<POLICE perform token check!!!>>
  // async function fetchProfile() {
  //   try {
  //     const response = await Axios.get(`/user/verify`)
  //     response.data[0].active_status === 1 ? appDispatch({ type: "username", data: response.data[0].username }) : appDispatch()
  //     response.data[0].group_name === "Admin" ? appDispatch({ type: "isAdmin" }) : appDispatch()
  //     console.log()
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   fetchProfile()
  // }, [])

  function caller() {
    console.log(appState.username)
    console.log(appState.isAdmin)
  }

  return (
    <>
      <div>
        <h1>This shall be the Task Management Main Page that will be done during assignment 2</h1>
        <button onClick={caller} type="Button">
          DEBUG
        </button>
      </div>
    </>
  )
}

export default TMSMain
