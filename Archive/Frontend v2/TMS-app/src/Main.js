import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"
// Importing Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
// Importing my components
import LoginPage from "./components/LoginPage"
import NavBar from "./components/NavBar"
import UserManagement from "./components/UserManagement"
import TMSMain from "./components/TMSMain"
import ErrorPage from "./components/ErrorPage"
import EditPage from "./components/EditPage"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Axios.defaults.baseURL = "http://localhost:8080"
Axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    isAdmin: false,
    token: localStorage.getItem("token"),
    username: null
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.token = action.data.token
        draft.username = action.data.username
        return
      case "logout":
        draft.loggedIn = false
        draft.isAdmin = false
        draft.username = null
        return
      case "isAdmin":
        draft.isAdmin = true
        return
      case "username":
        draft.username = action.data
        return
      case "toast":
        toast(action.data)
        return
      default:
        return
    }
  }

  async function fetchProfile() {
    try {
      const response = await Axios.get(`/user/verify`)
      response.data[0].active_status === 1 ? (state.username = response.data[0].username) : dispatch()
      response.data[0].group_name === "Admin" ? dispatch({ type: "isAdmin" }) : dispatch()
      console.log()
    } catch (e) {
      console.log(e)
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.token)
      Axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
      fetchProfile()
    } else {
      localStorage.removeItem("token")
      Axios.defaults.headers.common["Authorization"] = null
    }
  }, [state.loggedIn, state.token])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {state.loggedIn ? <NavBar /> : <NavBar />}
          <Routes>
            <Route path="/" element={state.loggedIn ? <TMSMain /> : <LoginPage />} />
            <Route path="/main" element={state.loggedIn ? <UserManagement /> : <ErrorPage />} />
            <Route path="/edit" element={state.loggedIn ? <EditPage /> : <ErrorPage />} />
          </Routes>
          <ToastContainer position="bottom-right" autoClose={5000} />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default Main
