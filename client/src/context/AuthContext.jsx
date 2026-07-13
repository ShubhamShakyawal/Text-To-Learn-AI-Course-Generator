import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout as apiLogout } from '../utils/api';
import AuthModal from '../components/AuthModal';

export const AuthContext = createContext();

/**
 * Provides authentication state to the entire application.
 *
 * Session handling:
 * - On mount, calls GET /api/auth/me to validate the session cookie with the server.
 *   If the server returns a user, the session is active. No localStorage is used.
 * - On login/register, the AuthModal calls the API and passes the UserDTO back via onLoginSuccess.
 * - On logout, calls POST /api/auth/logout to invalidate the server session.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem('user');
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'google' or 'email'

  const navigate = useNavigate();

  // On mount — ask the server if we have a valid session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const serverUser = await getMe(); // returns UserDTO
        if (serverUser) {
          setUser(serverUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(serverUser));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Session validation failed:', err);
        // Only clear the session if the server explicitly responds with 401 or 403
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
        // Otherwise (network timeouts, server 5xx restarts, database reconnecting), 
        // we keep the optimistic localStorage user to avoid logging them out.
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

  /**
   * Called by AuthModal after a successful register/login/google API call.
   * Stores the returned UserDTO in React state and localStorage.
   * Fires 'auth:login' so CourseContext refreshes and picks up transferred guest courses.
   *
   * @param {UserDTO} userData - the user object returned by the backend
   */
  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Failed to save user to localStorage:', err);
    }
    closeModal();
    // Signal CourseContext to re-fetch (picks up transferred guest courses)
    window.dispatchEvent(new Event('auth:login'));
  };

  /**
   * Logs out by invalidating the server session, then clears React state and localStorage.
   */
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Even if the server call fails, clear local state
      console.warn('Logout API call failed:', err);
    }
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('user');
    } catch (err) {
      console.warn('Failed to remove user from localStorage:', err);
    }
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
