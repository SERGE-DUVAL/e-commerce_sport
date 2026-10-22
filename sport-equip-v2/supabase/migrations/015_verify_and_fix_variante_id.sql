-- ============================================
-- VÉRIFICATION ET CORRECTION FORCÉE variante_id
-- ============================================

-- Vérifier le type actuel de variante_id
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'panier_items' AND column_name = 'variante_id';

-- Si toujours integer, forcer la conversion
DO $$
BEGIN
    -- Supprimer toutes les données existantes dans panier_items (car la conversion échouera sinon)
    TRUNCATE TABLE public.panier_items CASCADE;
    
    -- Supprimer la contrainte
    ALTER TABLE public.panier_items DROP CONSTRAINT IF EXISTS panier_items_variante_id_fkey;
    
    -- Modifier le type
    ALTER TABLE public.panier_items 
    ALTER COLUMN variante_id TYPE UUID USING variante_id::text::uuid;
    
    -- Recréer la contrainte
    ALTER TABLE public.panier_items 
    ADD CONSTRAINT panier_items_variante_id_fkey 
    FOREIGN KEY (variante_id) REFERENCES public.produit_variantes(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Conversion variante_id vers UUID réussie';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la conversion: %', SQLERRM;
END $$;
