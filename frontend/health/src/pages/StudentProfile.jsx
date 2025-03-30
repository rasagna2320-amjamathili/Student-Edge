import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setStudent(JSON.parse(storedUser));
    }
  }, []);

  const generateResume = async () => {
    if (!student) return;
    setLoading(true);

    // Mock API request (Replace this with actual API call)
    setTimeout(() => {
      setResume(
        `Generated Resume for ${student.name}\n\nSkills:\n- Problem Solving\n- Leadership\n- Teamwork\n\nProjects:\n- AI-based Chatbot\n- E-commerce Website\n\nCertifications:\n- AWS Cloud Practitioner`
      );
      setLoading(false);
    }, 2000);
  };

  const downloadResumeAsPDF = () => {
    if (!resume || !student) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Resume", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${student.name}`, 15, 40);
    doc.text(`Roll No: ${student.roll_no}`, 15, 50);
    doc.text(`Email: ${student.email}`, 15, 60);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Resume Content:", 15, 80);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(resume, 180);
    doc.text(textLines, 15, 90);

    doc.save(`${student.name}_Resume.pdf`);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
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

        <div className="button-group">
          <button className="update-btn" onClick={() => navigate("/student-home")}>
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
