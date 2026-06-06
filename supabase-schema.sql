-- Roast My Startup AI - Supabase Database Schema

-- 1. Create a profiles/users table that automatically syncs with Supabase Auth
-- Note: If we use Supabase Auth, auth.users is handled by Supabase.
-- We can create a public.users table to store user metadata linked to auth.users.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public.users
CREATE POLICY "Allow individual read access" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow individual update access" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow individual insert access" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create startup_reports table
CREATE TABLE IF NOT EXISTS public.startup_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  idea TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  report_json JSONB NOT NULL,
  startup_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.startup_reports
ALTER TABLE public.startup_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public.startup_reports
CREATE POLICY "Allow users to view their own reports" ON public.startup_reports
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL); -- Allow anonymous user reports or owned reports

CREATE POLICY "Allow users to insert their own reports" ON public.startup_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to delete their own reports" ON public.startup_reports
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Create a trigger that automatically adds a row to public.users when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
