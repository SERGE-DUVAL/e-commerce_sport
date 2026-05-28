const { CohereClient } = require("cohere-ai");
const { Produit, Commande, Utilisateur } = require("../models");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Mémoire simple des conversations
const conversations = {};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message vide",
      });
    }

    const userId = req.utilisateur?.id_utilisateur;

    // =========================
    // INITIALISATION HISTORIQUE
    // =========================

    if (!conversations[userId]) {
      conversations[userId] = [];
    }

    // =========================
    // CONTEXTE UTILISATEUR
    // =========================

    let contexte = "";

    if (userId) {
      const utilisateur = await Utilisateur.findByPk(userId);

      if (utilisateur) {
        contexte += `
=== UTILISATEUR CONNECTÉ ===
Nom : ${utilisateur.nom}
Email : ${utilisateur.email}
Points fidélité : ${utilisateur.points_fidelite}
`;
      }

      // =========================
      // DERNIÈRES COMMANDES
      // =========================

      const commandes = await Commande.findAll({
        where: { id_utilisateur: userId },
        limit: 3,
        order: [["createdAt", "DESC"]],
      });

      if (commandes.length > 0) {
        contexte += `

=== DERNIÈRES COMMANDES ===
`;

        commandes.forEach((cmd) => {
          contexte += `
Commande #${cmd.id_commande}
- Statut : ${cmd.statut}
- Montant : ${cmd.total_xaf} FCFA
`;
        });
      }
    }

    // =========================
    // PRODUITS DISPONIBLES
    // =========================

    const produits = await Produit.findAll({
      limit: 15,
      order: [["createdAt", "DESC"]],
    });

    if (produits.length > 0) {
      contexte += `

=== PRODUITS DISPONIBLES ===
`;

      produits.forEach((p) => {
        contexte += `
Produit : ${p.titre}
Prix : ${p.prix_xaf} FCFA
Stock : ${p.stock}
`;
      });
    }

    // =========================
    // AJOUT HISTORIQUE
    // =========================

    conversations[userId].push({
      role: "USER",
      message: message,
    });

    // Limiter mémoire
    if (conversations[userId].length > 10) {
      conversations[userId].shift();
    }

    // =========================
    // APPEL COHERE
    // =========================

    let botResponse = "";

    if (!process.env.COHERE_API_KEY) {
      botResponse = "Je peux vous aider avec les produits, commandes, paiements et livraisons. L'assistant IA avancé n'est pas encore configuré.";
    } else {
      const response = await cohere.chat({
        model: "command-r-plus",

        temperature: 0.4,

        preamble: `
Tu es l'assistant intelligent officiel de Sport-Equip.

Ton comportement :
- professionnel
- moderne
- poli
- rapide
- intelligent

Tu aides les clients concernant :
- les produits
- les commandes
- les paiements
- les livraisons
- les promotions
- les stocks
- les points fidélité

RÈGLES IMPORTANTES :
- Toujours répondre en français
- Utiliser UNIQUEMENT les données fournies
- Ne jamais inventer de produits
- Ne jamais inventer une commande
- Si une information manque, le dire clairement
- Répondre de manière concise
- Utiliser des emojis modérément
`,

        chatHistory: conversations[userId].map((msg) => ({
          role: msg.role,
          message: msg.message,
        })),

        message: `
CONTEXTE :

${contexte}

QUESTION CLIENT :
${message}
`,
      });

      botResponse = response.text || response.message || "Je suis disponible pour vous aider.";
    }

    // =========================
    // SAUVEGARDE RÉPONSE IA
    // =========================

    conversations[userId].push({
      role: "CHATBOT",
      message: botResponse,
    });

    // =========================
    // RÉPONSE API
    // =========================

    return res.json({
      success: true,
      response: botResponse,
    });

  }catch (error) {
  console.error("ERREUR COMPLETE CHATBOT:");
  console.error(error);

  if (error.response) {
    console.error(error.response.data);
  }

  return res.json({
    success: true,
    response: "Désolé, l'assistant IA avancé est momentanément indisponible. Vous pouvez consulter le catalogue, votre profil ou contacter l'administration pour votre demande.",
  });
}
};
