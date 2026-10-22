import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Check, Loader2, Send, Minus, Plus, MessageSquare, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProductById, getMainImage, formatPrice, getMinPrice, getMaxPrice, getProductImages, isInStock, getTotalStock } from '../services/productService'
import { addToCart, getOrCreateCart } from '../services/cartService'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [mainImage, setMainImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    loadProduct()
    loadReviews()
  }, [id])

  useEffect(() => {
    if (product) {
      // Utiliser getMainImage pour avoir la même image que le catalogue
      const image = getMainImage(product)
      setMainImage(image)
      
      const images = getProductImages(product)
      if (images.length > 0) {
        setSelectedImage(images[0].url)
      }
      // Sélectionner la première variante active par défaut
      const firstActiveVariant = product.produit_variantes?.find(v => v.actif && v.stock > 0)
      if (firstActiveVariant) {
        setSelectedVariant(firstActiveVariant)
      }
    }
  }, [product])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const data = await getProductById(id)
      setProduct(data)
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('avis_produits')
        .select('*')
        .eq('produit_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert('Vous devez être connecté pour ajouter des articles au panier')
      return
    }

    if (!selectedVariant || selectedVariant.stock === 0) {
      alert('Veuillez sélectionner une variante disponible')
      return
    }

    try {
      const cart = await getOrCreateCart(user.id)
      if (!cart) {
        alert('Erreur lors de la création du panier')
        return
      }
      await addToCart(cart.id, selectedVariant.id, quantity)
      alert('Produit ajouté au panier !')
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      alert('Erreur lors de l\'ajout au panier')
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Vous devez être connecté pour laisser un avis')
      return
    }

    if (!reviewForm.commentaire.trim()) {
      alert('Veuillez remplir le commentaire')
      return
    }

    setSubmittingReview(true)

    try {
      const { error } = await supabase
        .from('avis_produits')
        .insert({
          produit_id: id,
          user_id: user.id,
          note: reviewForm.note,
          titre: reviewForm.titre,
          commentaire: reviewForm.commentaire,
          verified_purchase: false
        })

      if (error) throw error

      setReviewForm({ note: 5, titre: '', commentaire: '' })
      setShowReviewForm(false)
      loadReviews()
      alert('Avis ajouté avec succès !')
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error)
      alert('Erreur lors de l\'ajout de l\'avis')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Produit non trouvé</p>
          <Link to="/catalogue" className="text-blue-600 hover:text-blue-700">
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  const images = getProductImages(product)
  const currentPrice = selectedVariant
    ? product.prix_base + (selectedVariant.prix_supplementaire || 0)
    : getMinPrice(product)
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length : 0
  const reviewCount = reviews.length
  const inStock = isInStock(product)
  const totalStock = getTotalStock(product)

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au catalogue
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImage || selectedImage || '/images/placeholder.jpg'}
                alt={product.titre}
                className="w-full h-full object-contain max-h-96"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image.url ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || product.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">{product.categories?.nom || 'Catégorie'}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.titre}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating > 0 ? `(${averageRating}/5 - ${reviewCount} avis)` : '(Pas encore d\'avis)'}
                </span>
              </div>
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">En stock ({totalStock} articles disponibles)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm font-medium">Rupture de stock</span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-blue-600">
              {formatPrice(currentPrice)}
              {getMinPrice(product) !== getMaxPrice(product) && (
                <span className="text-lg text-gray-500 font-normal ml-2">
                  - {formatPrice(getMaxPrice(product))}
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">
              {product.description || 'Équipement sportif de haute qualité pour vos entraînements.'}
            </p>

            {/* Variantes */}
            {product.produit_variantes && product.produit_variantes.length > 0 && (
              <>
                {/* Tailles */}
                {product.produit_variantes.some(v => v.taille) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                    <div className="flex gap-2 flex-wrap">
                      {[...new Set(product.produit_variantes.filter(v => v.taille).map(v => v.taille))].map((taille) => {
                        const variantWithSize = product.produit_variantes.find(v => v.taille === taille && v.actif && v.stock > 0)
                        return (
                          <button
                            key={taille}
                            onClick={() => variantWithSize && setSelectedVariant(variantWithSize)}
                            disabled={!variantWithSize}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              selectedVariant?.taille === taille
                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            } ${!variantWithSize ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {taille}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Couleurs */}
                {product.produit_variantes.some(v => v.couleur) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                    <div className="flex gap-2 flex-wrap">
                      {[...new Set(product.produit_variantes.filter(v => v.couleur).map(v => v.couleur))].map((couleur) => {
                        const variantWithColor = product.produit_variantes.find(v => v.couleur === couleur && v.actif && v.stock > 0)
                        return (
                          <button
                            key={couleur}
                            onClick={() => variantWithColor && setSelectedVariant(variantWithColor)}
                            disabled={!variantWithColor}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              selectedVariant?.couleur === couleur
                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            } ${!variantWithColor ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: couleur }} />
                              <span>{couleur}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {selectedVariant && selectedVariant.stock <= 5 && (
                <p className="text-sm text-orange-600 mt-2">
                  Seulement {selectedVariant.stock} articles disponibles
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedVariant && selectedVariant.stock === 0}
            >
              <ShoppingCart className="w-6 h-6" />
              {selectedVariant && selectedVariant.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>

            {product.code_barre && (
              <div className="text-sm text-gray-500">
                Code-barre: {product.code_barre}
              </div>
            )}

            {/* Section Avis */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Avis clients ({reviewCount})</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  {showReviewForm ? 'Annuler' : 'Laisser un avis'}
                </button>
              </div>

              {showReviewForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Votre avis</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewForm({ ...reviewForm, note: star })}
                            className="text-2xl transition-colors"
                          >
                            <Star
                              className={`w-6 h-6 ${star <= reviewForm.note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Titre (optionnel)</label>
                      <input
                        type="text"
                        value={reviewForm.titre || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, titre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Résumez votre expérience"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                      <textarea
                        value={reviewForm.commentaire}
                        onChange={(e) => setReviewForm({ ...reviewForm, commentaire: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Partagez votre avis sur ce produit..."
                        required
                      />
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? 'Envoi en cours...' : 'Envoyer mon avis'}
                    </button>
                  </div>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((avis) => (
                    <div key={avis.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= avis.note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          {avis.verified_purchase && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Achat vérifié
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(avis.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {avis.titre && (
                        <h4 className="font-medium text-gray-900 mb-1">{avis.titre}</h4>
                      )}
                      <p className="text-gray-700 text-sm">{avis.commentaire}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
