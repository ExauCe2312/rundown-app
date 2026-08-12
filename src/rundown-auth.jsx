import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './rundown.css';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RundownAuth() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && !form.name.trim()) errs.name = 'Ce champ est requis.';
    if (!form.email.trim()) errs.email = 'Ce champ est requis.';
    else if (!validateEmail(form.email)) errs.email = 'Adresse e-mail invalide.';
    if (!form.password) errs.password = 'Ce champ est requis.';
    else if (mode === 'signup' && form.password.length < 8) errs.password = '8 caractères minimum.';
    if (mode === 'signup' && form.confirm !== form.password) errs.confirm = 'Les mots de passe ne correspondent pas.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      // Pas de redirection manuelle ici : AuthContext détecte la nouvelle
      // session et App.jsx bascule automatiquement vers /dashboard.
    } catch (err) {
      setErrors({ form: err.message || 'Une erreur est survenue. Réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  return (
    <div className="rd-root min-h-screen flex items-center justify-center px-4" style={{ background: '#F0F1EC' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="rd-display text-2xl font-semibold" style={{ color: '#1C2430' }}>Rundown</span>
        </div>

        <div className="rd-line rounded-lg p-7" style={{ background: '#FFFFFF' }}>
          <h1 className="rd-display text-2xl font-semibold mb-1" style={{ color: '#1C2430' }}>
            {mode === 'login' ? 'Bon retour' : 'Créer votre compte'}
          </h1>
          <p className="text-sm mb-6" style={{ color: '#5B6472' }}>
            {mode === 'login' ? 'Connectez-vous pour retrouver votre rundown.' : 'Commencez à publier plus, en gérant moins.'}
          </p>

          {errors.form && (
            <div className="rd-mono text-xs mb-5 px-3 py-2 rounded" style={{ background: 'rgba(181,69,47,0.08)', color: '#B5452F' }}>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  style={errors.name ? { borderColor: '#B5452F' } : undefined}
                  placeholder="Camille Duarte"
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#B5452F' }}>{errors.name}</p>}
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                style={errors.email ? { borderColor: '#B5452F' } : undefined}
                placeholder="vous@exemple.com"
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#B5452F' }}>{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                style={errors.password ? { borderColor: '#B5452F' } : undefined}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs mt-1" style={{ color: '#B5452F' }}>{errors.password}</p>}
            </div>

            {mode === 'signup' && (
              <div className="mb-5">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#1C2430' }}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={update('confirm')}
                  className="rd-input w-full rd-line rounded px-3 py-2 text-sm"
                  style={errors.confirm ? { borderColor: '#B5452F' } : undefined}
                  placeholder="••••••••"
                />
                {errors.confirm && <p className="text-xs mt-1" style={{ color: '#B5452F' }}>{errors.confirm}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-medium py-2.5 rounded mt-2"
              style={{
                background: '#1C2430',
                color: '#F0F1EC',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#5B6472' }}>
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button onClick={() => switchMode('signup')} className="font-medium underline" style={{ color: '#1C2430' }}>
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button onClick={() => switchMode('login')} className="font-medium underline" style={{ color: '#1C2430' }}>
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
