export const dateUtils = {
  getCurrentDate: (): string => {
    return new Date().toISOString().split('T')[0];
  },

  getDaysDifference: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  getCurrentDayInCycle: (startDate: string): number => {
    const currentDate = dateUtils.getCurrentDate();
    const daysPassed = dateUtils.getDaysDifference(startDate, currentDate);
    return Math.min(daysPassed + 1, 30);
  },

  getRemainingDays: (startDate: string): number => {
    const currentDay = dateUtils.getCurrentDayInCycle(startDate);
    return Math.max(30 - currentDay + 1, 0);
  },

  isCycleComplete: (startDate: string): boolean => {
    return dateUtils.getCurrentDayInCycle(startDate) > 30;
  },

  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};