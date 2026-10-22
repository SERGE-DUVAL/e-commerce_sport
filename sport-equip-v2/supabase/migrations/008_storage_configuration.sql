-- Sport-Equip V2 - Storage Configuration
-- Configuration du bucket Storage pour les images de produits

-- ============================================
-- CRÉATION DES BUCKETS STORAGE
-- ============================================

-- Bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les avatars utilisateurs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLITIQUES RLS POUR STORAGE
-- ============================================

-- Politiques pour product-images
-- Tout le monde peut voir les images
CREATE POLICY "Public Access product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Seuls les admins peuvent uploader des images de produits
CREATE POLICY "Admin Upload product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'gestionnaire_stock')
  )
);

-- Seuls les admins peuvent supprimer des images de produits
CREATE POLICY "Admin Delete product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'gestionnaire_stock')
  )
);

-- Politiques pour user-avatars
-- Tout le monde peut voir les avatars
CREATE POLICY "Public Access user-avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

-- Les utilisateurs peuvent uploader leur propre avatar
CREATE POLICY "User Upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Les utilisateurs peuvent supprimer leur propre avatar
CREATE POLICY "User Delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Les admins peuvent gérer tous les avatars
CREATE POLICY "Admin Manage user-avatars"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'user-avatars' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
)
WITH CHECK (
  bucket_id = 'user-avatars' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);
