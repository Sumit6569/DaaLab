import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import './index.css'; // Adjust the path if needed

import "bootstrap/dist/css/bootstrap.min.css";
import DaaLab from "./components/Lab/DaaLab.jsx";
import StudentSingUp from "./components/Student/StudentSingUp.jsx";
import StudentLogin from "./components/Student/StudentLogin.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import TeacherLogin from "./components/Teacher/TeacherLogin.jsx";
import TeacherSingUp from "./components/Teacher/TeacherSingUp.jsx";
import StudentDashboard from "./components/Dashboard/StudentDashboard/StudentDashboard.jsx";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard/TeacherDashboard.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard/AdminDashboard.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
// Check the path and extension

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDetails, loadStudents } from "./action/studentAction.js";
import { getTeacherDetails, loadTeachers } from "./action/teacherAction.js";
import {
  getAssignmentDetails,
  getSectionDetails,
  getStudentWorkDetails,
  loadAssignment,
} from "./action/assignmentAction.js";
import LoginPage from "./components/Helper/LoginPage.jsx";
import CreateAssing from "./components/Assingment/CreateAssing.jsx";
import DetailOfAssingment from "./components/Assingment/DetailOfAssingment.jsx";
import AssignmentSubmit from "./components/Assingment/AssignmentSubmit.jsx";
import Footer from "../src/components/Footer/Footer.jsx";
import TeacherList from "./components/Dashboard/AdminDashboard/TeacherList.jsx";
import StudentList from "./components/Dashboard/AdminDashboard/StudentList.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudentDetails());
    dispatch(getTeacherDetails());
    dispatch(loadStudents());
    dispatch(loadTeachers());
    dispatch(loadAssignment());
    dispatch(getAssignmentDetails());
    dispatch(getSectionDetails());
    dispatch(getStudentWorkDetails());
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => ({
    isAuthenticated:
      state.student?.isAuthenticated || state.teacher?.isAuthenticated,
  }));

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/daalab" element={<DaaLab />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSingUp />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/signup" element={<TeacherSingUp />} />
          <Route path="/createassingment" element={<CreateAssing />} />
          <Route
            path="/student/detailsofassing"
            element={<DetailOfAssingment />}
          />
          <Route path="/submitassingment" element={<AssignmentSubmit />} />
          <Route path="/teacherlist" element={<TeacherList />} />
          <Route path="/studentlist" element={<StudentList />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
