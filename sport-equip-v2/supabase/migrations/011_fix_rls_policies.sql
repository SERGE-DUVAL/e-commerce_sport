-- Sport-Equip V2 - Correction RLS Policies
-- Corriger les politiques RLS pour permettre l'accès aux utilisateurs authentifiés

-- ============================================
-- TABLE PANIERS
-- ============================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own panier" ON public.paniers;
DROP POLICY IF EXISTS "Users can create own panier" ON public.paniers;
DROP POLICY IF EXISTS "Users can update own panier" ON public.paniers;

-- Politique : Les utilisateurs peuvent voir leur propre panier
CREATE POLICY "Users can view own panier"
    ON public.paniers FOR SELECT
    USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leur propre panier
CREATE POLICY "Users can create own panier"
    ON public.paniers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre panier
CREATE POLICY "Users can update own panier"
    ON public.paniers FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABLE PANIER_ITEMS
-- ============================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own panier_items" ON public.panier_items;
DROP POLICY IF EXISTS "Users can create own panier_items" ON public.panier_items;
DROP POLICY IF EXISTS "Users can update own panier_items" ON public.panier_items;
DROP POLICY IF EXISTS "Users can delete own panier_items" ON public.panier_items;

-- Politique : Les utilisateurs peuvent voir les items de leur panier
CREATE POLICY "Users can view own panier_items"
    ON public.panier_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.paniers 
            WHERE paniers.id = panier_items.panier_id 
            AND paniers.user_id = auth.uid()
        )
    );

-- Politique : Les utilisateurs peuvent créer des items dans leur panier
CREATE POLICY "Users can create own panier_items"
    ON public.panier_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.paniers 
            WHERE paniers.id = panier_items.panier_id 
            AND paniers.user_id = auth.uid()
        )
    );

-- Politique : Les utilisateurs peuvent mettre à jour les items de leur panier
CREATE POLICY "Users can update own panier_items"
    ON public.panier_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.paniers 
            WHERE paniers.id = panier_items.panier_id 
            AND paniers.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.paniers 
            WHERE paniers.id = panier_items.panier_id 
            AND paniers.user_id = auth.uid()
        )
    );

-- Politique : Les utilisateurs peuvent supprimer les items de leur panier
CREATE POLICY "Users can delete own panier_items"
    ON public.panier_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.paniers 
            WHERE paniers.id = panier_items.panier_id 
            AND paniers.user_id = auth.uid()
        )
    );

-- ============================================
-- TABLE AVIS_PRODUITS
-- ============================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can view avis" ON public.avis_produits;
DROP POLICY IF EXISTS "Users can create own avis" ON public.avis_produits;
DROP POLICY IF EXISTS "Users can update own avis" ON public.avis_produits;

-- Politique : Tout le monde peut voir les avis
CREATE POLICY "Anyone can view avis"
    ON public.avis_produits FOR SELECT
    USING (true);

-- Politique : Les utilisateurs peuvent créer leurs propres avis
CREATE POLICY "Users can create own avis"
    ON public.avis_produits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres avis
CREATE POLICY "Users can update own avis"
    ON public.avis_produits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABLE PROFILES
-- ============================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Politique : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
