import { Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Target, Users, Award } from 'lucide-react'

export default function About() {
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
            <Trophy className="w-8 h-8 text-blue-600" />
            À Propos de Sport-Equip
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Notre Histoire</h2>
              <p className="leading-relaxed">
                Fondée en 2024, Sport-Equip est née d'une passion pour le sport et d'un désir de fournir 
                aux athlètes camerounais l'équipement de qualité dont ils ont besoin pour exceller.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Notre Mission
              </h2>
              <p className="leading-relaxed">
                Démocratiser l'accès à l'équipement sportif de qualité en Cameroun et en Afrique centrale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Nos Valeurs
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Qualité</h3>
                  <p className="text-sm text-gray-700">Produits authentiques et durables</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Service</h3>
                  <p className="text-sm text-gray-700">Support client réactif</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Intégrité</h3>
                  <p className="text-sm text-gray-700">Transparence et honnêteté</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Innovation</h3>
                  <p className="text-sm text-gray-700">Dernières technologies</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Nos Engagements
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>100% de produits authentiques</li>
                <li>Livraison rapide dans tout le Cameroun</li>
                <li>Paiement sécurisé via Mobile Money</li>
                <li>Retour gratuit sous 14 jours</li>
                <li>Support client 7j/7</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
