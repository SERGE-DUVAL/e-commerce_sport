-- Enable RLS on adresses table
ALTER TABLE adresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users on adresses" ON adresses;
DROP POLICY IF EXISTS "Enable insert for authenticated users on adresses" ON adresses;
DROP POLICY IF EXISTS "Enable update for authenticated users on adresses" ON adresses;
DROP POLICY IF EXISTS "Enable delete for authenticated users on adresses" ON adresses;

-- RLS for 'adresses' table
CREATE POLICY "Enable read access for authenticated users on adresses" ON adresses
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users on adresses" ON adresses
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update for authenticated users on adresses" ON adresses
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable delete for authenticated users on adresses" ON adresses
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Grant necessary privileges
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE adresses TO authenticated;
