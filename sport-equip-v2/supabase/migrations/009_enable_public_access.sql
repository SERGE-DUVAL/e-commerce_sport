-- Sport-Equip V2 - Enable Public Access
-- Autoriser l'accès public aux tables de produits et catégories

-- ============================================
-- DÉSACTIVER RLS POUR LES TABLES PUBLIQUES
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE produit_variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produit_images ENABLE ROW LEVEL SECURITY;

-- Avis produits (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avis_produits') THEN
        ALTER TABLE avis_produits ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ============================================
-- POLITIQUES POUR ACCÈS PUBLICS (ANON)
-- ============================================

-- Categories - lecture publique
CREATE POLICY "Public read categories"
ON categories FOR SELECT
TO anon
USING (true);

-- Produits actifs - lecture publique
CREATE POLICY "Public read active products"
ON produits FOR SELECT
TO anon
USING (actif = true);

-- Produit variantes - lecture publique
CREATE POLICY "Public read product variants"
ON produit_variantes FOR SELECT
TO anon
USING (true);

-- Produit images - lecture publique
CREATE POLICY "Public read product images"
ON produit_images FOR SELECT
TO anon
USING (true);

-- Avis produits - lecture publique (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avis_produits') THEN
        CREATE POLICY "Public read product reviews"
        ON avis_produits FOR SELECT
        TO anon
        USING (true);
    END IF;
END $$;

-- ============================================
-- POLITIQUES POUR UTILISATEURS AUTHENTIFIÉS
-- ============================================

-- Categories - lecture pour authenticated
CREATE POLICY "Authenticated read categories"
ON categories FOR SELECT
TO authenticated
USING (true);

-- Produits - lecture pour authenticated
CREATE POLICY "Authenticated read products"
ON produits FOR SELECT
TO authenticated
USING (true);

-- Produit variantes - lecture pour authenticated
CREATE POLICY "Authenticated read product variants"
ON produit_variantes FOR SELECT
TO authenticated
USING (true);

-- Produit images - lecture pour authenticated
CREATE POLICY "Authenticated read product images"
ON produit_images FOR SELECT
TO authenticated
USING (true);

-- Avis produits - lecture pour authenticated (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'avis_produits') THEN
        CREATE POLICY "Authenticated read product reviews"
        ON avis_produits FOR SELECT
        TO authenticated
        USING (true);

        CREATE POLICY "Authenticated insert product reviews"
        ON avis_produits FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid());

        CREATE POLICY "Authenticated update own product reviews"
        ON avis_produits FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;
END $$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
