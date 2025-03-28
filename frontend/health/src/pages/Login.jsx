import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE_URL = "http://localhost:5000"; // Backend base URL

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
      console.log("Sending login request...");

      // 🔹 Send login request
      const res = await axios.post(`${BASE_URL}/api/students/login`, {
        rollNo: rollNo.trim(),
        password: password.trim(),
      });

      console.log("Login Response:", res.data);

      if (!res?.data?.token) {
        alert("Invalid credentials.");
        setLoading(false);
        return;
      }

      // 🔹 Store token
      localStorage.setItem("token", res.data.token);

      console.log("Fetching student profile...");
      
      // 🔹 Fetch student profile
      const studentRes = await axios.get(`${BASE_URL}/api/students/profile`, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      console.log("Student Profile Response:", studentRes.data);

      // 🔹 Store user details
      localStorage.setItem("user", JSON.stringify(studentRes.data));

      // 🔹 Redirect to student home
      navigate("/student-home");
    } catch (error) {
      console.error("Login Error:", error.response?.data);
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
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;
