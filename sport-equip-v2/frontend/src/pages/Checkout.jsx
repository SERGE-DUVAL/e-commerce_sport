import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Truck, CheckCircle, Loader2, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getCartItems, clearCart, getOrCreateCart } from '../services/cartService'
import { getMainImage, formatPrice } from '../services/productService'
import { createOrder, createPayment, updateOrderStatus } from '../services/orderService'
import { getUserAddresses, createAddress } from '../services/addressService'

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartId, setCartId] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [useExistingAddress, setUseExistingAddress] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: '',
    pays: 'Cameroun',
    methode_paiement: 'orange_money'
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadCart()
    loadAddresses()
  }, [user, navigate])

  const loadCart = async () => {
    try {
      const cart = await getOrCreateCart(user.id)
      if (cart) {
        setCartId(cart.id)
        const items = await getCartItems(user.id)
        setCartItems(items)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses(user.id)
      setAddresses(data || [])
      // Auto-select default address if exists
      const defaultAddress = data?.find(addr => addr.est_par_defaut)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
        setUseExistingAddress(true)
        setFormData({
          ...formData,
          nom: defaultAddress.nom_complet.split(' ').slice(1).join(' ') || '',
          prenom: defaultAddress.nom_complet.split(' ')[0] || '',
          telephone: defaultAddress.telephone,
          adresse: defaultAddress.adresse,
          ville: defaultAddress.ville,
          pays: 'Cameroun'
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Si l'utilisateur utilise une nouvelle adresse, la sauvegarder
      if (!useExistingAddress) {
        await createAddress({
          user_id: user.id,
          nom_complet: `${formData.prenom} ${formData.nom}`,
          telephone: formData.telephone,
          adresse: formData.adresse,
          ville: formData.ville,
          region: formData.ville, // Utiliser la ville comme région par défaut
          code_postal: '',
          type_adresse: 'livraison',
          est_par_defaut: false
        })
      }

      // Préparer les données de commande
      const orderData = {
        utilisateur_id: user.id,
        total: total,
        methode_paiement: formData.methode_paiement,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        pays: formData.pays,
        notes: '',
        items: cartItems.map(item => ({
          produit_id: item.produit_variantes.produits.id,
          variante_id: item.variante_id,
          quantite: item.quantite,
          prix_unitaire: item.produit_variantes?.prix_supplementaire
            ? item.produit_variantes.produits.prix_base + item.produit_variantes.prix_supplementaire
            : item.produit_variantes.produits.prix_base
        }))
      }

      // Créer la commande
      const commande = await createOrder(orderData)

      // Créer le paiement (simulé pour l'instant)
      await createPayment({
        commande_id: commande.id,
        montant: total,
        methode: formData.methode_paiement,
        reference_transaction: 'SIM-' + Date.now(),
        statut: 'succes',
        reponse_api: { simulated: true }
      })

      // Mettre à jour le statut de la commande à confirmée
      await updateOrderStatus(commande.id, 'confirmee')

      // Vider le panier après commande réussie
      await clearCart(cartId)

      setOrderPlaced(true)
    } catch (error) {
      console.error('Erreur lors de la commande:', error)
      alert('Erreur lors de la commande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fraisLivraison = 1000 // 1000 FCFA pour la livraison au Cameroun

  const sousTotal = cartItems.reduce((sum, item) => {
    // Handle different possible data structures
    let prix = 0
    if (item.produit_variantes?.produits?.prix_base) {
      prix = item.produit_variantes.prix_supplementaire
        ? item.produit_variantes.produits.prix_base + item.produit_variantes.prix_supplementaire
        : item.produit_variantes.produits.prix_base
    } else if (item.produits?.prix_base) {
      prix = item.produit_variantes?.prix_supplementaire
        ? item.produits.prix_base + item.produit_variantes.prix_supplementaire
        : item.produits.prix_base
    }
    return sum + (prix * item.quantite)
  }, 0)

  const total = sousTotal + fraisLivraison

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre commande a été enregistrée avec succès. Vous recevrez une confirmation par SMS.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au panier
          </Link>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits avant de passer commande</p>
            <Link
              to="/catalogue"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au panier
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de livraison */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Adresse de livraison
            </h2>

            {/* Sélection d'adresse existante */}
            {addresses.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="radio"
                    id="useExisting"
                    checked={useExistingAddress}
                    onChange={() => setUseExistingAddress(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="useExisting" className="text-sm font-medium text-gray-700">
                    Utiliser une adresse enregistrée
                  </label>
                </div>
                
                {useExistingAddress && (
                  <div className="space-y-2 ml-6">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === address.id}
                          onChange={() => {
                            setSelectedAddress(address)
                            setFormData({
                              ...formData,
                              nom: address.nom_complet.split(' ').slice(1).join(' ') || '',
                              prenom: address.nom_complet.split(' ')[0] || '',
                              telephone: address.telephone,
                              adresse: address.adresse,
                              ville: address.ville,
                              pays: 'Cameroun'
                            })
                          }}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{address.nom_complet}</p>
                          <p className="text-sm text-gray-600">{address.adresse}</p>
                          <p className="text-sm text-gray-600">{address.ville}, {address.region}</p>
                          <p className="text-sm text-gray-600">Tél: {address.telephone}</p>
                          {address.est_par_defaut && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Par défaut</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              <input
                type="radio"
                id="useNew"
                checked={!useExistingAddress}
                onChange={() => {
                  setUseExistingAddress(false)
                  setSelectedAddress(null)
                }}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="useNew" className="text-sm font-medium text-gray-700">
                Saisir une nouvelle adresse
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`grid grid-cols-2 gap-4 ${useExistingAddress ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    required={!useExistingAddress}
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    required={!useExistingAddress}
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>
              <div className={useExistingAddress ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  required={!useExistingAddress}
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+237 ..."
                />
              </div>
              <div className={useExistingAddress ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  required={!useExistingAddress}
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre adresse complète"
                />
              </div>
              <div className={useExistingAddress ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  name="ville"
                  required={!useExistingAddress}
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre ville"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Mode de paiement
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="methode_paiement"
                    value="orange_money"
                    checked={formData.methode_paiement === 'orange_money'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-medium">Orange Money</span>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="methode_paiement"
                    value="mtn_momo"
                    checked={formData.methode_paiement === 'mtn_momo'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-medium">MTN Mobile Money</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  'Confirmer la commande'
                )}
              </button>
            </form>
          </div>

          {/* Récapitulatif de commande */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Récapitulatif
            </h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                  <img
                    src={getMainImage(item.produit_variantes.produits)}
                    alt={item.produit_variantes.produits.titre}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.produit_variantes.produits.titre}</h3>
                    <p className="text-sm text-gray-600">
                      {item.produit_variantes?.couleur && `Couleur: ${item.produit_variantes.couleur}`}
                      {item.produit_variantes?.taille && ` • Taille: ${item.produit_variantes.taille}`}
                    </p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(
                        (item.produit_variantes?.prix_supplementaire 
                          ? item.produit_variantes.produits.prix_base + item.produit_variantes.prix_supplementaire
                          : item.produit_variantes.produits.prix_base) * item.quantite
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  {formatPrice(fraisLivraison)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
