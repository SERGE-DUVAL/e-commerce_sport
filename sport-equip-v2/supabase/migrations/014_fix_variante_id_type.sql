-- ============================================
-- CORRECTION TYPE variante_id DANS panier_items
-- ============================================

-- Supprimer la contrainte de clé étrangère existante
ALTER TABLE public.panier_items DROP CONSTRAINT IF EXISTS panier_items_variante_id_fkey;

-- Modifier le type de la colonne variante_id de integer vers uuid
ALTER TABLE public.panier_items 
ALTER COLUMN variante_id TYPE UUID USING variante_id::uuid;

-- Recréer la contrainte de clé étrangère avec le bon type
ALTER TABLE public.panier_items 
ADD CONSTRAINT panier_items_variante_id_fkey 
FOREIGN KEY (variante_id) REFERENCES public.produit_variantes(id) ON DELETE CASCADE;
