import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./UpdateProfessionalDetails.css";



const BASE_URL = "http://localhost:5000";



const UpdateProfessionalDetails = () => {

    const [student, setStudent] = useState(null);

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

    const [profilePicture, setProfilePicture] = useState(null);

    const [profilePicturePreview, setProfilePicturePreview] = useState("");

    const navigate = useNavigate();



    useEffect(() => {

        fetchProfessionalDetails();
    }, []);


    const fetchProfessionalDetails = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("You need to be logged in.");

            return;

        }

        try {

            const response = await axios.get(`${BASE_URL}/api/students/professional-details`, {

                headers: { Authorization: `Bearer ${token}` },

            });

            const data = response.data;

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



            setProfilePicturePreview(data.profilePicture || null); // Use directly, don't prepend BASE_URL

        } catch (error) {

            console.error("Error fetching professional details:", error);

            alert("Failed to load professional details.");

        }

    };



    const handleProfilePictureChange = (e) => {

        const file = e.target.files[0];

        setProfilePicture(file);

        const reader = new FileReader();

        reader.onloadend = () => {

            setProfilePicturePreview(reader.result);

        };

        if (file) reader.readAsDataURL(file);

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {

            alert("You need to be logged in to update.");

            return;

        }

        try {

            const formData = new FormData();

            formData.append("currentYear", currentYear);

            formData.append("currentSemester", currentSemester);

            formData.append("CGPA", CGPA);

            formData.append("personalPortfolio", personalPortfolio);

            formData.append("competitiveCodingProfiles", competitiveCodingProfiles);

            formData.append("skills", skills);

            formData.append("certifications", certifications);
            formData.append("participatedTechEvents", participatedTechEvents);

            formData.append("projects", projects);

            formData.append("coCurricularActivities", coCurricularActivities);

            formData.append("extraCurricularActivities", extraCurricularActivities);

            formData.append("githubProfile", githubProfile);

            formData.append("linkedinProfile", linkedinProfile);

            formData.append("additionalFields", additionalFields);

            if (profilePicture) {

                formData.append("profilePicture", profilePicture);
            }



            const response = await axios.put(`${BASE_URL}/api/students/professional-details`, formData, {

                headers: {

                    Authorization: `Bearer ${token}`,

                    "Content-Type": "multipart/form-data",

                },

            });



            if (response.status === 200) {

                alert("Professional details updated successfully!");

                navigate("/professional-details");

            } else {

                alert("Failed to update professional details.");

            }

        } catch (error) {

            console.error("Error updating professional details:", error);

            alert("An error occurred while updating.");

        }

    };



    return (

        <div className="profile-container">

            <div className="profile-card">

                <div className="photo-section">



                    <div className="profile-pic-circle" style={{ width: '120px', height: '120px' }}>

                        {profilePicturePreview ? (

                            <img src={profilePicturePreview} alt="Profile" className="profile-pic" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />

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



                <div className="form-container">

                    <h2>Update Professional Details</h2>

                    <form onSubmit={handleSubmit}>

                        <label>Current Year</label>

                        <input type="text" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} placeholder="e.g., 2023, Third Year" />



                        <label>Current Semester</label>

                        <input type="text" value={currentSemester} onChange={(e) => setCurrentSemester(e.target.value)} placeholder="e.g., Fall 2023, Semester 6" />


                        <label>CGPA</label>

                        <input type="text" value={CGPA} onChange={(e) => setCGPA(e.target.value)} placeholder="Your CGPA" />



                        <label>Personal Portfolio URL</label>
                        <input type="text" value={personalPortfolio} onChange={(e) => setPersonalPortfolio(e.target.value)} placeholder="Your portfolio URL" />



                        <label>Competitive Coding Profiles (comma-separated)</label>

                        <input type="text" value={competitiveCodingProfiles} onChange={(e) => setCompetitiveCodingProfiles(e.target.value)} placeholder="e.g., Codeforces, LeetCode" />


                        <label>Skills (comma-separated)</label>

                        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, Python" />



                        <label>Certifications (comma-separated)</label>

                        <input type="text" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="e.g., AWS Certified, Google Cloud" />


                        <label>Participated Tech Events (comma-separated)</label>
                        <input type="text" value={participatedTechEvents} onChange={(e) => setParticipatedTechEvents(e.target.value)} placeholder="e.g., Hackathons, Workshops" />



                        <label>Projects (comma-separated)</label>

                        <input type="text" value={projects} onChange={(e) => setProjects(e.target.value)} placeholder="e.g., Portfolio Website, E-commerce App" />



                        <label>Co-Curricular Activities (comma-separated)</label>
                        <input type="text" value={coCurricularActivities} onChange={(e) => setCoCurricularActivities(e.target.value)} placeholder="e.g., Debate Club, Robotics Team" />



                        <label>Extra-Curricular Activities (comma-separated)</label>

                        <input type="text" value={extraCurricularActivities} onChange={(e) => setExtraCurricularActivities(e.target.value)} placeholder="e.g., Sports, Music, Volunteering" />



                        <label>Github Profile URL</label>

                        <input type="text" value={githubProfile} onChange={(e) => setGithubProfile(e.target.value)} placeholder="Your GitHub URL" />



                        <label>LinkedIn Profile URL</label>

                        <input type="text" value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} placeholder="Your LinkedIn URL" />



                        <label>Additional Fields (comma-separated)</label>

                        <input type="text" value={additionalFields} onChange={(e) => setAdditionalFields(e.target.value)} placeholder="Any other relevant info" />


                        <button type="submit" className="submit-btn">Update Professional Details</button>

                    </form>

                </div>

            </div>

        </div>

    );

};



export default UpdateProfessionalDetails; 