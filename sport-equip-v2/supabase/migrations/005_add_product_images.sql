-- Sport-Equip V2 - Ajouter les images aux produits existants
-- Ce script ajoute uniquement les images aux produits déjà créés

-- ============================================
-- PRODUIT IMAGES
-- ============================================

INSERT INTO produit_images (id, produit_id, url, ordre_affichage, alt_text) VALUES
  -- Football
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 0, 'Crampons Pro Football'),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800', 0, 'Ballon Football Pro'),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800', 0, 'Maillot Équipe Nationale'),
  
  -- Running
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 0, 'Chaussures Running Elite'),
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800', 0, 'Short Running'),
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', 0, 'Montre GPS Running'),
  
  -- Fitness
  ('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 0, 'Haltères 10kg'),
  ('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 0, 'Tapis de Yoga'),
  ('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800', 0, 'Gant Fitness'),
  
  -- Basketball
  ('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800', 0, 'Chaussures Basketball Pro'),
  ('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800', 0, 'Ballon Basketball'),
  
  -- Tennis
  ('880e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', 0, 'Raquette Tennis Pro'),
  ('880e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440013', 'https://images.unsplash.com/photo-1594499288803-3e0e9e2b7f5c?w=800', 0, 'Balles Tennis (x3)')
ON CONFLICT (id) DO NOTHING;
