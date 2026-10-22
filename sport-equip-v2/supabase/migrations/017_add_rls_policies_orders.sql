-- Ajouter les RLS policies pour les tables de commandes

-- Grant privileges to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE commandes TO authenticated;
GRANT ALL ON TABLE commande_items TO authenticated;
GRANT ALL ON TABLE paiements TO authenticated;

-- RLS Policies pour commandes
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres commandes" ON commandes;
CREATE POLICY "Les utilisateurs peuvent voir leurs propres commandes"
    ON commandes FOR SELECT
    USING (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leurs commandes" ON commandes;
CREATE POLICY "Les utilisateurs peuvent créer leurs commandes"
    ON commandes FOR INSERT
    WITH CHECK (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs commandes" ON commandes;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs commandes"
    ON commandes FOR UPDATE
    USING (auth.uid() = utilisateur_id);

-- RLS Policies pour commande_items
ALTER TABLE commande_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs peuvent voir les items de leurs commandes" ON commande_items;
CREATE POLICY "Les utilisateurs peuvent voir les items de leurs commandes"
    ON commande_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM commandes
            WHERE commandes.id = commande_items.commande_id
            AND commandes.utilisateur_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des items pour leurs commandes" ON commande_items;
CREATE POLICY "Les utilisateurs peuvent créer des items pour leurs commandes"
    ON commande_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM commandes
            WHERE commandes.id = commande_items.commande_id
            AND commandes.utilisateur_id = auth.uid()
        )
    );

-- RLS Policies pour paiements
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs paiements" ON paiements;
CREATE POLICY "Les utilisateurs peuvent voir leurs paiements"
    ON paiements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM commandes
            WHERE commandes.id = paiements.commande_id
            AND commandes.utilisateur_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des paiements pour leurs commandes" ON paiements;
CREATE POLICY "Les utilisateurs peuvent créer des paiements pour leurs commandes"
    ON paiements FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM commandes
            WHERE commandes.id = paiements.commande_id
            AND commandes.utilisateur_id = auth.uid()
        )
    );
