import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ Moved inside functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, userType) => {
    const navigate = useNavigate();  // ✅ Use inside the function
    try {
      const url = userType === "student" ? "/login" : "/api/cdc-login";
      const res = await axios.post(`http://localhost:5000${url}`, credentials);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", userType);
      setUser(res.data.user);
      setRole(userType);

      navigate(userType === "student" ? "/dashboard" : "/cdc-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    const navigate = useNavigate();  // ✅ Use inside the function
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Fix: Ensure `useAuth` is exported correctly
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
