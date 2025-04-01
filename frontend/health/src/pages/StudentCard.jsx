import React from "react";
import "./Dashboard.css";

export default function StudentCard({ student }) {
  if (!student) {
    return <p className="error">Student data is missing.</p>;
  }

  return (
    <div className="student-card">
      <img
        src={student.profilePicture || ""}
        alt="Profile"
        className="student-profile-picture"
      />
      <h2 className="student-name">{student.name || "N/A"}</h2>
      <p className="student-email">{student.email || "N/A"}</p>
      <p className="student-detail"><strong>Roll No:</strong> {student.roll_no || "N/A"}</p>
 
      <p className="student-detail"><strong>CGPA:</strong> {student.CGPA || "N/A"}</p>

      <div className="student-info">
        <strong>Skills:</strong>
        <div className="tag-container">
          {Array.isArray(student.skills) && student.skills.length > 0 ? (
            student.skills.map((skill, i) => (
              <span key={i} className="tag skill-tag">{skill}</span>
            ))
          ) : (
            <p>No skills listed</p>
          )}
        </div>
      </div>
<p></p>
      <div className="student-info">
        <strong>Certifications:</strong>
        <div className="tag-container">
          {Array.isArray(student.certifications) && student.certifications.length > 0 ? (
            student.certifications.map((cert, i) => (
              <span key={i} className="tag cert-tag">{cert}</span>
            ))
          ) : (
            <p>No certifications listed</p>
          )}
        </div>
      </div>
      <p></p>
      <div className="student-info">
        <strong>Participated Tech Events:</strong>
        <div className="tag-container">
          {Array.isArray(student.participatedTechEvents) && student.participatedTechEvents.length > 0 ? (
            student.participatedTechEvents.map((event, i) => (
              <span key={i} className="tag tech-tag">{event}</span>
            ))
          ) : (
            <p>No tech events listed</p>
          )}
        </div>
      </div>
      <p></p>
      <div className="student-info">
        <strong>Extra-Curricular Activities:</strong>
        <div className="tag-container">
          {Array.isArray(student.extraCurricularActivities) && student.extraCurricularActivities.length > 0 ? (
            student.extraCurricularActivities.map((activity, i) => (
              <span key={i} className="tag extra-tag">{activity}</span>
            ))
          ) : (
            <p>No extra-curricular activities listed</p>
          )}
        </div>
      </div>
      <p></p>
      <div className="student-info">
        <strong>Co-Curricular Activities:</strong>
        <div className="tag-container">
          {Array.isArray(student.coCurricularActivities) && student.coCurricularActivities.length > 0 ? (
            student.coCurricularActivities.map((activity, i) => (
              <span key={i} className="tag co-tag">{activity}</span>
            ))
          ) : (
            <p>No co-curricular activities listed</p>
          )}
        </div>
      </div>
      <p></p>
      <div className="student-info">
        <strong>Additional Fields:</strong>
        <div className="tag-container">
          {Array.isArray(student.additionalFields) && student.additionalFields.length > 0 ? (
            student.additionalFields.map((field, i) => (
              <span key={i} className="tag additional-tag">{field}</span>
            ))
          ) : (
            <p>No additional fields listed</p>
          )}
        </div>
      </div>
    </div>
  );
}