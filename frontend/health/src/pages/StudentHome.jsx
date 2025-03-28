import React, { useState, useEffect } from "react";
import "./StudentHome.css";

const StudentHome = () => {
  const [student, setStudent] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([""]);
  console.log("Student State:", student);


  useEffect(() => {
    // 🔹 Retrieve student details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setStudent(JSON.parse(storedUser));
    }
  }, []);

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, ""]);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="photo-section">Photo</div>
        <div className="form-container">
          <h2>Student Profile</h2>

          {student ? (
            <>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Roll No:</strong> {student.roll_no}</p>
              <p><strong>Email:</strong> {student.email}</p>
            </>
          ) : (
            <p>Loading student details...</p>
          )}

          <form>
            <label>Skills</label>
            <input type="text" />

            <label>Certifications</label>
            <input type="text" />

            <label>Participated Tech Events</label>
            <input type="text" />

            <label>Extra-Curricular Activities</label>
            <input type="text" />

            <label>Co-Curricular Activities</label>
            <input type="text" />

            <label>Additional Fields</label>
            {additionalFields.map((_, index) => (
              <input key={index} type="text" placeholder="Add more fields..." />
            ))}

            <button type="button" onClick={handleAddField} className="add-field-btn">
              + Add Field
            </button>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;


