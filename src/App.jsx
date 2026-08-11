import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RundownAuth from './rundown-auth';
import RundownDashboard from './rundown-dashboard';
import RundownHero from './rundown-hero';
import RundownHomepageSections from './rundown-homepage-sections';

// 1. On crée une vue qui assemble les deux parties de ta page d'accueil
function LandingPage() {
  return (
    <main>
      <RundownHero />
      <RundownHomepageSections />
    </main>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique par défaut : La vitrine */}
        <Route path="/" element={<LandingPage />} />

        {/* Route publique : Formulaire d'authentification */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <RundownAuth onLogin={() => setIsAuthenticated(true)} />
        } />
        
        {/* Route protégée : Tableau de bord */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <RundownDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Redirection si l'utilisateur tape une URL qui n'existe pas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;