import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // On importe la connexion
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

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Au démarrage, on vérifie s'il y a une session Supabase active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. On écoute en direct les événements (connexion, déconnexion)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Nettoyage de l'écouteur
    return () => subscription.unsubscribe();
  }, []);

  // On affiche un écran de chargement le temps de vérifier la sécurité
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F1EC', color: '#1C2430' }}>
        <span className="rd-mono text-sm">Vérification de la session...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* On utilise désormais "session" au lieu de notre ancienne variable manuelle */}
        <Route path="/login" element={
          session ? <Navigate to="/dashboard" /> : <RundownAuth />
        } />
        
        <Route 
          path="/dashboard" 
          element={session ? <RundownDashboard /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;