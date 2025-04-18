import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const handleUpdateProfile = () => {
    if (student) {
      navigate("/student-home", { state: { studentData: student } });
    }
  };

  const generateResume = async () => {
    if (!student) return;
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          student_data: {
            ...student,
            linkedin: student.linkedin || "",
            github: student.github || "",
          },
          requirements: requirements,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResume(data.resume);
    } catch (error) {
      console.error("Error generating resume:", error);
      setResume("Error generating resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResumeAsPDF = () => {
    if (!resume || !student) return;

    const doc = new jsPDF();
    const margin = 15;
    const lineHeight = 8;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    // Student name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(student.name, 105, y, null, null, "center");
    y += 10;

    // Email
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(student.email, 105, y, null, null, "center");
    y += 10;

    // LinkedIn and GitHub if available
    if (student.linkedin || student.github) {
      let contactText = "";
      if (student.linkedin && student.github) {
        contactText = `LinkedIn: ${student.linkedin} | GitHub: ${student.github}`;
      } else if (student.linkedin) {
        contactText = `LinkedIn: ${student.linkedin}`;
      } else {
        contactText = `GitHub: ${student.github}`;
      }
      
      doc.setFontSize(10);
      doc.text(contactText, 105, y, null, null, "center");
      y += 10;
    }

    // Resume content
    const lines = resume.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (y + lineHeight > pageHeight - 10) {
        doc.addPage();
        y = 20;
      }

      if (/^[A-Z ]+$/.test(line.trim()) && line.length < 40) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }

      const splitLines = doc.splitTextToSize(line, 180);
      splitLines.forEach((l) => {
        doc.text(l, margin, y);
        y += lineHeight;
      });
    }

    doc.save(`${student.name.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="kebab-menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isMenuOpen && (
          <div className="menu-options">
            <Link to="/change-password">Change Password</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        <h2>Student Profile</h2>
        {loading ? (
          <p>Loading student details...</p>
        ) : student ? (
          <>
            <div className="profile-section">
              <div className="profile-pic-container">
                {student?.profilePicture ? (
                  <img src={student.profilePicture} alt="Profile" className="profile-pic" />
                ) : (
                  <span className="placeholder-text">Profile</span>
                )}
              </div>
            </div>
            <p><strong>Name:</strong> {student.name || "-"}</p>
            <p><strong>Roll No:</strong> {student.roll_no || "-"}</p>
            <p><strong>Email:</strong> {student.email || "-"}</p>
            {student.linkedin && (
              <p><strong>LinkedIn:</strong> 
                <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                  {student.linkedin}
                </a>
              </p>
            )}
            {student.github && (
              <p><strong>GitHub:</strong> 
                <a href={student.github} target="_blank" rel="noopener noreferrer">
                  {student.github}
                </a>
              </p>
            )}
            <p><strong>CGPA:</strong> {student.CGPA}</p>
            <p><strong>Skills:</strong> {student.skills?.length ? student.skills.join(", ") : "-"}</p>
            <p><strong>Certifications:</strong> {student.certifications?.length ? student.certifications.join(", ") : "-"}</p>
            <p><strong>Participated Tech Events:</strong> {student.participatedTechEvents?.length ? student.participatedTechEvents.join(", ") : "-"}</p>
            <p><strong>Extra-Curricular Activities:</strong> {student.extraCurricularActivities?.length ? student.extraCurricularActivities.join(", ") : "-"}</p>
            <p><strong>Co-Curricular Activities:</strong> {student.coCurricularActivities?.length ? student.coCurricularActivities.join(", ") : "-"}</p>
            <p><strong>Additional Fields:</strong> {student.additionalFields?.length ? student.additionalFields.join(", ") : "-"}</p>
          </>
        ) : (
          <p>No student data found!</p>
        )}
        <div className="button-group">
          <button className="update-btn" onClick={handleUpdateProfile}>
            Update Profile
          </button>
        </div>
        <div className="resume-section">
          <h3>Generate Resume</h3>
          <textarea
            placeholder="Enter specific resume requirements..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          ></textarea>
          <button className="primary-btn" onClick={generateResume} disabled={loading}>
            {loading ? "Generating..." : "Generate Resume"}
          </button>

          {resume && (
            <div className="resume-output">
              <h3>Generated Resume</h3>
              <pre>{resume}</pre>
              <button onClick={downloadResumeAsPDF} className="download-btn">
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;