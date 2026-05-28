const ZoneStockage = require('../models/ZoneStockage');
const Produit = require('../models/Produit');

// Créer une zone de stockage
exports.createZone = async (req, res) => {
  try {
    const zone = await ZoneStockage.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les zones de stockage
exports.getAllZones = async (req, res) => {
  try {
    const zones = await ZoneStockage.findAll({
      include: [{ model: Produit, as: 'produits' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une zone par ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = await ZoneStockage.findByPk(req.params.id, {
      include: [{ model: Produit, as: 'produits' }]
    });
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une zone
exports.updateZone = async (req, res) => {
  try {
    const zone = await ZoneStockage.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    await zone.update(req.body);
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Activer/Désactiver une zone
exports.toggleZone = async (req, res) => {
  try {
    const zone = await ZoneStockage.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    await zone.update({ actif: !zone.actif });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une zone
exports.deleteZone = async (req, res) => {
  try {
    const zone = await ZoneStockage.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    await zone.destroy();
    res.json({ message: 'Zone supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter un produit à une zone
exports.addProductToZone = async (req, res) => {
  try {
    const { id_zone } = req.params;
    const { id_produit } = req.body;

    const zone = await ZoneStockage.findByPk(id_zone);
    const produit = await Produit.findByPk(id_produit);

    if (!zone || !produit) {
      return res.status(404).json({ message: 'Zone ou produit non trouvé' });
    }

    await zone.addProduit(produit);
    res.json({ message: 'Produit ajouté à la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Retirer un produit d'une zone
exports.removeProductFromZone = async (req, res) => {
  try {
    const { id_zone } = req.params;
    const { id_produit } = req.body;

    const zone = await ZoneStockage.findByPk(id_zone);
    const produit = await Produit.findByPk(id_produit);

    if (!zone || !produit) {
      return res.status(404).json({ message: 'Zone ou produit non trouvé' });
    }

    await zone.removeProduit(produit);
    res.json({ message: 'Produit retiré de la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
