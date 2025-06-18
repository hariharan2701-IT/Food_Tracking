import React from 'react';
import { Calendar, Utensils, Sun, CloudSun, Moon, Calculator } from 'lucide-react';
import { TrackingData, FoodEntry } from '../../types';

interface FoodTrackingTableProps {
  trackingData: TrackingData;
  currentDay: number;
  onUpdateEntry: (day: number, field: keyof FoodEntry, value: string) => void;
}

export const FoodTrackingTable: React.FC<FoodTrackingTableProps> = ({
  trackingData,
  currentDay,
  onUpdateEntry,
}) => {
  const getDayStatus = (day: number) => {
    if (day < currentDay) return 'past';
    if (day === currentDay) return 'current';
    return 'future';
  };

  const getDayStyles = (day: number) => {
    const status = getDayStatus(day);
    switch (status) {
      case 'past':
        return 'bg-gray-50 border-gray-200';
      case 'current':
        return 'bg-blue-50 border-blue-300 ring-2 ring-blue-200';
      case 'future':
        return 'bg-white border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getInputStyles = (day: number) => {
    const status = getDayStatus(day);
    const baseStyles = 'w-full px-3 py-2 text-sm border rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    
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
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">30-Day Food Tracking</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-24">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Day
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Morning
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-orange-500" />
                  Noon
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 min-w-48">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-500" />
                  Evening
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 w-32">
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
              const entry = trackingData[day];
              const status = getDayStatus(day);
              
              return (
                <tr key={day} className={`${getDayStyles(day)} hover:bg-blue-25 transition-colors duration-150`}>
                  <td className="px-6 py-4">
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
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={entry.morning}
                      onChange={(e) => onUpdateEntry(day, 'morning', e.target.value)}
                      placeholder="Enter morning meal..."
                      className={getInputStyles(day)}
                      disabled={status === 'future'}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={entry.noon}
                      onChange={(e) => onUpdateEntry(day, 'noon', e.target.value)}
                      placeholder="Enter noon meal..."
                      className={getInputStyles(day)}
                      disabled={status === 'future'}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={entry.evening}
                      onChange={(e) => onUpdateEntry(day, 'evening', e.target.value)}
                      placeholder="Enter evening meal..."
                      className={getInputStyles(day)}
                      disabled={status === 'future'}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={entry.totalCalories}
                      onChange={(e) => onUpdateEntry(day, 'totalCalories', e.target.value)}
                      placeholder="0"
                      className={getInputStyles(day)}
                      disabled={status === 'future'}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};