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

