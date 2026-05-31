const Database = require('better-sqlite3');
const path = require('path');
const PDFDocument = require('pdfkit');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

exports.createOrder = async (req, res) => {
  try {
    const { articles, adresse_livraison, moyen_paiement, points_utilises, code_promo } = req.body;
    
    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(req.utilisateur.id_utilisateur);
    
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
      const promotion = db.prepare(`
        SELECT * FROM promotions 
        WHERE code = ? AND est_active = 1 AND date_expiration > datetime('now')
      `).get(code_promo.toUpperCase());

      if (promotion) {
        remise = promotion.pourcentage_remise;
      }
    }

    // Vérifier le stock pour chaque article
    for (const article of articles) {
      const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(article.id_produit);
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
    const result = db.prepare(`
      INSERT INTO commandes (id_utilisateur, total_xaf, moyen_paiement, frais_livraison, points_utilises, remise_appliquee, adresse_livraison, statut, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'En attente', datetime('now'), datetime('now'))
    `).run(req.utilisateur.id_utilisateur, Math.round(total), moyen_paiement, frais_livraison, points_utilises, remise, adresse_livraison);

    const commande = db.prepare('SELECT * FROM commandes WHERE id_commande = ?').get(result.lastInsertRowid);

    // Créer les lignes de commande
    for (const article of articles) {
      const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(article.id_produit);
      db.prepare(`
        INSERT INTO ligne_commandes (id_commande, id_produit, quantite, prix_unitaire_achat, taille_selectionnee, couleur_selectionnee, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(commande.id_commande, article.id_produit, article.quantite, produit.prix_xaf, article.taille, article.couleur);
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      commande
    });
  } catch (error) {
    console.error('Erreur createOrder:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const commandes = db.prepare(`
      SELECT c.* FROM commandes c
      WHERE c.id_utilisateur = ?
      ORDER BY c.created_at DESC
    `).all(req.utilisateur.id_utilisateur);

    // Récupérer les lignes de commande pour chaque commande
    for (const commande of commandes) {
      const lignes = db.prepare(`
        SELECT lc.*, p.titre, p.prix_xaf, p.image_url
        FROM ligne_commandes lc
        LEFT JOIN produits p ON lc.id_produit = p.id_produit
        WHERE lc.id_commande = ?
      `).all(commande.id_commande);
      commande.LigneCommandes = lignes.map(ligne => ({
        ...ligne,
        Produit: {
          titre: ligne.titre,
          prix_xaf: ligne.prix_xaf,
          image_url: ligne.image_url
        }
      }));
    }

    res.json(commandes);
  } catch (error) {
    console.error('Erreur getUserOrders:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const commande = db.prepare('SELECT * FROM commandes WHERE id_commande = ?').get(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const lignes = db.prepare(`
      SELECT lc.*, p.titre, p.prix_xaf, p.image_url
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
      WHERE lc.id_commande = ?
    `).all(commande.id_commande);

    commande.LigneCommandes = lignes.map(ligne => ({
      ...ligne,
      Produit: {
        titre: ligne.titre,
        prix_xaf: ligne.prix_xaf,
        image_url: ligne.image_url
      }
    }));

    res.json(commande);
  } catch (error) {
    console.error('Erreur getOrderById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { id_commande, id_caisse, montant_donne } = req.body;
    const commande = db.prepare('SELECT * FROM commandes WHERE id_commande = ?').get(id_commande);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const lignes = db.prepare('SELECT * FROM ligne_commandes WHERE id_commande = ?').all(id_commande);

    // Vérification finale du stock (Edge Case)
    for (const ligne of lignes) {
      const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(ligne.id_produit);
      if (produit.stock < ligne.quantite) {
        db.prepare('UPDATE commandes SET statut = ? WHERE id_commande = ?').run('Annulée', id_commande);
        return res.status(400).json({
          message: `Rupture de stock pour ${produit.titre}. Commande annulée.`
        });
      }
    }

    // Sélectionner une caisse ouverte automatiquement si non spécifiée
    let caisse = null;
    if (id_caisse) {
      caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(id_caisse);
    } else {
      caisse = db.prepare('SELECT * FROM caisses WHERE statut = ? ORDER BY created_at ASC LIMIT 1').get('ouverte');
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
    db.prepare('UPDATE caisses SET solde_actuel = solde_actuel + ?, responsable_actuel = ? WHERE id_caisse = ?')
      .run(montant_ajoute, req.utilisateur.nom, caisse.id_caisse);

    // Simulation du paiement via API Switch
    // Dans un environnement réel, ici on enverrait une requête à l'API Switch
    // Pour le développement, on simule un succès

    // Mettre à jour le statut et lier à la caisse
    db.prepare('UPDATE commandes SET statut = ?, id_caisse = ?, montant_rembourse = ? WHERE id_commande = ?')
      .run('Payée', caisse.id_caisse, montant_rembourse, id_commande);

    // Déduire le stock
    for (const ligne of lignes) {
      const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(ligne.id_produit);
      db.prepare('UPDATE produits SET stock = stock - ? WHERE id_produit = ?')
        .run(ligne.quantite, ligne.id_produit);
    }

    // Calculer et créditer les points de fidélité
    // Règle: 100 FCFA = 1 point
    // Exception: La partie payée avec les points ne génère pas de nouveaux points
    const montant_eligible_points = commande.total_xaf;
    const points_gagnes = Math.floor(montant_eligible_points / 100);

    if (points_gagnes > 0) {
      db.prepare('UPDATE utilisateurs SET points_fidelite = points_fidelite + ? - ? WHERE id_utilisateur = ?')
        .run(points_gagnes, commande.points_utilises, commande.id_utilisateur);
    } else if (commande.points_utilises > 0) {
      db.prepare('UPDATE utilisateurs SET points_fidelite = points_fidelite - ? WHERE id_utilisateur = ?')
        .run(commande.points_utilises, commande.id_utilisateur);
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
    console.error('Erreur processPayment:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Générer un ticket de caisse en PDF
exports.generateCashReceipt = async (req, res) => {
  try {
    const commande = db.prepare('SELECT * FROM commandes WHERE id_commande = ?').get(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Récupérer l'utilisateur
    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(commande.id_utilisateur);
    
    // Récupérer les lignes de commande avec produits
    const lignes = db.prepare(`
      SELECT lc.*, p.titre, p.prix_xaf
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
      WHERE lc.id_commande = ?
    `).all(commande.id_commande);

    // Récupérer la caisse
    const caisse = commande.id_caisse ? db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(commande.id_caisse) : null;

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
    doc.fontSize(10).text(new Date(commande.created_at).toLocaleString('fr-FR'), 400, 70, { align: 'right' });

    // Informations caisse
    doc.fillColor('black');
    doc.moveDown(3);
    doc.fontSize(14).text('Informations Caisse', { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Caisse: ${caisse?.nom || 'N/A'}`);
    doc.text(`Responsable: ${caisse?.responsable_actuel || 'N/A'}`);
    doc.text(`Moyen paiement: ${commande.moyen_paiement}`);

    // Informations client
    doc.moveDown(2);
    doc.fontSize(14).text('Informations Client', { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Nom: ${utilisateur?.nom || 'N/A'}`);
    doc.text(`Email: ${utilisateur?.email || 'N/A'}`);

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
    lignes.forEach((ligne, index) => {
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
        ligne.titre || 'Produit supprimé',
        ligne.quantite,
        `${ligne.prix_xaf} FCFA`,
        `${ligne.quantite * ligne.prix_xaf} FCFA`
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
    console.error('Erreur generateCashReceipt:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
