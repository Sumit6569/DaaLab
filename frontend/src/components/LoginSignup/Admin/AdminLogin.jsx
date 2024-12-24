import React, { useState } from "react";
import "../Teacher/TeacherSingUp"; // Corrected CSS import to match the file name
import Slider from "../../Slider/Slider";
import { adminLogin } from "../../../action/teacherAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    // setLoading(true);

    const myForm = new FormData();

    myForm.append("email", email);
    myForm.append("password", password);

    try {
      const response = await dispatch(adminLogin(myForm));
      if (response.status === 200) {
        toast.success("Login Successfully!");
        setEmail("");
        setPassword("");
        // setLoading(false); // Hide spinner after successful login
        navigate("/");
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
      <div className="container">
        <div className="inner-container">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>

          <p className="title">Login as an Admin</p>

          <form onSubmit={handleAdminSignup}>
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
              <button type="submit" className="submit-button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
