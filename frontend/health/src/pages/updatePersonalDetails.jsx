import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdatePersonalDetails.css"; 


const UpdatePersonalDetails = () => {
  const [student, setStudent] = useState(null);
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
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      fetchPersonalDetails();
  }, []);

  const fetchPersonalDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("You need to be logged in.");
          return;
      }
      try {
          const response = await axios.get("http://localhost:5000/api/students/personal-details", {
              headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          setStudent(data);
          setDob(data.dob || "");
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
          
          alert("Failed to load background details.");
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
  const inputStyle = {
    width: '200px',  // Example width
    height: '30px', // Example height
    fontSize: '16px', //optional
    padding: '10px'
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

          formData.append("dob", dob);
          formData.append("contact", contact);
          formData.append("address", address);
          formData.append("motherName", motherName);
          formData.append("fatherName", fatherName);
          formData.append("schoolName", schoolName);
          formData.append("schoolLocation", schoolLocation);
          formData.append("schoolPercentage", schoolPercentage);
          formData.append("schoolBoard", schoolBoard);
          formData.append("interCollegeName", interCollegeName);
          formData.append("interLocation", interLocation);
          formData.append("interStream", interStream);
          formData.append("interPercentage", interPercentage);
          formData.append("interBoard", interBoard);
          formData.append("achievements", achievements);
          //console.log("Form Data being sent:", formData);
          
          if (profilePicture) {
              formData.append("profilePicture", profilePicture);
          }

          const response = await axios.put("http://localhost:5000/api/students/personal-details", formData, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });

          if (response.status === 200) {
              alert("Background details updated successfully!");
              navigate("/personal-details"); // Redirect to the personal details page or any other page
          } else {
              alert("Failed to update background details.");
          }
      } catch (error) {
          console.error("Error updating background details:", error);
          alert("An error occurred while updating.");
      }
  };

  return (
      <div className="profile-container">
          <div className="profile-card">
              <div className="photo-section">
                
                      <div className="profile-pic-circle" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                          {profilePicturePreview ? (
                              <img src={profilePicturePreview} alt="Profile" className="profile-pic" style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}/>
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
                  <h2>Update Background Details</h2>
                  <form onSubmit={handleSubmit}>
                    <div id="DOB">
                    <label  id = "DOBLabel">Date of Birth</label>

                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle}  />
                    </div>
                      

                      <label>Contact Number</label>
                      <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Your contact number" />

                      <label>Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" />

                      <label>Mother's Name</label>
                      <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Mother's name" />

                      <label>Father's Name</label>
                      <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Father's name" />

                      <label>School Name</label>
                      <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="School name" />

                      <label>School Location</label>
                      <input type="text" value={schoolLocation} onChange={(e) => setSchoolLocation(e.target.value)} placeholder="School location" />

                      <label>School Percentage</label>
                      <input type="text" value={schoolPercentage} onChange={(e) => setSchoolPercentage(e.target.value)} placeholder="School percentage" />

                      <label>School Board</label>
                      <input type="text" value={schoolBoard} onChange={(e) => setSchoolBoard(e.target.value)} placeholder="e.g., CBSE, ICSE" />

                      <label>Intermediate College Name</label>
                      <input type="text" value={interCollegeName} onChange={(e) => setInterCollegeName(e.target.value)} placeholder="Intermediate college name" />

                      <label>Intermediate Location</label>
                      <input type="text" value={interLocation} onChange={(e) => setInterLocation(e.target.value)} placeholder="Intermediate location" />

                      <label>Intermediate Stream</label>
                      <input type="text" value={interStream} onChange={(e) => setInterStream(e.target.value)} placeholder="e.g., MPC, BiPC" />

                      <label>Intermediate Percentage</label>
                      <input type="text" value={interPercentage} onChange={(e) => setInterPercentage(e.target.value)} placeholder="Intermediate percentage" />

                      <label>Intermediate Board</label>
                      <input type="text" value={interBoard} onChange={(e) => setInterBoard(e.target.value)} placeholder="e.g., Board of Intermediate Education" />

                      <label>Achievements (comma-separated)</label>
                      <input type="text" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="e.g., Award, Recognition" />

                      <button type="submit" className="submit-btn">Update Details</button>
                  </form>
              </div>
          </div>
      </div>
  );
};

export default UpdatePersonalDetails;


