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
  id?: string;
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

export interface SupabaseUser {
  id: string;
  auth_user_id: string;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCycle {
  id: string;
  user_id: string;
  cycle_number: number;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFoodEntry {
  id: string;
  cycle_id: string;
  day_number: number;
  morning: string;
  noon: string;
  evening: string;
  total_calories: string;
  created_at: string;
  updated_at: string;
}