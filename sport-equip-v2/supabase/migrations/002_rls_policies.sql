-- Sport-Equip V2 - RLS Policies
-- Row Level Security pour sécuriser l'accès aux tables

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE adresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE produit_variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produit_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE paniers ENABLE ROW LEVEL SECURITY;
ALTER TABLE panier_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_mouvements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Tout le monde peut voir les profils (pour l'affichage public)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- ADRESSES POLICIES
-- ============================================

-- Les utilisateurs peuvent voir leurs adresses
CREATE POLICY "Users can view own addresses"
  ON adresses FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs adresses
CREATE POLICY "Users can create own addresses"
  ON adresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs adresses
CREATE POLICY "Users can update own addresses"
  ON adresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs adresses
CREATE POLICY "Users can delete own addresses"
  ON adresses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Tout le monde peut voir les catégories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- ============================================
-- PRODUITS POLICIES
-- ============================================

-- Tout le monde peut voir les produits actifs
CREATE POLICY "Active products are viewable by everyone"
  ON produits FOR SELECT
  USING (actif = true);

-- ============================================
-- PRODUIT VARIANTES POLICIES
-- ============================================

-- Tout le monde peut voir les variantes actives
CREATE POLICY "Active variantes are viewable by everyone"
  ON produit_variantes FOR SELECT
  USING (actif = true);

-- ============================================
-- PRODUIT IMAGES POLICIES
-- ============================================

-- Tout le monde peut voir les images de produits
CREATE POLICY "Product images are viewable by everyone"
  ON produit_images FOR SELECT
  USING (true);

-- ============================================
-- PANIERS POLICIES
-- ============================================

-- Les utilisateurs peuvent voir leur propre panier
CREATE POLICY "Users can view own cart"
  ON paniers FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leur panier
CREATE POLICY "Users can create own cart"
  ON paniers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur panier
CREATE POLICY "Users can update own cart"
  ON paniers FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- PANIER ITEMS POLICIES
-- ============================================

-- Les utilisateurs peuvent voir les items de leur panier
CREATE POLICY "Users can view own cart items"
  ON panier_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM paniers 
      WHERE paniers.id = panier_items.panier_id 
      AND paniers.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des items dans leur panier
CREATE POLICY "Users can create own cart items"
  ON panier_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM paniers 
      WHERE paniers.id = panier_items.panier_id 
      AND paniers.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent mettre à jour les items de leur panier
CREATE POLICY "Users can update own cart items"
  ON panier_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM paniers 
      WHERE paniers.id = panier_items.panier_id 
      AND paniers.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent supprimer les items de leur panier
CREATE POLICY "Users can delete own cart items"
  ON panier_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM paniers 
      WHERE paniers.id = panier_items.panier_id 
      AND paniers.user_id = auth.uid()
    )
  );

-- ============================================
-- COMMANDES POLICIES
-- ============================================

-- Les utilisateurs peuvent voir leurs commandes
CREATE POLICY "Users can view own orders"
  ON commandes FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs commandes
CREATE POLICY "Users can create own orders"
  ON commandes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs commandes
CREATE POLICY "Users can update own orders"
  ON commandes FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- LIGNES COMMANDE POLICIES
-- ============================================

-- Les utilisateurs peuvent voir les lignes de leurs commandes
CREATE POLICY "Users can view own order lines"
  ON lignes_commande FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM commandes 
      WHERE commandes.id = lignes_commande.commande_id 
      AND commandes.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des lignes dans leurs commandes
CREATE POLICY "Users can create own order lines"
  ON lignes_commande FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commandes 
      WHERE commandes.id = lignes_commande.commande_id 
      AND commandes.user_id = auth.uid()
    )
  );

-- ============================================
-- PAIEMENTS POLICIES
-- ============================================

-- Les utilisateurs peuvent voir leurs paiements
CREATE POLICY "Users can view own payments"
  ON paiements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM commandes 
      WHERE commandes.id = paiements.commande_id 
      AND commandes.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des paiements pour leurs commandes
CREATE POLICY "Users can create own payments"
  ON paiements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commandes 
      WHERE commandes.id = paiements.commande_id 
      AND commandes.user_id = auth.uid()
    )
  );

-- ============================================
-- STOCK MOUVEMENTS POLICIES
-- ============================================

-- Les utilisateurs peuvent voir les mouvements de stock liés à leurs commandes
CREATE POLICY "Users can view own stock movements"
  ON stock_mouvements FOR SELECT
  USING (
    commande_id IS NULL OR
    EXISTS (
      SELECT 1 FROM commandes 
      WHERE commandes.id = stock_mouvements.commande_id 
      AND commandes.user_id = auth.uid()
    )
  );
