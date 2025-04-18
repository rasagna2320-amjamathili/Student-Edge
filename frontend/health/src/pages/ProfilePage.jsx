import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGithub, FaLinkedin, FaArrowLeft } from "react-icons/fa";
import "./ProfilePage.css";

// Define API_BASE locally
const API_BASE = "http://192.168.0.196:5000";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      console.log("Fetching student with id:", id);
      try {
        const response = await axios.get(`${API_BASE}/students/${id}`);
        setStudent(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
        if (err.response && err.response.status === 404) {
          setError("Student not found. Please check the ID or try again.");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!student) return <p className="error">Student not found.</p>;

  const formatLink = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      
      <div className="profile-header">
        <img
          src={student.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="profile-picture"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile.png";
          }}
        />
        <div className="profile-info">
          <h1>{student.name || "N/A"}</h1>
          <p><strong>Roll No:</strong> {student.roll_no || "N/A"}</p>
          <p><strong>Email:</strong> {student.email || "N/A"}</p>
          <p><strong>CGPA:</strong> {student.CGPA || "N/A"}</p>
          
          {(student.githubProfile || student.linkedinProfile) && (
            <div className="social-links">
              {student.githubProfile && (
                <a 
                  href={formatLink(student.githubProfile)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link github"
                >
                  <FaGithub /> GitHub
                </a>
              )}
              {student.linkedinProfile && (
                <a 
                  href={formatLink(student.linkedinProfile)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="profile-details">
        <h2>Personal Details</h2>
        <p><strong>Achievements:</strong> {student.achievements?.join(", ") || "None"}</p>
        <p><strong>Address:</strong> {student.address || "Not provided"}</p>
        <p><strong>Contact:</strong> {student.contact || "Not provided"}</p>
        <p><strong>Date of Birth:</strong> {student.dob || "Not provided"}</p>
        <p><strong>Inter Board:</strong> {student.interBoard || "Not provided"}</p>
        <p><strong>Inter College:</strong> {student.interCollegeName || "Not provided"}</p>
        <p><strong>Inter Percentage:</strong> {student.interPercentage || "Not provided"}</p>
        <p><strong>School Board:</strong> {student.schoolBoard || "Not provided"}</p>
        <p><strong>School Name:</strong> {student.schoolName || "Not provided"}</p>

        <h2>Skills & Activities</h2>
        <p><strong>Skills:</strong> {student.skills?.join(", ") || "None"}</p>
        <p><strong>Certifications:</strong> {student.certifications?.join(", ") || "None"}</p>
        <p><strong>Co-Curricular:</strong> {student.coCurricularActivities?.join(", ") || "None"}</p>
        <p><strong>Extra-Curricular:</strong> {student.extraCurricularActivities?.join(", ") || "None"}</p>
        <p><strong>Tech Events:</strong> {student.participatedTechEvents?.join(", ") || "None"}</p>
        <p><strong>Additional Fields:</strong> {student.additionalFields?.join(", ") || "None"}</p>
      </div>
    </div>
  );
}