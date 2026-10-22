-- Sport-Equip V2 - MVP Tables
-- Phase 1: Core E-commerce Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. AUTHENTICATION & USERS
-- ============================================

-- Profiles (extension of auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('super_admin', 'admin', 'gestionnaire_stock', 'caissier', 'livreur', 'client')),
  points_fidelite INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adresses (multiple addresses per user)
CREATE TABLE adresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type_adresse TEXT CHECK (type_adresse IN ('livraison', 'facturation')),
  nom_complet TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  region TEXT NOT NULL,
  code_postal TEXT,
  est_par_defaut BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CATALOGUE PRODUITS
-- ============================================

-- Categories (hierarchical)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  ordre_affichage INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produits
CREATE TABLE produits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  categorie_id UUID REFERENCES categories(id),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  prix_base INTEGER NOT NULL, -- En FCFA
  actif BOOLEAN DEFAULT TRUE,
  code_barre TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produit Variantes (taille, couleur, SKU, stock)
CREATE TABLE produit_variantes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  taille TEXT,
  couleur TEXT,
  stock INTEGER DEFAULT 0,
  prix_supplementaire INTEGER DEFAULT 0,
  image_url TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produit Images
CREATE TABLE produit_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
  variante_id UUID REFERENCES produit_variantes(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordre_affichage INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PANIER (PERSISTENCE)
-- ============================================

-- Paniers
CREATE TABLE paniers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT, -- For non-logged-in users
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panier Items
CREATE TABLE panier_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  panier_id UUID REFERENCES paniers(id) ON DELETE CASCADE,
  variante_id UUID REFERENCES produit_variantes(id),
  quantite INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. COMMANDES
-- ============================================

-- Commandes
CREATE TABLE commandes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  adresse_livraison_id UUID REFERENCES adresses(id),
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'payee', 'en_preparation', 'expedie', 'livre', 'annule', 'rembourse')),
  total_ht INTEGER NOT NULL,
  total_tva INTEGER DEFAULT 0,
  total_ttc INTEGER NOT NULL,
  frais_livraison INTEGER DEFAULT 0,
  remise INTEGER DEFAULT 0,
  points_utilises INTEGER DEFAULT 0,
  points_gagnes INTEGER DEFAULT 0,
  moyen_paiement TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lignes Commande
CREATE TABLE lignes_commande (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commande_id UUID REFERENCES commandes(id) ON DELETE CASCADE,
  variante_id UUID REFERENCES produit_variantes(id),
  quantite INTEGER NOT NULL,
  prix_unitaire INTEGER NOT NULL,
  total_ligne INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paiements
CREATE TABLE paiements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commande_id UUID REFERENCES commandes(id),
  montant INTEGER NOT NULL,
  moyen_paiement TEXT NOT NULL CHECK (moyen_paiement IN ('mobile_money', 'orange_money', 'carte', 'paypal', 'cash', 'cheque', 'points')),
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'succes', 'echec', 'annule')),
  transaction_id TEXT,
  provider_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. STOCK MOUVEMENTS
-- ============================================

-- Stock Mouvements (historique)
CREATE TABLE stock_mouvements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  variante_id UUID REFERENCES produit_variantes(id) ON DELETE CASCADE,
  type_mouvement TEXT CHECK (type_mouvement IN ('entree', 'sortie', 'vente', 'retour', 'inventaire', 'correction')),
  quantite INTEGER NOT NULL,
  stock_avant INTEGER NOT NULL,
  stock_apres INTEGER NOT NULL,
  motif TEXT,
  utilisateur_id UUID REFERENCES profiles(id),
  commande_id UUID REFERENCES commandes(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Adresses
CREATE INDEX idx_adresses_user_id ON adresses(user_id);

-- Categories
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Produits
CREATE INDEX idx_produits_categorie_id ON produits(categorie_id);
CREATE INDEX idx_produits_slug ON produits(slug);
CREATE INDEX idx_produits_actif ON produits(actif);

-- Produit Variantes
CREATE INDEX idx_produit_variantes_produit_id ON produit_variantes(produit_id);
CREATE INDEX idx_produit_variantes_sku ON produit_variantes(sku);
CREATE INDEX idx_produit_variantes_actif ON produit_variantes(actif);

-- Produit Images
CREATE INDEX idx_produit_images_produit_id ON produit_images(produit_id);
CREATE INDEX idx_produit_images_variante_id ON produit_images(variante_id);

-- Paniers
CREATE INDEX idx_paniers_user_id ON paniers(user_id);
CREATE INDEX idx_paniers_session_id ON paniers(session_id);

-- Panier Items
CREATE INDEX idx_panier_items_panier_id ON panier_items(panier_id);
CREATE INDEX idx_panier_items_variante_id ON panier_items(variante_id);

-- Commandes
CREATE INDEX idx_commandes_user_id ON commandes(user_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_commandes_created_at ON commandes(created_at);

-- Lignes Commande
CREATE INDEX idx_lignes_commande_commande_id ON lignes_commande(commande_id);
CREATE INDEX idx_lignes_commande_variante_id ON lignes_commande(variante_id);

-- Paiements
CREATE INDEX idx_paiements_commande_id ON paiements(commande_id);
CREATE INDEX idx_paiements_statut ON paiements(statut);

-- Stock Mouvements
CREATE INDEX idx_stock_mouvements_variante_id ON stock_mouvements(variante_id);
CREATE INDEX idx_stock_mouvements_type_mouvement ON stock_mouvements(type_mouvement);
CREATE INDEX idx_stock_mouvements_created_at ON stock_mouvements(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON produits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paniers_updated_at BEFORE UPDATE ON paniers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_panier_items_updated_at BEFORE UPDATE ON panier_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commandes_updated_at BEFORE UPDATE ON commandes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
