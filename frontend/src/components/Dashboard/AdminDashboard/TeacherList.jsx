import React, { useState } from "react";
import "./TeacherList.css";
import { Link } from "react-router-dom";
const initialTeachers = [
  {
    id: 1,
    teacherName: "John Doe",
    email: "john.doe@example.com",
    department: "Math",
  },
  {
    id: 2,
    teacherName: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Science",
  },
  {
    id: 3,
    teacherName: "Alice Brown",
    email: "alice.brown@example.com",
    department: "English",
  },
];

function TeacherList() {
  const [teachers, setTeachers] = useState(initialTeachers);

  const handleDelete = (id) => {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(updatedTeachers);
  };

  const handleCreateTeacher = () => {
    // Logic for creating a new teacher, for now let's log a message
    console.log("Creating new teacher...");
  };

  return (
    <div className="teacher-list-container">
      <h2 className="teacher-list-title">Teachers List</h2>
      <Link to={"/teacher/signup"}>
        <button className="create-teacher-btn" onClick={handleCreateTeacher}>
          Create New Teacher
        </button>
      </Link>
      <table className="teacher-list-table">
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.teacherName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.department}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(teacher.id)}
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

export default TeacherList;
