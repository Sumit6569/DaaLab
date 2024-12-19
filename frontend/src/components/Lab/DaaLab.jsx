import React from "react";
import "./Daalab.css";

const Daalab = () => {
  const units = [
    { id: 1, title: "Unit 1: Introduction to Programming" },
    { id: 2, title: "Unit 2: Data Structures" },
    { id: 3, title: "Unit 3: Algorithms" },
    { id: 4, title: "Unit 4: Web Development" },
    { id: 5, title: "Unit 5: Database Management" },
  ];

  const handleDownload = () => {
    // Logic to download the syllabus
    const link = document.createElement("a");
    link.href = "/path/to/syllabus.pdf"; // Replace with your syllabus path
    link.download = "syllabus.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="daalab-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <h2>Course Units</h2>
        <ul>
          {units.map((unit) => (
            <li key={unit.id}>{unit.title}</li>
          ))}
        </ul>
        <button className="download-button" onClick={handleDownload}>
          Download Syllabus
        </button>
      </div>

      {/* Main Content Section */}
      <div className="content">
        <h1>Welcome to Daalab</h1>
        <p>
          This is where the main content of the Daalab component will be
          displayed. You can explore different units on the sidebar.
        </p>
      </div>
    </div>
  );
};

export default Daalab;
