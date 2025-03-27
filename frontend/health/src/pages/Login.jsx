import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE_URL = "http://172.16.4.89:5000"; // Backend IP

const Login = () => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/login`, { rollNo, password, role: "student" });
      localStorage.setItem("token", res.data.token);

      // Fetch Student Data
      const studentRes = await axios.get(`${BASE_URL}/api/student-profile`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      console.log(studentRes.data); // Handle student data here

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Student Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Roll No" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} style={{ color: "white" }}>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;
