const { MouvementStock, Produit, Utilisateur } = require('../models');

// Créer un mouvement de stock
exports.createMouvement = async (req, res) => {
  try {
    const { id_produit, type_mouvement, quantite, motif } = req.body;
    const id_utilisateur = req.utilisateur?.id_utilisateur || null;

    // Récupérer le produit
    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const stock_avant = produit.stock;
    let stock_apres = stock_avant;

    // Calculer le stock après le mouvement
    if (type_mouvement === 'entree') {
      stock_apres = stock_avant + quantite;
      await produit.update({ stock: stock_apres });
    } else if (type_mouvement === 'sortie') {
      if (stock_avant < quantite) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      stock_apres = stock_avant - quantite;
      await produit.update({ stock: stock_apres });
    } else if (type_mouvement === 'ajustement') {
      stock_apres = quantite;
      await produit.update({ stock: stock_apres });
    }

    // Créer le mouvement de stock
    const mouvement = await MouvementStock.create({
      id_produit,
      id_utilisateur,
      type_mouvement,
      quantite,
      stock_avant,
      stock_apres,
      motif
    });

    res.status(201).json(mouvement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les mouvements de stock
exports.getAllMouvements = async (req, res) => {
  try {
    const mouvements = await MouvementStock.findAll({
      include: [
        { model: Produit, as: 'produit', attributes: ['id_produit', 'titre', 'categorie'] },
        { model: Utilisateur, as: 'utilisateur', attributes: ['id_utilisateur', 'nom', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(mouvements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les mouvements d'un produit spécifique
exports.getMouvementsByProduit = async (req, res) => {
  try {
    const mouvements = await MouvementStock.findAll({
      where: { id_produit: req.params.id },
      include: [
        { model: Produit, as: 'produit', attributes: ['id_produit', 'titre', 'categorie'] },
        { model: Utilisateur, as: 'utilisateur', attributes: ['id_utilisateur', 'nom', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(mouvements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
