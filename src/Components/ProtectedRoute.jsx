import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/Firebase";
import '../Styles/global.css'

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-message"> ...טוען  </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
