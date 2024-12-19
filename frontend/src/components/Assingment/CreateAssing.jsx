import React, { useState } from "react";
import "./CreateAssing.css"; // Import the CSS file

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  // Sample sections (you can replace this with your actual data)
  const sections = [
    { id: 1, name: "Section A" },
    { id: 2, name: "Section B" },
    { id: 3, name: "Section C" },
  ];

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSectionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSections((prev) => [...prev, value]);
    } else {
      setSelectedSections((prev) =>
        prev.filter((section) => section !== value)
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }
    formData.append("sections", selectedSections);

    // Here you would typically send the formData to your server
    console.log("Submitting assignment:", {
      title,
      description,
      file: file ? file.name : null,
      sections: selectedSections,
    });

    // Reset the form
    setTitle("");
    setDescription("");
    setFile(null);
    setSelectedSections([]);
  };

  return (
    <div className="create-assignment-container">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload File:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Assign Sections:</label>
          {sections.map((section) => (
            <div key={section.id}>
              <input
                type="checkbox"
                id={`section-${section.id}`}
                value={section.name}
                checked={selectedSections.includes(section.name)}
                onChange={handleSectionChange}
              />
              <label htmlFor={`section-${section.id}`}>{section.name}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
