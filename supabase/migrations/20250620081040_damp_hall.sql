/*
  # Personal Food Tracking System Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `email` (text, unique)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `food_cycles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `cycle_number` (integer)
      - `start_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `food_entries`
      - `id` (uuid, primary key)
      - `cycle_id` (uuid, references food_cycles)
      - `day_number` (integer, 1-30)
      - `morning` (text)
      - `noon` (text)
      - `evening` (text)
      - `total_calories` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add admin policies for user management

  3. Indexes
    - Add indexes for better query performance
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create food_cycles table
CREATE TABLE IF NOT EXISTS food_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  cycle_number integer NOT NULL DEFAULT 1,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create food_entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid REFERENCES food_cycles(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  morning text DEFAULT '',
  noon text DEFAULT '',
  evening text DEFAULT '',
  total_calories text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Create policies for food_cycles
CREATE POLICY "Users can read own cycles"
  ON food_cycles
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own cycles"
  ON food_cycles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own cycles"
  ON food_cycles
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own cycles"
  ON food_cycles
  FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Create policies for food_entries
CREATE POLICY "Users can read own entries"
  ON food_entries
  FOR SELECT
  TO authenticated
  USING (cycle_id IN (
    SELECT fc.id FROM food_cycles fc
    JOIN user_profiles up ON fc.user_id = up.id
    WHERE up.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own entries"
  ON food_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (cycle_id IN (
    SELECT fc.id FROM food_cycles fc
    JOIN user_profiles up ON fc.user_id = up.id
    WHERE up.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own entries"
  ON food_entries
  FOR UPDATE
  TO authenticated
  USING (cycle_id IN (
    SELECT fc.id FROM food_cycles fc
    JOIN user_profiles up ON fc.user_id = up.id
    WHERE up.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own entries"
  ON food_entries
  FOR DELETE
  TO authenticated
  USING (cycle_id IN (
    SELECT fc.id FROM food_cycles fc
    JOIN user_profiles up ON fc.user_id = up.id
    WHERE up.auth_user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_food_cycles_user_id ON food_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_food_cycles_cycle_number ON food_cycles(cycle_number);
CREATE INDEX IF NOT EXISTS idx_food_entries_cycle_id ON food_entries(cycle_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_day_number ON food_entries(day_number);

-- Create unique constraint for user cycle numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_cycle ON food_cycles(user_id, cycle_number);

-- Create unique constraint for cycle day entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_cycle_day ON food_entries(cycle_id, day_number);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_cycles_updated_at
  BEFORE UPDATE ON food_cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_entries_updated_at
  BEFORE UPDATE ON food_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();