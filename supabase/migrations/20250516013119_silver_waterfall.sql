/*
  # Initial Schema Setup
  
  1. New Tables
    - `todos` table for managing user tasks
      - `id` (uuid, primary key)
      - `task` (text, required)
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid)
  
  2. Security
    - Enable RLS on todos table
    - Add policies for CRUD operations
    
  3. Functions
    - Add timestamp update function and trigger
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create necessary schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can view their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can view their own todos" 
    ON public.todos FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can create their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can create their own todos" 
    ON public.todos FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can update their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can update their own todos" 
    ON public.todos FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' AND policyname = 'Authenticated users can delete their own todos'
  ) THEN
    CREATE POLICY "Authenticated users can delete their own todos" 
    ON public.todos FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add timestamp update trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_todos_timestamp'
  ) THEN
    CREATE TRIGGER update_todos_timestamp
    BEFORE UPDATE ON public.todos
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END $$;