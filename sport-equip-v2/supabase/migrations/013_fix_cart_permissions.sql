-- ============================================
-- CORRECTION PERMISSIONS PANIER (RLS + GRANT)
-- ============================================

-- Désactiver RLS temporairement pour modifier les politiques
ALTER TABLE public.paniers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.panier_items DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE public.paniers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panier_items ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques sur paniers
DROP POLICY IF EXISTS "Users can view their own carts" ON public.paniers;
DROP POLICY IF EXISTS "Users can create their own cart" ON public.paniers;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.paniers;

-- Créer nouvelles politiques plus permissives pour paniers
CREATE POLICY "Users can view their own carts"
  ON public.paniers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own cart"
  ON public.paniers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own cart"
  ON public.paniers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Supprimer les anciennes politiques sur panier_items
DROP POLICY IF EXISTS "Users can view items in their cart" ON public.panier_items;
DROP POLICY IF EXISTS "Users can add items to their cart" ON public.panier_items;
DROP POLICY IF EXISTS "Users can update items in their cart" ON public.panier_items;
DROP POLICY IF EXISTS "Users can delete items from their cart" ON public.panier_items;

-- Créer nouvelles politiques plus permissives pour panier_items
CREATE POLICY "Users can view items in their cart"
  ON public.panier_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add items to their cart"
  ON public.panier_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update items in their cart"
  ON public.panier_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete items from their cart"
  ON public.panier_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Accorder tous les privilèges au rôle authenticated
GRANT ALL ON TABLE public.paniers TO authenticated;
GRANT ALL ON TABLE public.panier_items TO authenticated;

-- Accorder SELECT sur les tables liées
GRANT SELECT ON TABLE public.produits TO authenticated;
GRANT SELECT ON TABLE public.produit_variantes TO authenticated;
GRANT SELECT ON TABLE public.categories TO authenticated;
