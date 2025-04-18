import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./StudentCard.css";

export default function StudentCard({ student }) {
  if (!student) {
    return <p className="error">Student data is missing.</p>;
  }

  const navigate = useNavigate();

  const equivalentTerms = {
    "sql": ["structured query language"],
    "structured query language": ["sql"],
    "ai": ["artificial intelligence"],
    "artificial intelligence": ["ai"],
    "ml": ["machine learning"],
    "machine learning": ["ml"],
    "dbms": ["database management system"],
    "database management system": ["dbms"],
    "os": ["operating system"],
    "operating system": ["os"],
    "dsa": ["data structures and algorithms", "data structures"],
    "data structures and algorithms": ["dsa"],
    "data structures": ["dsa"],
    "oop": ["object-oriented programming"],
    "object-oriented programming": ["oop"],
    "ui": ["user interface"],
    "user interface": ["ui"],
    "ux": ["user experience"],
    "user experience": ["ux"],
    "api": ["application programming interface"],
    "application programming interface": ["api"],
    "css": ["cascading style sheets"],
    "cascading style sheets": ["css"],
    "html": ["hypertext markup language"],
    "hypertext markup language": ["html"],
    "js": ["javascript"],
    "javascript": ["js"],
    "rest": ["representational state transfer"],
    "representational state transfer": ["rest"],
    "iot": ["internet of things"],
    "internet of things": ["iot"],
    "nlp": ["natural language processing"],
    "natural language processing": ["nlp"],
    "cv": ["computer vision"],
    "computer vision": ["cv"],
    "gui": ["graphical user interface"],
    "graphical user interface": ["gui"],
    "ci/cd": ["continuous integration/continuous deployment"],
    "continuous integration/continuous deployment": ["ci/cd"],
    "vcs": ["version control system"],
    "version control system": ["vcs"],
    "ide": ["integrated development environment"],
    "integrated development environment": ["ide"],
    "orm": ["object-relational mapping"],
    "object-relational mapping": ["orm"],
    "jvm": ["java virtual machine"],
    "java virtual machine": ["jvm"],
    "http": ["hypertext transfer protocol"],
    "hypertext transfer protocol": ["http"],
    "https": ["hypertext transfer protocol secure"],
    "hypertext transfer protocol secure": ["https"],
    "tcp/ip": ["transmission control protocol/internet protocol"],
    "transmission control protocol/internet protocol": ["tcp/ip"],
    "nosql": ["not only sql"],
    "not only sql": ["nosql"],
    "rdbms": ["relational database management system"],
    "relational database management system": ["rdbms"],
  };

  const isTechRelatedSection = (title) => {
    const techSections = ["Skills", "Certifications", "Co-Curricular", "Additional Fields"];
    return techSections.includes(title);
  };

  const hasExactWordMatch = (text, term) => {
    const normalizedText = text.toLowerCase().trim();
    const normalizedTerm = term.toLowerCase().trim();
    return new RegExp(`(^|\\s|,|\\.|;|:)${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|,|\\.|;|:|$)`).test(normalizedText);
  };

  const renderDetailSection = (title, items, type) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="detail-section">
        <h3 className="section-title">{title}</h3>
        <div className="tag-container">
          {items.map((item, i) => {
            const normalizedItem = item.toLowerCase().trim();
            const isMatched = student.matchedSkills?.some(skill => {
              const normalizedSkill = skill.toLowerCase().trim();
              if (!isTechRelatedSection(title)) return false;
              
              const directMatch = hasExactWordMatch(normalizedItem, normalizedSkill);
              const equivalentMatch = equivalentTerms[normalizedSkill]?.some(equiv => 
                hasExactWordMatch(normalizedItem, equiv)
              );
              const reverseEquivalentMatch = equivalentTerms[normalizedItem]?.some(equiv => 
                hasExactWordMatch(normalizedSkill, equiv)
              );
              return directMatch || equivalentMatch || reverseEquivalentMatch;
            });

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

  const handleViewProfile = () => {
    navigate(`/profile/${student._id}`);
  };

  const formatSocialLink = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
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
          </div>
          
          {/* Social links now displayed as a vertical stack */}
          <div className="social-links-container">
            {student.github && (
              <a 
                href={formatSocialLink(student.github)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link github"
              >
                <FaGithub className="social-icon" />
                {student.github.replace(/https?:\/\/(www\.)?github\.com\//, "")}
              </a>
            )}
            {student.linkedin && (
              <a 
                href={formatSocialLink(student.linkedin)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <FaLinkedin className="social-icon" />
                {student.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
              </a>
            )}
          </div>
          
          {student.matchPercentage > 0 && (
            <span className="meta-item match-percentage">
              <strong>Match:</strong> {student.matchPercentage}%
              {student.matchedSkills?.length > 0 && (
                <span> ({student.matchedSkills.join(", ")})</span>
              )}
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

      <div className="student-details">
        {renderDetailSection("Skills", student.skills, "skill")}
        {renderDetailSection("Certifications", student.certifications, "cert")}
        {renderDetailSection("Co-Curricular", student.coCurricularActivities, "co")}
        {renderDetailSection("Additional Fields", student.additionalFields, "additional")}
        {renderDetailSection("Extra-Curricular", student.extraCurricularActivities, "extra")}
        {renderDetailSection("Tech Events", student.participatedTechEvents, "tech")}
      </div>
      <button className="view-profile-btn" onClick={handleViewProfile}>
        View Complete Profile
      </button>
    </div>
  );
}