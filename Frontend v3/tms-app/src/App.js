import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
// Importing Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
// Importing my components
import NavBar from "./Components/NavBar/NavBar"
import LoginPage from "./Components/LoginPage"
import TMSMain from "./Components/TMSMain/TMSMain"
import EditPage from "./Components/EditPage"
import ErrorPage from "./Components/ErrorPage"
import UserManagement from "./Components/UserManagement/UserManagement"
import Testing from "./Components/testing"
import Blank from "./Components/Blank"
// Importing toast for notifications
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
// Configuring Axios
Axios.defaults.baseURL = "http://localhost:6060"
Axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`

function App() {
  // Information for redering ONLY after check has updated the values
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    token: localStorage.getItem("token")
  }

  // Engine to run dispatch context in order to update values onto state context
  function ourReducer(draft, action) {
    switch (action.type) {
      case "loggedIn":
        draft.loggedIn = true
        draft.token = action.data.jwt
        Axios.defaults.headers.common["Authorization"] = `Bearer ${action.data.jwt}`
        return
      case "loggedOut":
        draft.loggedIn = false
        return
      case "isAdmin":
        draft.isAdmin = true
        return
      case "successToast":
        toast.success(action.data)
        return
      case "errorToast":
        toast.error(action.data)
        return
      default:
        return state
    }
  }

  const [isAdmin, setIsAdmin] = useState(false)

  async function checkGroup(groupName) {
    try {
      const response = await Axios.post(`/auth/checkgroup`, { groupName })
      setIsAdmin(response.data.result)
      if (response.data.result === "BSJ370") {
        dispatch({ type: "loggedOut" })
      }
    } catch (e) {
      console.log(e)
      dispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    checkGroup("admin")
    if (state.loggedIn) {
      localStorage.setItem("token", state.token)
    } else {
      localStorage.removeItem("token")
      Axios.defaults.headers.common["Authorization"] = null
    }
  }, [state.loggedIn, state.token])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/testing" element={<Testing />} />
            <Route path="/" element={state.loggedIn ? <Blank /> : <LoginPage />} />
            {/* <Route path="/" element={state.loggedIn ? <TMSMain /> : <LoginPage />} /> */}
            <Route path="/edit" element={state.loggedIn ? <EditPage /> : <LoginPage />} />
            <Route path="/main" element={state.loggedIn ? isAdmin ? <UserManagement /> : <ErrorPage /> : <LoginPage />} />
          </Routes>
          <ToastContainer position="bottom-right" autoClose={1250} />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
