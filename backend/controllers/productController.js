const { Produit, Avis } = require('../models');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    const { categorie, recherche, prix_min, prix_max } = req.query;

    const where = {};

    if (categorie) {
      where.categorie = categorie;
    }

    if (recherche) {
      where[Op.or] = [
        { titre: { [Op.like]: `%${recherche}%` } },
        { description: { [Op.like]: `%${recherche}%` } }
      ];
    }

    if (prix_min || prix_max) {
      where.prix_xaf = {};
      if (prix_min) where.prix_xaf[Op.gte] = prix_min;
      if (prix_max) where.prix_xaf[Op.lte] = prix_max;
    }

    const produits = await Produit.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Récupérer les avis du produit
    const avis = await Avis.findAll({
      where: { id_produit: req.params.id },
      include: [{
        model: require('../models').Utilisateur,
        attributes: ['nom']
      }]
    });

    // Calculer la moyenne des notes
    const moyenneNote = avis.length > 0 
      ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length 
      : 0;

    res.json({
      ...produit.toJSON(),
      avis,
      moyenneNote: parseFloat(moyenneNote.toFixed(1)),
      nombreAvis: avis.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const produit = await Produit.create(req.body);
    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await produit.update(req.body);
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await produit.destroy();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
