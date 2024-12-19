import React, { useState } from "react";
import "./AssignmentSubmission.css";
const AssignmentSubmission = () => {
  

  return (
    <div className="create-assignment-container">
      <h2>Submit Assignment</h2>
      <form onSubmit={""} className="assignment-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="ROLL NUMBER"
            value={""}
            onChange={""}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={""}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Optional"
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload File:</label>
          <input type="file" id="file" onChange={""} />
        </div>
        
        <button type="submit" className="submit-button">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
