import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Filter, Search, ShoppingCart, Loader2, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllProducts, searchProducts, getMainImage, formatPrice, getMinPrice } from '../services/productService'
import { addToCart } from '../services/cartService'

export default function Catalogue() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [addedToCart, setAddedToCart] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    // Lire le paramètre category depuis l'URL
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = products

    // Filtrer par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categories?.nom === selectedCategory)
    }

    // Filtrer par stock
    if (stockFilter === 'in_stock') {
      filtered = filtered.filter(p => p.produit_variantes?.some(v => v.actif && v.stock > 0))
    } else if (stockFilter === 'out_of_stock') {
      filtered = filtered.filter(p => !p.produit_variantes?.some(v => v.actif && v.stock > 0))
    }

    // Filtrer par recherche
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(p =>
        p.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, products, selectedCategory, stockFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getAllProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setFilteredProducts(products)
      return
    }
    try {
      const results = await searchProducts(query)
      setFilteredProducts(results)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    }
  }

  const handleAddToCart = async (productId, variantId) => {
    if (!user) {
      alert('Vous devez être connecté pour ajouter des articles au panier')
      return
    }

    try {
      await addToCart(user.id, productId, variantId, 1)
      setAddedToCart({ ...addedToCart, [productId]: true })
      setTimeout(() => {
        setAddedToCart({ ...addedToCart, [productId]: false })
      }, 2000)
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      alert('Erreur lors de l\'ajout au panier')
    }
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue</h1>
          <p className="text-gray-600">Découvrez notre sélection d'équipements sportifs premium</p>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Toutes les catégories</option>
            <option value="Football">Football</option>
            <option value="Running">Running</option>
            <option value="Fitness">Fitness</option>
            <option value="Tennis">Tennis</option>
            <option value="Basketball">Basketball</option>
            <option value="Cyclisme">Cyclisme</option>
            <option value="Natation">Natation</option>
            <option value="Boxe">Boxe</option>
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="all">Tous les stocks</option>
            <option value="in_stock">En stock</option>
            <option value="out_of_stock">Rupture de stock</option>
          </select>
        </div>

        {/* État de chargement */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun produit trouvé</p>
          </div>
        ) : (
          /* Grille de produits */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const firstVariant = product.produit_variantes?.find(v => v.actif && v.stock > 0)
              return (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={getMainImage(product) || '/images/placeholder.jpg'}
                        alt={product.titre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg'
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">{product.titre}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.categories?.nom || 'Catégorie'}</p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{formatPrice(getMinPrice(product))}</span>
                      <button
                        onClick={() => firstVariant && handleAddToCart(product.id, firstVariant.id)}
                        disabled={!firstVariant || addedToCart[product.id]}
                        className={`p-2 rounded-lg transition-colors ${
                          addedToCart[product.id]
                            ? 'bg-green-600 text-white'
                            : firstVariant
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {addedToCart[product.id] ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
