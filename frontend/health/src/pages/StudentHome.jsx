import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentHome.css";

const StudentHome = () => {
    const [student, setStudent] = useState(null);
    const [skills, setSkills] = useState("");
    const [certifications, setCertifications] = useState("");
    const [participatedTechEvents, setParticipatedTechEvents] = useState("");
    const [extraCurricularActivities, setExtraCurricularActivities] = useState("");
    const [coCurricularActivities, setCoCurricularActivities] = useState("");
    const [additionalFields, setAdditionalFields] = useState([""]);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to be logged in to view your profile.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/api/students/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            console.log("Data from backend:", data); // Check the data here
            setStudent(data);
            setSkills(data.skills.join(", ") || "");
            setCertifications(data.certifications.join(", ") || "");
            setParticipatedTechEvents(data.participatedTechEvents.join(", ") || "");
            setExtraCurricularActivities(data.extraCurricularActivities.join(", ") || "");
            setCoCurricularActivities(data.coCurricularActivities.join(", ") || "");
            setProfilePicture(data.profilePicture || "");
        } catch (error) {
            console.error("Error fetching student data:", error);
            alert("Failed to load student details.");
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to be logged in to update your profile.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("skills", skills);
            formData.append("certifications", certifications);
            formData.append("participatedTechEvents", participatedTechEvents);
            formData.append("extraCurricularActivities", extraCurricularActivities);
            formData.append("coCurricularActivities", coCurricularActivities);
            additionalFields.forEach((field) => formData.append("additionalFields[]", field));
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            const response = await axios.patch("http://localhost:5000/api/students/update", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setStudent(response.data.student);
                setProfilePicture(response.data.student.profilePicture);
                navigate("/student-profile");
            } else {
                alert("Something went wrong while updating your profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error.response || error.message);
            alert("An error occurred while updating your profile. Please try again.");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="photo-section">
                    <div className="profile-pic-container">
                        <div className="profile-pic-circle">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="profile-pic" />
                            ) : (
                                <span className="placeholder-text">Profile</span>
                            )}
                            <label htmlFor="profilePicInput" className="edit-icon">
                                <i className="fas fa-pencil-alt"></i>
                            </label>
                        </div>
                        <input
                            type="file"
                            id="profilePicInput"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                        />
                    </div>
                </div>

                <div className="form-container">
                    <h2>Student Profile</h2>
                    {student ? <p><strong>Roll No:</strong> {student.roll_no}</p> : <p>Loading student details...</p>}
                    <form onSubmit={handleSubmit}>
                        <label>Skills</label>
                        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Enter your skills" />
                        <label>Certifications</label>
                        <input type="text" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Enter your certifications" />
                        <label>Participated Tech Events</label>
                        <input type="text" value={participatedTechEvents} onChange={(e) => setParticipatedTechEvents(e.target.value)} placeholder="Enter your tech events" />
                        <label>Extra-Curricular Activities</label>
                        <input type="text" value={extraCurricularActivities} onChange={(e) => setExtraCurricularActivities(e.target.value)} placeholder="Enter your extra-curricular activities" />
                        <label>Co-Curricular Activities</label>
                        <input type="text" value={coCurricularActivities} onChange={(e) => setCoCurricularActivities(e.target.value)} placeholder="Enter your co-curricular activities" />
                        <label>Additional Fields</label>
                        {additionalFields.map((field, index) => (
                            <input key={index} type="text" value={field} onChange={(e) => {
                                const updatedFields = [...additionalFields];
                                updatedFields[index] = e.target.value;
                                setAdditionalFields(updatedFields);
                            }} placeholder="Add more fields..." />
                        ))}
                        <button type="button" onClick={() => setAdditionalFields([...additionalFields, ""])} className="add-field-btn">+ Add Field</button>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;