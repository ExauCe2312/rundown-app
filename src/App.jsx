import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RundownAuth from './rundown-auth';
import RundownDashboard from './rundown-dashboard';
import RundownHero from './rundown-hero';
import RundownHomepageSections from './rundown-homepage-sections';

function LandingPage() {
  return (
    <main>
      <RundownHero />
      <RundownHomepageSections />
    </main>
  );
}

function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F1EC', color: '#1C2430' }}>
        <span className="rd-mono text-sm">Vérification de la session...</span>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : <RundownAuth />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RundownDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
