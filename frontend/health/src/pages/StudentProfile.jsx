
import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";

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
    setIsMenuOpen(!isMenuOpen);
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
      const branchCode = student.roll_no.slice(6, 9);
      const branchMap = {
        "737": "Information Technology",
        "733": "Computer Science and Engineering",
        "735": "Electronics and Communication Engineering",
        "734": "Electrical and Electronics Engineering",
        "736": "Mechanical Engineering",
        "771": "Artificial Intelligence and Data Science",
        "729": "Artificial Intelligence and Machine Learning",
      };

      const branchName = branchMap[branchCode] || "Engineering";
      const studentData = {
        name: student.name || "Unknown",
        email: student.email || "Unknown",
        skills: student.skills || [],
        certifications: student.certifications || [],
        participatedTechEvents: student.participatedTechEvents || [],
        extraCurricularActivities: student.extraCurricularActivities || [],
        coCurricularActivities: student.coCurricularActivities || [],
        additionalFields: student.additionalFields || [],
        CGPA: student.CGPA || "N/A",
        requirements: requirements || "No specific requirements provided.",
        branch: branchName,
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyCfFZ4fP-wENFqfsiy6bDUa4lfA_35srlU`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Create a professional resume using the data below.
STRICTLY EXCLUDE THE EDUCATION SECTION.
DO NOT include any mention of the student’s name or email.
DO NOT use markdown (no asterisks or symbols).
Use ALL UPPERCASE HEADINGS.
Structure SKILLS into subcategories like:
- Programming Languages:
- Databases:
- Frameworks/Libraries:
- Tools:
- Others:(if present only)

Include only these sections in this order:
SUMMARY (4 lines only), TECHNICAL SKILLS, CERTIFICATIONS, PROJECTS AND TECHNICAL EVENTS, CO-CURRICULAR ACTIVITIES, EXTRACURRICULAR ACTIVITIES.

Student Background: Pursuing B.Tech in ${branchName}, CGPA: ${studentData.CGPA}
Additional Requirements: ${studentData.requirements}

Skills: ${studentData.skills.join(", ") || "None"}
Certifications: ${studentData.certifications.join(", ") || "None"}
Projects and Events: ${studentData.participatedTechEvents.join(", ") || "None"}
Co-curricular: ${studentData.coCurricularActivities.join(", ") || "None"}
Extracurricular: ${studentData.extraCurricularActivities.join(", ") || "None"}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate resume.";

      const educationText = `Chaitanya Bharathi Institute of Technology (CBIT)
Bachelor of Technology in ${branchName} (Pursuing)
CGPA: ${studentData.CGPA}

`;

      const modifiedResume = geminiText.replace(
        /^SUMMARY\n([\s\S]*?)(\n[A-Z])/,
        (match, summaryBody, nextSection) =>
          `${summaryBody.trim()}
${educationText}${nextSection}`
      );

      setResume(modifiedResume);
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(student.name, 105, y, null, null, "center");
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(student.email, 105, y, null, null, "center");
    y += 10;

    const lines = resume.split("\n");

    const insertEducationSection = () => {
      const branchCode = student.roll_no?.slice(6, 9) || "Unknown";
      const branchMap = {
        "737": "Information Technology",
        "733": "Computer Science and Engineering",
        "735": "Electronics and Communication Engineering",
        "734": "Electrical and Electronics Engineering",
        "736": "Mechanical Engineering",
        "771": "Artificial Intelligence and Data Science",
        "729": "Artificial Intelligence and Machine Learning",
      };

      const branch = branchMap[branchCode] || "Unknown Branch";
      const eduLines = [
        "Chaitanya Bharathi Institute of Technology (CBIT)",
        `Bachelor of Technology in ${branch} (Pursuing)`,
        `CGPA: ${student.CGPA}`,
      ];

      doc.setFont("helvetica", "normal");
      eduLines.forEach((line) => {
        if (y + lineHeight > pageHeight - 10) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 5;
    };

    let summaryEnded = false;
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
