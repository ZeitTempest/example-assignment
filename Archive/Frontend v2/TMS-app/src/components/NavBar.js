import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import NavBarLoggedIn from "./NavBarLoggedIn"
import StateContext from "../StateContext"

function NavBar() {
  const appState = useContext(StateContext)

  return (
    <header className="text-bg-dark d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-3 mb-2 mb-md-0">
        <Link to="/" className="d-inline-flex link-body-emphasis text-white text-decoration-none">
          <h5 className="ps-3">Task Management System</h5>
        </Link>
      </div>
      {appState.loggedIn ? <NavBarLoggedIn /> : ""}
    </header>
  )
}

export default NavBar
