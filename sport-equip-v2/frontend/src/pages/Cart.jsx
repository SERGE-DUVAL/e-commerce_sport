import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getOrCreateCart, getCartWithItems, updateCartItem, removeFromCart, calculateCartTotal, getCartItemCount } from '../services/cartService'
import { getMainImage, formatPrice } from '../services/productService'

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartId, setCartId] = useState(null)
  const SHIPPING_COST = 1000

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadCart = async () => {
    setLoading(true)
    try {
      const cart = await getOrCreateCart(user.id)
      if (cart) {
        setCartId(cart.id)
        const items = await getCartWithItems(cart.id)
        setCartItems(items)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity)
      await loadCart()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
      await loadCart()
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const subtotal = calculateCartTotal(cartItems)
  const total = subtotal + SHIPPING_COST
  const itemCount = getCartItemCount(cartItems)

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour voir votre panier</p>
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
          to="/catalogue"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au catalogue
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier ({itemCount} articles)</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Liste des articles */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.produit_variantes?.produits
                const variant = item.produit_variantes
                const imageUrl = getMainImage(product) || '/images/placeholder.jpg'
                const itemPrice = (product?.prix_base || 0) + (variant?.prix_supplementaire || 0)
                
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product?.titre || 'Produit'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product?.titre || 'Produit'}</h3>
                      <p className="text-sm text-gray-600">
                        {variant?.taille && `Taille: ${variant.taille}`}
                        {variant?.couleur && ` - ${variant.couleur}`}
                      </p>
                      <p className="text-blue-600 font-bold">{formatPrice(itemPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantite - 1)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        disabled={item.quantite <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantite}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantite + 1)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        disabled={variant?.stock && item.quantite >= variant.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Résumé */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{formatPrice(SHIPPING_COST)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Passer la commande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
