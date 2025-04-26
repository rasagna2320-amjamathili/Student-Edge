import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CdcLogin from "../pages/CdcLogin"; 
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword"; 
import StudentHome from "../pages/StudentHome"; 
import ProtectedRoute from "../routes/ProtectedRoute"; 
import StudentProfile from "../pages/StudentProfile"; 
import ChangePassword from '../pages/ChangePassword.jsx';
import PersonalDetails from '../pages/PersonalDetails'; 
import ProfessionalDetails from '../pages/ProfessionalDetails'; 
import UpdatePersonalDetails from '../pages/updatePersonalDetails.jsx';
import UpdateProfessionalDetails from '../pages/updateProfessionalDetails.jsx';
import ProfilePage from "../pages/ProfilePage";
<Route path="/profile/:id" element={<ProfilePage />} />

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
      <Route path="/personal-details" element={<PersonalDetails />} /> 
      <Route path="/professional-details" element={<ProfessionalDetails />} /> 
      <Route path="/update-personal-details" element={<UpdatePersonalDetails />} />
      <Route path="/update-professional-details" element={<UpdateProfessionalDetails />} />

 
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



