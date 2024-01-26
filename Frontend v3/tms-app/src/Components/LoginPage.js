import React, { useState, useContext } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import DispatchContext from "../DispatchContext"

function LoginPage() {
  const navigate = useNavigate()
  const unacceptable = [undefined, ""]
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()

    if (unacceptable.includes(username) || unacceptable.includes(password)) {
      appDispatch({ type: "errorToast", data: "Invalid Username/Password." })
    } else {
      try {
        const response = await Axios.post("/auth/login", { username, password })
        if (response.data.result === "true") {
          appDispatch({ type: "loggedIn", data: response.data })
          appDispatch({ type: "successToast", data: "Welcome." })
          navigate("/")
        } else {
          appDispatch({ type: "errorToast", data: "Invalid Username/Password." })
        }
      } catch (e) {
        console.log(e)
        appDispatch({ type: "errorToast", data: "Please contact an administrator." })
      }
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <form onSubmit={handleSubmit}>
          <h1 className="h4 mb-3 fw-normal">Login</h1>
          <div>
            <div className="form-floating">
              <input onChange={e => setUsername(e.target.value)} name="username" type="text" className="form-control" placeholder="Username" autoComplete="off" />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mt-1">
              <input onChange={e => setPassword(e.target.value)} name="password" type="password" className="form-control" placeholder="Password" />
              <label htmlFor="floatingInput">Password</label>
            </div>
            <div className="col-md-auto">
              <button className="mt-3 w-100 btn btn-lg btn-primary" type="submit">
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
