const { DemandeRemboursement, Commande, Utilisateur, Avoir } = require('../models');

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

    // Récupérer les commandes avec le statut "Remboursement demandé" qui n'ont pas de demande dans DemandeRemboursement
    const commandesRemboursement = await Commande.findAll({
      where: { statut: 'Remboursement demandé' },
      include: [
        { model: Utilisateur, as: 'Utilisateur', attributes: ['nom', 'email'] }
      ]
    });

    // Filtrer les commandes qui n'ont pas déjà une demande
    const commandeIds = demandes.map(d => d.id_commande);
    const commandesSansDemande = commandesRemboursement.filter(c => !commandeIds.includes(c.id_commande));

    // Créer des demandes virtuelles pour ces commandes
    const demandesVirtuelles = commandesSansDemande.map(c => ({
      id_demande: `CMD-${c.id_commande}`,
      id_commande: c.id_commande,
      id_utilisateur: c.id_utilisateur,
      type_demande: 'remboursement',
      raison: c.raison_remboursement || 'Demande de remboursement',
      description: c.raison_remboursement || 'Demande de remboursement',
      statut: 'en_attente',
      date_demande: c.updatedAt,
      commande: c,
      utilisateur: c.Utilisateur,
      isLegacy: true
    }));

    // Combiner les demandes existantes et les demandes virtuelles
    const toutesDemandes = [...demandes, ...demandesVirtuelles].sort((a, b) => {
      const dateA = a.date_demande || a.updatedAt;
      const dateB = b.date_demande || b.updatedAt;
      return new Date(dateB) - new Date(dateA);
    });

    res.json(toutesDemandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Approuver une demande (admin)
exports.approveDemande = async (req, res) => {
  try {
    const { montant_rembourse, notes_admin } = req.body;
    const id = req.params.id;

    // Vérifier si c'est une demande virtuelle (CMD-X)
    if (id.startsWith('CMD-')) {
      const commandeId = parseInt(id.replace('CMD-', ''));
      const commande = await Commande.findByPk(commandeId, {
        include: [{ model: Utilisateur, as: 'Utilisateur' }]
      });

      if (!commande) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Créer une vraie demande de remboursement
      const demande = await DemandeRemboursement.create({
        id_commande: commande.id_commande,
        id_utilisateur: commande.id_utilisateur,
        type_demande: 'remboursement',
        raison: commande.raison_remboursement || 'Demande de remboursement',
        description: commande.raison_remboursement || 'Demande de remboursement',
        statut: 'approuve',
        montant_rembourse,
        notes_admin,
        date_demande: commande.updatedAt,
        date_traitement: new Date()
      });

      // Mettre à jour le statut de la commande
      await commande.update({ statut: 'Remboursé' });

      res.json(demande);
    } else {
      // Demande normale existante dans la base de données
      const demande = await DemandeRemboursement.findByPk(id);

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

      // Mettre à jour le statut de la commande associée
      const commande = await Commande.findByPk(demande.id_commande);
      if (commande) {
        await commande.update({ statut: 'Remboursé' });
      }

      // Si le type de demande est "avoir", créer un avoir automatiquement
      if (demande.type_demande === 'avoir' && montant_rembourse) {
        try {
          const numeroAvoir = `AVR-${Date.now()}-${demande.id_commande}`;
          await Avoir.create({
            numero_avoir: numeroAvoir,
            montant: montant_rembourse,
            motif: `Remboursement de la commande #${demande.id_commande} - ${demande.raison}`,
            id_utilisateur: demande.id_utilisateur,
            id_commande: demande.id_commande,
            statut: 'en attente',
            notes: notes_admin || ''
          });
        } catch (avoirError) {
          console.error('Erreur lors de la création de l\'avoir:', avoirError);
          // Continuer même si la création de l'avoir échoue
        }
      }

      res.json(demande);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Refuser une demande (admin)
exports.rejectDemande = async (req, res) => {
  try {
    const { notes_admin } = req.body;
    const id = req.params.id;

    // Vérifier si c'est une demande virtuelle (CMD-X)
    if (id.startsWith('CMD-')) {
      const commandeId = parseInt(id.replace('CMD-', ''));
      const commande = await Commande.findByPk(commandeId);

      if (!commande) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Créer une vraie demande de remboursement refusée
      const demande = await DemandeRemboursement.create({
        id_commande: commande.id_commande,
        id_utilisateur: commande.id_utilisateur,
        type_demande: 'remboursement',
        raison: commande.raison_remboursement || 'Demande de remboursement',
        description: commande.raison_remboursement || 'Demande de remboursement',
        statut: 'refuse',
        notes_admin,
        date_demande: commande.updatedAt,
        date_traitement: new Date()
      });

      // Mettre à jour le statut de la commande
      await commande.update({ statut: 'Livrée' });

      res.json(demande);
    } else {
      // Demande normale existante dans la base de données
      const demande = await DemandeRemboursement.findByPk(id);

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

      // Mettre à jour le statut de la commande associée
      const commande = await Commande.findByPk(demande.id_commande);
      if (commande) {
        await commande.update({ statut: 'Livrée' });
      }

      res.json(demande);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Marquer une demande comme traitée (admin)
exports.markAsTraitee = async (req, res) => {
  try {
    const id = req.params.id;

    // Vérifier si c'est une demande virtuelle (CMD-X)
    if (id.startsWith('CMD-')) {
      const commandeId = parseInt(id.replace('CMD-', ''));
      const demande = await DemandeRemboursement.findOne({
        where: { id_commande: commandeId }
      });

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
    } else {
      // Demande normale existante dans la base de données
      const demande = await DemandeRemboursement.findByPk(id);

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
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
