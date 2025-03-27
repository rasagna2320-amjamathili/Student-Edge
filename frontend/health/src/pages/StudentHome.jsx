import React, { useState } from "react";
import "./StudentHome.css";

const StudentHome = () => {
  const [additionalFields, setAdditionalFields] = useState([""]);

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, ""]);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="photo-section">Photo</div>
        <div className="form-container">
          <h2>Student Profile</h2>
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

export default StudentHome; // ✅ Ensure correct export

