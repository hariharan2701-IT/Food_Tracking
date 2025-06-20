import React, { useState, useEffect } from 'react';
import { Bell, X, Minus } from 'lucide-react';

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
    
    // Auto-hide after 8 seconds if not minimized
    const timer = setTimeout(() => {
      if (!isMinimized) {
        setIsVisible(false);
      }
    }, 8000);

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
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500 max-w-xs sm:max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-3 h-3 lg:w-4 lg:h-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs lg:text-sm truncate">Cycle {cycleNumber} Progress</h3>
              {!isMinimized && (
                <p className="text-xs text-blue-100 mt-1 leading-tight">
                  {remainingDays > 0 
                    ? `${remainingDays} days remaining in your 30-day cycle!`
                    : 'Your 30-day cycle is complete! 🎉'
                  }
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleMinimize}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minus className={`w-3 h-3 transition-transform duration-200 ${isMinimized ? 'rotate-90' : 'rotate-0'}`} />
            </button>
            <button
              onClick={handleClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className="px-3 pb-3 lg:px-4 lg:pb-4">
            <div className="w-full bg-white/20 rounded-full h-1.5 lg:h-2">
              <div 
                className="bg-white rounded-full h-1.5 lg:h-2 transition-all duration-500 ease-out"
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