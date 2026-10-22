-- Sport-Equip V2 - Grant Privilèges Authenticated
-- Accorder les privilèges de base au rôle authenticated pour les tables nécessaires

-- ============================================
-- GRANT PRIVILÈGES POUR PANIERS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE public.paniers TO authenticated;
GRANT INSERT ON TABLE public.paniers TO authenticated;
GRANT UPDATE ON TABLE public.paniers TO authenticated;
GRANT DELETE ON TABLE public.paniers TO authenticated;

-- ============================================
-- GRANT PRIVILÈGES POUR PANIER_ITEMS
-- ============================================
GRANT SELECT ON TABLE public.panier_items TO authenticated;
GRANT INSERT ON TABLE public.panier_items TO authenticated;
GRANT UPDATE ON TABLE public.panier_items TO authenticated;
GRANT DELETE ON TABLE public.panier_items TO authenticated;

-- ============================================
-- GRANT PRIVILÈGES POUR AVIS_PRODUITS
-- ============================================
GRANT SELECT ON TABLE public.avis_produits TO authenticated;
GRANT INSERT ON TABLE public.avis_produits TO authenticated;
GRANT UPDATE ON TABLE public.avis_produits TO authenticated;
GRANT DELETE ON TABLE public.avis_produits TO authenticated;

-- ============================================
-- GRANT PRIVILÈGES POUR PROFILES
-- ============================================
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE ON TABLE public.profiles TO authenticated;

-- ============================================
-- GRANT PRIVILÈGES POUR PRODUITS (lecture seule)
-- ============================================
GRANT SELECT ON TABLE public.produits TO authenticated;
GRANT SELECT ON TABLE public.produit_variantes TO authenticated;
GRANT SELECT ON TABLE public.produit_images TO authenticated;
GRANT SELECT ON TABLE public.categories TO authenticated;
