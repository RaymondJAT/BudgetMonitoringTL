import { Navigate, useLocation } from "react-router-dom";
import { hasAccess } from "../utils/accessControl";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ path, children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // No token → refresh to login
  if (!token) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      return null;
    }
  } catch (err) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    return null;
  }

  // Check route access
  const allowed = hasAccess(path);
  if (!allowed) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    return null;
  }

  return children;
};

export default ProtectedRoute;
