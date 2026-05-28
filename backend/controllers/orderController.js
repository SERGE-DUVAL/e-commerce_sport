const { Commande, LigneCommande, Produit, Utilisateur, Promotion, Caisse } = require('../models');
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
    let caisse = null;
    if (id_caisse) {
      caisse = await Caisse.findByPk(id_caisse);
    } else {
      caisse = await Caisse.findOne({
        where: { statut: 'ouverte' },
        order: [['createdAt', 'ASC']]
      });
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
      statut: 'Payée',
      id_caisse: caisse.id_caisse,
      montant_rembourse
    });

    // Déduire le stock
    for (const ligne of commande.LigneCommandes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      await produit.update({ stock: produit.stock - ligne.quantite });
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

    // En-tête
    doc.rect(0, 0, doc.page.width, 80).fill('#1a237e');
    doc.fillColor('white').fontSize(24).text('Sport-Equip', 30, 25, { align: 'left' });
    doc.fontSize(12).text('Ticket de Caisse', 30, 55, { align: 'left' });
    doc.fontSize(10).text(`N° ${commande.id_commande}`, 30, 70, { align: 'left' });
    doc.fontSize(10).text(new Date(commande.createdAt).toLocaleString('fr-FR'), 400, 70, { align: 'right' });

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
    doc.fontSize(14).text('Articles', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['Article', 'Qté', 'Prix unitaire', 'Total'];
    const columnWidths = [180, 60, 100, 100];
    const rowHeight = 25;
    const startX = 30;

    // En-tête tableau
    doc.fontSize(9).fillColor('#1a237e');
    tableHeaders.forEach((header, i) => {
      doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
        width: columnWidths[i],
        align: 'left'
      });
    });

    // Ligne de séparation
    doc.moveTo(startX, tableTop + 12)
       .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 12)
       .stroke();

    // Données articles
    doc.fillColor('black');
    commande.LigneCommandes.forEach((ligne, index) => {
      const y = tableTop + 20 + (index * rowHeight);

      // Nouvelle page si nécessaire
      if (y > doc.page.height - 50) {
        doc.addPage();
        doc.fillColor('#1a237e');
        tableHeaders.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 30, {
            width: columnWidths[i],
            align: 'left'
          });
        });
        doc.moveTo(startX, 42)
           .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), 42)
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
