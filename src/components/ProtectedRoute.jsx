import { useLocation, Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ isRedirect: true }} />
  }

  return children;
}

export default ProtectedRoute;