-- Sport-Equip V2 - Synchroniser les utilisateurs existants
-- Synchroniser manuellement les utilisateurs auth.users vers profiles

-- ============================================
-- SYNCHRONISER LES UTILISATEURS EXISTANTS
-- ============================================

INSERT INTO profiles (id, email, prenom, nom, role, points_fidelite, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'first_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'last_name', ''),
    'client',
    0,
    created_at,
    NOW()
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    prenom = COALESCE(EXCLUDED.prenom, profiles.prenom),
    nom = COALESCE(EXCLUDED.nom, profiles.nom),
    updated_at = NOW();
