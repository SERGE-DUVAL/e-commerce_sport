import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, AlertTriangle, Users, CreditCard } from 'lucide-react'

export default function Terms() {
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
            <FileText className="w-8 h-8 text-blue-600" />
            Conditions d'Utilisation
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Acceptation des Conditions</h2>
              <p className="leading-relaxed">
                En utilisant le site Sport-Equip, vous acceptez les présentes conditions d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Compte Utilisateur
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Les informations fournies doivent être exactes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Commandes et Paiements
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Toutes les commandes sont sujettes à disponibilité</li>
                <li>Nous acceptons les paiements Mobile Money</li>
                <li>Les prix sont indiqués en FCFA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Propriété Intellectuelle
              </h2>
              <p className="leading-relaxed">
                Tout le contenu du site est la propriété exclusive de Sport-Equip.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
