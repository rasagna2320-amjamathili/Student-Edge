import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Generate resume using Gemini API
  const generateResume = async () => {
    if (!student) return;
    setLoading(true);
  
    try {
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
        requirements: requirements || "No specific requirements provided."
      };
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyAVUroR7W1uC7-NMyac99XMs3S5DVTinDg`,
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
                    text: `Generate a professional resume for a student named ${studentData.name} with email ${studentData.email}. 
                    The student has the following details: 
                    - Skills: ${studentData.skills.join(", ") || "None"}
                    - Certifications: ${studentData.certifications.join(", ") || "None"}
                    - Participated Tech Events: ${studentData.participatedTechEvents.join(", ") || "None"}
                    - Extra-Curricular Activities: ${studentData.extraCurricularActivities.join(", ") || "None"}
                    - Co-Curricular Activities: ${studentData.coCurricularActivities.join(", ") || "None"}
                    - Additional Fields: ${studentData.additionalFields.join(", ") || "None"}
                    - CGPA: ${studentData.CGPA}
                    Include the following company requirements: ${studentData.requirements}. 
                    Format the resume professionally with sections for Contact Information, Education, Skills, Certifications, Projects/Events, and Extracurricular Activities.`
                  }
                ]
              }
            ]
          })
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Gemini API Response:", data);
      const generatedResume = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate resume.";
  
      setResume(generatedResume);
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Resume", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${student.name}`, 15, 40);
    doc.text(`Email: ${student.email}`, 15, 50);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Resume Content:", 15, 70);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(resume, 180);
    doc.text(textLines, 15, 80);

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
            <div className="photo-section">
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
