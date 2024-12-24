import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaBars, FaTimes } from "react-icons/fa";
import "./TeacherDashboard.css";
import { Link, useNavigate } from "react-router-dom";
function TeacherDashboard({ teacher = {}, section = [], assignment = [], studentWork = []}) {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(true); // Toggle for sidebar visibility
  const [selectedSection, setSelectedSection] = useState(null); // Currently selected section
  const [selectedStudents, setSelectedStudents] = useState([]); // Students in selected section
  const [selectedAssignment, setSelectedAssignment] = useState(null); // Currently selected assignment
  const [selectedAssignmentWork, setSelectedAssignmentWork] = useState([]); // Submissions for selected assignment

  // Handles the selection of a section, resetting assignment selection when a new section is chosen
  const handleSectionSelect = (sec) => {
    if (selectedSection?._id !== sec._id) {
      setSelectedSection(sec);
      setSelectedStudents(sec.students || []); // Populate students in selected section
      setSelectedAssignment(null); // Reset assignment selection
      setSelectedAssignmentWork([]); // Clear assignment work data
    }
  };

  // Toggles the sidebar visibility
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // Filters assignments to show only those relevant to the selected section
  const filteredAssignments =
    assignment && selectedSection
      ? assignment.filter((item) =>
          item.sectionId.some((sec) => sec._id === selectedSection._id)
        )
      : [];

  // Assignment Details page redirect
  const handleAssignmentDetails = (assignmentDetails) => {
    const provider = teacher.provider
    navigate("/assignmentDetails", {
      state: { assignment: assignmentDetails, provider:provider },
    });
  };

  // Handles assignment selection and loads work data for selected assignment
  const handleAssignmentClick = (assignmentId) => {
    const workForAssignment = studentWork.filter((work) =>
      work.assignments.some((assign) => assign._id === assignmentId)
    );
    setSelectedAssignmentWork(workForAssignment); // Set relevant student work
    const assignmentDetails = assignment.find(
      (assign) => assign._id === assignmentId
    );
    setSelectedAssignment(assignmentDetails); // Set selected assignment details
  };

  const [totalSubmitted, setTotalSubmitted] = useState(0); // State to track total submissions

  // Calculates total submissions based on students displayed in the selected section
  useEffect(() => {
    const countSubmissions = selectedStudents.reduce((count, student) => {
      const studentWorkForAssignment = selectedAssignmentWork.find(
        (work) => work.students === student._id
      );
      return studentWorkForAssignment ? count + 1 : count; // Increment count if submission exists
    }, 0);
    setTotalSubmitted(countSubmissions); // Update state with submission count
  }, [selectedStudents, selectedAssignmentWork]);

  const totalStudents = selectedStudents.length; // Total students in selected section
  const leftSubmission = totalStudents - totalSubmitted; // Calculate remaining submissions

  return (
    <div className="teacher-dash">
      {/* Button to toggle sidebar */}
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{ left: showSidebar ? "12rem" : "1rem" }}
      >
        {showSidebar ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar for selecting sections */}
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <div className="dashboard-menu">
          <h2>Dashboard</h2>
          <div className="menu-item">
            <span>Section</span>
            <ul>
              {section.length > 0 ? (
                section.map((sec) => (
                  <li key={sec._id} onClick={() => handleSectionSelect(sec)}>
                    Section {sec.name}
                  </li>
                ))
              ) : (
                <li>No sections available</li>
              )}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <Link to="/createassingment">
            <button className="create-assignment-btn">Create Assignment</button>
          </Link>
        </div>
      </div>

      {/* Main content area */}
      <div className={`main-content ${showSidebar ? "sidebar-open" : ""}`}>
        <div className="header">
          <div>
            <span>Teacher Dashboard</span>
            <span>
              Welcome back, <b>{teacher.fullName}</b>
            </span>

            <div className="teacher-info">
              <span></span>
              <span>
                <strong>Teacher ID:</strong> {teacher._id}
              </span>
              <span>
                <strong>Email:</strong> {teacher.email}
              </span>
              <span>
                <strong>Department:</strong> {teacher.branch}
              </span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Display cards for selected section, total students, and submission counts */}
        <div className="component">
          <div className="card">
            <div className="card-header section">
              Section {selectedSection?.name || "N/A"}
            </div>
            <br />
            <div className="card-header section">
              {selectedAssignment
                ? selectedAssignment.title
                : "Select an Assignment"}
            </div>
          </div>
          <div className="card">
            <div className="card-header total-students">Total Students</div>
            <div className="card-content">{totalStudents}</div>
          </div>
          <div className="card">
            <div className="card-header total-submitted">Total Submitted</div>
            <div className="card-content">{totalSubmitted}</div>
          </div>
          <div className="card">
            <div className="card-header left-submission">Left Submission</div>
            <div className="card-content">{leftSubmission}</div>
          </div>
        </div>

        {/* Display available assignments for selected section */}
        <div className="assignment">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((item, index) => (
              <div
                className="assign"
                key={item._id || index}
                onClick={() => handleAssignmentClick(item._id)}
              >
                <span>{item.title || `Assignment ${index + 1}`}</span>
                {/* <Link to={"/student/detailsofassing"}> */}
                <button onClick={() => handleAssignmentDetails(item)}>
                  {" "}
                  View
                </button>
                {/* </Link> */}
              </div>
            ))
          ) : (
            <p>No assignments available for this section.</p>
          )}
        </div>

        {/* Table displaying student details and their submission status */}
        <div className="student-info">
          <h3>Students in Section {selectedSection?.name || "N/A"}</h3>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Submitted Date</th>
              <th>Work</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedStudents.length > 0 ? (
              selectedStudents.map((student) => {
                // Find work submitted by the student for the selected assignment
                const studentWorkForAssignment = selectedAssignmentWork.find(
                  (work) => work.students === student._id
                );

                return (
                  <tr key={student._id}>
                    <td>
                      <div className="student-info">
                        <span className="stat">{student.fullName}</span>
                        <span className="email">{student.email}</span>
                      </div>
                    </td>
                    <td className="submitted-date">
                      {studentWorkForAssignment
                        ? studentWorkForAssignment.submitedAt.split('T')[0]
                        : "Not submitted"}
                    </td>
                    <td className="student-work">
                      {studentWorkForAssignment &&
                      studentWorkForAssignment.avatar ? (
                        <a href={studentWorkForAssignment.avatar}>
                          <img
                            className="workImg"
                            src={studentWorkForAssignment.avatar}
                            alt="Student Work"
                          />
                        </a>
                      ) : (
                        <span>No work submitted</span>
                      )}
                    </td>
                    <td className="status">
                      {studentWorkForAssignment
                        ? studentWorkForAssignment.status
                        : "Pending"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No students available for this section.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

TeacherDashboard.propTypes = {
  teacher: PropTypes.object,
  section: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  assignment: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      sectionId: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  studentWork: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      sectionId: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default TeacherDashboard;
