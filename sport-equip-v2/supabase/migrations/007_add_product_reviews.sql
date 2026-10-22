-- Sport-Equip V2 - Avis Produits
-- Table pour les avis clients sur les produits

-- ============================================
-- TABLE AVIS PRODUITS
-- ============================================

CREATE TABLE avis_produits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note INTEGER CHECK (note >= 1 AND note <= 5) NOT NULL,
  titre TEXT,
  commentaire TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_avis_produits_produit_id ON avis_produits(produit_id);
CREATE INDEX idx_avis_produits_user_id ON avis_produits(user_id);
CREATE INDEX idx_avis_produits_note ON avis_produits(note);
CREATE INDEX idx_avis_produits_created_at ON avis_produits(created_at);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_avis_produits_updated_at BEFORE UPDATE ON avis_produits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
