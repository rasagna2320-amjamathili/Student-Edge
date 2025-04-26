import { useAuth } from "./context/AuthContext"; 
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ConditionalNavbar />
      <AppRoutes />
    </div>
  );
}

function ConditionalNavbar() {
  const { user } = useAuth(); 

  return user ? <Navbar /> : null; 
}

export default App;

/*

import React from "react";
import { Routes, Route } from "react-router-dom";
import Test from "./Test";
import StudentHome from "./pages/StudentHome";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/student-home" element={<StudentHome />} />
    </Routes>
  );
};

export default App;
*/