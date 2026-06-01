const Database = require('better-sqlite3');
const path = require('path');
require("dotenv").config();
const axios = require('axios');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'), { readonly: true });

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

    const userId = req.utilisateur?.id_utilisateur || 'anonymous';

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
      const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(userId);

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

      const commandes = db.prepare('SELECT * FROM commandes WHERE id_utilisateur = ? ORDER BY created_at DESC LIMIT 3').all(userId);

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

    const produits = db.prepare('SELECT * FROM produits ORDER BY created_at DESC LIMIT 15').all();

    if (produits.length > 0) {
      contexte += `

=== PRODUITS DISPONIBLES ===
`;

      produits.forEach((p) => {
        contexte += `
Produit : ${p.titre}
Catégorie : ${p.categorie}
Prix : ${p.prix_xaf} FCFA
Stock : ${p.stock}
Description : ${p.description || 'Non disponible'}
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
      return res.status(500).json({
        success: false,
        error: "Clé API Cohere non configurée",
        message: "L'assistant IA n'est pas configuré. Veuillez contacter l'administrateur."
      });
    }

    try {
      const url = "https://api.cohere.ai/v1/chat";
      const headers = {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      };

      const data = {
        "model": "command-r-08-2024",
        "chat_history": conversations[userId].map((msg) => ({
          role: msg.role,
          message: msg.message,
        })),
        "message": `
Tu es l'assistant intelligent officiel de Sport-Equip, une entreprise spécialisée dans la vente d'équipements sportifs.

CONTEXTE :

${contexte}

INSTRUCTIONS IMPORTANTES :
- Tu travailles pour Sport-Equip
- Réponds toujours en français
- Sois professionnel, poli et serviable
- Utilise les informations fournies dans le contexte pour répondre
- Si une information n'est pas disponible dans le contexte, dis-le clairement
- Ne jamais inventer de produits ou de prix
- Aide les clients avec leurs questions sur les produits, commandes, livraisons et promotions

QUESTION CLIENT :
${message}
`
      };

      const response = await axios.post(url, data, { headers });
      botResponse = response.data.text || response.data.message || "Je suis disponible pour vous aider.";
    } catch (cohereError) {
      console.error("ERREUR COHERE:", cohereError);
      
      // Vérifier si c'est une erreur de connexion
      if (cohereError.code === 'ECONNREFUSED' || cohereError.code === 'ENOTFOUND' || cohereError.message.includes('network') || cohereError.message.includes('ECONN')) {
        return res.status(503).json({
          success: false,
          error: "Pas de connexion internet",
          message: "Désolé, je n'ai pas accès à internet pour communiquer avec l'IA. Veuillez vérifier votre connexion et réessayer."
        });
      }
      
      // Autres erreurs Cohere
      return res.status(500).json({
        success: false,
        error: cohereError.message,
        message: "Désolé, une erreur s'est produite lors de la communication avec l'IA. Veuillez réessayer."
      });
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

  // En cas d'erreur, retourner une réponse de secours
  return res.json({
    success: true,
    response: "Désolé, une erreur s'est produite. Je suis toujours là pour vous aider avec nos produits, commandes et promotions. N'hésitez pas à reformuler votre question ou à consulter notre catalogue.",
  });
}
};
