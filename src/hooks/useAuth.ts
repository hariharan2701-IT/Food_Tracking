import { useState, useEffect } from 'react';
import { User, RegisterData } from '../types';
import { AuthService } from '../services/authService';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { user: currentUser } = await AuthService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { user: currentUser } = await AuthService.getCurrentUser();
        setUser(currentUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { user: loggedInUser, error } = await AuthService.signIn(email, password);
    
    if (error) {
      console.error('Login error:', error);
      return false;
    }

    setUser(loggedInUser);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const { user: newUser, error } = await AuthService.signUp(data);
    
    if (error) {
      console.error('Registration error:', error);
      return false;
    }

    setUser(newUser);
    return true;
  };

  const logout = async (): Promise<void> => {
    await AuthService.signOut();
    setUser(null);
  };

  const switchToRegister = () => setShowRegister(true);
  const switchToLogin = () => setShowRegister(false);

  return {
    user,
    isLoading,
    showRegister,
    login,
    register,
    logout,
    switchToRegister,
    switchToLogin,
    isAuthenticated: !!user?.isAuthenticated,
  };
};