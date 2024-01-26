import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function homeBar() {
  return (
    <header className="text-bg-dark d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-3 mb-2 mb-md-0">
        <Link to="/" className="d-inline-flex link-body-emphasis text-white text-decoration-none">
          {" "}
          <h5>Task Management System</h5>
        </Link>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <Link to="#" className="nav-link px-2 text-white">
            User Management
          </Link>
        </li>
        <li>
          <Link to="#" className="nav-link px-2 text-white">
            Edit Profile
          </Link>
        </li>
      </ul>

      <div className="col-md-3 text-end">
        <button type="button" className="btn btn-outline-primary me-2">
          Log Out
        </button>
      </div>
    </header>
  )
}

export default homeBar
