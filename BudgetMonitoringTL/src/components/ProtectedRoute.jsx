import { Navigate } from "react-router-dom";
import { hasAccess } from "../utils/accessControl";

const ProtectedRoute = ({ path, children }) => {
  const allowed = hasAccess(path);

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
