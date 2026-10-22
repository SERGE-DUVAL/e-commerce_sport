import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getCartCount } from '../services/cartService'
import { isAdmin } from '../services/adminService'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (user) {
      loadCartCount()
      checkAdminRole()
    } else {
      setCartCount(0)
      setIsUserAdmin(false)
    }
  }, [user])

  const loadCartCount = async () => {
    try {
      const count = await getCartCount(user.id)
      setCartCount(count)
    } catch (error) {
      console.error('Erreur lors du chargement du compteur panier:', error)
    }
  }

  const checkAdminRole = async () => {
    try {
      const admin = await isAdmin(user.id)
      setIsUserAdmin(admin)
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error)
      setIsUserAdmin(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-xl font-bold text-gray-900">Sport-Equip</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Accueil
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Catalogue
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              onClick={loadCartCount}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                {isUserAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <User className="w-5 h-5" />
                  Mon compte
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <User className="w-5 h-5" />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/catalogue"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => {
                    loadCartCount()
                    setMobileMenuOpen(false)
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Panier ({cartCount})
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Mon compte
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium justify-center"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Connexion
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
