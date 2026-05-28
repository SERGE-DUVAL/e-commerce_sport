const { DemandeRemboursement, Commande, Utilisateur } = require('../models');

// Créer une demande de remboursement/échange
exports.createDemande = async (req, res) => {
  try {
    const { id_commande, type_demande, raison, description } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    // Vérifier que la commande existe et appartient à l'utilisateur
    const commande = await Commande.findOne({
      where: { id_commande, id_utilisateur }
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que la commande est livrée
    if (commande.statut !== 'Livrée') {
      return res.status(400).json({ message: 'La commande doit être livrée pour faire une demande' });
    }

    // Vérifier que la commande a été livrée il y a moins de 3 jours
    const dateLivraison = new Date(commande.updatedAt);
    const aujourdHui = new Date();
    const differenceJours = Math.floor((aujourdHui - dateLivraison) / (1000 * 60 * 60 * 24));

    if (differenceJours > 3) {
      return res.status(400).json({ message: 'Le délai de 3 jours pour faire une demande est dépassé' });
    }

    // Vérifier qu'il n'y a pas déjà une demande pour cette commande
    const demandeExistante = await DemandeRemboursement.findOne({
      where: { id_commande }
    });

    if (demandeExistante) {
      return res.status(400).json({ message: 'Une demande existe déjà pour cette commande' });
    }

    const demande = await DemandeRemboursement.create({
      id_commande,
      id_utilisateur,
      type_demande,
      raison,
      description
    });

    res.status(201).json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les demandes de l'utilisateur connecté
exports.getUserDemandes = async (req, res) => {
  try {
    const id_utilisateur = req.utilisateur.id_utilisateur;
    const demandes = await DemandeRemboursement.findAll({
      where: { id_utilisateur },
      include: [
        { model: Commande, as: 'commande' }
      ],
      order: [['date_demande', 'DESC']]
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les demandes (admin)
exports.getAllDemandes = async (req, res) => {
  try {
    const demandes = await DemandeRemboursement.findAll({
      include: [
        { model: Commande, as: 'commande' },
        { model: Utilisateur, as: 'utilisateur', attributes: ['nom', 'email'] }
      ],
      order: [['date_demande', 'DESC']]
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Approuver une demande (admin)
exports.approveDemande = async (req, res) => {
  try {
    const { montant_rembourse, notes_admin } = req.body;
    const demande = await DemandeRemboursement.findByPk(req.params.id);

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Cette demande a déjà été traitée' });
    }

    await demande.update({
      statut: 'approuve',
      montant_rembourse,
      notes_admin,
      date_traitement: new Date()
    });

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Refuser une demande (admin)
exports.rejectDemande = async (req, res) => {
  try {
    const { notes_admin } = req.body;
    const demande = await DemandeRemboursement.findByPk(req.params.id);

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Cette demande a déjà été traitée' });
    }

    await demande.update({
      statut: 'refuse',
      notes_admin,
      date_traitement: new Date()
    });

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Marquer une demande comme traitée (admin)
exports.markAsTraitee = async (req, res) => {
  try {
    const demande = await DemandeRemboursement.findByPk(req.params.id);

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.statut !== 'approuve') {
      return res.status(400).json({ message: 'Seules les demandes approuvées peuvent être marquées comme traitées' });
    }

    await demande.update({
      statut: 'traite',
      date_traitement: new Date()
    });

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
