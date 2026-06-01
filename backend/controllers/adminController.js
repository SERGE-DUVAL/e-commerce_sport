const Database = require('better-sqlite3');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

exports.getDashboardStats = async (req, res) => {
  try {
    const totalRevenus = db.prepare(`
      SELECT SUM(total_xaf) as total FROM commandes WHERE statut = 'Payée'
    `).get()?.total || 0;

    const totalCommandes = db.prepare(`
      SELECT COUNT(*) as total FROM commandes WHERE statut = 'Payée'
    `).get()?.total || 0;

    const totalClients = db.prepare(`
      SELECT COUNT(*) as total FROM utilisateurs WHERE role = 'client'
    `).get()?.total || 0;

    const produitsEnStock = db.prepare(`
      SELECT SUM(stock) as total FROM produits
    `).get()?.total || 0;

    const produitsVendus = db.prepare(`
      SELECT SUM(quantite) as total FROM ligne_commandes
    `).get()?.total || 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const commandesPayeesRecentes = db.prepare(`
      SELECT total_xaf, created_at FROM commandes 
      WHERE statut = 'Payée' AND created_at >= ?
      ORDER BY created_at ASC
    `).all(thirtyDaysAgo);

    const ventesParJourMap = commandesPayeesRecentes.reduce((acc, commande) => {
      const date = commande.created_at.slice(0, 10);
      acc[date] = (acc[date] || 0) + Number(commande.total_xaf || 0);
      return acc;
    }, {});

    const ventesParJour = Object.entries(ventesParJourMap).map(([date, total]) => ({ date, total }));

    // Top 5 produits les plus vendus
    const allLignes = db.prepare(`
      SELECT lc.*, p.titre, p.categorie 
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
    `).all();

    const produitsMap = allLignes.reduce((acc, ligne) => {
      const id = ligne.id_produit;
      if (!acc[id]) {
        acc[id] = {
          id_produit: id,
          titre: ligne.titre || 'Produit supprimé',
          categorie: ligne.categorie || 'N/A',
          total_vendu: 0
        };
      }
      acc[id].total_vendu += Number(ligne.quantite || 0);
      return acc;
    }, {});

    const topProduits = Object.values(produitsMap)
      .sort((a, b) => b.total_vendu - a.total_vendu)
      .slice(0, 5);

    // Top 5 clients les plus fidèles
    const topClients = db.prepare(`
      SELECT id_utilisateur, nom, email, points_fidelite 
      FROM utilisateurs 
      WHERE role = 'client'
      ORDER BY points_fidelite DESC
      LIMIT 5
    `).all();

    res.json({
      totalRevenus,
      totalCommandes,
      totalClients,
      produitsEnStock,
      produitsVendus,
      ventesParJour,
      topProduits,
      topClients
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = db.prepare(`
      SELECT u.* FROM utilisateurs u
      WHERE u.role = 'client'
    `).all();

    // Remove password from response
    const clientsWithoutPassword = clients.map(c => {
      const { mot_de_passe, ...rest } = c;
      return rest;
    });

    res.json(clientsWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.params.id,
        role: 'client'
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    const commandesCount = await Commande.count({
      where: { id_utilisateur: client.id_utilisateur }
    });

    if (commandesCount > 0) {
      return res.status(400).json({
        message: 'Ce client possède des commandes. Suppression refusée pour conserver l’historique légal et commercial.'
      });
    }

    await client.destroy();
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const commandes = db.prepare(`
      SELECT c.* FROM commandes c
      ORDER BY c.created_at DESC
    `).all();

    // Get utilisateurs for each commande
    const utilisateurs = db.prepare('SELECT * FROM utilisateurs').all();
    const utilisateursMap = new Map(utilisateurs.map(u => [u.id_utilisateur, u]));

    // Get ligne_commandes for each commande
    const lignes = db.prepare(`
      SELECT lc.*, p.titre, p.categorie, p.prix_xaf
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
    `).all();

    const lignesMap = new Map();
    lignes.forEach(l => {
      if (!lignesMap.has(l.id_commande)) {
        lignesMap.set(l.id_commande, []);
      }
      lignesMap.get(l.id_commande).push(l);
    });

    // Format response
    const formattedCommandes = commandes.map(c => ({
      ...c,
      Utilisateur: utilisateursMap.get(c.id_utilisateur) || null,
      LigneCommandes: lignesMap.get(c.id_commande) || []
    }));

    res.json(formattedCommandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByPk(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvÃ©e' });
    }

    await commande.update({ statut });
    res.json({ message: 'Statut mis Ã  jour', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = db.prepare('SELECT * FROM promotions').all();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvÃ©e' });
    }
    await promotion.update(req.body);
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvÃ©e' });
    }
    await promotion.destroy();
    res.json({ message: 'Promotion supprimÃ©e' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const commandes = db.prepare(`
      SELECT c.*, u.nom as client_nom, u.email as client_email
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      WHERE c.statut IN ('Payée', 'Livrée')
      ORDER BY c.created_at DESC
    `).all();

    // Get ligne_commandes for each commande
    const lignes = db.prepare(`
      SELECT lc.*, p.titre as produit_titre
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
    `).all();

    const lignesMap = new Map();
    lignes.forEach(l => {
      if (!lignesMap.has(l.id_commande)) {
        lignesMap.set(l.id_commande, []);
      }
      lignesMap.get(l.id_commande).push(l);
    });

    // Add LigneCommandes to each commande
    commandes.forEach(c => {
      c.LigneCommandes = lignesMap.get(c.id_commande) || [];
    });

    const doc = new PDFDocument({ margin: 50 });
    const filename = 'rapport_ventes.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // En-tête professionnel
    doc.rect(0, 0, doc.page.width, 100).fill('#1a237e');
    doc.fillColor('white').fontSize(28).text('Sport-Equip', 50, 35, { align: 'left' });
    doc.fontSize(14).text('Rapport des Ventes', 50, 65, { align: 'left' });
    doc.fontSize(12).text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, 85, { align: 'left' });

    // Statistiques récapitulatives
    doc.fillColor('black');
    doc.moveDown(3);
    doc.fontSize(18).text('Résumé des ventes', { underline: true });
    doc.moveDown();

    const totalRevenus = commandes.reduce((sum, c) => sum + c.total_xaf, 0);
    const totalCommandes = commandes.length;
    const moyennePanier = totalCommandes > 0 ? Math.round(totalRevenus / totalCommandes) : 0;

    doc.fontSize(12);
    doc.text(`Nombre total de commandes: ${totalCommandes}`);
    doc.text(`Revenus totaux: ${totalRevenus.toLocaleString('fr-FR')} FCFA`);
    doc.text(`Panier moyen: ${moyennePanier.toLocaleString('fr-FR')} FCFA`);
    doc.moveDown(2);

    // Tableau des commandes
    doc.fontSize(16).text('Détail des commandes', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['N°', 'Client', 'Date', 'Total', 'Statut'];
    const columnWidths = [50, 200, 100, 120, 100];
    const rowHeight = 30;
    const startX = 50;

    // En-tête du tableau
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

    // Données du tableau
    doc.fillColor('black');
    commandes.forEach((commande, index) => {
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
        `#${commande.id_commande}`,
        commande.client_nom || 'Utilisateur supprimé',
        new Date(commande.created_at).toLocaleDateString('fr-FR'),
        `${commande.total_xaf.toLocaleString('fr-FR')} FCFA`,
        commande.statut
      ];

      rowData.forEach((data, i) => {
        doc.text(data, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: columnWidths[i],
          align: 'left'
        });
      });

      // Ligne de séparation entre les lignes
      doc.moveTo(startX, y + rowHeight - 5)
         .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight - 5)
         .stroke();
    });

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

exports.exportCSV = async (req, res) => {
  try {
    const commandes = db.prepare(`
      SELECT c.*, u.nom as client_nom, u.email as client_email
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      WHERE c.statut = 'Payée'
      ORDER BY c.created_at DESC
    `).all();

    // Get ligne_commandes for each commande
    const lignes = db.prepare(`
      SELECT lc.*, p.titre as produit_titre
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
    `).all();

    const lignesMap = new Map();
    lignes.forEach(l => {
      if (!lignesMap.has(l.id_commande)) {
        lignesMap.set(l.id_commande, []);
      }
      lignesMap.get(l.id_commande).push(l);
    });

    const data = commandes.map(c => ({
      id_commande: c.id_commande,
      client: c.client_nom || 'Utilisateur supprimé',
      email: c.client_email || 'N/A',
      date: new Date(c.created_at).toLocaleDateString('fr-FR'),
      total_xaf: c.total_xaf,
      moyen_paiement: c.moyen_paiement,
      statut: c.statut,
      articles: (lignesMap.get(c.id_commande) || []).map(l => `${l.produit_titre || 'Produit inconnu'} (x${l.quantite})`).join(', ')
    }));

    const fields = ['id_commande', 'client', 'email', 'date', 'total_xaf', 'moyen_paiement', 'statut', 'articles'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ventes.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

