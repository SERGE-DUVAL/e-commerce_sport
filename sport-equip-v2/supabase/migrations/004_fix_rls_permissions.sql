-- Fix RLS Permissions for anon role
-- Accorder les permissions de base au rôle anon pour les tables publiques

-- GRANT USAGE sur le schema public
GRANT USAGE ON SCHEMA public TO anon;

-- GRANT SELECT sur toutes les tables publiques
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- GRANT SELECT sur les tables futures
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- GRANT USAGE sur les séquences (pour les UUID)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
