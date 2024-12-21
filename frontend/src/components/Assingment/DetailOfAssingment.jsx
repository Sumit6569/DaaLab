import React from "react";
import "./AssignmentDetails.css";

const AssignmentDetails = ({ assignment }) => {
  return (
    <div className="assignment-details">
      <h2 className="assignment-title">assignment.title</h2>
      <p className="assignment-description">assignment.description</p>
      <div className="assignment-info">
        <p>
          <strong>Due Date:</strong> assignment.dueDate
        </p>
        <p>
          <strong>Assigned By:</strong> assignment.assignedBy
        </p>
        <p>
          <strong>Status:</strong> assignment.status
        </p>
      </div>
      
        <button
          className="download-button"
          onClick={() => {
            const link = document.createElement("a");
            link.href = assignment.fileUrl;
            link.download = assignment.fileName || "assignment_file";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download File
        </button>
 
    </div>
  );
};

export default AssignmentDetails;
