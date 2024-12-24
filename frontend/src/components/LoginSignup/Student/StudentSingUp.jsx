import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./StudentSignup.css";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { studentRegister } from "../../../action/studentAction";
import Slider from "../../Slider/Slider";

function StudentSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setconformPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleGoogleLogin = () => {
    console.log("Google login triggered");
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault();
    // setLoading(true);

    const myForm = new FormData();

    myForm.append("fullName", fullName);
    myForm.append("email", email);
    myForm.append("branch", branch);
    myForm.append("sectionName", sectionName);
    myForm.append("password", password);
    myForm.append("conformPassword", conformPassword);
    myForm.append("avatar", avatar);

    try {
      const response = await dispatch(studentRegister(myForm));
      if (response.status === 200) {
        toast.success("Student register Successfully!");
        setfullName("");
        setEmail("");
        setPassword("");
        setconformPassword("");
        setBranch("");
        setSectionName("");
        setAvatar("");
        // setLoading(false); // Hide spinner after successful login
        navigate("/student/login");
      } else {
        toast.error(response?.data?.message || "Login failed!", "error");
        // setLoading(false); // Hide spinner if login fails
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Login failed!",
        "error"
      );
      // setLoading(false); // Hide spinner after error
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Slider /> {/* Background Slider */}
      <div className="container2">
        <div className="inner-container2">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>

          <p className="title">Signup as a Student</p>

          <form onSubmit={handleStudentSignup}>
            <div className="form">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="fullName"
                id="fullName"
                placeholder="* Enter name"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="* Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form">
              <label htmlFor="branch">Branch:</label>
              <select className="form-select" id="branch" onChange={(e) => setBranch(e.target.value)} >
                <option selected>* Choose Branch</option>
                <option value="CSE" >CSE</option>
              </select>
            </div>

            <div className="form">
              <label htmlFor="sectionName">Section:</label>
              <select className="form-select" id="sectionName" onChange={(e) => setSectionName(e.target.value)}>
                <option selected>* Choose Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="form">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="* Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="form">
              <label htmlFor="conformPassword">Conform Password:</label>
              <input
                type="password"
                id="conformPassword"
                placeholder="* Enter conform password"
                value={conformPassword}
                onChange={(e) => setconformPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="form">
              <label htmlFor="avatar">Profile Image: </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
              />
            </div>
            <div className="form">
              <button type="submit" className="submit-button">
                Login
              </button>
            </div>
          </form>

          <div id="auth-account">
            <p className="mt-2 separator">
              <span></span> <b>Or</b> <span></span>
            </p>
           
          </div>

          <div className="tst">
            Already have an Account?{" "}
            <Link to="/student/login" className="sign-up-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSignUp;
