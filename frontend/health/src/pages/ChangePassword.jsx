import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css"; 

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState(""); // For displaying validation messages
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setPasswordRequirements(""); // Clear previous requirements
        setLoading(true);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setMessage("All fields are required.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage("New password and confirm password do not match.");
            setLoading(false);
            return;
        }

        // Password Validation
        if (newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setMessage("Password does not meet requirements:");
            setPasswordRequirements(
                <ul>
                    {newPassword.length < 8 && <li className="error">At least 8 characters</li>}
                    {!/[A-Z]/.test(newPassword) && <li className="error">At least one uppercase letter</li>}
                    {!/[a-z]/.test(newPassword) && <li className="error">At least one lowercase letter</li>}
                    {!/[0-9]/.test(newPassword) && <li className="error">At least one number</li>}
                    {!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) && <li className="error">At least one special character</li>}
                </ul>
            );
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
                {passwordRequirements && (
                    <div className="password-requirements">
                        {passwordRequirements}
                    </div>
                )}
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <div className="password-field">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                👁️
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <div className="password-field">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                👁️
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                        <div className="password-field">
                            <input
                                type={showConfirmNewPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            >
                                👁️
                            </button>
                        </div>
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
