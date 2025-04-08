import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./ChangePassword.css"; 

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Authentication token not found. Please log in again.");
      navigate("/login"); // Adjust your login route if different
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password updated successfully!");
        navigate(-1);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2>Change Password</h2>
        {message && (
          <p className={message.includes("success") ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="change-password-btn" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;