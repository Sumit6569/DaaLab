import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom"
import { logout } from "../../action/teacherAction";
import { getUserType } from "../../Utility/tokenUtils";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = getUserType();

  const { isAuthenticated } = useSelector((state) => ({
    isAuthenticated: state.student?.isAuthenticated || state.teacher?.isAuthenticated,
  }));
  
  
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    // setLoading(true);
    await dispatch(logout());
    // setLoading(false);

    navigate("/")
  };

  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <nav className="navbar sticky-top">
      <div className="nav-container">
        <a className="img" href="/">
          <img src="/logo.png" alt="Logo" width="130px" height="70px" />
        </a>

        {/* Toggle Menu Icon */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {isNavOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <div className={`navbar-nav ${isNavOpen ? "active" : ""}`}>
          <div className="nav-comp">
            <div
              className={`nav-link dropdown ${isDropdownOpen ? "open" : ""}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <a href="#!" className="dropdown-toggle" onClick={toggleDropdown}>
                Virtual Lab
              </a>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <a href="/daalab">DAA Lab</a>
                </div>
              )}
            </div>

            <a className="nav-link" href="/">
              Home
            </a>

            <a className="nav-link" href="/createassingment">
              {" "}
              About Us{" "}
            </a>
            <a className="nav-link" href="/detailsofassing">
              {" "}
              Contact{" "}
            </a>

            {isAuthenticated ? (
              <>
                <a href="/">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    {" "}
                    Logout{" "}
                  </button>
                </a>
              </>
            ) : (
              <>
                <a href="/loginPage">
                  <button
                    type="button"
                    className="btn btn-primary"
                    href="/loginPage"
                  >
                    {" "}
                    Login{" "}
                  </button>
                </a>
              </>
            )}
          </div>

          <div className="customDropdown">
            <img
              className="customProfileUser"
              data-bs-toggle="dropdown"
              width="60px"
              height="60px"
              src="/Profile.png"
              alt="User"
            />

            <ul className="customDropdownMenu">
              {isAuthenticated ? (
                <>
                  {userType === "teacher" && (
                    <a href="/dashboard/teacher">
                      <button className="customDropdownItem">
                        Teacher Dashboard
                      </button>
                    </a>
                  )}
                  {userType === "student" && (
                    <a href="/dashboard/student">
                      <button className="customDropdownItem">
                        Student Dashboard
                      </button>
                    </a>
                  )}
                  {userType === "admin" && (
                    <a href="/dashboard/admin">
                      <button className="customDropdownItem">
                        Admin Dashboard
                      </button>
                    </a>
                  )}
                </>
              ) : (
                <>
                  <a href="/dashboard/teacher">
                    <button className="customDropdownItem">
                      Teacher Dashboard
                    </button>
                  </a>
                  <a href="/dashboard/student">
                    <button className="customDropdownItem">
                      Student Dashboard
                    </button>
                  </a>
                  <a href="/dashboard/admin">
                    <button className="customDropdownItem">
                      Admin Dashboard
                    </button>
                  </a>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
