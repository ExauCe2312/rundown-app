import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './rundown.css';

export default function RundownDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bureau');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Liste des contenus provenant de Supabase
  const [contents, setContents] = useState([]);

  const [contentForm, setContentForm] = useState({
    title: '',
    platform: 'YouTube',
    date: '',
    time: '',
    mediaUrl: ''
  });
  
  const navigate = useNavigate();

  // 1. Récupérer les données depuis Supabase
  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) console.error("Erreur chargement:", error);
    else setContents(data || []);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchContents();
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 2. Enregistrer dans Supabase
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contents')
      .insert([{
        title: contentForm.title,
        platform: contentForm.platform,
        date: contentForm.date,
        time: contentForm.time,
        media_url: contentForm.mediaUrl,
        status: 'Planifié'
      }]);

    if (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    } else {
      setIsModalOpen(false);
      setContentForm({ title: '', platform: 'YouTube', date: '', time: '', mediaUrl: '' });
      fetchContents(); // Rafraîchir la liste
    }
    setLoading(false);
  };

  // 3. Supprimer de Supabase
  const handleDeleteContent = async (id) => {
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', id);

    if (error) alert("Erreur suppression : " + error.message);
    else fetchContents();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bureau':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span className="rd-mono text-xs uppercase" style={{ color: '#5B6472' }}>Tableau de bord</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               <div className="rd-line rounded p-4 bg-white">
                <span className="rd-mono text-xs" style={{ color: '#5B6472' }}>CONTENUS PLANIFIÉS</span>
                <div className="text-2xl font-bold mt-2" style={{ color: '#1C2430' }}>{contents.length}</div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rd-line rounded">
                <h3 className="rd-display text-lg font-semibold mb-2" style={{ color: '#1C2430' }}>Prochaines publications</h3>
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
          </div>
        );

      case 'contenus':
        return (
          <div>
            <h1 className="rd-display text-2xl font-semibold mb-4" style={{ color: '#1C2430' }}>Gestion des Contenus</h1>
            {contents.length === 0 ? (
              <div className="p-8 bg-white rd-line rounded text-center text-sm" style={{ color: '#5B6472' }}>
                Aucun contenu enregistré pour le moment.
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

      // (Tu peux ajouter ici les cas 'calendrier', 'statistiques', 'parametres' selon le besoin)
      default:
        return <div>Section en construction</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative" style={{ background: '#F0F1EC' }}>
      <div className="lg:hidden flex justify-between items-center p-4 bg-[#1C2430] text-[#F0F1EC]">
        <span className="rd-display text-lg font-semibold">Rundown</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-xs px-3 py-1.5 rounded bg-white/10">Menu ☰</button>
      </div>

      <aside className={`w-full lg:w-64 p-6 bg-[#1C2430] text-[#F0F1EC] ${isMobileMenuOpen ? 'flex' : 'hidden lg:flex'} flex-col`}>
        <nav className="flex flex-col gap-2">
            {['bureau', 'contenus', 'parametres'].map((item) => (
              <button key={item} onClick={() => { setActiveTab(item); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 rounded text-sm capitalize" style={{ background: activeTab === item ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}>{item}</button>
            ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{renderContent()}</main>

      {/* Modale */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl rd-line">
            <form onSubmit={handleContentSubmit}>
              <input type="text" required value={contentForm.title} onChange={(e) => setContentForm({...contentForm, title: e.target.value})} className="rd-input w-full rd-line rounded px-3 py-2 text-sm mb-4" placeholder="Titre" />
              <select value={contentForm.platform} onChange={(e) => setContentForm({...contentForm, platform: e.target.value})} className="w-full mb-4">{['YouTube', 'Instagram', 'TikTok', 'Newsletter'].map(p => <option key={p} value={p}>{p}</option>)}</select>
              <input type="date" required value={contentForm.date} onChange={(e) => setContentForm({...contentForm, date: e.target.value})} className="w-full mb-4" />
              <input type="time" required value={contentForm.time} onChange={(e) => setContentForm({...contentForm, time: e.target.value})} className="w-full mb-4" />
              <button type="submit" disabled={loading} className="w-full py-2 bg-[#1C2430] text-white rounded">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}