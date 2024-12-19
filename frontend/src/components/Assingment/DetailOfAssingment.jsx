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
    </div>
  );
};

export default AssignmentDetails;
