const { Produit, Commande, Utilisateur } = require('../models');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.utilisateur?.id_utilisateur;

    // Analyse simple du message (NLP basique)
    const messageLower = message.toLowerCase();
    let response = '';

    // Questions sur les stocks
    if (messageLower.includes('stock') || messageLower.includes('disponible') || messageLower.includes('disponibilité')) {
      // Extraire le nom du produit si mentionné
      const mots = messageLower.split(' ');
      const produitTrouve = await Produit.findOne({
        where: {
          titre: {
            [require('sequelize').Op.like]: `%${mots[mots.length - 1]}%`
          }
        }
      });

      if (produitTrouve) {
        response = `Le produit "${produitTrouve.titre}" est disponible en ${produitTrouve.stock} exemplaires.`;
      } else {
        const totalStock = await Produit.sum('stock');
        response = `Nous avons actuellement ${totalStock} produits en stock dans notre catalogue. Pour un produit spécifique, merci de préciser son nom.`;
      }
    }
    // Questions sur les commandes
    else if (messageLower.includes('commande') || messageLower.includes('colis') || messageLower.includes('livraison')) {
      if (userId) {
        const derniereCommande = await Commande.findOne({
          where: { id_utilisateur: userId },
          order: [['createdAt', 'DESC']]
        });

        if (derniereCommande) {
          response = `Votre dernière commande #${derniereCommande.id_commande} est actuellement au statut: "${derniereCommande.statut}".`;
        } else {
          response = 'Vous n\'avez aucune commande en cours.';
        }
      } else {
        response = 'Pour suivre votre commande, veuillez vous connecter à votre compte.';
      }
    }
    // Questions sur les prix
    else if (messageLower.includes('prix') || messageLower.includes('coût') || messageLower.includes('combien')) {
      const mots = messageLower.split(' ');
      const produitTrouve = await Produit.findOne({
        where: {
          titre: {
            [require('sequelize').Op.like]: `%${mots[mots.length - 1]}%`
          }
        }
      });

      if (produitTrouve) {
        response = `Le produit "${produitTrouve.titre}" coûte ${produitTrouve.prix_xaf.toLocaleString()} FCFA.`;
      } else {
        response = 'Pour connaître le prix d\'un produit, merci de préciser son nom.';
      }
    }
    // Questions sur les points de fidélité
    else if (messageLower.includes('point') || messageLower.includes('fidélité') || messageLower.includes('cagnotte')) {
      if (userId) {
        const utilisateur = await Utilisateur.findByPk(userId);
        const valeurFcfa = utilisateur.points_fidelite / 10;
        response = `Vous disposez de ${utilisateur.points_fidelite} points de fidélité, ce qui équivaut à ${valeurFcfa.toLocaleString()} FCFA de réduction disponible.`;
      } else {
        response = 'Pour consulter vos points de fidélité, veuillez vous connecter à votre compte.';
      }
    }
    // Questions générales
    else if (messageLower.includes('bonjour') || messageLower.includes('hello') || messageLower.includes('salut')) {
      response = 'Bonjour ! Je suis l\'assistant Sport-Equip. Je peux vous aider à vérifier les stocks, suivre vos commandes, connaître les prix ou consulter vos points de fidélité. Comment puis-je vous aider ?';
    }
    else if (messageLower.includes('merci')) {
      response = 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
    }
    else if (messageLower.includes('aide') || messageLower.includes('help')) {
      response = 'Je peux vous aider avec: - Vérifier la disponibilité des stocks - Suivre l\'état de vos commandes - Connaître les prix des produits - Consulter vos points de fidélité Que souhaitez-vous savoir ?';
    }
    else {
      response = 'Je n\'ai pas compris votre demande. Je peux vous aider avec les stocks, les commandes, les prix ou vos points de fidélité. Tapez "aide" pour plus d\'informations.';
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
