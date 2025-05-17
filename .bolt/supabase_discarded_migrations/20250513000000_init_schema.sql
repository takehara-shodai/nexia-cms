-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create necessary schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- Set up RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-super-secret-jwt-token-with-at-least-32-characters-long';

-- Create sample tables
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- Add RLS policies
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for todos table
CREATE TRIGGER update_todos_timestamp
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 