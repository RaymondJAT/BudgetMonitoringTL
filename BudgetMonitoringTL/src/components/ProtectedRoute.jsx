import { Navigate, useLocation } from "react-router-dom";
import { hasAccess } from "../utils/accessControl";

const ProtectedRoute = ({ path, children }) => {
  const location = useLocation();
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
