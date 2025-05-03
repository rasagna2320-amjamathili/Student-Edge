import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ProfessionalDetails.css";
import axios from "axios";
const BASE_URL = "http://localhost:5000";

const ProfessionalDetails = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State variables to display professional details (not for editing here)
    const [currentYear, setCurrentYear] = useState("");
    const [currentSemester, setCurrentSemester] = useState("");
    const [CGPA, setCGPA] = useState("");
    const [personalPortfolio, setPersonalPortfolio] = useState("");
    const [competitiveCodingProfiles, setCompetitiveCodingProfiles] = useState("");
    const [skills, setSkills] = useState("");
    const [certifications, setCertifications] = useState("");
    const [participatedTechEvents, setParticipatedTechEvents] = useState("");
    const [projects, setProjects] = useState("");
    const [coCurricularActivities, setCoCurricularActivities] = useState("");
    const [extraCurricularActivities, setExtraCurricularActivities] = useState("");
    const [githubProfile, setGithubProfile] = useState("");
    const [linkedinProfile, setLinkedinProfile] = useState("");
    const [additionalFields, setAdditionalFields] = useState("");
    const [profilePicturePreview, setProfilePicturePreview] = useState("");

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}/api/students/professional-details`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudent(data);
                setCurrentYear(data.currentYear || "");
                setCurrentSemester(data.currentSemester || "");
                setCGPA(data.CGPA || "");
                setPersonalPortfolio(data.personalPortfolio || "");
                setCompetitiveCodingProfiles(data.competitiveCodingProfiles ? data.competitiveCodingProfiles.join(", ") : "");
                setSkills(data.skills ? data.skills.join(", ") : "");
                setCertifications(data.certifications ? data.certifications.join(", ") : "");
                setParticipatedTechEvents(data.participatedTechEvents ? data.participatedTechEvents.join(", ") : "");
                setProjects(data.projects ? data.projects.join(", ") : "");
                setCoCurricularActivities(data.coCurricularActivities ? data.coCurricularActivities.join(", ") : "");
                setExtraCurricularActivities(data.extraCurricularActivities ? data.extraCurricularActivities.join(", ") : "");
                setGithubProfile(data.githubProfile || "");
                setLinkedinProfile(data.linkedinProfile || "");
                setAdditionalFields(data.additionalFields ? data.additionalFields.join(", ") : "");
                setProfilePicturePreview(data.profilePicture || "");
            } catch (error) {
                console.error("Error fetching professional data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, []);

    const handleGoToUpdatePage = () => {
        navigate("/update-professional-details"); // Navigate to the update page
    };

    if (loading) {
        return <p>Loading details...</p>;
    }

    if (error) {
        return <p>Error loading details: {error}</p>;
    }

    return (
        <div className="professional-details-container">
            <div className="professional-details-card">
                <h2>Profile</h2>

                <div className="profile-pic-display" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    {student?.profilePicture ? (
                        <img
                            src={student.profilePicture}
                            alt="Profile"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                backgroundColor: '#ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '1.5em',
                                color: '#fff',
                            }}
                        >
                            -
                        </div>
                    )}
                </div>

                <div className="data-display">
                    <p><strong>Current Year:</strong> {student?.currentYear || "-"}</p>
                    <p><strong>Current Semester:</strong> {student?.currentSemester || "-"}</p>
                    <p><strong>CGPA:</strong> {student?.CGPA || "-"}</p>
                    <p><strong>Personal Portfolio:</strong> {student?.personalPortfolio || "-"}</p>
                    <p><strong>Competitive Coding Profiles:</strong> {student?.competitiveCodingProfiles?.join(", ") || "-"}</p>
                    <p><strong>Skills:</strong> {student?.skills?.join(", ") || "-"}</p>
                    <p><strong>Certifications:</strong> {student?.certifications?.join(", ") || "-"}</p>
                    <p><strong>Participated Tech Events:</strong> {student?.participatedTechEvents?.join(", ") || "-"}</p>
                    <p><strong>Projects:</strong> {student?.projects?.join(", ") || "-"}</p>
                    <p><strong>Co-Curricular Activities:</strong> {student?.coCurricularActivities?.join(", ") || "-"}</p>
                    <p><strong>Extra-Curricular Activities:</strong> {student?.extraCurricularActivities?.join(", ") || "-"}</p>
                    <p><strong>Github Profile URL:</strong> {student?.githubProfile || "-"}</p>
                    <p><strong>LinkedIn Profile URL:</strong> {student?.linkedinProfile || "-"}</p>
                    <p><strong>Additional Fields:</strong> {student?.additionalFields?.join(", ") || "-"}</p>
                </div>

                {/* Change the button to trigger navigation */}
                <button type="button" className="submit-btn" onClick={handleGoToUpdatePage}>
                    Update Details
                </button>
                <Link to="/student-profile" className="back-to-dashboard">Back to Dashboard</Link>
            </div>
        </div>
    );
};

export default ProfessionalDetails;