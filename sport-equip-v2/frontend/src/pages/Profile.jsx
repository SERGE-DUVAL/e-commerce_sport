import { Link } from 'react-router-dom'
import { ArrowLeft, User, ShoppingBag, Settings, LogOut, MapPin, CreditCard, Save, Package, Clock, CheckCircle, Truck, ChevronLeft, X, Plus, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getUserOrders, getOrderById } from '../services/orderService'
import { getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../services/addressService'
import { getUserPayments } from '../services/paymentService'
import { formatPrice, getMainImage } from '../services/productService'

export default function Profile() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('profil')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressFormData, setAddressFormData] = useState({
    nom_complet: '',
    telephone: '',
    adresse: '',
    ville: '',
    region: '',
    code_postal: '',
    type_adresse: 'livraison',
    est_par_defaut: false
  })
  const [formData, setFormData] = useState({
    prenom: user?.user_metadata?.first_name || '',
    nom: user?.user_metadata?.last_name || '',
    telephone: ''
  })

  useEffect(() => {
    if (activeTab === 'commandes' && user) {
      loadOrders()
    }
  }, [activeTab, user])

  useEffect(() => {
    if (activeTab === 'adresses' && user) {
      loadAddresses()
    }
  }, [activeTab, user])

  useEffect(() => {
    if (activeTab === 'paiements' && user) {
      loadPayments()
    }
  }, [activeTab, user])

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const data = await getUserOrders(user.id)
      setOrders(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const loadAddresses = async () => {
    setAddressesLoading(true)
    try {
      const data = await getUserAddresses(user.id)
      setAddresses(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error)
    } finally {
      setAddressesLoading(false)
    }
  }

  const loadPayments = async () => {
    setPaymentsLoading(true)
    try {
      const data = await getUserPayments(user.id)
      setPayments(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const loadOrderDetails = async (orderId) => {
    setOrderDetailsLoading(true)
    try {
      const data = await getOrderById(orderId)
      setSelectedOrder(data)
    } catch (error) {
      console.error('Erreur lors du chargement des détails de commande:', error)
    } finally {
      setOrderDetailsLoading(false)
    }
  }

  const handleOrderClick = (order) => {
    loadOrderDetails(order.id)
  }

  const handleBackToOrders = () => {
    setSelectedOrder(null)
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setAddressFormData({
      nom_complet: '',
      telephone: '',
      adresse: '',
      ville: '',
      region: '',
      code_postal: '',
      type_adresse: 'livraison',
      est_par_defaut: false
    })
    setShowAddressForm(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressFormData({
      nom_complet: address.nom_complet,
      telephone: address.telephone,
      adresse: address.adresse,
      ville: address.ville,
      region: address.region,
      code_postal: address.code_postal || '',
      type_adresse: address.type_adresse,
      est_par_defaut: address.est_par_defaut
    })
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return
    }

    try {
      await deleteAddress(addressId)
      await loadAddresses()
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error)
      alert('Erreur lors de la suppression de l\'adresse')
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(user.id, addressId)
      await loadAddresses()
    } catch (error) {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error)
      alert('Erreur lors de la définition de l\'adresse par défaut')
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, {
          ...addressFormData,
          user_id: user.id
        })
      } else {
        await createAddress({
          ...addressFormData,
          user_id: user.id
        })
      }
      setShowAddressForm(false)
      setEditingAddress(null)
      await loadAddresses()
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'adresse:', error)
      alert('Erreur lors de l\'enregistrement de l\'adresse')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      // Mettre à jour les métadonnées utilisateur dans auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.prenom,
          last_name: formData.nom
        }
      })

      if (authError) throw authError

      // Mettre à jour la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Compte</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profil')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                activeTab === 'profil' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab('commandes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                activeTab === 'commandes' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Commandes
            </button>
            <button
              onClick={() => setActiveTab('adresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                activeTab === 'adresses' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Adresses
            </button>
            <button
              onClick={() => setActiveTab('paiements')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                activeTab === 'paiements' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Paiements
            </button>
            <button
              onClick={() => setActiveTab('parametres')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                activeTab === 'parametres' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Paramètres
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'profil' && (
              <>
                {/* Informations personnelles */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="+237 699 000 000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Enregistrement...
                        </>
                      ) : success ? (
                        <>
                          <Save className="w-5 h-5" />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'commandes' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                {selectedOrder ? (
                  <>
                    <button
                      onClick={handleBackToOrders}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Retour aux commandes
                    </button>
                    {orderDetailsLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Chargement des détails...</p>
                      </div>
                    ) : selectedOrder ? (
                      <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Commande #{selectedOrder.id.slice(0, 8)}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Clock className="w-4 h-4" />
                                {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-gray-900">{formatPrice(selectedOrder.total)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            {selectedOrder.statut === 'confirmee' && (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-600">Confirmée</span>
                              </>
                            )}
                            {selectedOrder.statut === 'en_preparation' && (
                              <>
                                <Package className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-600">En préparation</span>
                              </>
                            )}
                            {selectedOrder.statut === 'expediee' && (
                              <>
                                <Truck className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-orange-600">Expédiée</span>
                              </>
                            )}
                            {selectedOrder.statut === 'livree' && (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-600">Livrée</span>
                              </>
                            )}
                            {selectedOrder.statut === 'en_attente' && (
                              <>
                                <Clock className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-600">En attente</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Articles commandés</h4>
                          <div className="space-y-3">
                            {selectedOrder.commande_items?.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={getMainImage(item.produits)}
                                  alt={item.produits?.titre}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.produits?.titre}</h5>
                                  <p className="text-sm text-gray-600">
                                    {item.produit_variantes?.couleur && `Couleur: ${item.produit_variantes.couleur}`}
                                    {item.produit_variantes?.couleur && item.produit_variantes?.taille && ' • '}
                                    {item.produit_variantes?.taille && `Taille: ${item.produit_variantes.taille}`}
                                  </p>
                                  <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold text-gray-900">{formatPrice(item.prix_unitaire * item.quantite)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h4>
                          <div className="text-sm text-gray-600">
                            <p><strong>{selectedOrder.nom_livraison} {selectedOrder.prenom_livraison}</strong></p>
                            <p>{selectedOrder.adresse_livraison}</p>
                            <p>{selectedOrder.ville_livraison}, {selectedOrder.pays_livraison}</p>
                            <p>Tél: {selectedOrder.telephone_livraison}</p>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Paiement</h4>
                          <div className="text-sm text-gray-600">
                            <p><strong>Méthode:</strong> {selectedOrder.methode_paiement === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}</p>
                            <p><strong>Montant:</strong> {formatPrice(selectedOrder.total)}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Commandes récentes</h2>
                    {ordersLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Chargement...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Aucune commande pour le moment</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Package className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-gray-900">Commande #{order.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                {order.statut === 'confirmee' && (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Confirmée</span>
                                  </>
                                )}
                                {order.statut === 'en_preparation' && (
                                  <>
                                    <Package className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-600">En préparation</span>
                                  </>
                                )}
                                {order.statut === 'expediee' && (
                                  <>
                                    <Truck className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-600">Expédiée</span>
                                  </>
                                )}
                                {order.statut === 'livree' && (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Livrée</span>
                                  </>
                                )}
                                {order.statut === 'en_attente' && (
                                  <>
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-600">En attente</span>
                                  </>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">{order.methode_paiement === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                              <p><strong>Livraison:</strong> {order.nom_livraison} {order.prenom_livraison}, {order.adresse_livraison}, {order.ville_livraison}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'adresses' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Adresses de livraison</h2>
                  <button
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une adresse
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                          <input
                            type="text"
                            required
                            value={addressFormData.nom_complet}
                            onChange={(e) => setAddressFormData({ ...addressFormData, nom_complet: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                          <input
                            type="tel"
                            required
                            value={addressFormData.telephone}
                            onChange={(e) => setAddressFormData({ ...addressFormData, telephone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+221 77 123 45 67"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.adresse}
                          onChange={(e) => setAddressFormData({ ...addressFormData, adresse: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123 Rue de la République"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                          <input
                            type="text"
                            required
                            value={addressFormData.ville}
                            onChange={(e) => setAddressFormData({ ...addressFormData, ville: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dakar"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Région *</label>
                          <input
                            type="text"
                            required
                            value={addressFormData.region}
                            onChange={(e) => setAddressFormData({ ...addressFormData, region: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dakar"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                          <input
                            type="text"
                            value={addressFormData.code_postal}
                            onChange={(e) => setAddressFormData({ ...addressFormData, code_postal: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="12345"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type d'adresse</label>
                          <select
                            value={addressFormData.type_adresse}
                            onChange={(e) => setAddressFormData({ ...addressFormData, type_adresse: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="livraison">Livraison</option>
                            <option value="facturation">Facturation</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="est_par_defaut"
                          checked={addressFormData.est_par_defaut}
                          onChange={(e) => setAddressFormData({ ...addressFormData, est_par_defaut: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="est_par_defaut" className="text-sm text-gray-700">Définir comme adresse par défaut</label>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Enregistrement...' : (editingAddress ? 'Modifier' : 'Ajouter')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false)
                            setEditingAddress(null)
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {addressesLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Chargement...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune adresse enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">{address.nom_complet}</span>
                              {address.est_par_defaut && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Par défaut</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.adresse}</p>
                            <p className="text-sm text-gray-600">{address.ville}, {address.region}</p>
                            <p className="text-sm text-gray-600">{address.code_postal}</p>
                            <p className="text-sm text-gray-600">Tél: {address.telephone}</p>
                            <p className="text-xs text-gray-500 mt-1">{address.type_adresse === 'livraison' ? 'Livraison' : 'Facturation'}</p>
                          </div>
                          <div className="flex gap-2">
                            {!address.est_par_defaut && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Définir par défaut"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'paiements' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique des paiements</h2>
                {paymentsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Chargement...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun paiement enregistré</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">Paiement #{payment.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">{formatPrice(payment.montant)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            {payment.statut === 'succes' && (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">Succès</span>
                              </>
                            )}
                            {payment.statut === 'en_attente' && (
                              <>
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-600">En attente</span>
                              </>
                            )}
                            {payment.statut === 'echec' && (
                              <>
                                <X className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Échec</span>
                              </>
                            )}
                            {payment.statut === 'annule' && (
                              <>
                                <X className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-600">Annulé</span>
                              </>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {payment.moyen_paiement === 'orange_money' ? 'Orange Money' : 
                             payment.moyen_paiement === 'mtn_momo' ? 'MTN Mobile Money' :
                             payment.moyen_paiement === 'carte' ? 'Carte bancaire' :
                             payment.moyen_paiement === 'paypal' ? 'PayPal' :
                             payment.moyen_paiement === 'cash' ? 'Espèces' :
                             payment.moyen_paiement}
                          </span>
                        </div>
                        {payment.transaction_id && (
                          <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                            <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'parametres' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres du compte</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">Recevoir les offres et promotions</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Newsletter</h3>
                      <p className="text-sm text-gray-600">Abonnement à la newsletter</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
