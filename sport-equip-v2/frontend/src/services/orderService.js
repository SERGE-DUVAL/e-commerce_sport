import { supabase } from '../lib/supabaseClient'

// Créer une nouvelle commande
export async function createOrder(orderData) {
  try {
    // Créer la commande
    const { data: commande, error: commandeError } = await supabase
      .from('commandes')
      .insert({
        utilisateur_id: orderData.utilisateur_id,
        total: orderData.total,
        methode_paiement: orderData.methode_paiement,
        nom_livraison: orderData.nom,
        prenom_livraison: orderData.prenom,
        telephone_livraison: orderData.telephone,
        adresse_livraison: orderData.adresse,
        ville_livraison: orderData.ville,
        pays_livraison: orderData.pays,
        notes_livraison: orderData.notes
      })
      .select()
      .single()

    if (commandeError) throw commandeError

    // Créer les items de commande
    const itemsData = orderData.items.map(item => ({
      commande_id: commande.id,
      produit_id: item.produit_id,
      variante_id: item.variante_id,
      quantite: item.quantite,
      prix_unitaire: item.prix_unitaire
    }))

    const { error: itemsError } = await supabase
      .from('commande_items')
      .insert(itemsData)

    if (itemsError) throw itemsError

    return commande
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    throw error
  }
}

// Obtenir les commandes d'un utilisateur
export async function getUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        commande_items (
          *,
          produits (titre),
          produit_variantes (couleur, taille)
        )
      `)
      .eq('utilisateur_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    throw error
  }
}

// Obtenir une commande par ID
export async function getOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        commande_items (
          *,
          produits (titre),
          produit_variantes (couleur, taille)
        ),
        paiements (*)
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    throw error
  }
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(orderId, statut) {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .update({ statut })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    throw error
  }
}

// Créer un paiement
export async function createPayment(paymentData) {
  try {
    const { data, error } = await supabase
      .from('paiements')
      .insert({
        commande_id: paymentData.commande_id,
        montant: paymentData.montant,
        methode: paymentData.methode,
        reference_transaction: paymentData.reference_transaction,
        statut: paymentData.statut,
        reponse_api: paymentData.reponse_api
      })
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
export async function updatePaymentStatus(paymentId, statut, reponseApi = null) {
  try {
    const updateData = { statut }
    if (reponseApi) {
      updateData.reponse_api = reponseApi
    }

    const { data, error } = await supabase
      .from('paiements')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de paiement:', error)
    throw error
  }
}
