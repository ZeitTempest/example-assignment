import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"

function NavBarLoggedIn() {
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  function handleLogout() {
    appDispatch({ type: "loggedOut" })
    appDispatch({ type: "successToast", data: "You have successfully logged out." })
    navigate("/")
  }

  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState("")

  async function checkGroup(groupName) {
    try {
      const response = await Axios.post(`/auth/checkgroup`, { groupName })
      setIsAdmin(response.data.result)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  async function getUsername() {
    try {
      const response = await Axios.get(`/get/profile`)
      setUsername(response.data.username)
    } catch (e) {
      console.log(e)
      appDispatch({ type: "errorToast", data: "Please contact an administrator." })
    }
  }

  useEffect(() => {
    checkGroup("admin")
    getUsername()
  })

  return (
    <>
      <div>
        <ul className="nav">
          <li>
            {isAdmin ? (
              <Link to="/main" className="nav-link text-white">
                User Management
              </Link>
            ) : (
              ""
            )}
          </li>
          <li>
            <Link to="/edit" className="nav-link text-white">
              Edit Profile
            </Link>
          </li>
        </ul>
      </div>

      <div className="text-end pe-3">
        <div className="text-white d-inline pe-3">
          <div className="text-white d-inline pe-3">Hi! {username}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-primary me-2">
          Log Out
        </button>
      </div>
    </>
  )
}

export default NavBarLoggedIn
