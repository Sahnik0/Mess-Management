/*
  # Initial Schema for Mess Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text)
      - `full_name` (text)
      - `market_days` (text[]) - Array of selected market days
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `amount` (decimal)
      - `date` (date)
      - `items` (jsonb) - List of purchased items
      - `created_at` (timestamp)
    
    - `contributions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `amount` (decimal)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  market_days text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  amount decimal NOT NULL CHECK (amount > 0),
  date date DEFAULT CURRENT_DATE,
  items jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create contributions table
CREATE TABLE contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  amount decimal NOT NULL CHECK (amount > 0),
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Expenses policies
CREATE POLICY "Users can view all expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Contributions policies
CREATE POLICY "Users can view all contributions"
  ON contributions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own contributions"
  ON contributions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);