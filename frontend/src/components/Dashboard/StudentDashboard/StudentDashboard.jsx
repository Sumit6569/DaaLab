import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader.jsx";

import "./StudentDashboard.css";

const recentActivities = [
  {
    id: 1,
    title: "Assignment 1: Introduction to Algorithms",
    assignDate: "2023-09-25",
    dueDate: "2023-10-01",
    status: "Completed",
  },
  {
    id: 2,
    title: "Assignment 2: Data Structures",
    assignDate: "2023-09-30",
    dueDate: "2023-10-05",
    status: "Completed",
  },
  {
    id: 3,
    title: "Assignment 3: Sorting Algorithms",
    assignDate: "2023-10-06",
    dueDate: "2023-10-10",
    status: "Pending",
  },
];

function StudentDashboard() {
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Mock student data
  const student = {
    fullName: "John Doe",
    id: "12345",
    email: "johndoe@example.com",
    branch: "Computer Science",
    avatar: "https://via.placeholder.com/150", // Placeholder avatar
    provider: "Google",
  };

  useEffect(() => {
    setLoader(true);
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loader && <Loader />}
      {showPopup && (
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
          type="error"
        />
      )}
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
        </header>

        {/* Student Details Section */}
        <div className="student-details">
          <div className="student-avatar">
            <img src={student.avatar} alt="Student Avatar" />
          </div>
          <div className="student-info">
            <p>
              <strong>Full Name:</strong> {student.fullName}
            </p>
            <p>
              <strong>Student ID:</strong> {student.id}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Branch:</strong> {student.branch}
            </p>
            <p>
              <strong>Provider:</strong> {student.provider}
            </p>
          </div>
        </div>

        <div className="overview-cards">
          <div className="card completed-assignments">
            <CheckCircleIcon className="icon" />
            <div>
              <p className="card-value">5</p>
              <p className="card-label">Completed Assignments</p>
            </div>
          </div>
          <div className="card pending-assignments">
            <ExclamationCircleIcon className="icon" />
            <div>
              <p className="card-value">2</p>
              <p className="card-label">Pending Assignments</p>
            </div>
          </div>
          <div className="card classmates">
            <UserGroupIcon className="icon" />
            <div>
              <p className="card-value">20</p>
              <p className="card-label">Classmates</p>
            </div>
          </div>
        </div>

        <div className="activities-table">
          <h2 className="table-title">Recent Activities</h2>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Assign Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>{activity.assignDate}</td>
                  <td>{activity.dueDate}</td>
                  <td className={`status ${activity.status.toLowerCase()}`}>
                    <Link to="/submitassingment">{activity.status}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
