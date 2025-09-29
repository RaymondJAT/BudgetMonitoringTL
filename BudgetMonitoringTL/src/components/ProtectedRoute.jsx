import { Navigate, useLocation } from "react-router-dom";
import { hasAccess } from "../utils/accessControl";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ path, children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Check token
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      return (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      );
    }
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Check route access
  const allowed = hasAccess(path);
  if (!allowed) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
