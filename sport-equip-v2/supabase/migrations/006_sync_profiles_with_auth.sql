-- Sport-Equip V2 - Synchroniser la table profiles existante avec auth.users
-- Cette migration ajoute des triggers pour synchroniser automatiquement les données

-- ============================================
-- FONCTION POUR LA SYNCHRONISATION AUTOMATIQUE
-- ============================================

-- Fonction pour créer un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, prenom, nom)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Le profil existe déjà, on met à jour
        UPDATE public.profiles
        SET 
            email = NEW.email,
            prenom = NEW.raw_user_meta_data->>'first_name',
            nom = NEW.raw_user_meta_data->>'last_name'
        WHERE id = NEW.id;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute lors de la création d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour le profil lors de la modification
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        email = NEW.email,
        prenom = NEW.raw_user_meta_data->>'first_name',
        nom = NEW.raw_user_meta_data->>'last_name',
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute lors de la modification d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- ============================================
-- SYNCHRONISATION DES UTILISATEURS EXISTANTS
-- ============================================

-- Synchroniser les utilisateurs existants avec la table profiles
INSERT INTO public.profiles (id, email, prenom, nom, role, points_fidelite)
SELECT 
    id,
    email,
    raw_user_meta_data->>'first_name',
    raw_user_meta_data->>'last_name',
    'client',
    0
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    prenom = EXCLUDED.prenom,
    nom = EXCLUDED.nom,
    updated_at = timezone('utc'::text, now());

-- ============================================
-- RLS POLICIES (si pas déjà configurées)
-- ============================================

-- Activer RLS sur la table profiles si ce n'est pas déjà fait
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
