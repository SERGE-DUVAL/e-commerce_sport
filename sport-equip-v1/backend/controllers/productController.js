const { Produit, Avis, CodeBarre, ZoneStockage, Utilisateur } = require('../models');
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
        model: Utilisateur,
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

    // Générer automatiquement un code-barres EAN13 pour le produit
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += Math.floor(Math.random() * 10);
    }

    // Calculer le checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    const ean13 = code + checksum;

    // Créer le code-barres pour le produit
    await CodeBarre.create({
      id_produit: produit.id_produit,
      code_barre: ean13,
      type_code: 'EAN13'
    });

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

    // Vérifier si le produit a des commandes
    const { LigneCommande } = require('../models');
    const lignesCommandes = await LigneCommande.findAll({
      where: { id_produit: req.params.id }
    });

    if (lignesCommandes.length > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer ce produit car il est associé à des commandes' });
    }

    // Supprimer le code barre associé au produit
    await CodeBarre.destroy({ where: { id_produit: req.params.id } });

    await produit.destroy();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.assignProductToZone = async (req, res) => {
  try {
    const { id_produit, id_zone } = req.body;

    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const zone = await ZoneStockage.findByPk(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    // Vérifier si la zone est active
    if (!zone.actif) {
      return res.status(400).json({ message: 'La zone n\'est pas active' });
    }

    // Vérifier la capacité de la zone
    const currentProducts = await zone.getProduits();
    if (currentProducts.length >= zone.capacite) {
      return res.status(400).json({ 
        message: 'Zone pleine: Capacité maximale atteinte',
        capacite: zone.capacite,
        produits_actuels: currentProducts.length
      });
    }

    await produit.addZone(zone);

    res.status(201).json({ message: 'Produit assigné à la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductZones = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id, {
      include: [{
        model: ZoneStockage,
        as: 'zones'
      }]
    });

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(produit.zones);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Organiser les produits par catégorie dans une zone
exports.organizeProductsByCategory = async (req, res) => {
  try {
    const { id_zone, categorie } = req.body;

    const zone = await ZoneStockage.findByPk(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    // Récupérer les produits de la catégorie
    const produits = await Produit.findAll({
      where: { categorie }
    });

    // Assigner tous les produits de la catégorie à la zone
    for (const produit of produits) {
      await produit.addZone(zone);
    }

    res.json({ 
      message: `${produits.length} produits de la catégorie ${categorie} organisés dans la zone ${zone.nom}`,
      nombre_produits: produits.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.removeProductFromZone = async (req, res) => {
  try {
    const { id_produit, id_zone } = req.body;

    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const zone = await ZoneStockage.findByPk(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    await produit.removeZone(zone);

    res.json({ message: 'Produit retiré de la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
