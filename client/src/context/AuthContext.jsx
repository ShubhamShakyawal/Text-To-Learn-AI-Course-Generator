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
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'google' or 'email'

  const navigate = useNavigate();

  // On mount — ask the server if we have a valid session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const serverUser = await getMe(); // returns UserDTO or null
        if (serverUser) {
          setUser(serverUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session validation failed:', err);
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
   * Stores the returned UserDTO in React state only — no localStorage.
   * Fires 'auth:login' so CourseContext refreshes and picks up transferred guest courses.
   *
   * @param {UserDTO} userData - the user object returned by the backend
   */
  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    closeModal();
    // Signal CourseContext to re-fetch (picks up transferred guest courses)
    window.dispatchEvent(new Event('auth:login'));
  };

  /**
   * Logs out by invalidating the server session, then clears React state.
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
