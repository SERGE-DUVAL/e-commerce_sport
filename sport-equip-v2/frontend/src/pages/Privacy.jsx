import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from 'lucide-react'

export default function Privacy() {
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

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Politique de Confidentialité
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
              <p className="leading-relaxed">
                Sport-Equip s'engage à protéger la confidentialité de vos données personnelles. 
                Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Données Collectées
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Informations personnelles (nom, prénom, email, téléphone)</li>
                <li>Adresse de livraison</li>
                <li>Informations de paiement</li>
                <li>Historique des commandes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Protection des Données
              </h2>
              <p className="leading-relaxed">
                Nous utilisons des mesures de sécurité avancées pour protéger vos données :
                chiffrement SSL, pare-feu sécurisé, et accès restreint.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Vos Droits
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification</li>
                <li>Droit à la suppression</li>
                <li>Droit d'opposition</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
