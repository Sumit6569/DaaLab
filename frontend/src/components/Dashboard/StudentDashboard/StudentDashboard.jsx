import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader.jsx";

import "./StudentDashboard.css";
import PropTypes from "prop-types";


function StudentDashboard({student={}, section=[], assignment=[], studentWork=[]}) {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

    const sectionData = section || [];
  
    // Create a lookup map for sections by ID to optimize performance
    const sectionMap = React.useMemo(() => {
      return sectionData.reduce((map, sec) => {
        map[sec._id] = sec.name;
        return map;
      }, {});
    }, [sectionData]);

    const studentSection = sectionMap[student.sectionId]

    console.log("studentWork", sectionMap);
    
    // Assignments with section 
    const studentSectionAssignments = React.useMemo(() => {
      const studentSection = section.find((sec) => sec._id === student.sectionId);
      
      return studentSection?.assignments || [];
    }, [section, student.sectionId]);

    // No. of student in section
    const studentInSection = React.useMemo(() => {
      const studentSection = section.find((sec) => sec._id === student.sectionId);
      
      return studentSection.students.length;
    }, [section, student.sectionId]);
    

    
    const sectionAssignments = React.useMemo(() => {
      // Filter assignments whose IDs are in studentSectionAssignments
      return assignment.filter((assign) => studentSectionAssignments.includes(assign._id));
    }, [assignment, studentSectionAssignments]);
    

    const studentWorkData = React.useMemo(() => {
      return studentWork.filter((work) => work.students === student._id)
    }, [studentWork, student._id])



    // console.log(sectionAssignments);
    const pendingAssignmentsCount = React.useMemo(() => {
      return sectionAssignments.filter((assignment) => {
        // Find matching studentWork by checking nested assignments
        const matchingStudentWork = studentWork.find((work) =>
          work.assignments.some((assign) => assign._id === assignment._id) // Check if assignment ID matches
        );
    
        // Count as pending if no work is submitted or status is "Pending"
        return !matchingStudentWork || matchingStudentWork.status === "Pending";
      }).length; // Get the count of pending assignments
    }, [sectionAssignments, studentWork]);

    const handleSubmitAssignment = (assignmentId) => {
      navigate("/submitassingment", {
        state: { assignmentId: assignmentId },
      });
    };


    const handleAssignmentDetails = (assignmentDetails) => {
      const provider = student.provider
      navigate("/assignmentDetails", {
        state: { assignment: assignmentDetails, provider: provider },
      });
      
    };

  useEffect(() => {
    setLoader(true);
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // console.log( assignment )
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
              <strong>Student ID:</strong> {student._id}
            </p>
            <p>
              <strong>Full Name:</strong> {student.fullName}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Branch:</strong> {student.branch}
            </p>
            <p>
              <strong>Section:</strong> {studentSection}
            </p>
          </div>
        </div>

        <div className="overview-cards">
          <div className="card completed-assignments">
            <CheckCircleIcon className="icon" />
            <div>
              <p className="card-value">{sectionAssignments.length-pendingAssignmentsCount}</p>
              <p className="card-label">Completed Assignments</p>
            </div>
          </div>
          <div className="card pending-assignments">
            <ExclamationCircleIcon className="icon" />
            <div>
              <p className="card-value">{pendingAssignmentsCount} </p>
              <p className="card-label">Pending Assignments</p>
            </div>
          </div>
          <div className="card classmates">
            <UserGroupIcon className="icon" />
            <div>
              <p className="card-value">{studentInSection}</p>
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
                <th>Submited work</th>
                <th>Submitted At</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              
              {sectionAssignments.map((assignment) => {

                // Find the matching studentWork data using studentWorkId
                const matchingStudentWork = studentWork.find((work) => {
                  return work._id.toString() === assignment.studentWorkId?.toString();
                });

                return (
                  <tr key={assignment._id}>
                    <td>
                        <button onClick={() => handleAssignmentDetails(assignment)}> {assignment.title} </button>
                    </td>
                    <td>{assignment.createdAt.split("T")[0]}</td>
                    <td>{assignment.dueDate.split("T")[0]}</td>
                    <td>
                      {matchingStudentWork &&
                        matchingStudentWork.avatar ? (
                          <a href={matchingStudentWork.avatar}>
                            <img
                              className="workImg"
                              src={matchingStudentWork.avatar}
                              alt="Student Work"
                            />
                          </a>
                        ) : (
                          <span>No work submitted</span>
                      )}
                    </td>
                    <td>{matchingStudentWork?.submitedAt.split("T")[0]}</td>
                    <td className={`status ${matchingStudentWork?.status.toLowerCase() || "unknown"}`}>
                    <button onClick={() => handleSubmitAssignment(assignment._id)}>
                      {matchingStudentWork?.status || "Pending"}
                    </button>
                      {/* <Link to="/submitassingment">{matchingStudentWork?.status || "Pending"}</Link> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}


StudentDashboard.propTypes = {
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


export default StudentDashboard;
