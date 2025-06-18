import { User, CycleData } from '../types';

const STORAGE_KEYS = {
  USER: 'personal_food_track_user',
  CYCLE_DATA: 'personal_food_track_cycle_data',
  REGISTERED_USERS: 'personal_food_track_registered_users',
} as const;

interface RegisteredUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export const storage = {
  // User authentication
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Registered users management
  getRegisteredUsers: (): RegisteredUser[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  setRegisteredUsers: (users: RegisteredUser[]): void => {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  },

  // Cycle data (user-specific)
  getCycleData: (userId: string): CycleData | null => {
    try {
      const cycleData = localStorage.getItem(`${STORAGE_KEYS.CYCLE_DATA}_${userId}`);
      return cycleData ? JSON.parse(cycleData) : null;
    } catch {
      return null;
    }
  },

  setCycleData: (cycleData: CycleData): void => {
    localStorage.setItem(`${STORAGE_KEYS.CYCLE_DATA}_${cycleData.userId}`, JSON.stringify(cycleData));
  },

  removeCycleData: (userId: string): void => {
    localStorage.removeItem(`${STORAGE_KEYS.CYCLE_DATA}_${userId}`);
  },
};