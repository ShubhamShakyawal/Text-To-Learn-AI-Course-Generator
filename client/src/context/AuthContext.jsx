import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, syncUser } from '../utils/api';
import AuthModal from '../components/AuthModal';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'google' or 'email'
  
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('texttolearn_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Set authorization token if we have a mock token
          setAuthToken(parsedUser.token || 'mock-jwt-token');
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('texttolearn_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = () => {
    setModalType('google');
    setIsModalOpen(true);
  };

  const loginWithEmail = () => {
    setModalType('email');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const loginUser = async (userData) => {
    const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
    const completeUser = {
      ...userData,
      token: mockToken,
    };

    setUser(completeUser);
    setIsAuthenticated(true);
    localStorage.setItem('texttolearn_user', JSON.stringify(completeUser));
    setAuthToken(mockToken);
    closeModal();

    // Trigger syncUser to backend in background (gracefully caught if backend endpoint doesn't exist)
    try {
      await syncUser({
        name: completeUser.name,
        email: completeUser.email,
        picture: completeUser.picture,
        sub: completeUser.sub || `local|${completeUser.email}`,
      });
    } catch (err) {
      console.warn('Backend sync failed, running in local-only mode:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('texttolearn_user');
    setAuthToken(null);
    closeModal();
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        logout,
        loginUser,
      }}
    >
      {children}
      
      {/* Global Authentication Modal Overlay */}
      {isModalOpen && (
        <AuthModal
          type={modalType}
          onClose={closeModal}
          onLoginSuccess={loginUser}
        />
      )}
    </AuthContext.Provider>
  );
};
