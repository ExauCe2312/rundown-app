import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './rundown.css';

export default function RundownDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bureau'); // État pour gérer la vue active
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les infos de l'utilisateur connecté depuis Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Contenu dynamique selon l'onglet cliqué
  const renderContent = () => {
    switch (activeTab) {
      case 'bureau':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="rd-mono text-xs uppercase" style={{ color: '#5B6472' }}>Édition du Mardi 11 Août 2026</span>
                <h1 className="rd-display text-2xl font-semibold mt-1" style={{ color: '#1C2430' }}>
                  Bienvenue, {user?.user_metadata?.name || user?.email || 'Créateur'}
                </h1>
              </div>
              <button 
                onClick={() => alert("Fonctionnalité '+ Nouveau contenu' à venir !")}
                className="text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                style={{ background: '#1C2430', color: '#F0F1EC' }}
              >
                + Nouveau contenu
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: '#5B6472' }}>VUES TOTALES</span>
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>128 400</div>
                <span className="text-xs text-green-600 mt-1 block">▲ +12,4 %</span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: '#5B6472' }}>TAUX D'ENGAGEMENT</span>
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>6,8 %</div>
                <span className="text-xs text-green-600 mt-1 block">▲ +0,9 pt</span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: '#5B6472' }}>NOUVEAUX ABONNÉS</span>
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>2 340</div>
                <span className="text-xs text-green-600 mt-1 block">▲ +18 %</span>
              </div>
              <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: '#5B6472' }}>CONTENUS PUBLIÉS</span>
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>24 / 28</div>
                <span className="text-xs mt-1 block" style={{ color: '#5B6472' }}>86 % de l'objectif</span>
              </div>
            </div>
          </div>
        );

      case 'calendrier':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Calendrier éditorial</h1>
            <p className="text-sm" style={{ color: '#5B6472' }}>Gérez ici la programmation visuelle de vos publications multi-plateformes.</p>
            {/* Espace calendrier interactif à structurer */}
            <div className="mt-6 p-8 bg-white rd-line rounded text-center text-sm" style={{ color: '#5B6472' }}>
              Le module calendrier interactif sera branché ici.
            </div>
          </div>
        );

      case 'contenus':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Mes Contenus</h1>
            <p className="text-sm" style={{ color: '#5B6472' }}>Liste de tous vos brouillons, publications programmées et archives.</p>
            <div className="mt-6 p-8 bg-white rd-line rounded text-center text-sm" style={{ color: '#5B6472' }}>
              Aucun contenu répertorié pour le moment.
            </div>
          </div>
        );

      case 'statistiques':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Statistiques Globales</h1>
            <p className="text-sm" style={{ color: '#5B6472' }}>Analysez la croissance de votre audience en détail.</p>
            <div className="mt-6 p-8 bg-white rd-line rounded text-center text-sm" style={{ color: '#5B6472' }}>
              Graphiques d'analytique avancés en cours de conception.
            </div>
          </div>
        );

      case 'parametres':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Paramètres du compte</h1>
            <p className="text-sm mb-4" style={{ color: '#5B6472' }}>Gérez vos informations de profil et vos préférences de connexion.</p>
            <div className="p-4 bg-white rd-line rounded max-w-md">
              <p className="text-xs font-medium mb-1" style={{ color: '#5B6472' }}>E-mail connecté :</p>
              <p className="text-sm font-bold mb-4" style={{ color: '#1C2430' }}>{user?.email}</p>
              <button 
                onClick={handleLogout}
                className="text-xs font-medium px-3 py-2 rounded rd-line bg-red-50 text-red-600 hover:bg-red-100"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F0F1EC' }}>
      {/* Barre latérale (Sidebar) */}
      <aside className="w-64 flex flex-col justify-between p-6" style={{ background: '#1C2430', color: '#F0F1EC' }}>
        <div>
          <div className="mb-8">
            <span className="rd-display text-xl font-semibold">Rundown</span>
            <p className="text-xs mt-1" style={{ color: '#A0AEC0' }}>Studio de production de contenu</p>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'bureau', label: 'Bureau' },
              { id: 'calendrier', label: 'Calendrier' },
              { id: 'contenus', label: 'Contenus' },
              { id: 'statistiques', label: 'Statistiques' },
              { id: 'parametres', label: 'Paramètres' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="text-left px-3 py-2 rounded text-sm transition-colors"
                style={{
                  background: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: activeTab === item.id ? '#F0F1EC' : '#A0AEC0',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-xs pt-4 border-t border-gray-700" style={{ color: '#A0AEC0' }}>
          Connecté en tant que <br />
          <span className="font-medium text-white truncate block">{user?.user_metadata?.name || user?.email}</span>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}