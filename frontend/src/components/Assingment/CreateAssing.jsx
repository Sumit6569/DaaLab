import React, { useState } from "react";
import "./CreateAssing.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAssignment } from "../../action/assignmentAction";

const CreateAssignment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [avatar, setAvatar] = useState("");
  const [sectionName, setSectionName] = useState([]);

  const sections = [{ name: "A" }, { name: "B" }, { name: "C" }];


  const handleSectionChange = (e) => {
    const { value, checked } = e.target;
    setSectionName((prev) =>
      checked ? [...prev, value] : prev.filter((section) => section !== value)
    );
  };

  const handleAssignmentSubmit = async(e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("dueDate", dueDate);
    myForm.append("avatar", avatar);
    // myForm.append("sectionName", sectionName);
  // Append each sectionName separately
  sectionName.forEach((section) => myForm.append("sectionName[]", section));
    console.log(sectionName);
    

    try {
      const response = await dispatch(createAssignment(myForm));
      if(response.status === 200) {
        toast.success("New assignment created Successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");
        setAvatar("");
        setSectionName([]);

        navigate("/dashboard/teacher")
      } else {
        toast.error(response?.data?.message || "Create assignment fail!")
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Create assignment failed!",
        "error"
      );
    }
  };

  return (
    <div className="create-assignment-container">
      <h2>Create Assignment</h2>
      <form onSubmit={handleAssignmentSubmit} className="assignment-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="* Enter assignment title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description: </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter assignment description"
          ></textarea>
        </div>

        <div className="row">
          <div className="form-group">
            <label htmlFor="avatar">Upload File</label>
            <input 
              type="file" 
              id="avatar" 
              name="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">DueDate:</label>
            <input
              type="date"
              id="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Assign Sections:</label>
          {sections.map(({ id, name }) => (
            <div key={id} className="checkbox-group">
              <input
                type="checkbox"
                id={`section-${id}`}
                value={name}
                checked={sectionName.includes(name)}
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
