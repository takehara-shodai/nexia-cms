/*
  # Initial Schema Setup
  
  1. Extensions
    - Enables vector extension for advanced search capabilities
    - Enables UUID extension for UUID generation
  
  2. Tables
    - Creates todos table with UUID primary key and timestamps
  
  3. Security
    - Enables RLS on todos table
    - Adds policies for CRUD operations
    
  4. Triggers
    - Adds updated_at timestamp trigger
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
CREATE POLICY "Authenticated users can view their own todos" 
ON public.todos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own todos" 
ON public.todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own todos" 
ON public.todos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own todos" 
ON public.todos FOR DELETE
USING (auth.uid() = user_id);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add timestamp update trigger
CREATE TRIGGER update_todos_timestamp
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();