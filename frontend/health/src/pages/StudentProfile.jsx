import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);  // Store student data
  const [resume, setResume] = useState("");  // Store generated resume
  const [requirements, setRequirements] = useState("");  // Store resume requirements input
  const [loading, setLoading] = useState(true);  // Handle loading state
  const navigate = useNavigate();  // For navigation between routes

  // Fetch student data once component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setStudent(data); // Set the fetched student data
        setLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        console.error("Error fetching student data:", error);
        setLoading(false);  // Stop loading even if an error occurs
      }
    };
    fetchStudentData();
  }, []);

  // Navigate to the "student-home" page when updating the profile
  const handleUpdateProfile = () => {
    if (student) {
      navigate("/student-home", { state: { studentData: student } });
    }
  };

  // Generate the resume with mock data (for now)
  const generateResume = async () => {
    if (!student) return;
    setLoading(true); // Set loading to true while generating the resume

    // Mock API request (Replace with actual API call)
    setTimeout(() => {
      setResume(
        `Generated Resume for ${student.name}\n\nSkills:\n- Problem Solving\n- Leadership\n- Teamwork\n\nProjects:\n- AI-based Chatbot\n- E-commerce Website\n\nCertifications:\n- AWS Cloud Practitioner`
      );
      setLoading(false); // Set loading to false once resume is generated
    }, 2000);
  };

  // Download resume as a PDF file
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

            {/* Displaying other fields safely */}
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
