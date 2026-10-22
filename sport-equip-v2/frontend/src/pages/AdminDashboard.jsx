import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart3, TrendingUp, AlertCircle, Loader2, X, Eye, Upload, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAdminStats, getAllProducts, getAllOrders, getAllUsers, isAdmin, getRecentActivity, createProduct } from '../services/adminService'
import { getMainImage, isInStock, getTotalStock } from '../services/productService'
import supabase from '../config/supabase'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false)
  const [recentActivity, setRecentActivity] = useState({
    recentOrders: [],
    recentUsers: [],
    lowStockProducts: []
  })
  const [showProductModal, setShowProductModal] = useState(false)
  const [loadingProductUpload, setLoadingProductUpload] = useState(false)
  const [productFormData, setProductFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie_id: '',
    image: null,
    variantes: [{ couleur: '', taille: '', stock: 0 }]
  })

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Vérifier si l'utilisateur est connecté
      if (!user?.id) {
        navigate('/login')
        return
      }
      
      // Vérifier si l'utilisateur est admin
      const isAdminUser = await isAdmin(user.id)
      if (!isAdminUser) {
        navigate('/catalogue')
        return
      }

      // Charger les stats
      const statsData = await getAdminStats()
      setStats(statsData)

      // Charger l'activité récente
      const activityData = await getRecentActivity()
      setRecentActivity(activityData)
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleViewOrder = async (order) => {
    try {
      setLoadingOrderDetails(true)
      setShowOrderModal(true)
      setSelectedOrder(order)

      // Récupérer les détails de la commande avec items et adresse
      const { data: orderDetails, error: orderError } = await supabase
        .from('commandes')
        .select('*, commande_items(*, produit_variantes(*, produits(*, categories(*))))')
        .eq('id', order.id)
        .single()

      if (orderError) throw orderError

      setSelectedOrder(orderDetails)
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la commande:', error)
    } finally {
      setLoadingOrderDetails(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setLoadingProductUpload(true)

    try {
      let imageUrl = null

      // Upload de l'image si présente
      if (productFormData.image) {
        const file = productFormData.image
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Créer le produit
      const productData = {
        titre: productFormData.titre,
        description: productFormData.description,
        prix: parseFloat(productFormData.prix),
        categorie_id: productFormData.categorie_id,
        image_url: imageUrl,
        actif: true
      }

      const newProduct = await createProduct(productData)

      // Créer les variantes
      for (const variante of productFormData.variantes) {
        if (variante.couleur || variante.taille) {
          await supabase.from('produit_variantes').insert({
            produit_id: newProduct.id,
            couleur: variante.couleur,
            taille: variante.taille,
            stock: variante.stock || 0,
            prix: parseFloat(productFormData.prix)
          })
        }
      }

      // Fermer le modal et recharger les produits
      setShowProductModal(false)
      setProductFormData({
        titre: '',
        description: '',
        prix: '',
        categorie_id: '',
        image: null,
        variantes: [{ couleur: '', taille: '', stock: 0 }]
      })
      loadProducts()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error)
      alert('Erreur lors de l\'ajout du produit')
    } finally {
      setLoadingProductUpload(false)
    }
  }

  const handleAddVariante = () => {
    setProductFormData({
      ...productFormData,
      variantes: [...productFormData.variantes, { couleur: '', taille: '', stock: 0 }]
    })
  }

  const handleRemoveVariante = (index) => {
    const newVariantes = productFormData.variantes.filter((_, i) => i !== index)
    setProductFormData({
      ...productFormData,
      variantes: newVariantes
    })
  }

  // Charger les données selon l'onglet actif
  useEffect(() => {
    if (!loading) {
      if (activeTab === 'products') {
        loadProducts()
      } else if (activeTab === 'orders') {
        loadOrders()
      } else if (activeTab === 'users') {
        loadUsers()
      }
    }
  }, [activeTab, loading])

  const loadProducts = async () => {
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-xl font-bold text-gray-900">Sport-Equip Admin</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user?.prenom} {user?.nom}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Produits</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                      </div>
                      <Package className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Commandes</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                      </div>
                      <ShoppingCart className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Utilisateurs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Revenus</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.revenue.toLocaleString()} FCFA</p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                  <div className="space-y-4">
                    {/* Commandes récentes */}
                    {recentActivity.recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Nouvelle commande #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.profiles ? `${order.profiles.prenom} ${order.profiles.nom}` : 'Client inconnu'} - {order.total?.toLocaleString()} FCFA
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}

                    {/* Utilisateurs récents */}
                    {recentActivity.recentUsers.slice(0, 2).map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Nouvel utilisateur inscrit
                          </p>
                          <p className="text-sm text-gray-600">
                            {user.prenom} {user.nom} - {user.email}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}

                    {/* Stock faible */}
                    {recentActivity.lowStockProducts.slice(0, 2).map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Stock faible: {product.titre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.categories?.nom || 'Sans catégorie'}
                          </p>
                        </div>
                      </div>
                    ))}

                    {recentActivity.recentOrders.length === 0 && 
                     recentActivity.recentUsers.length === 0 && 
                     recentActivity.lowStockProducts.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
                  <button 
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un produit
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Catégorie</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Prix</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <img
                                src={getMainImage(product)}
                                alt={product.titre}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.jpg'
                                }}
                              />
                            </td>
                            <td className="py-3 px-4">{product.titre}</td>
                            <td className="py-3 px-4">{product.categories?.nom || '-'}</td>
                            <td className="py-3 px-4">{product.prix_base?.toLocaleString()} FCFA</td>
                            <td className="py-3 px-4">
                              {isInStock(product) ? (
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  En stock ({getTotalStock(product)})
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  Rupture de stock
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500">
                              Aucun produit trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestion des commandes</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{order.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">
                              {order.profiles ? `${order.profiles.prenom} ${order.profiles.nom}` : 'Client inconnu'}
                            </td>
                            <td className="py-3 px-4">{order.total?.toLocaleString()} FCFA</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
                                order.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.statut}
                              </span>
                            </td>
                            <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-500">
                              Aucune commande trouvée
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Prénom</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date d'inscription</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Points fidélité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userItem) => (
                          <tr key={userItem.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{userItem.prenom || '-'}</td>
                            <td className="py-3 px-4">{userItem.nom || '-'}</td>
                            <td className="py-3 px-4">{userItem.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                userItem.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                userItem.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                userItem.role === 'gestionnaire_stock' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {userItem.role || 'client'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{new Date(userItem.created_at).toLocaleDateString('fr-FR')}</td>
                            <td className="py-3 px-4">{userItem.points_fidelite || 0}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-500">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytiques</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">Graphiques et statistiques...</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">Configuration du site...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal détails commande */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Détails de la commande #{selectedOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingOrderDetails ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Informations client */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations client</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <p className="font-medium">
                        {selectedOrder.profiles ? `${selectedOrder.profiles.prenom} ${selectedOrder.profiles.nom}` : 'Client inconnu'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedOrder.profiles?.email || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                {selectedOrder.adresse_livraison && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h4>
                    <div className="text-sm">
                      <p className="font-medium">{selectedOrder.adresse_livraison.nom} {selectedOrder.adresse_livraison.prenom}</p>
                      <p>{selectedOrder.adresse_livraison.adresse}</p>
                      <p>{selectedOrder.adresse_livraison.code_postal} {selectedOrder.adresse_livraison.ville}</p>
                      <p>{selectedOrder.adresse_livraison.pays}</p>
                      <p className="mt-2">Tél: {selectedOrder.adresse_livraison.telephone}</p>
                    </div>
                  </div>
                )}

                {/* Articles de la commande */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Articles commandés</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Produit</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Variante</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quantité</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Prix unitaire</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.commande_items?.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3 px-4 text-sm">
                              {item.produit_variantes?.produits?.titre || 'Produit inconnu'}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {item.produit_variantes?.couleur || '-'} / {item.produit_variantes?.taille || '-'}
                            </td>
                            <td className="py-3 px-4 text-sm text-center">{item.quantite}</td>
                            <td className="py-3 px-4 text-sm text-right">
                              {item.prix_unitaire?.toLocaleString()} FCFA
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              {(item.prix_unitaire * item.quantite).toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Récapitulatif paiement */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif paiement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total:</span>
                      <span>{selectedOrder.sous_total?.toLocaleString() || selectedOrder.total?.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison:</span>
                      <span>{selectedOrder.frais_livraison?.toLocaleString() || '1000'} FCFA</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>{selectedOrder.total?.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Statut de la commande */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Statut de la commande</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
                      selectedOrder.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrder.statut === 'expediee' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.statut === 'livree' ? 'bg-purple-100 text-purple-800' :
                      selectedOrder.statut === 'annulee' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.statut || 'En attente'}
                    </span>
                    <span className="text-sm text-gray-600">
                      - {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
