import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CdcLogin.css"; // Import CSS

const CdcLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/cdcs/loginCDC", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("cdcToken", response.data.token);
        navigate("/dashboard"); // Navigate to dashboard on successful login
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="cdc-login-container">
      <div className="cdc-login-card">
        <h2>CDC Login</h2>
        
        {error && <p className="error-message" aria-live="polite">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* Button disabled until form is valid */}
          <button type="submit" disabled={!isFormValid || loading} className={isFormValid ? "active" : "disabled"}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-links">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default CdcLogin;
