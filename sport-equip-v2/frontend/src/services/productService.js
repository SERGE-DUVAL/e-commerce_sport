import { supabase } from '../lib/supabaseClient'

// Récupérer tous les produits avec leurs variantes et images
export async function getAllProducts() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (
        id,
        nom,
        slug
      ),
      produit_variantes (
        id,
        sku,
        taille,
        couleur,
        stock,
        prix_supplementaire,
        image_url,
        actif
      ),
      produit_images (
        id,
        url,
        ordre_affichage,
        alt_text
      )
    `)
    .eq('actif', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }

  return produits
}

// Récupérer un produit par son ID avec ses variantes et images
export async function getProductById(id) {
  const { data: produit, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (
        id,
        nom,
        slug
      ),
      produit_variantes (
        id,
        sku,
        taille,
        couleur,
        stock,
        prix_supplementaire,
        image_url,
        actif
      ),
      produit_images (
        id,
        url,
        ordre_affichage,
        alt_text
      )
    `)
    .eq('id', id)
    .eq('actif', true)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return null
  }

  return produit
}

// Récupérer un produit par son slug
export async function getProductBySlug(slug) {
  const { data: produit, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (
        id,
        nom,
        slug
      ),
      produit_variantes (
        id,
        sku,
        taille,
        couleur,
        stock,
        prix_supplementaire,
        image_url,
        actif
      ),
      produit_images (
        id,
        url,
        ordre_affichage,
        alt_text
      )
    `)
    .eq('slug', slug)
    .eq('actif', true)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return null
  }

  return produit
}

// Récupérer les produits par catégorie
export async function getProductsByCategory(categorySlug) {
  const { data: produits, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (
        id,
        nom,
        slug
      ),
      produit_variantes (
        id,
        sku,
        taille,
        couleur,
        stock,
        prix_supplementaire,
        image_url,
        actif
      ),
      produit_images (
        id,
        url,
        ordre_affichage,
        alt_text
      )
    `)
    .eq('categories.slug', categorySlug)
    .eq('actif', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error)
    return []
  }

  return produits
}

// Récupérer toutes les catégories
export async function getAllCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('actif', true)
    .order('ordre_affichage', { ascending: true })

  if (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }

  return categories
}

// Rechercher des produits
export async function searchProducts(query) {
  const { data: produits, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (
        id,
        nom,
        slug
      ),
      produit_variantes (
        id,
        sku,
        taille,
        couleur,
        stock,
        prix_supplementaire,
        image_url,
        actif
      ),
      produit_images (
        id,
        url,
        ordre_affichage,
        alt_text
      )
    `)
    .or(`titre.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('actif', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la recherche de produits:', error)
    return []
  }

  return produits
}

// Formater le prix en FCFA
export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Mapping des produits vers leurs images locales (basé sur les fichiers réels dans /images)
const productImageMap = {
  // Football
  'crampons pro football': '/images/Crampons Mercurial.jpg',
  'crampons mercurial': '/images/Crampons Mercurial.jpg',
  'crampons mercurial vapor': '/images/Crampons_Mercurial_Vapor.jfif',
  'ballon football pro': '/images/Ballon Football Official.jfif',
  'ballon football official': '/images/Ballon Football Official.jfif',
  'ballon uefa champions': '/images/Ballon_UEFA_Champions_League.jfif',
  'ballon nba officiel': '/images/Ballon_NBA_officiel.jfif',
  'maillot equipe nationale': '/images/Maillot Football Pro.jpg',
  'maillot football pro': '/images/Maillot Football Pro.jpg',
  'maillot psg domicile 2024': '/images/Maillot_PSG_Domicile_2024.jfif',
  'gants gardien pro': '/images/Gants Gardien Pro.jfif',
  'gants gardien nike': '/images/Gants_de_gardien_Nike.jfif',

  // Running
  'chaussures running elite': '/images/Chaussures Running Ultra.jpg',
  'chaussures running ultra': '/images/Chaussures Running Ultra.jpg',
  'chaussures running ultraboost': '/images/Chaussures_Running_Ultraboost.jfif',
  'short running': '/images/Legging_de_running.jfif',
  'legging running': '/images/Legging_de_running.jfif',
  'montre gps running': '/images/Montre GPS Running.jfif',
  'montre gps running': '/images/Montre_GPS_Running.jfif',
  'gourde isotermique 1l': '/images/Gourde Isotermique 1L.jpg',
  'gourde 750ml': '/images/Gourde_750ml.jfif',

  // Tennis
  'raquette tennis pro': '/images/Raquette Tennis Pro.jpg',
  'balle tennis 3 pack': '/images/Balle Tennis 3-pack.jpg',
  'balles tennis x3': '/images/Balles_de_tennis_(x3).jfif',
  'manchettes tennis': '/images/Manchettes_de_tennis.jfif',
  'chaussures tennis court': '/images/Chaussures_Tennis_Court.jfif',
  'poignet tennis': '/images/Poignet_tennis_artengo_tp_100_marine.jfif',

  // Basketball
  'chaussures basketball pro': '/images/Chaussures Basketball Air.jfif',
  'ballon basketball': '/images/Ballon Basketball Official.jpg',
  'ballon basketball official': '/images/Ballon Basketball Official.jpg',
  'chaussures basketball air': '/images/Chaussures Basketball Air.jfif',
  'chaussures jordan air': '/images/Chaussures_Jordan_Air.jfif',
  'maillot basketball jersey': '/images/Maillot Basketball Jersey.jpg',
  'maillot nba lakers': '/images/Maillot_NBA_Lakers.jfif',
  'panier basket mural': '/images/Panier_de_basket_mural.jfif',

  // Fitness
  'halteres 10kg': '/images/Halteres_reglables_20kg.jfif',
  'tapis de yoga': '/images/Tapis de Yoga Premium.jpg',
  'gant fitness': '/images/Elastique Resistance.jpg',
  'halteres reglables 20kg': '/images/Halteres_reglables_20kg.jfif',
  'kettlebell 16kg': '/images/Kettlebell_16kg.jfif',
  'elastique resistance': '/images/Elastique Resistance.jpg',
  'elastiques resistance': '/images/Elastiques_de_resistance.jfif',
  'tapis yoga premium': '/images/Tapis de Yoga Premium.jpg',
  'banc reglable': '/images/Banc_reglable.jfif',

  // Cyclisme
  'casque cyclisme pro': '/images/Casque_cyclisme_Pro.jfif',
  'gants cyclisme': '/images/Gants_cyclisme.jfif',
  'maillot cyclisme equipe': '/images/Maillot_cyclisme_equipe.jfif',

  // Natation
  'lunettes natation': '/images/Lunettes_de_natation.jfif',
  'bonne natation silicone': '/images/Bonne_de_natation_silicone.jfif',
  'planches natation': '/images/Planches_de_natation.jfif',

  // Boxe
  'gants boxe 16oz': '/images/Gants_de_boxe_16oz.jfif',
  'bandages boxe': '/images/Bandages_de_boxe.jfif',
  'ceinture boxe': '/images/Ceinture_de_boxe.jfif',

  // Images génériques par catégorie (fallback)
  'football': '/images2/Foot1.jfif',
  'running': '/images2/running.jfif',
  'tennis': '/images2/tennis1.jfif',
  'basketball': '/images2/basketball.jfif',
  'fitness': '/images2/Fitness1.jfif',
  'cyclisme': '/images2/cyclisme1.jfif',
  'natation': '/images2/Natation.jfif',
  'boxe': '/images2/Boxe.jfif'
}

// Obtenir l'image principale d'un produit
export function getMainImage(product) {
  if (!product) return '/images/placeholder.jpg'

  // Si le produit a des images dans la table produit_images
  if (product.produit_images && product.produit_images.length > 0) {
    const mainImage = product.produit_images.find(img => img.ordre_affichage === 0) || product.produit_images[0]
    // Si l'URL est une URL Unsplash, utiliser l'image locale correspondante
    if (mainImage.url && mainImage.url.includes('unsplash')) {
      return getImageFromMap(product) || '/images/placeholder.jpg'
    }
    return mainImage.url
  }

  // Si le produit a une image_url
  if (product.image_url) {
    if (product.image_url.includes('unsplash')) {
      return getImageFromMap(product) || '/images/placeholder.jpg'
    }
    return product.image_url
  }

  // Utiliser le mapping
  return getImageFromMap(product) || '/images/placeholder.jpg'
}

// Obtenir l'image depuis le mapping
function getImageFromMap(product) {
  if (!product) return null

  // Normaliser le titre pour la recherche (garder les espaces)
  const normalizeKey = (str) => str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s]/g, '') // Garder seulement lettres, chiffres et espaces
    .replace(/\s+/g, ' ') // Normaliser les espaces multiples
    .trim()

  // Essayer avec le titre (plusieurs variantes)
  if (product.titre) {
    const titleNormalized = normalizeKey(product.titre)
    
    // Essayer exact
    if (productImageMap[titleNormalized]) {
      return productImageMap[titleNormalized]
    }
    
    // Essayer avec tirets au lieu d'espaces
    const titleWithDashes = titleNormalized.replace(/\s+/g, '-')
    if (productImageMap[titleWithDashes]) {
      return productImageMap[titleWithDashes]
    }
    
    // Essayer avec underscores au lieu d'espaces
    const titleWithUnderscores = titleNormalized.replace(/\s+/g, '_')
    if (productImageMap[titleWithUnderscores]) {
      return productImageMap[titleWithUnderscores]
    }
  }

  // Essayer avec le slug
  if (product.slug) {
    const slugKey = normalizeKey(product.slug)
    if (productImageMap[slugKey]) {
      return productImageMap[slugKey]
    }
  }

  // Essayer avec l'ID
  if (product.id) {
    const idKey = product.id.toLowerCase()
    if (productImageMap[idKey]) {
      return productImageMap[idKey]
    }
  }

  // Fallback: chercher par correspondance partielle (au moins 50% de correspondance)
  if (product.titre) {
    const titleNormalized = normalizeKey(product.titre)
    const partialMatch = Object.keys(productImageMap).find(key => {
      const similarity = calculateSimilarity(titleNormalized, key)
      return similarity > 0.5
    })
    if (partialMatch) {
      return productImageMap[partialMatch]
    }
  }

  return null
}

// Calculer la similarité entre deux chaînes (algorithme de Jaccard simplifié)
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ')
  const words2 = str2.split(' ')
  const intersection = words1.filter(word => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]
  return union.length > 0 ? intersection.length / union.length : 0
}

// Obtenir toutes les images d'un produit triées
export function getProductImages(product) {
  if (!product.produit_images || product.produit_images.length === 0) {
    return []
  }
  return [...product.produit_images].sort((a, b) => a.ordre_affichage - b.ordre_affichage)
}

// Fonction de diagnostic pour vérifier les correspondances d'images
export async function checkImageMapping() {
  const { data: products, error } = await supabase
    .from('produits')
    .select('id, titre, slug, categories (nom)')
    .eq('actif', true)

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return { error: error.message }
  }

  const normalizeKey = (str) => str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const results = {
    total: products.length,
    matched: 0,
    unmatched: [],
    unmatchedByCategory: {}
  }

  products.forEach(product => {
    const titleNormalized = normalizeKey(product.titre)
    const hasMatch = productImageMap[titleNormalized] || 
                    productImageMap[titleNormalized.replace(/\s+/g, '-')] ||
                    productImageMap[titleNormalized.replace(/\s+/g, '_')]

    if (hasMatch) {
      results.matched++
    } else {
      results.unmatched.push({
        id: product.id,
        titre: product.titre,
        titreNormalized: titleNormalized,
        categorie: product.categories?.nom || 'Sans catégorie'
      })

      const category = product.categories?.nom || 'Sans catégorie'
      if (!results.unmatchedByCategory[category]) {
        results.unmatchedByCategory[category] = []
      }
      results.unmatchedByCategory[category].push(product.titre)
    }
  })

  console.log('=== RÉSULTATS DU DIAGNOSTIC ===')
  console.log(`Total produits: ${results.total}`)
  console.log(`Avec correspondance: ${results.matched}`)
  console.log(`Sans correspondance: ${results.unmatched.length}`)
  console.log('\n=== PRODUITS SANS CORRESPONDANCE ===')
  results.unmatched.forEach(p => {
    console.log(`- ${p.titre} (${p.categorie}) -> normalized: "${p.titreNormalized}"`)
  })
  console.log('\n=== PAR CATÉGORIE ===')
  Object.entries(results.unmatchedByCategory).forEach(([cat, products]) => {
    console.log(`${cat}: ${products.length} produits sans image`)
  })

  return results
}

// Obtenir le prix minimum d'un produit (en tenant compte des variantes)
export function getMinPrice(product) {
  if (!product.produit_variantes || product.produit_variantes.length === 0) {
    return product.prix_base
  }
  const minVariantPrice = Math.min(
    ...product.produit_variantes.map(v => product.prix_base + (v.prix_supplementaire || 0))
  )
  return minVariantPrice
}

// Obtenir le prix maximum d'un produit
export function getMaxPrice(product) {
  if (!product.produit_variantes || product.produit_variantes.length === 0) {
    return product.prix_base
  }
  const maxVariantPrice = Math.max(
    ...product.produit_variantes.map(v => product.prix_base + (v.prix_supplementaire || 0))
  )
  return maxVariantPrice
}

// Vérifier si un produit est en stock
export function isInStock(product) {
  if (!product.produit_variantes || product.produit_variantes.length === 0) {
    return product.stock > 0
  }
  return product.produit_variantes.some(v => v.actif && v.stock > 0)
}

// Obtenir le stock total d'un produit
export function getTotalStock(product) {
  if (!product.produit_variantes || product.produit_variantes.length === 0) {
    return product.stock || 0
  }
  return product.produit_variantes
    .filter(v => v.actif)
    .reduce((total, v) => total + (v.stock || 0), 0)
}

// Calculer la note moyenne d'un produit
export function getAverageRating(product) {
  if (!product.avis_produits || product.avis_produits.length === 0) {
    return 0
  }
  const sum = product.avis_produits.reduce((acc, avis) => acc + avis.note, 0)
  return Math.round((sum / product.avis_produits.length) * 10) / 10
}

// Obtenir le nombre d'avis d'un produit
export function getReviewCount(product) {
  if (!product.avis_produits) {
    return 0
  }
  return product.avis_produits.length
}
