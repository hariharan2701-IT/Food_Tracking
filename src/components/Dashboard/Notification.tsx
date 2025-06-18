import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationProps {
  remainingDays: number;
  cycleNumber: number;
}

export const Notification: React.FC<NotificationProps> = ({ remainingDays, cycleNumber }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Show notification on component mount
    setIsVisible(true);
    
    // Auto-hide after 10 seconds if not minimized
    const timer = setTimeout(() => {
      if (!isMinimized) {
        setIsVisible(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [remainingDays, cycleNumber, isMinimized]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg shadow-2xl border border-white/20 max-w-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Cycle {cycleNumber} Progress</h3>
              {!isMinimized && (
                <p className="text-xs text-blue-100 mt-1">
                  {remainingDays > 0 
                    ? `${remainingDays} days remaining in your 30-day tracking cycle!`
                    : 'Your 30-day cycle is complete! 🎉'
                  }
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMinimize}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200"
            >
              <div className={`w-3 h-0.5 bg-white transition-transform duration-200 ${isMinimized ? 'rotate-0' : 'rotate-180'}`}></div>
            </button>
            <button
              onClick={handleClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className="px-4 pb-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
                style={{ width: `${Math.max(0, 100 - (remainingDays / 30) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-100 mt-2 text-center">
              {30 - remainingDays}/30 days completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};