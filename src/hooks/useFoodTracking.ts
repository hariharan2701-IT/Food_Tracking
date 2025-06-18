import { useState, useEffect } from 'react';
import { CycleData, TrackingData, FoodEntry } from '../types';
import { storage } from '../utils/storage';
import { dateUtils } from '../utils/dateUtils';

const createEmptyTrackingData = (): TrackingData => {
  const data: TrackingData = {};
  for (let i = 1; i <= 30; i++) {
    data[i] = {
      morning: '',
      noon: '',
      evening: '',
      totalCalories: '',
    };
  }
  return data;
};

const createNewCycle = (cycleNumber: number = 1, userId: string): CycleData => ({
  cycleNumber,
  startDate: dateUtils.getCurrentDate(),
  trackingData: createEmptyTrackingData(),
  userId,
});

export const useFoodTracking = () => {
  const [currentCycle, setCurrentCycle] = useState<CycleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const savedCycleData = storage.getCycleData(currentUser.id);
    
    if (savedCycleData) {
      // Check if current cycle is complete and needs to reset
      if (dateUtils.isCycleComplete(savedCycleData.startDate)) {
        const newCycle = createNewCycle(savedCycleData.cycleNumber + 1, currentUser.id);
        setCurrentCycle(newCycle);
        storage.setCycleData(newCycle);
      } else {
        setCurrentCycle(savedCycleData);
      }
    } else {
      // First time user - create initial cycle
      const initialCycle = createNewCycle(1, currentUser.id);
      setCurrentCycle(initialCycle);
      storage.setCycleData(initialCycle);
    }
    
    setIsLoading(false);
  }, []);

  const updateFoodEntry = (day: number, field: keyof FoodEntry, value: string): void => {
    if (!currentCycle) return;

    const updatedCycle = {
      ...currentCycle,
      trackingData: {
        ...currentCycle.trackingData,
        [day]: {
          ...currentCycle.trackingData[day],
          [field]: value,
        },
      },
    };
    
    setCurrentCycle(updatedCycle);
    storage.setCycleData(updatedCycle);
  };

  const startNewCycle = (): void => {
    if (!currentCycle) return;

    const newCycle = createNewCycle(currentCycle.cycleNumber + 1, currentCycle.userId);
    setCurrentCycle(newCycle);
    storage.setCycleData(newCycle);
  };

  const restartFromCycle1 = (): void => {
    if (!currentCycle) return;

    const restartedCycle = createNewCycle(1, currentCycle.userId);
    setCurrentCycle(restartedCycle);
    storage.setCycleData(restartedCycle);
  };

  const getCurrentDay = (): number => {
    if (!currentCycle) return 1;
    return dateUtils.getCurrentDayInCycle(currentCycle.startDate);
  };

  const getRemainingDays = (): number => {
    if (!currentCycle) return 30;
    return dateUtils.getRemainingDays(currentCycle.startDate);
  };

  return {
    currentCycle: currentCycle || createNewCycle(1, 'temp'),
    isLoading,
    updateFoodEntry,
    startNewCycle,
    restartFromCycle1,
    getCurrentDay,
    getRemainingDays,
  };
};