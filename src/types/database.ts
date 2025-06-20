export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          username: string;
          email: string;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          username: string;
          email: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          username?: string;
          email?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_cycles: {
        Row: {
          id: string;
          user_id: string;
          cycle_number: number;
          start_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cycle_number?: number;
          start_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cycle_number?: number;
          start_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_entries: {
        Row: {
          id: string;
          cycle_id: string;
          day_number: number;
          morning: string;
          noon: string;
          evening: string;
          total_calories: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          day_number: number;
          morning?: string;
          noon?: string;
          evening?: string;
          total_calories?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          day_number?: number;
          morning?: string;
          noon?: string;
          evening?: string;
          total_calories?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}