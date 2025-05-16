/*
  # Remove todos table and related objects

  1. Changes
    - Remove todos table and its trigger
    - Keep update_timestamp() function since other tables depend on it
*/

-- Remove the trigger first
DROP TRIGGER IF EXISTS update_todos_timestamp ON public.todos;

-- Remove the todos table
DROP TABLE IF EXISTS public.todos;