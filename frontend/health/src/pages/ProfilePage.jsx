import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGithub, FaLinkedin, FaArrowLeft } from "react-icons/fa";
import "./ProfilePage.css";

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

  const formatLink = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!student) return <p className="error">Student not found.</p>;

  const {
    profilePicture,
    name,
    roll_no,
    email,
    CGPA,
    githubProfile,
    linkedinProfile,
    github,
    linkedin,
    achievements,
    address,
    contact,
    dob,
    interBoard,
    interCollegeName,
    interPercentage,
    schoolBoard,
    schoolName,
    schoolPercentage,
    skills,
    certifications,
    coCurricularActivities,
    extraCurricularActivities,
    participatedTechEvents,
    additionalFields,
  } = student;

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="profile-header">
        <img
          src={profilePicture || "/default-profile.png"}
          alt="Profile"
          className="profile-picture"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile.png";
          }}
        />
        <div className="profile-info">
          <h1>{name || "N/A"}</h1>
          <p><strong>Roll No:</strong> {roll_no || "N/A"}</p>
          <p><strong>Email:</strong> {email || "N/A"}</p>
          <p><strong>CGPA:</strong> {CGPA || "N/A"}</p>

          {(githubProfile || github || linkedinProfile || linkedin) && (
            <div className="social-links">
              {(githubProfile || github) && (
                <a
                  href={formatLink(githubProfile || github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github"
                >
                  <FaGithub /> GitHub
                </a>
              )}
              {(linkedinProfile || linkedin) && (
                <a
                  href={formatLink(linkedinProfile || linkedin)}
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
        <p><strong>Achievements:</strong> {achievements?.length > 0 ? achievements.join(", ") : "None"}</p>
        <p><strong>Address:</strong> {address || "Not provided"}</p>
        <p><strong>Contact:</strong> {contact || "Not provided"}</p>
        <p><strong>Date of Birth:</strong> {dob || "Not provided"}</p>
        <p><strong>Inter Board:</strong> {interBoard || "Not provided"}</p>
        <p><strong>Inter College:</strong> {interCollegeName || "Not provided"}</p>
        <p><strong>Inter Percentage:</strong> {interPercentage || "Not provided"}</p>
        <p><strong>School Board:</strong> {schoolBoard || "Not provided"}</p>
        <p><strong>School Name:</strong> {schoolName || "Not provided"}</p>
        <p><strong>School Percentage:</strong> {schoolPercentage || "Not provided"}</p>

        <h2>Skills & Activities</h2>
        <p><strong>Skills:</strong> {skills?.length > 0 ? skills.join(", ") : "None"}</p>
        <p><strong>Certifications:</strong> {certifications?.length > 0 ? certifications.join(", ") : "None"}</p>
        <p><strong>Co-Curricular Activities:</strong> {coCurricularActivities?.length > 0 ? coCurricularActivities.join(", ") : "None"}</p>
        <p><strong>Extra-Curricular Activities:</strong> {extraCurricularActivities?.length > 0 ? extraCurricularActivities.join(", ") : "None"}</p>
        <p><strong>Tech Events:</strong> {participatedTechEvents?.length > 0 ? participatedTechEvents.join(", ") : "None"}</p>
        <p><strong>Additional Details:</strong> {additionalFields?.length > 0 ? additionalFields.join(", ") : "None"}</p>
      </div>
    </div>
  );
}
