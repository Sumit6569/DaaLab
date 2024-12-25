import React from "react";
import "./StudentList.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { deleteStudent } from "../../../action/studentAction";

function StudentList({ studentDetails = [], section = {} }) {
  // Ensure section.data is initialized to an array if undefined
  const sectionData = Array.isArray(section) ? section : section.data || [];
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Create a lookup map for sections by ID to optimize performance
  const sectionMap = React.useMemo(() => {
    return sectionData.reduce((map, sec) => {
      map[sec._id] = sec.name;
      return map;
    }, {});
  }, [sectionData]);

  const handleDeleteStudent = async (studentId) => {
    try {
  
      const response = await dispatch(deleteStudent ({ studentId:studentId }));
      if (response.status === 200) {
        toast.success("Student delete Successfully!");

        navigate("/dashboard/admin");
      } else {
        toast.error( response?.data?.message || "Student delete failed!", "error");
        // setLoading(false); // Hide spinner if login fails
      }
    } catch (err) {
      toast.error( err.response?.data?.message || err.message || "Student delete failed!", "error");
      // setLoading(false); // Hide spinner after error
    }
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
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentDetails.map((student) => (
            <tr key={student._id}>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.branch}</td>
              <td>{sectionMap[student.sectionId] || "Unknown Section"}</td>
              <td>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#deleteModal-${student._id}`} >
                  Delete Student
                </button>
                  
                <div className="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" id={`deleteModal-${student._id}`}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3 className="modal-title fs-5" id="exampleModalLabel">Are you sure to delete student ?</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger"  onClick={() => handleDeleteStudent(student._id)}>Delete</button>
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

StudentList.propTypes = {
  studentDetails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),  
  section: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default StudentList;
