import React, { useState } from "react";
import "./CreateAssing.css";

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  const sections = [
    { id: 1, name: "Section A" },
    { id: 2, name: "Section B" },
    { id: 3, name: "Section C" },
  ];

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSectionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSections((prev) =>
      checked ? [...prev, value] : prev.filter((section) => section !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);
    formData.append("sections", selectedSections);

    console.log("Submitting assignment:", {
      title,
      description,
      file: file?.name || null,
      sections: selectedSections,
    });

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
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter assignment title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter assignment description"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload File</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Assign Sections</label>
          {sections.map(({ id, name }) => (
            <div key={id} className="checkbox-group">
              <input
                type="checkbox"
                id={`section-${id}`}
                value={name}
                checked={selectedSections.includes(name)}
                onChange={handleSectionChange}
              />
              <label htmlFor={`section-${id}`}>{name}</label>
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
