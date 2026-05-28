const Fournisseur = require('../models/Fournisseur');

// Créer un fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les fournisseurs
exports.getAllFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(fournisseurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un fournisseur par ID
exports.getFournisseurById = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByPk(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    res.json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un fournisseur
exports.updateFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByPk(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    await fournisseur.update(req.body);
    res.json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Activer/Désactiver un fournisseur
exports.toggleFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByPk(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    await fournisseur.update({ actif: !fournisseur.actif });
    res.json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un fournisseur
exports.deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByPk(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    await fournisseur.destroy();
    res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
