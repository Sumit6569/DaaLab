import React, { useState } from "react";
import "./AssignmentSubmission.css";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { submitAssignment } from "../../action/assignmentAction";
const AssignmentSubmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { assignmentId } = location.state || {};
  console.log("as submit", assignmentId);

  const [avatar, setAvatar] = useState("");

  const handleAssignmentSubmit = async(e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.append("avatar", avatar);
    myForm.append("assignmentId", assignmentId)

    console.log(avatar)
    
    try {
      const response = await dispatch(submitAssignment(myForm));
      if(response.status === 200) {
        toast.success("assignment submit Successfully!");
        setAvatar("");

        navigate("/dashboard/student")
      } else {
        toast.error(response?.data?.message || "Submit assignment fail!")
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Submit assignment failed!",
        "error"
      );
    }
  };

  return (
    <div className="create-assignment-container">
      <h2>Submit Assignment</h2>
      <form onSubmit={handleAssignmentSubmit} className="assignment-form">
        <div className="form-group">
          <label htmlFor="file">Upload File:</label>
          <input 
            type="file" 
            id="avatar" 
            name="avatar"
            onChange={(e) => setAvatar(e.target.files[0])} 
          />
        </div>
        
        <button type="submit" className="submit-button">
          Submit Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
