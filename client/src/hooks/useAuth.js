import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    login: context.loginWithEmail, // Map generic login to email login for backward compatibility
  };
};
