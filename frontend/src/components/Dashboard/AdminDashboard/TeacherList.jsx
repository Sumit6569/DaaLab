import React, { useState } from "react";
import "./TeacherList.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteTeacher } from "../../../action/teacherAction";
import PropTypes from "prop-types";


function TeacherList({teacherDetails=[]}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteTeacher = async (teacherId) => {
    try {
      
      const response = await dispatch( deleteTeacher({ teacherId:teacherId }));
      if (response.status === 200) {
        toast.success("Teacher delete Successfully!");

        navigate("/dashboard/admin");
      } else {
        toast.error( response?.data?.message || "Teacher delete failed!", "error");
        // setLoading(false); // Hide spinner if login fails
      }
    } catch (err) {
      toast.error( err.response?.data?.message || err.message || "Teacher delete failed!", "error");
      // setLoading(false); // Hide spinner after error
    }
  };
  
  return (
    <div className="teacher-list-container">
      <h2 className="teacher-list-title">Teachers List</h2>
      <Link to={"/teacher/signup"}>
        <button className="create-teacher-btn">
          Register New Teacher
        </button>
      </Link>
      <table className="teacher-list-table">
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Register Date</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teacherDetails.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.fullName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.provider}</td>
              <td>{teacher.createdAt.split('T')[0]}</td>
              <td>{teacher.branch || "CSE"}</td>
              <td>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#deleteModal-${teacher._id}`} >
                  Delete Teacher
                </button>
                  
                <div className="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" id={`deleteModal-${teacher._id}`}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3 className="modal-title fs-5" id="exampleModalLabel">Are you sure to delete teacher ?</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger"  onClick={() => handleDeleteTeacher(teacher._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TeacherList.propTypes = {
  teacherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),  
};

export default TeacherList;
