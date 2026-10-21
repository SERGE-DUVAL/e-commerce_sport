import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      // Vérifier si le token est expiré
      try {
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenPayload.exp < currentTime) {
          // Token expiré, déconnecter l'utilisateur
          logout();
        } else {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          
          // Configurer un timeout pour déconnecter automatiquement après expiration
          const timeUntilExpiry = (tokenPayload.exp - currentTime) * 1000;
          const timeoutId = setTimeout(() => {
            logout();
          }, timeUntilExpiry);
          
          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        // Erreur lors de la vérification du token, déconnecter
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Configurer un timeout pour déconnecter automatiquement après 1 heure
    try {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (tokenPayload.exp - currentTime) * 1000;
      const timeoutId = setTimeout(() => {
        logout();
      }, timeUntilExpiry);
      
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Erreur lors de la configuration du timeout:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
