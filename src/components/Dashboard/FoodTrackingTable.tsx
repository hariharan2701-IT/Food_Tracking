import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, Utensils, Sun, CloudSun, Moon, Calculator, Save, Check } from 'lucide-react';
import { TrackingData, FoodEntry } from '../../types';

interface FoodTrackingTableProps {
  trackingData: TrackingData;
  currentDay: number;
  onUpdateEntry: (day: number, field: keyof FoodEntry, value: string) => Promise<void>;
}

export const FoodTrackingTable: React.FC<FoodTrackingTableProps> = ({
  trackingData,
  currentDay,
  onUpdateEntry,
}) => {
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const getDayStatus = useCallback((day: number) => {
    if (day < currentDay) return 'past';
    if (day === currentDay) return 'current';
    return 'future';
  }, [currentDay]);

  const getDayStyles = useCallback((day: number) => {
    const status = getDayStatus(day);
    switch (status) {
      case 'past':
        return 'bg-gray-50 border-gray-200';
      case 'current':
        return 'bg-blue-50 border-blue-300 ring-1 ring-blue-200';
      case 'future':
        return 'bg-white border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  }, [getDayStatus]);

  const getInputStyles = useCallback((day: number) => {
    const status = getDayStatus(day);
    const baseStyles = 'w-full px-2 py-1.5 text-sm border rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none';
    
    switch (status) {
      case 'past':
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-700`;
      case 'current':
        return `${baseStyles} bg-white border-blue-300 text-gray-900 shadow-sm`;
      case 'future':
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-500`;
      default:
        return baseStyles;
    }
  }, [getDayStatus]);

  const handleInputChange = useCallback((day: number, field: keyof FoodEntry, value: string) => {
    const key = `${day}-${field}`;
    setPendingChanges(prev => ({ ...prev, [key]: value }));
    
    // Clear saved state when user types
    setSavedStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const handleSave = useCallback(async (day: number, field: keyof FoodEntry) => {
    const key = `${day}-${field}`;
    const value = pendingChanges[key];
    
    if (value === undefined) return;

    setSavingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await onUpdateEntry(day, field, value);
      setPendingChanges(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      setSavedStates(prev => ({ ...prev, [key]: true }));
      
      // Clear saved indicator after 2 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSavingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [pendingChanges, onUpdateEntry]);

  const getCurrentValue = useCallback((day: number, field: keyof FoodEntry) => {
    const key = `${day}-${field}`;
    return pendingChanges[key] !== undefined ? pendingChanges[key] : trackingData[day][field];
  }, [pendingChanges, trackingData]);

  const hasPendingChanges = useCallback((day: number, field: keyof FoodEntry) => {
    const key = `${day}-${field}`;
    return pendingChanges[key] !== undefined;
  }, [pendingChanges]);

  const visibleDays = useMemo(() => {
    // Show current day and surrounding days for better performance on mobile
    const start = Math.max(1, currentDay - 5);
    const end = Math.min(30, currentDay + 10);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentDay]);

  const renderInputField = useCallback((day: number, field: keyof FoodEntry, placeholder: string) => {
    const key = `${day}-${field}`;
    const value = getCurrentValue(day, field);
    const isPending = hasPendingChanges(day, field);
    const isSaving = savingStates[key];
    const isSaved = savedStates[key];
    const status = getDayStatus(day);

    return (
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => handleInputChange(day, field, e.target.value)}
          placeholder={placeholder}
          className={`${getInputStyles(day)} ${isPending ? 'border-yellow-400 bg-yellow-50' : ''}`}
          disabled={status === 'future'}
          rows={2}
        />
        {isPending && (
          <button
            onClick={() => handleSave(day, field)}
            disabled={isSaving}
            className="absolute top-1 right-1 p-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            title="Save changes"
          >
            {isSaving ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isSaved ? (
              <Check className="w-3 h-3" />
            ) : (
              <Save className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    );
  }, [getCurrentValue, hasPendingChanges, savingStates, savedStates, getDayStatus, getInputStyles, handleInputChange, handleSave]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <Utensils className="w-5 h-5 text-white" />
          <h2 className="text-lg font-bold text-white">30-Day Food Tracking</h2>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {visibleDays.map(day => {
            const entry = trackingData[day];
            const status = getDayStatus(day);
            
            return (
              <div key={day} className={`${getDayStyles(day)} rounded-lg p-4 border-2`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      status === 'current' 
                        ? 'bg-blue-600 text-white' 
                        : status === 'past'
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {day}
                    </div>
                    <span className="font-medium text-gray-700">Day {day}</span>
                  </div>
                  {status === 'current' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <label className="text-sm font-medium text-gray-700">Morning</label>
                    </div>
                    {renderInputField(day, 'morning', 'Enter morning meal...')}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CloudSun className="w-4 h-4 text-orange-500" />
                      <label className="text-sm font-medium text-gray-700">Noon</label>
                    </div>
                    {renderInputField(day, 'noon', 'Enter noon meal...')}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Moon className="w-4 h-4 text-purple-500" />
                      <label className="text-sm font-medium text-gray-700">Evening</label>
                    </div>
                    {renderInputField(day, 'evening', 'Enter evening meal...')}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="w-4 h-4 text-green-600" />
                      <label className="text-sm font-medium text-gray-700">Total Calories</label>
                    </div>
                    {renderInputField(day, 'totalCalories', '0')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-20">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Day
                </div>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Morning
                </div>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-orange-500" />
                  Noon
                </div>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-500" />
                  Evening
                </div>
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 w-32">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-green-600" />
                  Total Cal
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 30 }, (_, index) => {
              const day = index + 1;
              const status = getDayStatus(day);
              
              return (
                <tr key={day} className={`${getDayStyles(day)} hover:bg-blue-25 transition-colors duration-150`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        status === 'current' 
                          ? 'bg-blue-600 text-white' 
                          : status === 'past'
                          ? 'bg-gray-400 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {day}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {renderInputField(day, 'morning', 'Enter morning meal...')}
                  </td>
                  <td className="px-3 py-3">
                    {renderInputField(day, 'noon', 'Enter noon meal...')}
                  </td>
                  <td className="px-3 py-3">
                    {renderInputField(day, 'evening', 'Enter evening meal...')}
                  </td>
                  <td className="px-3 py-3">
                    {renderInputField(day, 'totalCalories', '0')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show All Days Button for Mobile */}
      <div className="block lg:hidden p-4 border-t border-gray-200">
        <button
          onClick={() => {
            // This could expand to show all days or navigate to a full view
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Scroll to Top
        </button>
      </div>
    </div>
  );
};