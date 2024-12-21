import React, { useState } from "react";
import "./StudentList.css";
import { Link } from "react-router-dom";

const initialStudents = [
  {
    id: 1,
    studentName: "Emily Johnson",
    email: "emily.johnson@example.com",
    grade: "CSE",
  },
  {
    id: 2,
    studentName: "Michael Brown",
    email: "michael.brown@example.com",
    grade: "MECH",
  },
  {
    id: 3,
    studentName: "Sophia Davis",
    email: "sophia.davis@example.com",
    grade: "ECE",
  },
];

function StudentList() {
  const [students, setStudents] = useState(initialStudents);

  const handleDelete = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const handleCreateStudent = () => {
    console.log("Creating new student...");
  };

  return (
    <div className="student-list-container">
      <h2 className="student-list-title">Students List</h2>
     
      <table className="student-list-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.email}</td>
              <td>{student.grade}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
