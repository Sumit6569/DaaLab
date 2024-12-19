import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon, // New icon for Completed Assignments
  ExclamationCircleIcon, // New icon for Pending Assignments
  UserGroupIcon, // Icon for Classmates
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
import Popup from "../../Popup.jsx";
import Loader from "../../Loader/Loader.jsx";
import "./StudentDashboard.css";

const performanceData = [
  { month: "Jan", grade: 75 },
  { month: "Feb", grade: 80 },
  { month: "Mar", grade: 78 },
  { month: "Apr", grade: 85 },
  { month: "May", grade: 90 },
  { month: "Jun", grade: 88 },
  { month: "Jul", grade: 92 },
  { month: "Aug", grade: 85 },
  { month: "Sep", grade: 87 },
  { month: "Oct", grade: 90 },
  { month: "Nov", grade: 93 },
  { month: "Dec", grade: 95 },
];

const recentActivities = [
  {
    id: 1,
    title: "Assignment 1: Introduction to Algorithms",
    date: "2023-10-01",
    status: "Completed",
  },
  {
    id: 2,
    title: "Assignment 2: Data Structures",
    date: "2023-10-05",
    status: "Completed",
  },
  {
    id: 3,
    title: "Assignment 3: Sorting Algorithms",
    date: "2023-10-10",
    status: "Pending",
  },
];

function StudentDashboard() {
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

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
          <nav className="dashboard-nav">
            <a href="/student/dashboard">Dashboard</a>
            <a href="/student/profile">Profile</a>
          </nav>
        </header>

        <div className="overview-cards">
          <div className="card completed-assignments">
            <CheckCircleIcon className="icon" /> {/* Updated Icon */}
            <div>
              <p className="card-value">5</p>
              <p className="card-label">Completed Assignments</p>
            </div>
          </div>
          <div className="card pending-assignments">
            <ExclamationCircleIcon className="icon" /> {/* Updated Icon */}
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

        <div className="performance-chart">
          <h2 className="chart-title">Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" domain={[70, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="grade"
                stroke="#3182ce"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
