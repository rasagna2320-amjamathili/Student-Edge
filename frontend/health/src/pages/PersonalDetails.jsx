import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PersonalDetails.css";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const PersonalDetails = () => {
    const navigate = useNavigate();
    const [personalDetails, setPersonalDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State variables for displaying personal details
    const [dob, setDob] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [motherName, setMotherName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [schoolLocation, setSchoolLocation] = useState("");
    const [schoolPercentage, setSchoolPercentage] = useState("");
    const [schoolBoard, setSchoolBoard] = useState("");
    const [interCollegeName, setInterCollegeName] = useState("");
    const [interLocation, setInterLocation] = useState("");
    const [interStream, setInterStream] = useState("");
    const [interPercentage, setInterPercentage] = useState("");
    const [interBoard, setInterBoard] = useState("");
    const [achievements, setAchievements] = useState("");
    const [profilePicturePreview, setProfilePicturePreview] = useState("");

    useEffect(() => {
        const fetchPersonalDetailsData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}/api/students/personal-details`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const formattedDob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : "";
                setPersonalDetails(data);
                // Initialize state with fetched data for display
                setDob(formattedDob || "");
                setContact(data.contact || "");
                setAddress(data.address || "");
                setMotherName(data.motherName || "");
                setFatherName(data.fatherName || "");
                setSchoolName(data.schoolName || "");
                setSchoolLocation(data.schoolLocation || "");
                setSchoolPercentage(data.schoolPercentage || "");
                setSchoolBoard(data.schoolBoard || "");
                setInterCollegeName(data.interCollegeName || "");
                setInterLocation(data.interLocation || "");
                setInterStream(data.interStream || "");
                setInterPercentage(data.interPercentage || "");
                setInterBoard(data.interBoard || "");
                setAchievements(data.achievements ? data.achievements.join(", ") : "");
                setProfilePicturePreview(data.profilePicture || "");
            } catch (error) {
                console.error("Error fetching background details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalDetailsData();
    }, []);

    const handleGoToUpdatePage = () => {
        navigate("/update-personal-details");
    };

    if (loading) {
        return <p>Loading background details...</p>;
    }

    if (error) {
        return <p>Error loading background details: {error}</p>;
    }

    return (
        <div className="personal-details-container">
            <div className="personal-details-card">
                <h2>Background Details</h2>
                <div className="profile-pic-display" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    {personalDetails?.profilePicture ? (
                        <img
                            src={personalDetails.profilePicture}
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
                    <p><strong>Date of Birth:</strong> {dob || "-"}</p>
                    <p><strong>Contact Number:</strong> {contact || "-"}</p>
                    <p><strong>Address:</strong> {address || "-"}</p>
                    <p><strong>Mother's Name:</strong> {motherName || "-"}</p>
                    <p><strong>Father's Name:</strong> {fatherName || "-"}</p>
                    <p><strong>School Name:</strong> {schoolName || "-"}</p>
                    <p><strong>School Location:</strong> {schoolLocation || "-"}</p>
                    <p><strong>School Percentage:</strong> {schoolPercentage || "-"}</p>
                    <p><strong>School Board:</strong> {schoolBoard || "-"}</p>
                    <p><strong>Intermediate College:</strong> {interCollegeName || "-"}</p>
                    <p><strong>Intermediate Location:</strong> {interLocation || "-"}</p>
                    <p><strong>Intermediate Stream:</strong> {interStream || "-"}</p>
                    <p><strong>Intermediate Percentage:</strong> {interPercentage || "-"}</p>
                    <p><strong>Intermediate Board:</strong> {interBoard || "-"}</p>
                    <p><strong>Achievements:</strong> {achievements || "-"}</p>
                </div>

                <button type="button" className="submit-btn" onClick={handleGoToUpdatePage}>
                    Update Details
                </button>
                <Link to="/student-profile" className="back-to-dashboard">Back to Dashboard</Link>
            </div>
        </div>
    );
};

export default PersonalDetails;
