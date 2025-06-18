import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const { 
    user, 
    isLoading, 
    showRegister, 
    login, 
    register, 
    logout, 
    switchToRegister, 
    switchToLogin, 
    isAuthenticated 
  } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Personal Food Tracking System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (showRegister) {
      return <RegisterForm onRegister={register} onSwitchToLogin={switchToLogin} />;
    }
    return <LoginForm onLogin={login} onSwitchToRegister={switchToRegister} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;