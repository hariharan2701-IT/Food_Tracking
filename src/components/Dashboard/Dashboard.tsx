import React from 'react';
import { User } from '../../types';
import { useFoodTracking } from '../../hooks/useFoodTracking';
import { Header } from '../Layout/Header';
import { FoodTrackingTable } from './FoodTrackingTable';
import { Notification } from './Notification';
import { usePDFExport } from '../../hooks/usePDFExport';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const {
    currentCycle,
    isLoading,
    error,
    updateFoodEntry,
    startNewCycle,
    restartFromCycle1,
    getCurrentDay,
    getRemainingDays,
  } = useFoodTracking(user.id);

  const { exportToPDF } = usePDFExport();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your food tracking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentCycle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No cycle data available</p>
        </div>
      </div>
    );
  }

  const currentDay = getCurrentDay();
  const remainingDays = getRemainingDays();

  const handleDownloadPDF = () => {
    exportToPDF(currentCycle, user, currentDay);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        cycleNumber={currentCycle.cycleNumber}
        currentDay={currentDay}
        onLogout={onLogout}
        onStartNewCycle={startNewCycle}
        onRestartFromCycle1={restartFromCycle1}
        onDownloadPDF={handleDownloadPDF}
      />

      <Notification
        remainingDays={remainingDays}
        cycleNumber={currentCycle.cycleNumber}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-emerald-800">Current Cycle</h3>
                <p className="text-2xl font-bold text-emerald-900">#{currentCycle.cycleNumber}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Current Day</h3>
                <p className="text-2xl font-bold text-green-900">{currentDay}/30</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800">Days Remaining</h3>
                <p className="text-2xl font-bold text-yellow-900">{remainingDays}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800">Progress</h3>
                <p className="text-2xl font-bold text-purple-900">{Math.round(((30 - remainingDays) / 30) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        <FoodTrackingTable
          trackingData={currentCycle.trackingData}
          currentDay={currentDay}
          onUpdateEntry={updateFoodEntry}
        />
      </main>
    </div>
  );
};