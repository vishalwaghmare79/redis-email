import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedLayout = () => {
  const { token } = useAuth();

  const isAuthenticated = token || localStorage.getItem("token");
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
