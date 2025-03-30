import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE_URL = "http://localhost:5000";

const Login = () => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!rollNo.trim() || !password.trim()) {
      alert("Roll No and Password are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/students/login`, {
        rollNo: rollNo.trim(),
        password: password.trim(),
      });

      if (!res?.data?.token) {
        alert("Invalid credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      
      const studentRes = await axios.get(`${BASE_URL}/api/students/profile`, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      localStorage.setItem("user", JSON.stringify(studentRes.data));
      navigate("/student-profile");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Student Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <a href="/forgot-password" className="forgot-link">
          Forgot Password?
        </a>
      </div>
    </div>
  );
};

export default Login;