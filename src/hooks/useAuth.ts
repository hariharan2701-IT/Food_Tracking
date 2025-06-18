import { useState, useEffect } from 'react';
import { User, RegisterData } from '../types';
import { storage } from '../utils/storage';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456',
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser && savedUser.isAuthenticated) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check admin credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin',
        username: ADMIN_CREDENTIALS.username,
        email: 'admin@foodtrack.com',
        isAuthenticated: true,
        isAdmin: true,
      };
      setUser(adminUser);
      storage.setUser(adminUser);
      return true;
    }

    // Check registered users
    const registeredUsers = storage.getRegisteredUsers();
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userToLogin: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        isAuthenticated: true,
        isAdmin: false,
      };
      setUser(userToLogin);
      storage.setUser(userToLogin);
      return true;
    }

    return false;
  };

  const register = (data: RegisterData): boolean => {
    const registeredUsers = storage.getRegisteredUsers();
    
    // Check if username or email already exists
    const userExists = registeredUsers.some(u => 
      u.username === data.username || u.email === data.email
    );
    
    if (userExists) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      password: data.password,
    };

    registeredUsers.push(newUser);
    storage.setRegisteredUsers(registeredUsers);

    // Auto-login the new user
    const userToLogin: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAuthenticated: true,
      isAdmin: false,
    };
    setUser(userToLogin);
    storage.setUser(userToLogin);
    
    return true;
  };

  const logout = (): void => {
    setUser(null);
    storage.removeUser();
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