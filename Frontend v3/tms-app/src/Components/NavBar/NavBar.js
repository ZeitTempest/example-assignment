import React, { useContext } from "react"
import { Link } from "react-router-dom"
// Importing Contexts
import StateContext from "../../StateContext"
// Importing components
import NavBarLoggedIn from "./NavBarLoggedIn"

function NavBar() {
  const appState = useContext(StateContext)
  //d-flex align-items-center justify-content-center justify-content-md-between py-3 mb-4

  return (
    <>
      <header className="text-bg-dark border-bottom sticky-top">
        <div className="d-flex align-items-center justify-content-between" style={{ height: "7vh" }}>
          <Link to="/" className="link-body-emphasis text-white text-decoration-none">
            <h5 className="ps-3 ">Task Management System</h5>
          </Link>
          {appState.loggedIn ? <NavBarLoggedIn /> : ""}
        </div>
      </header>
      <div style={{ height: "3vh" }}></div>
    </>
  )
}

export default NavBar
