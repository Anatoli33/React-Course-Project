import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
