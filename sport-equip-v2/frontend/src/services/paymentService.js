import { supabase } from '../lib/supabaseClient'

// Obtenir les paiements d'un utilisateur
export async function getUserPayments(userId) {
  try {
    // D'abord, récupérer les IDs des commandes de l'utilisateur
    const { data: orders, error: ordersError } = await supabase
      .from('commandes')
      .select('id')
      .eq('utilisateur_id', userId)

    if (ordersError) throw ordersError

    if (!orders || orders.length === 0) {
      return []
    }

    const orderIds = orders.map(order => order.id)

    // Ensuite, récupérer les paiements pour ces commandes
    const { data, error } = await supabase
      .from('paiements')
      .select(`
        *,
        commandes (
          id,
          statut,
          total
        )
      `)
      .in('commande_id', orderIds)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error)
    throw error
  }
}

// Obtenir les paiements d'une commande spécifique
export async function getOrderPayments(orderId) {
  try {
    const { data, error } = await supabase
      .from('paiements')
      .select('*')
      .eq('commande_id', orderId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements de la commande:', error)
    throw error
  }
}

// Créer un nouveau paiement
export async function createPayment(paymentData) {
  try {
    const { data, error } = await supabase
      .from('paiements')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error)
    throw error
  }
}

// Mettre à jour le statut d'un paiement
export async function updatePaymentStatus(paymentId, status) {
  try {
    const { data, error } = await supabase
      .from('paiements')
      .update({ statut: status })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du paiement:', error)
    throw error
  }
}
