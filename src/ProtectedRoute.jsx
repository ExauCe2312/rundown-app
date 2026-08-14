import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// À utiliser autour de toute page qui doit être réservée aux utilisateurs connectés.
// Exemple : <ProtectedRoute><RundownDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F0F1EC", color: "#1C2430" }}
      >
        <span className="rd-mono text-sm">Vérification de la session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
