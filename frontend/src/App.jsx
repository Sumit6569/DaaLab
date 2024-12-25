import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import './index.css'; // Adjust the path if needed

import "bootstrap/dist/css/bootstrap.min.css";
import DaaLab from "./components/Lab/DaaLab.jsx";
import StudentSingUp from "./components/LoginSignup/Student/StudentSingUp.jsx";
import StudentLogin from "./components/LoginSignup/Student/StudentLogin.jsx";
import AdminLogin from "./components/LoginSignup/Admin/AdminLogin.jsx";
import TeacherLogin from "./components/LoginSignup/Teacher/TeacherLogin.jsx";
import TeacherSingUp from "./components/LoginSignup/Teacher/TeacherSingUp.jsx"
import StudentDashboard from "./components/Dashboard/StudentDashboard/StudentDashboard.jsx";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard/TeacherDashboard.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard/AdminDashboard.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import CreateAssing from "./components/Assingment/CreateAssing.jsx";
import AssignmentSubmit from "./components/Assingment/AssignmentSubmit.jsx";
import Footer from "../src/components/Footer/Footer.jsx";
import TeacherList from "./components/Dashboard/AdminDashboard/TeacherList.jsx";
import StudentList from "./components/Dashboard/AdminDashboard/StudentList.jsx";
// Check the path and extension

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDetails, loadStudents } from "./action/studentAction.js";
import { getTeacherDetails, loadTeachers } from "./action/teacherAction.js";
import { getUserType } from "./Utility/tokenUtils.js";
import LoginPage from "./components/LoginSignup/Helper/LoginPage.jsx";
import AssignmentDetails from "./components/Assingment/AssignmentDetails.jsx";

import {
  getActivityDetails,
  getAssignmentDetails,
  getSectionDetails,
  getStudentWorkDetails,
  loadAssignment,
} from "./action/assignmentAction.js";

function App() {
  const dispatch = useDispatch();
  const userType = getUserType();

  useEffect(() => {
    dispatch(getStudentDetails());
    dispatch(loadStudents());
    dispatch(loadTeachers());
    dispatch(getTeacherDetails());
    dispatch(loadAssignment());
    dispatch(getAssignmentDetails());
    dispatch(getSectionDetails());
    dispatch(getStudentWorkDetails());
    dispatch(getActivityDetails())
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => ({
    isAuthenticated:
      state.student?.isAuthenticated || state.teacher?.isAuthenticated,
  }));

  const { teacher} = useSelector((state) => state.teacher);
  const { teacherDetails } = useSelector((state) => state.teacherDetails)
  const { student} = useSelector((state) => state.student);
  const { studentDetails } = useSelector((state) => state.studentDetails)
  const { assignment } = useSelector((state) => state.assignment );
  const { section } = useSelector((state) => state.section );
  const { studentWork } = useSelector((state) => state.studentWork );
  const { activity } = useSelector((state) => state.activity );

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
          <Route path="/dashboard/student" element={isAuthenticated && userType === "student" ? <StudentDashboard student={student?.data} section={section?.data} assignment={assignment?.data} studentWork={studentWork?.data} /> : <StudentLogin />} />
          <Route path="/dashboard/teacher" element={isAuthenticated && userType === "teacher" ? <TeacherDashboard teacher={teacher?.data} section={section?.data} assignment={assignment?.data} studentWork={studentWork?.data} /> : <TeacherLogin />} />
          <Route path="/dashboard/admin" element={isAuthenticated && userType === "admin" ? <AdminDashboard  teacher={teacher?.data} studentDetails={studentDetails?.data} teacherDetails={teacherDetails?.data} activity={activity?.data} /> : <AdminLogin />} />
          <Route path="/daalab" element={<DaaLab />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSingUp />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/signup" element={<TeacherSingUp />} />
          <Route path="/createassingment" element={<CreateAssing />} />
          <Route path="/assignmentDetails" element={<AssignmentDetails teacherDetails={teacherDetails?.data} />} />
          <Route path="/submitassingment" element={<AssignmentSubmit />} />
          <Route path="/teacherlist" element={<TeacherList teacherDetails={teacherDetails?.data} />} />
          <Route path="/studentlist" element={<StudentList studentDetails={studentDetails?.data} section={section?.data} />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;



