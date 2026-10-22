import { supabase } from '../lib/supabaseClient'

// Obtenir les adresses d'un utilisateur
export async function getUserAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('adresses')
      .select('*')
      .eq('user_id', userId)
      .order('est_par_defaut', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error)
    throw error
  }
}

// Créer une nouvelle adresse
export async function createAddress(addressData) {
  try {
    const { data, error } = await supabase
      .from('adresses')
      .insert(addressData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la création de l\'adresse:', error)
    throw error
  }
}

// Mettre à jour une adresse
export async function updateAddress(addressId, addressData) {
  try {
    const { data, error } = await supabase
      .from('adresses')
      .update(addressData)
      .eq('id', addressId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'adresse:', error)
    throw error
  }
}

// Supprimer une adresse
export async function deleteAddress(addressId) {
  try {
    const { error } = await supabase
      .from('adresses')
      .delete()
      .eq('id', addressId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse:', error)
    throw error
  }
}

// Définir une adresse comme par défaut
export async function setDefaultAddress(userId, addressId) {
  try {
    // D'abord, retirer le statut par défaut de toutes les adresses
    await supabase
      .from('adresses')
      .update({ est_par_defaut: false })
      .eq('user_id', userId)

    // Ensuite, définir la nouvelle adresse par défaut
    const { data, error } = await supabase
      .from('adresses')
      .update({ est_par_defaut: true })
      .eq('id', addressId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la définition de l\'adresse par défaut:', error)
    throw error
  }
}
