import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StudentProfile.css";

const BASE_URL = "http://localhost:5000"; // Base URL for API requests

const StudentProfile = () => {
  const [personalData, setPersonalData] = useState(null);
  const [professionalData, setProfessionalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState(null);
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
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/api/students/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPersonalData(data); // Store all profile data including email, linkedin, github

      } catch (err) {
        setError(err.message);
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  const fetchResumeData = async () => {
    setLoading(true);
    try {
      const personalResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL_FLASK}/api/personal-details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const personal = await personalResponse.json();
      setPersonalData(personal);

      const professionalResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL_FLASK}/api/professional-details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const professional = await professionalResponse.json();
      setProfessionalData(professional);

      if (!personalResponse.ok || !professionalResponse.ok) {
        throw new Error("Failed to fetch data for resume");
      }
    } catch (error) {
      console.error("Error fetching data for resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateResume = async () => {
    if (!personalData?._id) return;  // Prevent function execution if there's no student ID
  
    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Using token for authentication
        },
        body: JSON.stringify({
          student_id: personalData._id, // Sending student ID
          requirements: requirements,    // Sending additional data for resume
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Throw error if response is not OK (not 2xx)
      }
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);  // Throw error if the response contains an error message
      }
  
      setResume(data.resume);  // Set only resume text, not the whole object
    } catch (error) {
      console.error("Error generating resume:", error);
      setResume("Error generating resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const downloadResumeAsPDF = () => {
    if (!resume || !personalData) return;

    const doc = new jsPDF();
    const margin = 15;
    const lineHeight = 8;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    // Student name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(personalData.name || "Student", 105, y, null, null, "center");
    y += 10;

    // Email
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(personalData.email || "Email Not Available", 105, y, null, null, "center");
    y += 10;

    // LinkedIn and GitHub if available
    if (personalData.linkedin || personalData.github) {
      let contactText = "";
      if (personalData.linkedin && personalData.github) {
        contactText = `LinkedIn: ${personalData.linkedin} | GitHub: ${personalData.github}`;
      } else if (personalData.linkedin) {
        contactText = `LinkedIn: ${personalData.linkedin}`;
      } else {
        contactText = `GitHub: ${personalData.github}`;
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
        doc.text(margin, y, l);
        y += lineHeight;
      });
    }

    doc.save(`${(personalData.name || "Student").replace(/\s+/g, "_")}_Resume.pdf`);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header" id="student-profile-header">
          <h2>Welcome, {personalData?.name || "Student"}</h2>
          {personalData?.profilePicture && (
            <img
              src={personalData.profilePicture}
              alt="Profile Picture"
              className="profile-pic"
              width="20" // Adjust this value as needed
              height="20" // Adjust this value as needed
            />
          )}
          <div id="Details">
            <p>
              <strong>Roll Number:</strong> {personalData?.roll_no || "-"}
            </p>
            <p>
              <strong>Current Year:</strong> {personalData?.currentYear || "-"}
            </p>
            <p>
              <strong>Current Semester:</strong> {personalData?.currentSemester || "-"}
            </p>
          </div>
        </div>

        <div className="button-group">
          <Link to="/personal-details" className="update-btn">
            Background Details
          </Link>
          <Link to="/professional-details" className="update-btn">
            Present Profile
          </Link>
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
      </div>
    </div>
  );
};

export default StudentProfile;
