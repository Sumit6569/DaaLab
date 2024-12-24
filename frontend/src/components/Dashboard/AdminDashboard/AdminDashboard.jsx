import React, { useEffect, useState } from "react";
import {
  UserGroupIcon, // Icon for Teachers and Students
  AcademicCapIcon, // Icon for Active Courses
} from "@heroicons/react/24/outline";
import Loader from "../../Loader/Loader.jsx";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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

function AdminDashboard({teacher={}, studentDetails=[], teacherDetails=[]}) {
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
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <nav className="dashboard-nav"></nav>
        </header>

        <div className="admin-details">
          <h2 className="admin-title">Admin Details</h2>
          <div className="admin-info">
            <p>
              <strong>Admin ID:</strong> {teacher._id}
            </p>
            <p>
              <strong>Full Name:</strong> {teacher.fullName}
            </p>
            <p>
              <strong>Email:</strong> {teacher.email}
            </p>
          </div>
        </div>

        <div className="overview-cards">
          <div className="card teachers">
            <UserGroupIcon className="icon" />
            <Link to="/teacherlist">
              <div>
                <p className="card-value">{teacherDetails.length}</p>
                <p className="card-label">Total Teachers</p>
              </div>
            </Link>
          </div>

          <div className="card students">
            <UserGroupIcon className="icon" />
            <Link to="/studentlist">
              <div>
                <p className="card-value">{studentDetails.length}</p>
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


AdminDashboard.propTypes = {
  teacher: PropTypes.object,
  assignment: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      sectionId: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  studentDetails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      sectionId: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  teacherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      sectionId: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  )
};


export default AdminDashboard;
