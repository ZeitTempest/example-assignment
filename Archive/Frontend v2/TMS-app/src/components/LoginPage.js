import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function LoginPage() {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const responseUser = await Axios.post("/user/login", { username, password })
      const responseAdmin = await Axios.post("/group/checkadmin", { username })

      if (responseUser.data) {
        appDispatch({ type: "login", data: responseUser.data })
        appDispatch({ type: "toast", data: "Welcome" })
      } else {
        console.log("1Incorrect username / password.")
      }

      if (responseAdmin.data.groups.length === 1) {
        appDispatch({ type: "isAdmin" })
      }
    } catch (e) {
      appDispatch({ type: "toast", data: "Incorrect username/password" })
      console.log("2Incorrect username / password.")
      console.log(e)
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
