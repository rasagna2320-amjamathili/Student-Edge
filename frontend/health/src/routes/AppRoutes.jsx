import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CdcLogin from "../pages/CdcLogin"; // ✅ Import CDC Login
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword"; 
import StudentHome from "../pages/StudentHome"; 
import ProtectedRoute from "../routes/ProtectedRoute"; 
import StudentProfile from "../pages/StudentProfile"; 
import ChangePassword from '../pages/ChangePassword.jsx';
import ProfilePage from "../pages/ProfilePage";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cdc-login" element={<CdcLogin />} /> 
      <Route path="/student-home" element={<StudentHome />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/student-profile" element={<StudentProfile />} /> 
      <Route path="/change-password" element={<ChangePassword />}/>
      <Route path="/profile/:id" element={<ProfilePage />} />

 
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;



