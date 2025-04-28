import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  // ❌ Not logged in? Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated, render children
  return children;
}
