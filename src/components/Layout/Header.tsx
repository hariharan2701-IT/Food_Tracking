import React from 'react';
import { LogOut, Calendar, Trophy, RotateCcw, Download } from 'lucide-react';
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
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Personal Food Tracking</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.username}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Cycle {cycleNumber} • Day {currentDay}/30
              </span>
            </div>

            <button
              onClick={onDownloadPDF}
              className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={onStartNewCycle}
              className="hidden sm:inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              <Trophy className="w-4 h-4" />
              New Cycle
            </button>

            <button
              onClick={onRestartFromCycle1}
              className="hidden sm:inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Cycle {cycleNumber} • Day {currentDay}/30
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onDownloadPDF}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={onStartNewCycle}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              <Trophy className="w-4 h-4" />
              New
            </button>
            <button
              onClick={onRestartFromCycle1}
              className="flex items-center justify-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};