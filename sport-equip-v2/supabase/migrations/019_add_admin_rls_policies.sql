-- RLS Policies for Admin Access
-- Allow admins to read/write all data

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can read all products" ON produits;
DROP POLICY IF EXISTS "Admins can insert products" ON produits;
DROP POLICY IF EXISTS "Admins can update products" ON produits;
DROP POLICY IF EXISTS "Admins can delete products" ON produits;

DROP POLICY IF EXISTS "Admins can read all orders" ON commandes;
DROP POLICY IF EXISTS "Admins can update orders" ON commandes;

DROP POLICY IF EXISTS "Admins can read all users" ON profiles;
DROP POLICY IF EXISTS "Admins can update users" ON profiles;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_role(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin', 'gestionnaire_stock', 'caissier')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products - Admin policies
CREATE POLICY "Admins can read all products" ON produits
FOR SELECT TO authenticated
USING (is_admin_role(auth.uid()));

CREATE POLICY "Admins can insert products" ON produits
FOR INSERT TO authenticated
WITH CHECK (is_admin_role(auth.uid()));

CREATE POLICY "Admins can update products" ON produits
FOR UPDATE TO authenticated
USING (is_admin_role(auth.uid()))
WITH CHECK (is_admin_role(auth.uid()));

CREATE POLICY "Admins can delete products" ON produits
FOR DELETE TO authenticated
USING (is_admin_role(auth.uid()));

-- Orders - Admin policies
CREATE POLICY "Admins can read all orders" ON commandes
FOR SELECT TO authenticated
USING (is_admin_role(auth.uid()));

CREATE POLICY "Admins can update orders" ON commandes
FOR UPDATE TO authenticated
USING (is_admin_role(auth.uid()))
WITH CHECK (is_admin_role(auth.uid()));

-- Profiles - Admin policies
CREATE POLICY "Admins can read all users" ON profiles
FOR SELECT TO authenticated
USING (is_admin_role(auth.uid()));

CREATE POLICY "Admins can update users" ON profiles
FOR UPDATE TO authenticated
USING (is_admin_role(auth.uid()))
WITH CHECK (is_admin_role(auth.uid()));

-- Grant necessary privileges
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE produits TO authenticated;
GRANT ALL ON TABLE commandes TO authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
