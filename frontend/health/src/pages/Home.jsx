import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/visitor-count');
        const data = await response.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount(); // Fetch on initial load
  }, []);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
            </svg>
            <span>Student Profiling</span>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="fade-in">Empowering Students with Smart Profiling</h1>
            <p className="hero-description fade-in">
              Showcase your skills, projects, and achievements effortlessly with our profiling system.
              Stand out and connect with opportunities.
            </p>

            <div className="auth-buttons fade-in">
              <Link to="/login" className="auth-button student">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4a4 4 0 014 4a4 4 0 01-4 4a4 4 0 01-4-4a4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                </svg>
                Student Login
              </Link>
              <Link to="/cdc-login" className="auth-button cdc">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
                </svg>
                CDC Login
              </Link>
            </div>
            <div className="visitor-count">
              Total Visitors: {visitorCount}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Student Profiling System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;