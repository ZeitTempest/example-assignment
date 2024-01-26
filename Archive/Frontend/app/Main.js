import React, { useEffect, useState, useReducer } from "react"
import ReactDOM from "react-dom/client"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"
Axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

// Importing my components
import LoginPage from "./components/LoginPage"
import NavBar from "./components/NavBar"
import UserManagement from "./components/UserManagement"
import TMSMain from "./components/TMSMain"
import ErrorPage from "./components/ErrorPage"
import EditPage from "./components/EditPage"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    isAdmin: false,
    flashMessages: [],
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
      case "flashMessage":
        // something
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.token)
      Axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      localStorage.removeItem("token")
      Axios.defaults.headers.common["Authorization"] = null
    }
  }, [state.loggedIn])

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
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
