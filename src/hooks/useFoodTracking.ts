import { useState, useEffect } from 'react';
import { CycleData, FoodEntry } from '../types';
import { FoodTrackingService } from '../services/foodTrackingService';
import { dateUtils } from '../utils/dateUtils';

export const useFoodTracking = (userId: string | null) => {
  const [currentCycle, setCurrentCycle] = useState<CycleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadCycleData = async () => {
      setIsLoading(true);
      setError(null);

      const { cycle, error: cycleError } = await FoodTrackingService.getCurrentCycle(userId);
      
      if (cycleError) {
        setError(cycleError);
      } else {
        setCurrentCycle(cycle);
      }
      
      setIsLoading(false);
    };

    loadCycleData();
  }, [userId]);

  const updateFoodEntry = async (day: number, field: keyof FoodEntry, value: string): Promise<void> => {
    if (!currentCycle?.id) return;

    // Update local state immediately for better UX
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

    // Update in database
    const { error: updateError } = await FoodTrackingService.updateFoodEntry(
      currentCycle.id,
      day,
      field,
      value
    );

    if (updateError) {
      setError(updateError);
      // Revert local state on error
      setCurrentCycle(currentCycle);
    }
  };

  const startNewCycle = async (): Promise<void> => {
    if (!currentCycle || !userId) return;

    setIsLoading(true);
    const { cycle, error: cycleError } = await FoodTrackingService.createNewCycle(
      userId,
      currentCycle.cycleNumber + 1
    );

    if (cycleError) {
      setError(cycleError);
    } else {
      setCurrentCycle(cycle);
    }
    
    setIsLoading(false);
  };

  const restartFromCycle1 = async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    const { cycle, error: cycleError } = await FoodTrackingService.restartFromCycle1(userId);

    if (cycleError) {
      setError(cycleError);
    } else {
      setCurrentCycle(cycle);
    }
    
    setIsLoading(false);
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
    currentCycle,
    isLoading,
    error,
    updateFoodEntry,
    startNewCycle,
    restartFromCycle1,
    getCurrentDay,
    getRemainingDays,
  };
};