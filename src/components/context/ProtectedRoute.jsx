import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
