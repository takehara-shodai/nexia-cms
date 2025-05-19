-- Create contents table
CREATE TABLE IF NOT EXISTS "nexia-cms-contents" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE "nexia-cms-contents" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "nexia-cms-contents"
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "nexia-cms-contents"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "nexia-cms-contents"
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON "nexia-cms-contents"
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nexia_cms_contents_updated_at
  BEFORE UPDATE ON "nexia-cms-contents"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 