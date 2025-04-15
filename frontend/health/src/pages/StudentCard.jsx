import React from "react";
import "./StudentCard.css";

export default function StudentCard({ student }) {
  if (!student) {
    return <p className="error">Student data is missing.</p>;
  }

  const renderDetailSection = (title, items, type) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="detail-section">
        <h3 className="section-title">{title}</h3>
        <div className="tag-container">
          {items.map((item, i) => {
            const isMatched = student.matchedSkills?.some(skill => 
              item.toLowerCase().includes(skill.toLowerCase())
            );
            
            return (
              <span 
                key={i} 
                className={`tag ${type}-tag ${isMatched ? "matched" : ""}`}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="student-card">
      <div className="student-header">
        <img
          src={student.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="student-profile-picture"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "/default-profile.png";
          }}
        />
        <div className="student-basic-info">
          <h2 className="student-name">{student.name || "N/A"}</h2>
          <p className="student-email">{student.email || "N/A"}</p>
          <div className="student-meta">
            <span className="meta-item">
              <strong>Roll No:</strong> {student.roll_no || "N/A"}
            </span>
            <span className="meta-item">
              <strong>CGPA:</strong> {student.CGPA || "N/A"}
            </span>
            {student.matchPercentage > 0 && (
              <span className="meta-item match-percentage">
                <strong>Match:</strong> {student.matchPercentage}%
                <div className="match-bar">
                  <div 
                    className="match-progress" 
                    style={{ width: `${student.matchPercentage}%` }}
                  ></div>
                </div>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="student-details">
        {renderDetailSection("Skills", student.skills, "skill")}
        {renderDetailSection("Certifications", student.certifications, "cert")}
        {renderDetailSection("Tech Events", student.participatedTechEvents, "tech")}
        {renderDetailSection("Extra-Curricular", student.extraCurricularActivities, "extra")}
        {renderDetailSection("Co-Curricular", student.coCurricularActivities, "co")}
        {renderDetailSection("Additional Fields", student.additionalFields, "additional")}
      </div>
    </div>
  );
}