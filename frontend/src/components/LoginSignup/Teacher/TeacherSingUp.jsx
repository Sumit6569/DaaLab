import React, { useState } from 'react';
import './TeacherSignUp.css'; // Corrected CSS import to match the file name

import {useDispatch} from "react-redux";

import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';
import Slider from '../../Slider/Slider';
import { teacherRegister } from '../../../action/teacherAction';

function TeacherSignUp() {
  const  dispatch = useDispatch()
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [password, setPassword] = useState('');
  const [conformPassword, setConformPassword] = useState('');

    const handleTeacherSignup = async (e) => {
      e.preventDefault();
      
      
      const myForm = new FormData();
  
      myForm.append("fullName", fullName);
      myForm.append("email", email);
      myForm.append("branch", branch);
      myForm.append("password", password);
      myForm.append("conformPassword", conformPassword)

      try {
        const response = await dispatch(teacherRegister(myForm));
        if (response.status === 200) {
            toast.success("Teacher register Successfully!");
            setFullName('');
            setEmail('');
            setBranch('');
            setPassword('');
            setConformPassword('');

            // setLoading(false); 
            navigate("/teacherlist")
        } else {
            toast.error(response?.data?.message || "Login failed!", 'error');
            // setLoading(false); // Hide spinner if login fails
        }
      } catch (err) {
          toast.error(err.response?.data?.message || err.message || 'Login failed!', 'error');
          // setLoading(false); // Hide spinner after error
      }
    };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Slider /> {/* Background Slider */}
      <div className="container">
        <div className="inner-container">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>

          <p className="title">Signup new Teacher</p>

          <form onSubmit={handleTeacherSignup}>
            <div className="form">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="fullName"
                id="fullName"
                placeholder="* Enter name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                type="conformPassword"
                id="conformPassword"
                placeholder="* Enter conform password"
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form">
              <button type="submit" className="submit-button">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherSignUp;
