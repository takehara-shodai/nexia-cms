/*
  # Remove todos table and related objects

  1. Changes
    - Remove todos table and its trigger
    - Keep update_timestamp() function since other tables depend on it
*/

DO $$ 
BEGIN
    -- Remove the trigger if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_todos_timestamp'
    ) THEN
        DROP TRIGGER IF EXISTS update_todos_timestamp ON public.todos;
    END IF;

    -- Remove the todos table if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'todos'
    ) THEN
        DROP TABLE IF EXISTS public.todos;
    END IF;
END $$;