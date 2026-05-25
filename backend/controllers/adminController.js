const { Utilisateur, Commande, LigneCommande, Produit, Promotion } = require('../models');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalRevenus = await Commande.sum('total_xaf', {
      where: { statut: 'Payée' }
    }) || 0;

    const totalCommandes = await Commande.count({
      where: { statut: 'Payée' }
    });

    const totalClients = await Utilisateur.count({
      where: { role: 'client' }
    });

    const produitsEnStock = await Produit.sum('stock') || 0;

    const produitsVendus = await LigneCommande.sum('quantite') || 0;

    // Évolution des ventes par jour (30 derniers jours)
    const ventesParJour = await Commande.findAll({
      where: {
        statut: 'Payée',
        createdAt: {
          [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('total_xaf')), 'total']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    res.json({
      totalRevenus,
      totalCommandes,
      totalClients,
      produitsEnStock,
      produitsVendus,
      ventesParJour
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Utilisateur.findAll({
      where: { role: 'client' },
      attributes: { exclude: ['mot_de_passe'] },
      include: [{
        model: Commande,
        order: [['createdAt', 'DESC']],
        limit: 1
      }]
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      include: [
        { model: Utilisateur, attributes: ['nom', 'email'] },
        { model: LigneCommande, include: [Produit] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByPk(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    await commande.update({ statut });
    res.json({ message: 'Statut mis à jour', commande });
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
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
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
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }
    await promotion.destroy();
    res.json({ message: 'Promotion supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { statut: 'Payée' },
      include: [
        { model: Utilisateur, attributes: ['nom', 'email'] },
        { model: LigneCommande, include: [Produit] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const doc = new PDFDocument();
    const filename = 'rapport_ventes.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    doc.fontSize(20).text('Rapport des Ventes - Sport-Equip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
    doc.moveDown();

    let total = 0;
    commandes.forEach((commande, index) => {
      doc.fontSize(14).text(`Commande #${commande.id_commande}`);
      doc.fontSize(10).text(`Client: ${commande.Utilisateur.nom}`);
      doc.text(`Date: ${commande.createdAt.toLocaleDateString('fr-FR')}`);
      doc.text(`Total: ${commande.total_xaf.toLocaleString()} FCFA`);
      doc.text(`Statut: ${commande.statut}`);
      doc.moveDown();
      total += commande.total_xaf;
    });

    doc.fontSize(14).text(`Total des revenus: ${total.toLocaleString()} FCFA`, { align: 'right' });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      where: { statut: 'Payée' },
      include: [
        { model: Utilisateur, attributes: ['nom', 'email'] },
        { model: LigneCommande, include: [Produit] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const data = commandes.map(c => ({
      id_commande: c.id_commande,
      client: c.Utilisateur.nom,
      email: c.Utilisateur.email,
      date: c.createdAt.toLocaleDateString('fr-FR'),
      total_xaf: c.total_xaf,
      moyen_paiement: c.moyen_paiement,
      statut: c.statut,
      articles: c.LigneCommandes.map(l => `${l.Produit.titre} (x${l.quantite})`).join(', ')
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
