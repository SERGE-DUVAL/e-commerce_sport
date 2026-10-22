import { supabase } from '../lib/supabase'

// Statistiques globales pour le dashboard admin
export async function getAdminStats() {
  try {
    // Récupérer le nombre total de produits
    const { count: totalProducts } = await supabase
      .from('produits')
      .select('*', { count: 'exact', head: true })

    // Récupérer le nombre total de commandes
    const { count: totalOrders } = await supabase
      .from('commandes')
      .select('*', { count: 'exact', head: true })

    // Récupérer le nombre total d'utilisateurs
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Récupérer le revenu total (somme des commandes confirmées)
    const { data: revenueData } = await supabase
      .from('commandes')
      .select('total')
      .eq('statut', 'confirmee')

    const revenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    return {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      revenue
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des stats admin:', error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      revenue: 0
    }
  }
}

// Récupérer tous les produits pour l'admin
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('produits')
      .select('*, categories(*), produit_variantes(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

// Récupérer toutes les commandes pour l'admin
export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .select('*, profiles(id, prenom, nom, email)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return []
  }
}

// Récupérer tous les utilisateurs pour l'admin
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return []
  }
}

// Récupérer l'activité récente pour l'admin
export async function getRecentActivity() {
  try {
    // Récupérer les 5 dernières commandes
    const { data: recentOrders, error: ordersError } = await supabase
      .from('commandes')
      .select('*, profiles(prenom, nom)')
      .order('created_at', { ascending: false })
      .limit(5)

    if (ordersError) throw ordersError

    // Récupérer les 5 derniers utilisateurs
    const { data: recentUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (usersError) throw usersError

    // Récupérer les produits avec stock faible (< 5)
    const { data: lowStockProducts, error: stockError } = await supabase
      .from('produits')
      .select('*, categories(nom)')
      .order('created_at', { ascending: false })
      .limit(10)

    if (stockError) throw stockError

    return {
      recentOrders: recentOrders || [],
      recentUsers: recentUsers || [],
      lowStockProducts: lowStockProducts?.filter(p => {
        const totalStock = p.produit_variantes?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0
        return totalStock < 5
      }) || []
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité récente:', error)
    return {
      recentOrders: [],
      recentUsers: [],
      lowStockProducts: []
    }
  }
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(orderId, status) {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .update({ statut: status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de commande:', error)
    return null
  }
}

// Créer un nouveau produit
export async function createProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('produits')
      .insert(productData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    throw error
  }
}

// Mettre à jour un produit
export async function updateProduct(productId, productData) {
  try {
    const { data, error } = await supabase
      .from('produits')
      .update(productData)
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    throw error
  }
}

// Supprimer un produit
export async function deleteProduct(productId) {
  try {
    const { error } = await supabase
      .from('produits')
      .delete()
      .eq('id', productId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    throw error
  }
}

// Vérifier si l'utilisateur a un rôle admin
export async function isAdmin(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return ['super_admin', 'admin', 'gestionnaire_stock', 'caissier'].includes(data?.role)
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error)
    return false
  }
}
