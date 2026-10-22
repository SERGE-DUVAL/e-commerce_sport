import { Link } from 'react-router-dom'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Comment passer une commande ?",
      answer: "Sélectionnez les produits, ajoutez-les au panier, puis procédez au paiement via Mobile Money."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons Orange Money et MTN Mobile Money."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Yaoundé (1-2 jours), Douala (2-3 jours), autres villes (3-5 jours)."
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Oui, vous pouvez retourner un produit dans les 14 jours suivant la réception."
    },
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous pouvez suivre l'état de votre commande depuis votre compte."
    }
  ]

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
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Questions Fréquemment Posées
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-gray-700 mb-4">
              N'hésitez pas à nous contacter directement.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
