-- Sport-Equip V2 - Seed Data
-- Données de test pour le MVP

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO categories (id, nom, slug, description, ordre_affichage) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Football', 'football', 'Équipement pour le football', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Running', 'running', 'Chaussures et équipement pour la course à pied', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Fitness', 'fitness', 'Équipement pour la salle de sport et fitness', 3),
  ('550e8400-e29b-41d4-a716-446655440004', 'Basketball', 'basketball', 'Équipement pour le basketball', 4),
  ('550e8400-e29b-41d4-a716-446655440005', 'Tennis', 'tennis', 'Équipement pour le tennis', 5);

-- ============================================
-- PRODUITS
-- ============================================

INSERT INTO produits (id, categorie_id, titre, slug, description, prix_base, actif) VALUES
  -- Football
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Crampons Pro Football', 'crampons-pro-football', 'Crampons de haute qualité pour terrains synthétiques', 25000, true),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Ballon Football Pro', 'ballon-football-pro', 'Ballon officiel FIFA qualité match', 15000, true),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Maillot Équipe Nationale', 'maillot-equipe-nationale', 'Maillot officiel équipe nationale', 20000, true),
  
  -- Running
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Chaussures Running Elite', 'chaussures-running-elite', 'Chaussures de course légères et amortissantes', 45000, true),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Short Running', 'short-running', 'Short technique pour la course', 8000, true),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Montre GPS Running', 'montre-gps-running', 'Montre connectée avec GPS pour runners', 35000, true),
  
  -- Fitness
  ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Haltères 10kg', 'haltieres-10kg', 'Paire d''haltères ajustables 10kg', 12000, true),
  ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Tapis de Yoga', 'tapis-yoga', 'Tapis antidérapant pour yoga et fitness', 5000, true),
  ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Gant Fitness', 'gant-fitness', 'Gants de fitness avec poignets', 3000, true),
  
  -- Basketball
  ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Chaussures Basketball Pro', 'chaussures-basketball-pro', 'Chaussures haute performance pour basketball', 55000, true),
  ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Ballon Basketball', 'ballon-basketball', 'Ballon taille officielle FIBA', 12000, true),
  
  -- Tennis
  ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', 'Raquette Tennis Pro', 'raquette-tennis-pro', 'Raquette carbone pour joueurs avancés', 65000, true),
  ('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 'Balles Tennis (x3)', 'balles-tennis-x3', 'Pack de 3 balles de tennis', 2000, true);

-- ============================================
-- PRODUIT IMAGES
-- ============================================

INSERT INTO produit_images (id, produit_id, url, ordre_affichage, alt_text) VALUES
  -- Football
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '/images/Crampons Mercurial.jpg', 0, 'Crampons Pro Football'),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '/images/Ballon Football Official.jfif', 0, 'Ballon Football Pro'),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '/images/Maillot Football Pro.jpg', 0, 'Maillot Équipe Nationale'),
  
  -- Running
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '/images/Chaussures Running Ultra.jpg', 0, 'Chaussures Running Elite'),
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '/images/Short Running Elite.jfif', 0, 'Short Running'),
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', '/images/Montre GPS Running.jfif', 0, 'Montre GPS Running'),
  
  -- Fitness
  ('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', '/images/Halteres_reglables_20kg.jfif', 0, 'Haltères 10kg'),
  ('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008', '/images/Tapis de Yoga Premium.jpg', 0, 'Tapis de Yoga'),
  ('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', '/images/Gants_de_boxe_16oz.jfif', 0, 'Gant Fitness'),
  
  -- Basketball
  ('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', '/images/Chaussures Basketball Air.jfif', 0, 'Chaussures Basketball Pro'),
  ('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', '/images/Ballon Basketball Official.jpg', 0, 'Ballon Basketball'),
  
  -- Tennis
  ('880e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440012', '/images/Raquette Tennis Pro.jpg', 0, 'Raquette Tennis Pro'),
  ('880e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440013', '/images/Balles_de_tennis_(x3).jfif', 0, 'Balles Tennis (x3)');

-- ============================================
-- PRODUIT VARIANTES
-- ============================================

INSERT INTO produit_variantes (id, produit_id, sku, taille, couleur, stock, prix_supplementaire, actif) VALUES
  -- Crampons Pro Football
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'CRAM-PRO-40-NOIR', '40', 'Noir', 15, 0, true),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'CRAM-PRO-41-NOIR', '41', 'Noir', 20, 0, true),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'CRAM-PRO-42-NOIR', '42', 'Noir', 18, 0, true),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'CRAM-PRO-43-NOIR', '43', 'Noir', 12, 0, true),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'CRAM-PRO-44-NOIR', '44', 'Noir', 10, 0, true),
  
  -- Chaussures Running Elite
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'RUN-ELI-39-BLANC', '39', 'Blanc', 8, 0, true),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 'RUN-ELI-40-BLANC', '40', 'Blanc', 12, 0, true),
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'RUN-ELI-41-BLANC', '41', 'Blanc', 15, 0, true),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440004', 'RUN-ELI-42-BLANC', '42', 'Blanc', 10, 0, true),
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440004', 'RUN-ELI-43-BLANC', '43', 'Blanc', 8, 0, true),
  
  -- Chaussures Basketball Pro
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440010', 'BAS-PRO-40-ROUGE', '40', 'Rouge', 6, 0, true),
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440010', 'BAS-PRO-41-ROUGE', '41', 'Rouge', 8, 0, true),
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440010', 'BAS-PRO-42-ROUGE', '42', 'Rouge', 10, 0, true),
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440010', 'BAS-PRO-43-ROUGE', '43', 'Rouge', 7, 0, true),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440010', 'BAS-PRO-44-ROUGE', '44', 'Rouge', 5, 0, true);
