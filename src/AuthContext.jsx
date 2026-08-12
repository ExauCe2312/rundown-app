import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

// Ce composant "enveloppe" toute l'application (voir App.jsx) et rend
// l'utilisateur connecté disponible partout via useAuth(), sans que
// chaque page ait besoin d'appeler Supabase elle-même.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Au chargement de l'app, on vérifie si une session existe déjà
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Et on reste à l'écoute des changements (connexion, déconnexion, expiration)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      if (error.message === 'User already registered') {
        throw new Error('Un compte existe déjà avec cet e-mail.');
      }
      throw new Error(error.message);
    }
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('E-mail ou mot de passe incorrect.');
      }
      throw new Error(error.message);
    }
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Petit raccourci utilisé dans les autres composants : const { user, login } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() doit être utilisé à l’intérieur de <AuthProvider>.');
  return ctx;
}
