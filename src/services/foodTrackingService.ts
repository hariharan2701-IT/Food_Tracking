import { supabase } from '../lib/supabase';
import { CycleData, TrackingData, FoodEntry } from '../types';
import { dateUtils } from '../utils/dateUtils';

export class FoodTrackingService {
  static async getCurrentCycle(userId: string): Promise<{ cycle: CycleData | null; error: string | null }> {
    try {
      // Get the latest cycle for the user
      const { data: cycleData, error: cycleError } = await supabase
        .from('food_cycles')
        .select('*')
        .eq('user_id', userId)
        .order('cycle_number', { ascending: false })
        .limit(1)
        .single();

      if (cycleError && cycleError.code !== 'PGRST116') {
        return { cycle: null, error: cycleError.message };
      }

      if (!cycleData) {
        // Create first cycle
        return await this.createNewCycle(userId, 1);
      }

      // Check if current cycle is complete
      if (dateUtils.isCycleComplete(cycleData.start_date)) {
        return await this.createNewCycle(userId, cycleData.cycle_number + 1);
      }

      // Get food entries for this cycle
      const { data: entriesData, error: entriesError } = await supabase
        .from('food_entries')
        .select('*')
        .eq('cycle_id', cycleData.id)
        .order('day_number');

      if (entriesError) {
        return { cycle: null, error: entriesError.message };
      }

      // Convert to TrackingData format
      const trackingData: TrackingData = {};
      for (let i = 1; i <= 30; i++) {
        const entry = entriesData.find(e => e.day_number === i);
        trackingData[i] = {
          morning: entry?.morning || '',
          noon: entry?.noon || '',
          evening: entry?.evening || '',
          totalCalories: entry?.total_calories || '',
        };
      }

      const cycle: CycleData = {
        id: cycleData.id,
        cycleNumber: cycleData.cycle_number,
        startDate: cycleData.start_date,
        trackingData,
        userId,
      };

      return { cycle, error: null };
    } catch (error) {
      return { cycle: null, error: 'An unexpected error occurred' };
    }
  }

  static async createNewCycle(userId: string, cycleNumber: number): Promise<{ cycle: CycleData | null; error: string | null }> {
    try {
      // Create new cycle
      const { data: cycleData, error: cycleError } = await supabase
        .from('food_cycles')
        .insert({
          user_id: userId,
          cycle_number: cycleNumber,
          start_date: dateUtils.getCurrentDate(),
        })
        .select()
        .single();

      if (cycleError) {
        return { cycle: null, error: cycleError.message };
      }

      // Create empty food entries for all 30 days in batches for better performance
      const batchSize = 10;
      const entries = [];
      
      for (let i = 1; i <= 30; i++) {
        entries.push({
          cycle_id: cycleData.id,
          day_number: i,
          morning: '',
          noon: '',
          evening: '',
          total_calories: '',
        });
      }

      // Insert entries in batches
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        const { error: entriesError } = await supabase
          .from('food_entries')
          .insert(batch);

        if (entriesError) {
          return { cycle: null, error: entriesError.message };
        }
      }

      // Create tracking data
      const trackingData: TrackingData = {};
      for (let i = 1; i <= 30; i++) {
        trackingData[i] = {
          morning: '',
          noon: '',
          evening: '',
          totalCalories: '',
        };
      }

      const cycle: CycleData = {
        id: cycleData.id,
        cycleNumber: cycleData.cycle_number,
        startDate: cycleData.start_date,
        trackingData,
        userId,
      };

      return { cycle, error: null };
    } catch (error) {
      return { cycle: null, error: 'An unexpected error occurred' };
    }
  }

  static async updateFoodEntry(
    cycleId: string,
    day: number,
    field: keyof FoodEntry,
    value: string
  ): Promise<{ error: string | null }> {
    try {
      const updateData: any = {};
      
      switch (field) {
        case 'morning':
          updateData.morning = value;
          break;
        case 'noon':
          updateData.noon = value;
          break;
        case 'evening':
          updateData.evening = value;
          break;
        case 'totalCalories':
          updateData.total_calories = value;
          break;
      }

      const { error } = await supabase
        .from('food_entries')
        .update(updateData)
        .eq('cycle_id', cycleId)
        .eq('day_number', day);

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  static async restartFromCycle1(userId: string): Promise<{ cycle: CycleData | null; error: string | null }> {
    try {
      // Delete all existing cycles and entries for the user
      const { error: deleteError } = await supabase
        .from('food_cycles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        return { cycle: null, error: deleteError.message };
      }

      // Create new cycle starting from 1
      return await this.createNewCycle(userId, 1);
    } catch (error) {
      return { cycle: null, error: 'An unexpected error occurred' };
    }
  }

  // Batch update multiple entries for better performance
  static async batchUpdateEntries(
    updates: Array<{
      cycleId: string;
      day: number;
      field: keyof FoodEntry;
      value: string;
    }>
  ): Promise<{ error: string | null }> {
    try {
      const promises = updates.map(update => 
        this.updateFoodEntry(update.cycleId, update.day, update.field, update.value)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error).map(result => result.error);

      if (errors.length > 0) {
        return { error: `Failed to update ${errors.length} entries` };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred during batch update' };
    }
  }
}