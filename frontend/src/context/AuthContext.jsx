import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification de la session au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 1. AJOUT DE LA FONCTION REGISTER
  const register = async (fullName, email, password) => {
    try {
      const data = await authService.register(fullName, email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setIsAuthenticated(false);
      throw error; // On propage l'erreur pour la capturer dans RegisterPage
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    // 2. INJECTION DE 'register' DANS LE CONTEXTE
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      logout, 
      register 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}