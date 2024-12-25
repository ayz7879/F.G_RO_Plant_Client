import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const username = localStorage.getItem("username");
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="https://us.123rf.com/450wm/wikagraphic/wikagraphic2010/wikagraphic201033018/157994086-initial-letter-fg-logotype-company-name-blue-circle-and-swoosh-design-vector-logo-for-business-and.jpg?ver=6"
            alt="F.G"
            style={{ width: "50px", borderRadius: "50%" }}
          />
        </Link>
        <h6 className="text-light">{`F.G ${username.toUpperCase()}`}</h6>
        {/* Navbar toggle for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/all-customers">
                All Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/all-admins">
                All Admins
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={() => { 
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = '/';
               }}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
