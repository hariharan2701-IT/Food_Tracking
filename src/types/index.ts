export interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
}

export interface FoodEntry {
  morning: string;
  noon: string;
  evening: string;
  totalCalories: string;
}

export interface TrackingData {
  [day: number]: FoodEntry;
}

export interface CycleData {
  cycleNumber: number;
  startDate: string;
  trackingData: TrackingData;
  userId: string;
}

export interface AppState {
  user: User | null;
  currentCycle: CycleData;
  isLoading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}