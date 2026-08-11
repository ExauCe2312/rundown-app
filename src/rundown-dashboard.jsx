import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './rundown.css';

export default function RundownDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bureau');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Liste des contenus (initialisée avec un exemple ou vide)
  const [contents, setContents] = useState([
    {
      id: 1,
      title: 'Refonte de mon setup dev et astuces productivité',
      platform: 'YouTube',
      date: '2026-08-15',
      time: '18:00',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      status: 'Planifié'
    }
  ]);

  const [contentForm, setContentForm] = useState({
    title: '',
    platform: 'YouTube',
    date: '',
    time: '',
    mediaUrl: '',
    status: 'Planifié'
  });

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleContentSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...contentForm
    };
    setContents([newEntry, ...contents]);
    setIsModalOpen(false);
    setContentForm({ title: '', platform: 'YouTube', date: '', time: '', mediaUrl: '', status: 'Planifié' });
  };

  const handleDeleteContent = (id) => {
    setContents(contents.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bureau':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span className="rd-mono text-xs uppercase" style={{ color: '#5B6472' }}>Édition du Mardi 11 Août 2026</span>
                <h1 className="rd-display text-2xl font-semibold mt-1" style={{ color: '#1C2430' }}>
                  Bienvenue, {user?.user_metadata?.name || user?.email || 'Créateur'}
                </h1>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium px-4 py-2 rounded flex items-center gap-2 w-full sm:w-auto justify-center"
                style={{ background: '#1C2430', color: '#F0F1EC' }}
              >
                + Nouveau contenu
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>{contents.length} / 28</div>
                <span className="text-xs mt-1 block" style={{ color: '#5B6472' }}>Suivi en direct</span>
              </div>
            </div>

            {/* Aperçu rapide des derniers contenus programmés */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rd-line rounded">
                <h3 className="rd-display text-lg font-semibold mb-2" style={{ color: '#1C2430' }}>Prochaines publications</h3>
                <p className="text-xs mb-4" style={{ color: '#5B6472' }}>Aperçu rapide de vos planifications en cours.</p>
                {contents.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">Aucune publication planifiée.</p>
                ) : (
                  <div className="space-y-3">
                    {contents.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-3 rd-line rounded flex items-center justify-between text-sm bg-gray-50">
                        <div>
                          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-black/5 mr-2">{item.platform}</span>
                          <span className="font-medium" style={{ color: '#1C2430' }}>{item.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.date} à {item.time || '00:00'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rd-line rounded">
                <h3 className="rd-display text-lg font-semibold mb-2" style={{ color: '#1C2430' }}>Statistiques globales</h3>
                <p className="text-xs mb-4" style={{ color: '#5B6472' }}>Vues, 14 derniers jours.</p>
                <div className="h-32 flex items-center justify-center border border-dashed rounded text-xs" style={{ color: '#5B6472' }}>
                  Graphique d'activité
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendrier':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Calendrier éditorial</h1>
            <p className="text-sm mb-6" style={{ color: '#5B6472' }}>Vue d'ensemble de vos diffusions multi-plateformes programmées.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contents.map((item) => (
                <div key={item.id} className="bg-white p-4 rd-line rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#1C2430] text-[#F0F1EC]">{item.platform}</span>
                    <span className="text-xs font-mono text-gray-500">{item.date} — {item.time}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: '#1C2430' }}>{item.title}</h4>
                  {item.mediaUrl && (
                    <p className="text-xs text-blue-600 truncate mb-2">📎 Média attaché : {item.mediaUrl}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'contenus':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Gestion des Contenus</h1>
            <p className="text-sm mb-6" style={{ color: '#5B6472' }}>Retrouvez, suivez et supprimez vos publications planifiées.</p>
            
            {contents.length === 0 ? (
              <div className="p-8 bg-white rd-line rounded text-center text-sm" style={{ color: '#5B6472' }}>
                Aucun contenu enregistré pour le moment. Cliquez sur "+ Nouveau contenu".
              </div>
            ) : (
              <div className="space-y-4">
                {contents.map((item) => (
                  <div key={item.id} className="bg-white p-4 rd-line rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200" style={{ color: '#1C2430' }}>{item.platform}</span>
                        <span className="text-xs text-gray-500">📅 {item.date} à {item.time || '00:00'}</span>
                      </div>
                      <h4 className="font-medium text-base" style={{ color: '#1C2430' }}>{item.title}</h4>
                      {item.mediaUrl && <p className="text-xs text-gray-500 mt-1">Média : {item.mediaUrl}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
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
    <div className="min-h-screen flex flex-col lg:flex-row relative" style={{ background: '#F0F1EC' }}>
      
      {/* Barre de navigation mobile */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-[#1C2430] text-[#F0F1EC]">
        <span className="rd-display text-lg font-semibold">Rundown</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-xs px-3 py-1.5 rounded bg-white/10"
        >
          {isMobileMenuOpen ? 'Fermer ✕' : 'Menu ☰'}
        </button>
      </div>

      {/* Barre latérale (Sidebar) */}
      <aside 
        className={`w-full lg:w-64 flex-shrink-0 flex-col justify-between p-6 bg-[#1C2430] text-[#F0F1EC] ${
          isMobileMenuOpen ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div>
          <div className="mb-8 hidden lg:block">
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
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
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

        <div className="text-xs pt-4 border-t border-gray-700 mt-6 lg:mt-0" style={{ color: '#A0AEC0' }}>
          Connecté en tant que <br />
          <span className="font-medium text-white truncate block">{user?.user_metadata?.name || user?.email}</span>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Fenêtre Modale "Nouveau contenu" enrichie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl rd-line">
            <div className="flex justify-between items-center mb-4">
              <h3 className="rd-display text-lg font-semibold" style={{ color: '#1C2430' }}>Planifier un nouveau contenu</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-sm font-bold px-2 py-1 rounded hover:bg-gray-100"
                style={{ color: '#5B6472' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleContentSubmit}>
              <div className="mb-4">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Titre ou légende de la publication</label>
                <input
                  type="text"
                  required
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  placeholder="Ex: Mon nouveau tutoriel complet..."
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Plateforme cible</label>
                <select
                  value={contentForm.platform}
                  onChange={(e) => setContentForm({ ...contentForm, platform: e.target.value })}
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="X / Twitter">X / Twitter</option>
                  <option value="Threads">Threads</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={contentForm.date}
                    onChange={(e) => setContentForm({ ...contentForm, date: e.target.value })}
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Heure précise</label>
                  <input
                    type="time"
                    required
                    value={contentForm.time}
                    onChange={(e) => setContentForm({ ...contentForm, time: e.target.value })}
                    className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Lien du média ou de la vidéo (Optionnel)</label>
                <input
                  type="url"
                  value={contentForm.mediaUrl}
                  onChange={(e) => setContentForm({ ...contentForm, mediaUrl: e.target.value })}
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  placeholder="https://exmple.com/ma-video.mp4"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-medium px-4 py-2 rounded rd-line bg-gray-50 hover:bg-gray-100"
                  style={{ color: '#5B6472' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="text-xs font-medium px-4 py-2 rounded"
                  style={{ background: '#1C2430', color: '#F0F1EC' }}
                >
                  Programmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}