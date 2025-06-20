import React, { useState } from 'react';
import { LogOut, Calendar, Trophy, RotateCcw, Download, Menu, X } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  cycleNumber: number;
  currentDay: number;
  onLogout: () => void;
  onStartNewCycle: () => void;
  onRestartFromCycle1: () => void;
  onDownloadPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cycleNumber,
  currentDay,
  onLogout,
  onStartNewCycle,
  onRestartFromCycle1,
  onDownloadPDF,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">Food Tracking</h1>
              <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">Welcome, {user.username}!</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Cycle {cycleNumber} • Day {currentDay}/30
              </span>
            </div>

            <button
              onClick={onDownloadPDF}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={onStartNewCycle}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              <Trophy className="w-4 h-4" />
              New Cycle
            </button>

            <button
              onClick={onRestartFromCycle1}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 px-3 py-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded text-xs">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span className="font-medium text-emerald-800">C{cycleNumber} D{currentDay}</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3 space-y-2">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg mb-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Cycle {cycleNumber} • Day {currentDay}/30
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onDownloadPDF();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => {
                  onStartNewCycle();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                <Trophy className="w-4 h-4" />
                New
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onRestartFromCycle1();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};