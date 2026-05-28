const { Livreur, AffectationLivraison, Commande, Utilisateur, LigneCommande, Produit } = require('../models');
const PDFDocument = require('pdfkit');

// Créer un livreur
exports.createLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.create(req.body);
    res.status(201).json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les livreurs
exports.getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await Livreur.findAll();
    
    // Synchroniser le statut des livreurs en fonction de leurs affectations actuelles
    for (const livreur of livreurs) {
      const affectationsEnCours = await AffectationLivraison.findAll({
        where: { 
          id_livreur: livreur.id_livreur,
          statut: ['en attente', 'en livraison']
        }
      });
      
      // Si le livreur a des affectations en cours mais son statut est "disponible", le mettre à jour
      if (affectationsEnCours.length > 0 && livreur.statut === 'disponible') {
        await livreur.update({ statut: 'en livraison' });
      }
      
      // Si le livreur n'a pas d'affectations en cours mais son statut est "en livraison", le mettre à jour
      if (affectationsEnCours.length === 0 && livreur.statut === 'en livraison') {
        await livreur.update({ statut: 'disponible' });
      }
    }
    
    // Récupérer les livreurs mis à jour
    const livreursMajores = await Livreur.findAll();
    res.json(livreursMajores);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un livreur par ID
exports.getLivreurById = async (req, res) => {
  try {
    const livreur = await Livreur.findByPk(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un livreur
exports.updateLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByPk(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    await livreur.update(req.body);
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un livreur
exports.deleteLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByPk(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Vérifier si le livreur a des affectations en cours
    const affectationsEnCours = await AffectationLivraison.findAll({
      where: { id_livreur: req.params.id, statut: 'en livraison' }
    });

    if (affectationsEnCours.length > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer un livreur avec des livraisons en cours' });
    }

    await livreur.destroy();
    res.json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Affecter une commande à un livreur
exports.assignDelivery = async (req, res) => {
  try {
    const { id_commande, id_livreur, date_livraison_prevue } = req.body;

    // Vérifier que la commande existe
    const commande = await Commande.findByPk(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que le livreur existe et est disponible
    const livreur = await Livreur.findByPk(id_livreur);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    if (livreur.statut !== 'disponible') {
      return res.status(400).json({ message: 'Le livreur n\'est pas disponible' });
    }

    // Créer l'affectation
    const affectation = await AffectationLivraison.create({
      id_commande,
      id_livreur,
      date_livraison_prevue,
      statut: 'en attente'
    });

    // Mettre à jour le statut de la commande
    await commande.update({ statut: 'En livraison' });

    // Mettre à jour le statut du livreur
    await livreur.update({ statut: 'en livraison' });

    res.status(201).json(affectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour la position GPS d'un livreur
exports.updateLivreurLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const livreur = await Livreur.findByPk(req.params.id);

    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    await livreur.update({
      latitude,
      longitude,
      derniere_mise_a_jour_gps: new Date()
    });

    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Calculer la météo pour une position GPS
exports.getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude et longitude requises' });
    }

    // Simulation de météo basée sur la latitude
    const conditions = ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Orageux', 'Brumeux'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Simulation de température basée sur la latitude
    const baseTemp = 25 - Math.abs(parseFloat(latitude));
    const temperature = (baseTemp + Math.random() * 10 - 5).toFixed(1);

    res.json({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      temperature: parseFloat(temperature),
      conditions: randomCondition,
      humidite: Math.floor(Math.random() * 40 + 40),
      vent: Math.floor(Math.random() * 30 + 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Calculer la distance entre deux points GPS
exports.calculateDistance = async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({ message: 'Coordonnées requises' });
    }

    const R = 6371; // Rayon de la Terre en km
    const dLat = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const dLon = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(parseFloat(lat1) * Math.PI / 180) * Math.cos(parseFloat(lat2) * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    res.json({
      distance: distance.toFixed(2),
      unit: 'km'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les affectations de livraison
exports.getAffectations = async (req, res) => {
  try {
    const affectations = await AffectationLivraison.findAll({
      include: [
        { model: Commande, as: 'commande' },
        { model: Livreur, as: 'livreur' }
      ],
      order: [['date_affectation', 'DESC']]
    });
    res.json(affectations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'une affectation
exports.updateAffectationStatus = async (req, res) => {
  try {
    const { statut, notes } = req.body;
    const affectation = await AffectationLivraison.findByPk(req.params.id);

    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    const updateData = { statut };
    if (notes) updateData.notes = notes;

    if (statut === 'livrée') {
      updateData.date_livraison_reelle = new Date();
      // Mettre à jour le statut de la commande
      const commande = await Commande.findByPk(affectation.id_commande);
      if (commande) {
        await commande.update({ statut: 'Livrée' });
      }
      // Libérer le livreur
      const livreur = await Livreur.findByPk(affectation.id_livreur);
      if (livreur) {
        await livreur.update({ statut: 'disponible' });
      }
    }

    await affectation.update(updateData);
    res.json(affectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Générer un bordereau de livraison en PDF
exports.generateDeliveryNote = async (req, res) => {
  try {
    const affectation = await AffectationLivraison.findByPk(req.params.id, {
      include: [
        {
          model: Commande,
          as: 'commande',
          include: [
            {
              model: Utilisateur,
              as: 'Utilisateur'
            },
            {
              model: LigneCommande,
              as: 'LigneCommandes',
              include: [
                {
                  model: Produit,
                  as: 'Produit'
                }
              ]
            }
          ]
        },
        {
          model: Livreur,
          as: 'livreur'
        }
      ]
    });

    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `bordereau_livraison_${affectation.id_affectation}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // En-tête
    doc.rect(0, 0, doc.page.width, 100).fill('#1a237e');
    doc.fillColor('white').fontSize(28).text('Sport-Equip', 50, 35, { align: 'left' });
    doc.fontSize(14).text('Bordereau de Livraison', 50, 65, { align: 'left' });
    doc.fontSize(12).text(`N° ${affectation.id_affectation}`, 50, 85, { align: 'left' });

    // Informations client
    doc.fillColor('black');
    doc.moveDown(4);
    doc.fontSize(16).text('Informations Client', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Nom: ${affectation.commande.Utilisateur?.nom || 'N/A'}`);
    doc.text(`Email: ${affectation.commande.Utilisateur?.email || 'N/A'}`);
    doc.text(`Adresse: ${affectation.commande.adresse_livraison || 'N/A'}`);

    // Informations commande
    doc.moveDown(2);
    doc.fontSize(16).text('Informations Commande', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Commande N°: ${affectation.commande.id_commande}`);
    doc.text(`Date commande: ${new Date(affectation.commande.createdAt).toLocaleDateString('fr-FR')}`);
    doc.text(`Total: ${affectation.commande.total_xaf.toLocaleString('fr-FR')} FCFA`);
    doc.text(`Moyen paiement: ${affectation.commande.moyen_paiement}`);

    // Informations livreur
    doc.moveDown(2);
    doc.fontSize(16).text('Informations Livreur', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Nom: ${affectation.livreur?.nom} ${affectation.livreur?.prenom}`);
    doc.text(`Téléphone: ${affectation.livreur?.telephone}`);
    doc.text(`Véhicule: ${affectation.livreur?.vehicule}`);
    doc.text(`Plaque: ${affectation.livreur?.plaque_immatriculation}`);

    // Détails articles
    doc.moveDown(2);
    doc.fontSize(16).text('Articles à livrer', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['Article', 'Quantité', 'Prix unitaire', 'Total'];
    const columnWidths = [200, 80, 100, 100];
    const rowHeight = 30;
    const startX = 50;

    // En-tête tableau
    doc.fontSize(10).fillColor('#1a237e');
    tableHeaders.forEach((header, i) => {
      doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
        width: columnWidths[i],
        align: 'left'
      });
    });

    // Ligne de séparation
    doc.moveTo(startX, tableTop + 15)
       .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15)
       .stroke();

    // Données articles
    doc.fillColor('black');
    affectation.commande.LigneCommandes.forEach((ligne, index) => {
      const y = tableTop + 25 + (index * rowHeight);

      // Nouvelle page si nécessaire
      if (y > doc.page.height - 50) {
        doc.addPage();
        doc.fillColor('#1a237e');
        tableHeaders.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 50, {
            width: columnWidths[i],
            align: 'left'
          });
        });
        doc.moveTo(startX, 65)
           .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), 65)
           .stroke();
        doc.fillColor('black');
      }

      const rowData = [
        ligne.Produit?.titre || 'Produit supprimé',
        ligne.quantite,
        `${ligne.prix_unitaire_achat} FCFA`,
        `${ligne.quantite * ligne.prix_unitaire_achat} FCFA`
      ];

      rowData.forEach((data, i) => {
        doc.text(data, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: columnWidths[i],
          align: 'left'
        });
      });
    });

    // Signature
    doc.moveDown(3);
    doc.fontSize(12).text('Signature livreur:', 50, doc.y);
    doc.moveTo(50, doc.y + 30).lineTo(200, doc.y + 30).stroke();
    doc.fontSize(10).text('Date et heure:', 250, doc.y);
    doc.moveTo(250, doc.y + 30).lineTo(400, doc.y + 30).stroke();

    // Pied de page
    doc.fontSize(10).fillColor('gray');
    doc.text('Sport-Equip - Équipements Sportifs Professionnels', 50, doc.page.height - 30, {
      align: 'center'
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
