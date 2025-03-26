import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddStudent.css";

export default function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
    branch: "",
    section: "",
    courses: "",
    certificates: "",
    skills: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/add-student", student);
      alert("Student added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div className="add-student-container">
      <h1>Add New Student</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="rollNo" placeholder="Roll Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="branch" placeholder="Branch" onChange={handleChange} required />
        <input type="text" name="section" placeholder="Section" onChange={handleChange} required />
        <input type="text" name="courses" placeholder="Courses (comma-separated)" onChange={handleChange} />
        <input type="text" name="certificates" placeholder="Certificates (comma-separated)" onChange={handleChange} />
        <input type="text" name="skills" placeholder="Skills (comma-separated)" onChange={handleChange} />
        <button type="submit">Add Student</button>
        <button type="button" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
}
