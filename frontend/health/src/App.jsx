import { useAuth } from "./context/AuthContext"; // ✅ No need to import AuthProvider here
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
  const { user } = useAuth(); // Get authentication state

  return user ? <Navbar /> : null; // Show Navbar only after login
}

export default App;

