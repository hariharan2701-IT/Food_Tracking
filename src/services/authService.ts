import { supabase } from '../lib/supabase';
import { User, RegisterData } from '../types';

export class AuthService {
  static async signUp(data: RegisterData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', data.username)
        .single();

      if (existingUser) {
        return { user: null, error: 'Username already exists' };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user' };
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: authData.user.id,
          username: data.username,
          email: data.email,
        })
        .select()
        .single();

      if (profileError) {
        return { user: null, error: profileError.message };
      }

      const user: User = {
        id: profileData.id,
        username: profileData.username,
        email: profileData.email,
        isAuthenticated: true,
        isAdmin: profileData.is_admin,
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to sign in' };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to load user profile' };
      }

      const user: User = {
        id: profileData.id,
        username: profileData.username,
        email: profileData.email,
        isAuthenticated: true,
        isAdmin: profileData.is_admin,
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        return { user: null, error: null };
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to load user profile' };
      }

      const user: User = {
        id: profileData.id,
        username: profileData.username,
        email: profileData.email,
        isAuthenticated: true,
        isAdmin: profileData.is_admin,
      };

      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }
}