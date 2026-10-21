const { CohereClient } = require("cohere-ai");
const sequelize = require("../config/database");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Mémoire des conversations
const conversations = {};

// Définition textuelle stricte de ton schéma SQLite actuel
const SCHEMA_MLD = `
Champs utilisables pour générer du SQL (SQLite) :

1. Table: utilisateurs
   - id_utilisateur (INTEGER, PK)
   - nom (VARCHAR)
   - email (VARCHAR)
   - points_fidelite (INTEGER)

2. Table: commandes
   - id_commande (INTEGER, PK)
   - total_xaf (INTEGER)
   - moyen_paiement (VARCHAR)
   - frais_livraison (INTEGER)
   - points_utilises (INTEGER)
   - remise_appliquee (INTEGER)
   - adresse_livraison (TEXT)
   - statut (VARCHAR)
   - montant_rembourse (INTEGER)
   - id_utilisateur (INTEGER, FK -> utilisateurs.id_utilisateur)
   - created_at (DATETIME)
   - updated_at (DATETIME)
   ⚠️ ATTENTION : La colonne "id_caisse" N'EXISTE PAS dans cette table. Ne l'utilise jamais.

3. Table: produits
   - id_produit (INTEGER, PK)
   - titre (VARCHAR)
   - description (TEXT)
   - prix_xaf (INTEGER)
   - stock (INTEGER)
`;

exports.chat = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(503).json({
      success: false,
      response: 'Le chatbot est indisponible tant que les requêtes générées ne sont pas sécurisées.'
    });
  }

  if (!process.env.COHERE_API_KEY) {
    return res.status(503).json({
      success: false,
      response: 'Le service de chatbot n’est pas configuré.'
    });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message vide" });
    }

    // ID de l'utilisateur connecté (Fallback à 1 pour tes tests si pas de session)
    const userId = req.utilisateur?.id_utilisateur || 1;

    if (!conversations[userId]) {
      conversations[userId] = [];
    }

    // =========================================================================
    // ÉTAPE 1 : Demander à l'IA si elle a besoin d'exécuter une requête SQL
    // =========================================================================
    const decisionResponse = await cohere.chat({
      model: "command-r-plus",
      temperature: 0.0, // Strict pour éviter les inventions
      preamble: `Tu es un assistant technique connecté à une base de données SQLite.
Analyse la demande du client. Si elle nécessite des informations en temps réel issues de la base de données (produits, ses commandes, ses points), génère UNIQUEMENT la requête SQL correspondante.

RÈGLES DE SÉCURITÉ SQLITE :
- Utilise le MLD fourni ci-dessous.
- Pour filtrer sur l'utilisateur actuellement connecté, utilise impérativement la valeur : {{USER_ID}}.
- Ne fais JAMAIS de requêtes de modification (INSERT, UPDATE, DELETE). Uniquement des SELECT.
- Si la demande ne nécessite AUCUNE donnée (ex: "Bonjour", "Qui es-tu ?"), réponds par le mot "AUCUN".
- Renvoie uniquement le code SQL pur, sans balises markdown (\`\`\`), sans texte autour.

SCHÉMA DE LA BASE DE DONNÉES ACTUALISÉ :
${SCHEMA_MLD}
`,
      message: `L'id de l'utilisateur actuel est {{USER_ID}}. Demande du client : "${message}"`,
    });

    let sqlQuery = decisionResponse.text.trim();
    let dataContext = "Aucune donnée de base de données requise.";

    // =========================================================================
    // ÉTAPE 2 : Si l'IA demande du SQL, on l'exécute sur le serveur
    // =========================================================================
    if (sqlQuery && sqlQuery !== "AUCUN" && !sqlQuery.includes("CONVERSATION")) {
      try {
        // Sécurité de base : On remplace le tag dynamique par le vrai ID utilisateur
        sqlQuery = sqlQuery.replace(/{{USER_ID}}/g, userId);

        console.log(`[Chatbot SQL] Exécution de la requête : ${sqlQuery}`);

        // Exécution directe du SQL brut via Sequelize
        const [results] = await sequelize.query(sqlQuery);
        dataContext = JSON.stringify(results, null, 2);
        
      } catch (sqlError) {
        console.error("[Chatbot SQL] Échec de la requête générée par l'IA :", sqlError.message);
        dataContext = `Erreur lors de la récupération des données : ${sqlError.message}. Fais sans ou signale-le gentiment.`;
      }
    }

    // =========================================================================
    // ÉTAPE 3 : Génération de la réponse finale à l'utilisateur
    // =========================================================================
    conversations[userId].push({ role: "USER", message: message });

    const finalResponse = await cohere.chat({
      model: "command-r-plus",
      temperature: 0.5,
      preamble: `Tu es l'assistant intelligent officiel de Sport-Equip.
Réponds au client de manière chaleureuse, polie et concise en utilisant les données réelles récupérées depuis le système si nécessaires.

RÈGLES :
- Réponds toujours en français.
- Ne parle jamais de "requête SQL", de "base de données" ou de "tables" au client. Traduis les données naturellement (ex: au lieu de "le statut est LIVREE", dis "Votre commande a bien été livrée").
- Si les données sont vides ou introuvables, informe le client avec précision sans rien inventer.
`,
      chatHistory: conversations[userId].slice(0, -1).map((msg) => ({
        role: msg.role,
        message: msg.message,
      })),
      message: `
DONNÉES SYSTÈME RÉCUPÉRÉES :
${dataContext}

QUESTION DU CLIENT :
${message}
`,
    });

    const botResponse = finalResponse.text || "Je reste à votre disposition.";

    conversations[userId].push({ role: "CHATBOT", message: botResponse });

    if (conversations[userId].length > 12) conversations[userId].shift();

    return res.json({
      success: true,
      response: botResponse,
    });

  } catch (error) {
    console.error("ERREUR CRITIQUE CHATBOT :", error);
    return res.json({
      success: false,
      response: "Désolé, je rencontre un problème pour traiter votre demande actuellement.",
    });
  }
};