const { Commande, LigneCommande, Produit, Utilisateur, Promotion } = require('../models');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  try {
    const { articles, adresse_livraison, moyen_paiement, points_utilises, code_promo } = req.body;
    
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id_utilisateur);
    
    // Vérifier les points disponibles
    if (points_utilises > utilisateur.points_fidelite) {
      return res.status(400).json({ message: 'Points insuffisants' });
    }

    // Calculer le total
    let total = 0;
    let remise = 0;

    if (code_promo && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Seul un administrateur peut appliquer une promotion' });
    }

    // Vérifier et appliquer le code promo
    if (code_promo) {
      const promotion = await Promotion.findOne({
        where: {
          code: code_promo.toUpperCase(),
          est_active: true,
          date_expiration: { [Op.gt]: new Date() }
        }
      });

      if (promotion) {
        remise = promotion.pourcentage_remise;
      }
    }

    // Vérifier le stock pour chaque article
    for (const article of articles) {
      const produit = await Produit.findByPk(article.id_produit);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${article.id_produit} non trouvé` });
      }
      if (produit.stock < article.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.titre}` });
      }
      total += produit.prix_xaf * article.quantite;
    }

    // Appliquer la réduction promo
    if (remise > 0) {
      total = total * (1 - remise / 100);
    }

    // Calculer les frais de livraison
    const frais_livraison = total >= 45000 ? 0 : 3000;

    // Déduire les points (10 points = 1 FCFA)
    const reduction_points = points_utilises / 10;
    total -= reduction_points;

    // Créer la commande
    const commande = await Commande.create({
      id_utilisateur: req.utilisateur.id_utilisateur,
      total_xaf: Math.round(total),
      moyen_paiement,
      frais_livraison,
      points_utilises,
      remise_appliquee: remise,
      adresse_livraison,
      statut: 'En attente'
    });

    // Créer les lignes de commande
    for (const article of articles) {
      const produit = await Produit.findByPk(article.id_produit);
      await LigneCommande.create({
        id_commande: commande.id_commande,
        id_produit: article.id_produit,
        quantite: article.quantite,
        prix_unitaire_achat: produit.prix_xaf,
        taille_selectionnee: article.taille,
        couleur_selectionnee: article.couleur
      });
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      commande
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { id_utilisateur: req.utilisateur.id_utilisateur },
      include: [{
        model: LigneCommande,
        include: [Produit]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [{
        model: LigneCommande,
        include: [Produit]
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { id_commande } = req.body;
    const commande = await Commande.findByPk(id_commande, {
      include: [LigneCommande]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérification finale du stock (Edge Case)
    for (const ligne of commande.LigneCommandes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      if (produit.stock < ligne.quantite) {
        await commande.update({ statut: 'Annulée' });
        return res.status(400).json({ 
          message: `Rupture de stock pour ${produit.titre}. Commande annulée.` 
        });
      }
    }

    // Simulation du paiement via API Switch
    // Dans un environnement réel, ici on enverrait une requête à l'API Switch
    // Pour le développement, on simule un succès
    
    // Mettre à jour le statut
    await commande.update({ statut: 'Payée' });

    // Déduire le stock
    for (const ligne of commande.LigneCommandes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      await produit.update({ stock: produit.stock - ligne.quantite });
    }

    // Calculer et créditer les points de fidélité
    // Règle: 100 FCFA = 1 point
    // Exception: La partie payée avec les points ne génère pas de nouveaux points
    const montant_eligible_points = commande.total_xaf;
    const points_gagnes = Math.floor(montant_eligible_points / 100);

    if (points_gagnes > 0) {
      const utilisateur = await Utilisateur.findByPk(commande.id_utilisateur);
      await utilisateur.update({
        points_fidelite: utilisateur.points_fidelite + points_gagnes - commande.points_utilises
      });
    } else if (commande.points_utilises > 0) {
      const utilisateur = await Utilisateur.findByPk(commande.id_utilisateur);
      await utilisateur.update({
        points_fidelite: utilisateur.points_fidelite - commande.points_utilises
      });
    }

    res.json({ 
      message: 'Paiement validé avec succès',
      commande,
      points_gagnes
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
