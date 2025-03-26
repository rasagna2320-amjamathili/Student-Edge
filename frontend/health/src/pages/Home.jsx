import { Link } from "react-router-dom";
import "./Homepage.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-card">
        <h1 className="home-title">Student Profiling</h1>
        <p className="home-text">
          "Empowering Students with a Smart Profiling System – Showcase Skills, Projects & Achievements Effortlessly!"
        </p>
        <div className="home-buttons">
          <Link to="/login">
            <button className="button-blue">Student Login</button>
          </Link>
          <Link to="/cdc-login">
            <button className="button-green">CDC Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;






