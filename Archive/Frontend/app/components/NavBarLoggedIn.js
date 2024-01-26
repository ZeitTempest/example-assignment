import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function NavBarLoggedIn() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const navigate = useNavigate()

  function handleLogout() {
    appDispatch({ type: "logout" })
    navigate("/")
  }

  return (
    <>
      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          {appState.isAdmin ? (
            <Link to="/main" className="nav-link px-2 text-white">
              User Management
            </Link>
          ) : (
            ""
          )}
        </li>
        <li>
          <Link to="/edit" className="nav-link px-2 text-white">
            Edit Profile
          </Link>
        </li>
      </ul>

      <div className="col-md-3 text-end pe-3">
        <div className="text-white d-inline pe-3">
          <div className="text-white d-inline pe-3">Hi! {appState.username}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-primary me-2">
          Log Out
        </button>
      </div>
    </>
  )
}

export default NavBarLoggedIn
