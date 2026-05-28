const { Produit, MouvementStock, Utilisateur, LigneCommande, Commande } = require('../models');

// Créer un mouvement de stock
exports.createMouvement = async (req, res) => {
  try {
    const { id_produit, type_mouvement, quantite, motif } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const stock_avant = produit.stock;
    let stock_apres = stock_avant;

    if (type_mouvement === 'entree') {
      stock_apres = stock_avant + quantite;
    } else if (type_mouvement === 'sortie') {
      stock_apres = stock_avant - quantite;
    } else if (type_mouvement === 'ajustement') {
      stock_apres = quantite;
    }

    if (stock_apres < 0) {
      return res.status(400).json({ message: 'Stock insuffisant pour cette sortie' });
    }

    const mouvement = await MouvementStock.create({
      id_produit,
      id_utilisateur,
      type_mouvement,
      quantite,
      stock_avant,
      stock_apres,
      motif
    });

    await produit.update({ stock: stock_apres });

    res.json(mouvement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer l'historique des mouvements de stock
exports.getMouvements = async (req, res) => {
  try {
    const { id_produit } = req.query;
    const where = id_produit ? { id_produit } : {};

    const mouvements = await MouvementStock.findAll({
      where,
      include: [
        { model: Produit, as: 'produit' },
        { model: Utilisateur, as: 'utilisateur', attributes: ['nom', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(mouvements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les alertes de stock bas
exports.getStockAlerts = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      where: {
        stock: {
          [require('sequelize').Op.lt]: 5
        }
      },
      order: [['stock', 'ASC']]
    });

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Prévision de rupture de stock basée sur les ventes
exports.getStockForecast = async (req, res) => {
  try {
    const produits = await Produit.findAll();

    const forecasts = await Promise.all(produits.map(async (produit) => {
      // Calculer les ventes moyennes par jour sur les 30 derniers jours
      const trenteJours = new Date();
      trenteJours.setDate(trenteJours.getDate() - 30);

      const lignesCommandes = await LigneCommande.findAll({
        include: [
          {
            model: Commande,
            as: 'commande',
            where: {
              createdAt: {
                [require('sequelize').Op.gte]: trenteJours
              },
              statut: 'Livrée'
            }
          }
        ],
        where: { id_produit: produit.id_produit }
      });

      const totalVendu = lignesCommandes.reduce((sum, ligne) => sum + ligne.quantite, 0);
      const venteMoyenneParJour = totalVendu / 30;

      let joursRestants = null;
      if (venteMoyenneParJour > 0) {
        joursRestants = Math.floor(produit.stock / venteMoyenneParJour);
      }

      return {
        id_produit: produit.id_produit,
        titre: produit.titre,
        categorie: produit.categorie,
        stock_actuel: produit.stock,
        vente_moyenne_journaliere: venteMoyenneParJour.toFixed(2),
        jours_restants: joursRestants,
        alerte: joursRestants !== null && joursRestants < 7
      };
    }));

    // Filtrer uniquement les produits avec alerte
    const alerts = forecasts.filter(f => f.alerte).sort((a, b) => a.jours_restants - b.jours_restants);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
