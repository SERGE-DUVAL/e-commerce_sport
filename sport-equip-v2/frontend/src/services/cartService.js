import { supabase } from '../lib/supabaseClient'

// Créer ou récupérer le panier d'un utilisateur
export async function getOrCreateCart(userId) {
  const { data: existingCart, error: fetchError } = await supabase
    .from('paniers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Erreur lors de la récupération du panier:', fetchError)
    return null
  }

  if (existingCart) {
    return existingCart
  }

  // Créer un nouveau panier
  const { data: newCart, error: createError } = await supabase
    .from('paniers')
    .insert({ user_id: userId })
    .select()
    .single()

  if (createError) {
    console.error('Erreur lors de la création du panier:', createError)
    return null
  }

  return newCart
}

// Ajouter un article au panier
export async function addToCart(cartId, varianteId, quantite = 1) {
  const { data: existingItems, error: fetchError } = await supabase
    .from('panier_items')
    .select('*')
    .eq('panier_id', cartId)
    .eq('variante_id', varianteId)

  if (fetchError) {
    console.error('Erreur lors de la vérification du panier:', fetchError)
    return null
  }

  const existingItem = existingItems && existingItems.length > 0 ? existingItems[0] : null

  if (existingItem) {
    // Mettre à jour la quantité
    const { data: updatedItem, error: updateError } = await supabase
      .from('panier_items')
      .update({ quantite: existingItem.quantite + quantite })
      .eq('id', existingItem.id)
      .select()

    if (updateError) {
      console.error('Erreur lors de la mise à jour du panier:', updateError)
      return null
    }

    return updatedItem && updatedItem.length > 0 ? updatedItem[0] : null
  }

  // Ajouter un nouvel article
  const { data: newItem, error: insertError } = await supabase
    .from('panier_items')
    .insert({ panier_id: cartId, variante_id: varianteId, quantite })
    .select()

  if (insertError) {
    console.error('Erreur lors de l\'ajout au panier:', insertError)
    return null
  }

  return newItem && newItem.length > 0 ? newItem[0] : null
}

// Mettre à jour la quantité d'un article
export async function updateCartItem(itemId, quantite) {
  if (quantite <= 0) {
    return await removeFromCart(itemId)
  }

  const { data, error } = await supabase
    .from('panier_items')
    .update({ quantite })
    .eq('id', itemId)
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return null
  }

  return data
}

// Supprimer un article du panier
export async function removeFromCart(itemId) {
  const { error } = await supabase
    .from('panier_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return false
  }

  return true
}

// Vider le panier
export async function clearCart(cartId) {
  const { error } = await supabase
    .from('panier_items')
    .delete()
    .eq('panier_id', cartId)

  if (error) {
    console.error('Erreur lors du vidage du panier:', error)
    return false
  }

  return true
}

// Récupérer le panier avec tous les articles
export async function getCartWithItems(cartId) {
  const { data, error } = await supabase
    .from('panier_items')
    .select(`
      *,
      produit_variantes (
        *,
        produits (
          *,
          categories (
            id,
            nom,
            slug
          ),
          produit_images (
            id,
            url,
            ordre_affichage,
            alt_text
          )
        )
      )
    `)
    .eq('panier_id', cartId)

  if (error) {
    console.error('Erreur lors de la récupération du panier:', error)
    return []
  }

  return data
}

// Calculer le total du panier
export function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const variantPrice = item.produit_variantes?.produits?.prix_base || 0
    const supplementPrice = item.produit_variantes?.prix_supplementaire || 0
    return total + ((variantPrice + supplementPrice) * item.quantite)
  }, 0)
}

// Compter le nombre d'articles dans le panier
export function getCartItemCount(cartItems) {
  return cartItems.reduce((count, item) => count + item.quantite, 0)
}

// Récupérer le nombre d'articles dans le panier d'un utilisateur
export async function getCartCount(userId) {
  const cart = await getOrCreateCart(userId)
  if (!cart) return 0

  const items = await getCartWithItems(cart.id)
  return getCartItemCount(items || [])
}

// Récupérer les articles du panier d'un utilisateur
export async function getCartItems(userId) {
  const cart = await getOrCreateCart(userId)
  if (!cart) return []

  return await getCartWithItems(cart.id)
}
