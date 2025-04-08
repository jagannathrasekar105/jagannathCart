import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ While checking auth status, don't render anything
  if (loading) {
    return null; // Or add a loader here if desired
  }

  // ❌ Not logged in? Redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Authenticated, render children
  return children;
}
