const { Commande, LigneCommande, Produit, Utilisateur, Promotion, Caisse, DemandeRemboursement, MouvementStock } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

exports.createOrder = async (req, res) => {
  try {
    const { articles, adresse_livraison, moyen_paiement, points_utilises, code_promo } = req.body;
    
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id_utilisateur);
    
    // Vérifier les points disponibles
    if (points_utilises > utilisateur.points_fidelite) {
      return res.status(400).json({ message: 'Points insuffisants' });
    }

    // Calculer le total
    let total = 0;
    let remise = 0;

    if (code_promo && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Seul un administrateur peut appliquer une promotion' });
    }

    // Vérifier et appliquer le code promo
    if (code_promo) {
      const promotion = await Promotion.findOne({
        where: {
          code: code_promo.toUpperCase(),
          est_active: true,
          date_expiration: { [Op.gt]: new Date() }
        }
      });

      if (promotion) {
        remise = promotion.pourcentage_remise;
      }
    }

    // Vérifier le stock pour chaque article
    for (const article of articles) {
      const produit = await Produit.findByPk(article.id_produit);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${article.id_produit} non trouvé` });
      }
      if (produit.stock < article.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.titre}` });
      }
      total += produit.prix_xaf * article.quantite;
    }

    // Appliquer la réduction promo
    if (remise > 0) {
      total = total * (1 - remise / 100);
    }

    // Calculer les frais de livraison
    const frais_livraison = total >= 45000 ? 0 : 3000;

    // Déduire les points (10 points = 1 FCFA)
    const reduction_points = points_utilises / 10;
    total -= reduction_points;

    // Créer la commande
    const commande = await Commande.create({
      id_utilisateur: req.utilisateur.id_utilisateur,
      total_xaf: Math.round(total),
      moyen_paiement,
      frais_livraison,
      points_utilises,
      remise_appliquee: remise,
      adresse_livraison,
      statut: 'En attente'
    });

    // Créer les lignes de commande
    for (const article of articles) {
      const produit = await Produit.findByPk(article.id_produit);
      await LigneCommande.create({
        id_commande: commande.id_commande,
        id_produit: article.id_produit,
        quantite: article.quantite,
        prix_unitaire_achat: produit.prix_xaf,
        taille_selectionnee: article.taille,
        couleur_selectionnee: article.couleur
      });
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      commande
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { id_utilisateur: req.utilisateur.id_utilisateur },
      include: [{
        model: LigneCommande,
        as: 'LigneCommandes',
        include: [{
          model: Produit,
          as: 'Produit'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [{
        model: LigneCommande,
        include: [Produit]
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { id_commande, id_caisse, montant_donne } = req.body;
    const commande = await Commande.findByPk(id_commande, {
      include: [{
        model: LigneCommande,
        as: 'LigneCommandes'
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérification finale du stock (Edge Case)
    for (const ligne of commande.LigneCommandes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      if (produit.stock < ligne.quantite) {
        await commande.update({ statut: 'Annulée' });
        return res.status(400).json({
          message: `Rupture de stock pour ${produit.titre}. Commande annulée.`
        });
      }
    }

    // Sélectionner une caisse ouverte automatiquement si non spécifiée
    // Choisir la caisse avec le plus petit solde parmi les caisses ouvertes
    let caisse = null;
    if (id_caisse) {
      caisse = await Caisse.findByPk(id_caisse);
    } else {
      const caissesOuvertes = await Caisse.findAll({
        where: { statut: 'ouverte' }
      });
      
      if (caissesOuvertes.length > 0) {
        // Trier par solde actuel croissant et prendre la première
        caisse = caissesOuvertes.sort((a, b) => a.solde_actuel - b.solde_actuel)[0];
      }
    }

    if (!caisse) {
      return res.status(400).json({ message: 'Aucune caisse ouverte disponible' });
    }

    // Gérer le remboursement si le client donne trop
    let montant_rembourse = 0;
    if (montant_donne && montant_donne > commande.total_xaf) {
      montant_rembourse = montant_donne - commande.total_xaf;
    }

    // Mettre à jour le solde de la caisse
    const montant_ajoute = commande.total_xaf - montant_rembourse;
    await caisse.update({
      solde_actuel: caisse.solde_actuel + montant_ajoute,
      responsable_actuel: req.utilisateur.nom
    });

    // Simulation du paiement via API Switch
    // Dans un environnement réel, ici on enverrait une requête à l'API Switch
    // Pour le développement, on simule un succès

    // Mettre à jour le statut et lier à la caisse
    await commande.update({ 
      statut: 'En livraison',
      id_caisse: caisse.id_caisse,
      montant_rembourse
    });

    // Déduire le stock et enregistrer les mouvements
    for (const ligne of commande.LigneCommandes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      const stock_avant = produit.stock;
      const stock_apres = stock_avant - ligne.quantite;
      
      await produit.update({ stock: stock_apres });
      
      // Enregistrer le mouvement de stock
      await MouvementStock.create({
        id_produit: produit.id_produit,
        id_utilisateur: commande.id_utilisateur,
        type_mouvement: 'sortie',
        quantite: ligne.quantite,
        stock_avant,
        stock_apres,
        motif: `Vente - Commande #${commande.id_commande}`
      });
    }

    // Calculer et créditer les points de fidélité
    // Règle: 100 FCFA = 1 point
    // Exception: La partie payée avec les points ne génère pas de nouveaux points
    const montant_eligible_points = commande.total_xaf;
    const points_gagnes = Math.floor(montant_eligible_points / 100);

    if (points_gagnes > 0) {
      const utilisateur = await Utilisateur.findByPk(commande.id_utilisateur);
      await utilisateur.update({
        points_fidelite: utilisateur.points_fidelite + points_gagnes - commande.points_utilises
      });
    } else if (commande.points_utilises > 0) {
      const utilisateur = await Utilisateur.findByPk(commande.id_utilisateur);
      await utilisateur.update({
        points_fidelite: utilisateur.points_fidelite - commande.points_utilises
      });
    }

    const response = {
      message: 'Paiement validé avec succès',
      commande,
      points_gagnes,
      caisse: caisse.nom,
      montant_rembourse
    };

    // Signaler à l'admin (notification)
    if (montant_rembourse > 0) {
      response.alerte = `Remboursement de ${montant_rembourse} FCFA effectué pour la commande #${commande.id_commande}`;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Générer un ticket de caisse en PDF
exports.generateCashReceipt = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
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
        },
        {
          model: Caisse,
          as: 'caisse'
        }
      ]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = `ticket_caisse_${commande.id_commande}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // En-tête avec logo
    doc.rect(0, 0, doc.page.width, 100).fill('#1a237e');
    
    // Logo Sport-Equip (cercle avec SE)
    doc.circle(50, 50, 30).fill('#ffffff');
    doc.fillColor('#1a237e').fontSize(18).font('Helvetica-Bold').text('SE', 38, 42);
    
    doc.fillColor('white').fontSize(28).font('Helvetica-Bold').text('Sport-Equip', 100, 35, { align: 'left' });
    doc.fontSize(12).text('Équipements Sportifs Professionnels', 100, 60, { align: 'left' });
    doc.fontSize(10).text('Ticket de Caisse', 100, 75, { align: 'left' });
    doc.fontSize(10).text(`N° ${commande.id_commande}`, 400, 40, { align: 'right' });
    doc.fontSize(10).text(new Date(commande.createdAt).toLocaleString('fr-FR'), 400, 55, { align: 'right' });
    doc.fontSize(10).text(`Statut: ${commande.statut}`, 400, 70, { align: 'right' });

    // Informations caisse
    doc.fillColor('black');
    doc.moveDown(3);
    doc.fontSize(14).text('Informations Caisse', { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Caisse: ${commande.caisse?.nom || 'N/A'}`);
    doc.text(`Responsable: ${commande.caisse?.responsable_actuel || 'N/A'}`);
    doc.text(`Moyen paiement: ${commande.moyen_paiement}`);

    // Informations client
    doc.moveDown(2);
    doc.fontSize(14).text('Informations Client', { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Nom: ${commande.Utilisateur?.nom || 'N/A'}`);
    doc.text(`Email: ${commande.Utilisateur?.email || 'N/A'}`);

    // Détails articles
    doc.moveDown(2);
    doc.fontSize(14).text('Articles Commandés', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['Article', 'Qté', 'Prix unitaire', 'Total'];
    const columnWidths = [200, 60, 100, 100];
    const rowHeight = 30;
    const startX = 30;

    // En-tête tableau avec fond
    doc.rect(startX, tableTop, columnWidths.reduce((a, b) => a + b, 0), 20).fill('#e8eaf6');
    doc.fontSize(10).fillColor('#1a237e').font('Helvetica-Bold');
    tableHeaders.forEach((header, i) => {
      doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, tableTop + 5, {
        width: columnWidths[i] - 10,
        align: 'left'
      });
    });

    // Ligne de séparation
    doc.moveTo(startX, tableTop + 20)
       .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 20)
       .stroke();

    // Données articles
    doc.fillColor('black').font('Helvetica');
    commande.LigneCommandes.forEach((ligne, index) => {
      const y = tableTop + 25 + (index * rowHeight);

      // Nouvelle page si nécessaire
      if (y > doc.page.height - 80) {
        doc.addPage();
        const newTableTop = 30;
        doc.rect(startX, newTableTop, columnWidths.reduce((a, b) => a + b, 0), 20).fill('#e8eaf6');
        doc.fillColor('#1a237e').font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, newTableTop + 5, {
            width: columnWidths[i] - 10,
            align: 'left'
          });
        });
        doc.moveTo(startX, newTableTop + 20)
           .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), newTableTop + 20)
           .stroke();
        doc.fillColor('black').font('Helvetica');
      }

      // Bordure autour de chaque ligne
      const currentY = y;
      doc.rect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight).stroke();

      const rowData = [
        ligne.Produit?.titre || 'Produit supprimé',
        ligne.quantite,
        `${ligne.prix_unitaire_achat.toLocaleString('fr-FR')} FCFA`,
        `${(ligne.quantite * ligne.prix_unitaire_achat).toLocaleString('fr-FR')} FCFA`
      ];

      rowData.forEach((data, i) => {
        doc.text(data, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, currentY + 8, {
          width: columnWidths[i] - 10,
          align: 'left'
        });
      });
    });

    // Totaux
    doc.moveDown(2);
    doc.fontSize(12).fillColor('black');
    doc.text(`Sous-total: ${commande.total_xaf.toLocaleString('fr-FR')} FCFA`, startX, doc.y);
    doc.text(`Frais livraison: ${commande.frais_livraison.toLocaleString('fr-FR')} FCFA`, startX, doc.y + 15);
    doc.text(`Remise: -${commande.remise_appliquee.toLocaleString('fr-FR')} FCFA`, startX, doc.y + 30);
    doc.fontSize(14).fillColor('#1a237e').font('Helvetica-Bold');
    const total = commande.total_xaf + commande.frais_livraison - commande.remise_appliquee;
    doc.text(`TOTAL: ${total.toLocaleString('fr-FR')} FCFA`, startX, doc.y + 50);

    // Remboursement
    if (commande.montant_rembourse > 0) {
      doc.moveDown(2);
      doc.fontSize(12).fillColor('#d32f2f');
      doc.text(`Remboursement: ${commande.montant_rembourse.toLocaleString('fr-FR')} FCFA`, startX, doc.y);
    }

    // Points
    doc.moveDown(2);
    doc.fontSize(10).fillColor('black');
    doc.text(`Points utilisés: ${commande.points_utilises}`, startX, doc.y);
    const points_gagnes = Math.floor(commande.total_xaf / 100);
    doc.text(`Points gagnés: ${points_gagnes}`, startX, doc.y + 15);

    // Signature
    doc.moveDown(3);
    doc.fontSize(11).text('Signature:', startX, doc.y);
    doc.moveTo(startX, doc.y + 20).lineTo(startX + 100, doc.y + 20).stroke();
    doc.fontSize(9).text('Date:', startX + 150, doc.y);
    doc.moveTo(startX + 150, doc.y + 20).lineTo(startX + 250, doc.y + 20).stroke();

    // Pied de page
    doc.fontSize(9).fillColor('gray');
    doc.text('Sport-Equip - Équipements Sportifs Professionnels', 30, doc.page.height - 30, {
      align: 'center'
    });
    doc.text('Merci de votre confiance !', 30, doc.page.height - 20, {
      align: 'center'
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [{
        model: LigneCommande,
        as: 'LigneCommandes'
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (commande.statut !== 'Payée' && commande.statut !== 'En livraison') {
      return res.status(400).json({ message: 'Seules les commandes payées ou en livraison peuvent être annulées' });
    }

    await commande.update({ statut: 'Annulée' });

    // Remettre le stock et enregistrer les mouvements
    if (commande.LigneCommandes) {
      for (const ligne of commande.LigneCommandes) {
        const produit = await Produit.findByPk(ligne.id_produit);
        if (produit) {
          const stock_avant = produit.stock;
          const stock_apres = stock_avant + ligne.quantite;
          
          await produit.update({ stock: stock_apres });
          
          // Enregistrer le mouvement de stock
          await MouvementStock.create({
            id_produit: produit.id_produit,
            id_utilisateur: commande.id_utilisateur,
            type_mouvement: 'entree',
            quantite: ligne.quantite,
            stock_avant,
            stock_apres,
            motif: `Annulation - Commande #${commande.id_commande}`
          });
        }
      }
    }

    res.json({ message: 'Commande annulée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Demander un remboursement
exports.requestRefund = async (req, res) => {
  try {
    const { reason, type_demande, description } = req.body;
    const commande = await Commande.findByPk(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (commande.statut !== 'Livrée') {
      return res.status(400).json({ message: 'Seules les commandes livrées peuvent faire l\'objet d\'un remboursement' });
    }

    // Vérifier qu'il n'y a pas déjà une demande pour cette commande
    const demandeExistante = await DemandeRemboursement.findOne({
      where: { id_commande: commande.id_commande }
    });

    if (demandeExistante) {
      return res.status(400).json({ message: 'Une demande de remboursement existe déjà pour cette commande' });
    }

    // Créer une demande de remboursement
    const demande = await DemandeRemboursement.create({
      id_commande: commande.id_commande,
      id_utilisateur: commande.id_utilisateur,
      type_demande: type_demande || 'avoir',
      raison: reason,
      description: description || reason,
      statut: 'en_attente',
      date_demande: new Date()
    });

    // Mettre à jour le statut de la commande
    await commande.update({ 
      statut: 'Remboursement demandé'
    });

    res.json({ message: 'Demande de remboursement envoyée avec succès', demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Confirmer la réception
exports.confirmReception = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (commande.statut !== 'En livraison' && commande.statut !== 'Payée') {
      return res.status(400).json({ message: 'Seules les commandes en livraison ou payées peuvent être confirmées' });
    }

    await commande.update({ statut: 'Livrée' });

    // Mettre à jour le statut de l'affectation de livraison
    const { AffectationLivraison } = require('../models');
    const affectation = await AffectationLivraison.findOne({
      where: { id_commande: commande.id_commande }
    });
    if (affectation) {
      await affectation.update({ statut: 'effectué' });
    }

    res.json({ message: 'Réception confirmée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
