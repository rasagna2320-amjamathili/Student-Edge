import React from "react";
import "./Dashboard.css";

export default function StudentCard({ student }) {
  return (
    <div className="student-card">
      <h2 className="student-name">{student.name}</h2>
      <p className="student-email">{student.email}</p>
      <p className="student-detail"><strong>Roll No:</strong> {student.rollNo}</p>
      <p className="student-detail"><strong>Password:</strong> {student.password}</p>
      <p className="student-detail"><strong>Branch:</strong> {student.branch}</p>
      <p className="student-detail"><strong>Section:</strong> {student.section}</p>

      <div className="student-info">
        <strong>Courses:</strong>
        <div className="tag-container">
          {student.courses.map((course, i) => (
            <span key={i} className="tag course-tag">{course}</span>
          ))}
        </div>
      </div>

      <div className="student-info">
        <strong>Certificates:</strong>
        <div className="tag-container">
          {student.certificates.map((cert, i) => (
            <span key={i} className="tag cert-tag">{cert}</span>
          ))}
        </div>
      </div>

      <div className="student-info">
        <strong>Skills:</strong>
        <div className="tag-container">
          {student.skills.map((skill, i) => (
            <span key={i} className="tag skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
