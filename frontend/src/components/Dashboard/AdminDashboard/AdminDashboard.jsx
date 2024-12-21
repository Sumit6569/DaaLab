import React, { useEffect, useState } from "react";
import {
  UserGroupIcon, // Icon for Teachers and Students
  AcademicCapIcon, // Icon for Active Courses
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Loader from "../../Loader/Loader.jsx";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

const performanceData = [
  { month: "Jan", metric: 50 },
  { month: "Feb", metric: 60 },
  { month: "Mar", metric: 55 },
  { month: "Apr", metric: 70 },
  { month: "May", metric: 75 },
  { month: "Jun", metric: 80 },
  { month: "Jul", metric: 85 },
  { month: "Aug", metric: 78 },
  { month: "Sep", metric: 80 },
  { month: "Oct", metric: 85 },
  { month: "Nov", metric: 90 },
  { month: "Dec", metric: 95 },
];

const recentActivities = [
  {
    id: 1,
    title: "Added New Teacher: John Doe",
    date: "2023-12-01",
    status: "Completed",
  },
  {
    id: 2,
    title: "Reviewed Student Feedback",
    date: "2023-12-05",
    status: "Pending",
  },
  {
    id: 3,
    title: "Published New Course: React Basics",
    date: "2023-12-10",
    status: "Completed",
  },
];

function AdminDashboard() {
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Sample admin details (can be fetched from an API or passed as props)
  const adminDetails = {
    id: "A123",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
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
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <nav className="dashboard-nav"></nav>
        </header>

        <div className="admin-details">
          <h2 className="admin-title">Admin Details</h2>
          <div className="admin-info">
            <p>
              <strong>Admin ID:</strong> {adminDetails.id}
            </p>
            <p>
              <strong>Full Name:</strong> {adminDetails.fullName}
            </p>
            <p>
              <strong>Email:</strong> {adminDetails.email}
            </p>
          </div>
        </div>

        <div className="overview-cards">
          <div className="card teachers">
            <UserGroupIcon className="icon" />
            <Link to="/teacherlist">
              <div>
                <p className="card-value">10</p>
                <p className="card-label">Total Teachers</p>
              </div>
            </Link>
          </div>

          <div className="card students">
            <UserGroupIcon className="icon" />
            <Link to="/studentlist">
              <div>
                <p className="card-value">150</p>
                <p className="card-label">Total Students</p>
              </div>
            </Link>
          </div>

          <div className="card courses">
            <AcademicCapIcon className="icon" />
            <div>
              <p className="card-value">25</p>
              <p className="card-label">Active Courses</p>
            </div>
          </div>
        </div>

        <div className="activities-table">
          <h2 className="table-title">Recent Activities</h2>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>{activity.date}</td>
                  <td className={`status ${activity.status.toLowerCase()}`}>
                    {activity.status}
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

export default AdminDashboard;
