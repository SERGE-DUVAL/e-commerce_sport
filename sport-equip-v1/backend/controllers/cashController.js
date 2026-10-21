const Caisse = require('../models/Caisse');
const Utilisateur = require('../models/Utilisateur');

// Créer une caisse
exports.createCaisse = async (req, res) => {
  try {
    const { nom, solde_initial, id_responsable } = req.body;

    const caisse = await Caisse.create({
      nom,
      solde_initial,
      solde_actuel: solde_initial,
      date_ouverture: new Date(),
      statut: 'ouverte',
      id_responsable
    });

    res.status(201).json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les caisses
exports.getAllCaisses = async (req, res) => {
  try {
    const caisses = await Caisse.findAll({
      include: [{ model: Utilisateur, as: 'responsable' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(caisses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une caisse par ID
exports.getCaisseById = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id, {
      include: [{ model: Utilisateur, as: 'responsable' }]
    });
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une caisse
exports.updateCaisse = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    await caisse.update(req.body);
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fermer une caisse
exports.closeCaisse = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    await caisse.update({
      statut: 'fermée',
      date_fermeture: new Date()
    });
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ouvrir une caisse
exports.openCaisse = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }

    if (caisse.statut === 'ouverte') {
      return res.status(400).json({ message: 'Cette caisse est déjà ouverte' });
    }

    await caisse.update({
      statut: 'ouverte',
      date_ouverture: new Date()
    });
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le solde d'une caisse
exports.updateSolde = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    const { montant } = req.body;
    await caisse.update({
      solde_actuel: caisse.solde_actuel + montant
    });
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une caisse
exports.deleteCaisse = async (req, res) => {
  try {
    const caisse = await Caisse.findByPk(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    await caisse.destroy();
    res.json({ message: 'Caisse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
