const Avoir = require('../models/Avoir');
const Commande = require('../models/Commande');
const Utilisateur = require('../models/Utilisateur');

// Créer un avoir
exports.createAvoir = async (req, res) => {
  try {
    const { id_commande, id_utilisateur, montant, motif, date_expiration, notes } = req.body;

    // Générer un numéro d'avoir unique
    const numero_avoir = `AVR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const avoir = await Avoir.create({
      numero_avoir,
      id_commande,
      id_utilisateur,
      montant,
      motif,
      date_expiration,
      notes
    });

    res.status(201).json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les avoirs
exports.getAllAvoirs = async (req, res) => {
  try {
    const avoirs = await Avoir.findAll({
      include: [
        { model: Commande, as: 'commande' },
        { model: Utilisateur, as: 'utilisateur' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(avoirs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un avoir par ID
exports.getAvoirById = async (req, res) => {
  try {
    const avoir = await Avoir.findByPk(req.params.id, {
      include: [
        { model: Commande, as: 'commande' },
        { model: Utilisateur, as: 'utilisateur' }
      ]
    });
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }
    res.json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un avoir
exports.updateAvoir = async (req, res) => {
  try {
    const { id } = req.params;
    const { montant, motif, date_expiration, notes, statut } = req.body;

    const avoir = await Avoir.findByPk(id);
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }

    await avoir.update({
      montant: montant || avoir.montant,
      motif: motif || avoir.motif,
      date_expiration: date_expiration || avoir.date_expiration,
      notes: notes || avoir.notes,
      statut: statut || avoir.statut
    });

    res.json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Utiliser un avoir
exports.useAvoir = async (req, res) => {
  try {
    const avoir = await Avoir.findByPk(req.params.id);
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }

    if (avoir.statut !== 'en attente') {
      return res.status(400).json({ message: 'Cet avoir a déjà été utilisé ou est expiré' });
    }

    // Vérifier si l'avoir est expiré
    if (avoir.date_expiration && new Date(avoir.date_expiration) < new Date()) {
      await avoir.update({ statut: 'expiré' });
      return res.status(400).json({ message: 'Cet avoir est expiré' });
    }

    await avoir.update({ statut: 'utilisé' });
    res.json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Annuler un avoir
exports.cancelAvoir = async (req, res) => {
  try {
    const avoir = await Avoir.findByPk(req.params.id);
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }

    await avoir.update({ statut: 'annulé' });
    res.json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un avoir
exports.deleteAvoir = async (req, res) => {
  try {
    const avoir = await Avoir.findByPk(req.params.id);
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }
    await avoir.destroy();
    res.json({ message: 'Avoir supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
