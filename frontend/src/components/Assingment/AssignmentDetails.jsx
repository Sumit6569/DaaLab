import React from "react";
import "./AssignmentDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteAssignment } from "../../action/assignmentAction";

const AssignmentDetails = ({teacherDetails=[]}) => {
  const dispatch=  useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { assignment, provider } = location.state || {};

  const teacherAssignmentDetails = React.useMemo(() => {
    const assignmentTeacher = teacherDetails.find((tech) => tech._id === assignment.teacher);
    return assignmentTeacher || [];
  }, [teacherDetails, assignment?._id]);
  
  const handleDeleteAssignment = async() =>{

    try {
          const response = await dispatch(deleteAssignment({ assignmentId: assignment._id }));
          if (response.status === 200) {
            toast.success("Assignment delete Successfully!");

            navigate("/dashboard/teacher");
          } else {
            toast.error(response?.data?.message || "Assignment delete failed!", "error");
            // setLoading(false); // Hide spinner if login fails
          }
        } catch (err) {
          toast.error(
            err.response?.data?.message || err.message || "Assignment delete failed!",
            "error"
          );
          // setLoading(false); // Hide spinner after error
        }
      };

  return (
    <div className="assignment-details">
      <h2 className="assignment-title">{assignment.title}</h2>
      <p className="assignment-description">{assignment.description}</p>
      <div className="assignment-info">
      <p>
          <strong>Assign Date:</strong> {assignment.createdAt.split('T')[0]}
        </p>
        <br/>
        <p>
          <strong>Due Date:</strong> {assignment.dueDate.split('T')[0]}
        </p>
        <br/>
        <p>
          <strong>Assigned By:</strong> {teacherAssignmentDetails.fullName}
        </p>
      </div>
      
      <div>
      <button
          type="button" className="btn btn-success"
          onClick={() => {
            const link = document.createElement("a");
            link.href = assignment.avatar;
            link.download = assignment.avatar || "assignment_file";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          View File
        </button>

        {provider === "teacher" ? (
          <>
            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Delete Assignment
            </button>
              
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title fs-5" id="exampleModalLabel">Are you sure to delete assignment ?</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={handleDeleteAssignment}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : 
          null
        }



      </div>
    </div>
  );
};

AssignmentDetails.propTypes = {
  teacherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};


export default AssignmentDetails;
