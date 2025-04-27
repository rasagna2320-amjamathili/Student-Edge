import { Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext"; // Ensure the correct path
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Assuming `AuthContext` provides a `user` object

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
