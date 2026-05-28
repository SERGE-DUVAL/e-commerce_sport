const { Avis, Commande, LigneCommande, Utilisateur } = require('../models');

exports.createReview = async (req, res) => {
  try {
    const { id_produit, note, commentaire, type_avis, id_commande } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    if (type_avis === 'produit') {
      // Vérifier que l'utilisateur a acheté ce produit et que la commande est livrée
      const commandeLivre = await Commande.findOne({
        where: {
          id_utilisateur,
          statut: 'Livrée'
        },
        include: [{
          model: LigneCommande,
          as: 'LigneCommandes',
          where: { id_produit }
        }]
      });

      if (!commandeLivre) {
        return res.status(403).json({ 
          message: 'Vous devez avoir acheté ce produit et reçu votre commande pour laisser un avis' 
        });
      }

      // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
      const existingReview = await Avis.findOne({
        where: { id_produit, id_utilisateur, type_avis: 'produit' }
      });

      if (existingReview) {
        return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit' });
      }

      const avis = await Avis.create({
        id_produit,
        id_utilisateur,
        note,
        commentaire,
        type_avis: 'produit'
      });

      res.status(201).json({ message: 'Avis créé avec succès', avis });
    } else if (type_avis === 'livraison') {
      // Vérifier que l'utilisateur a une commande livrée
      const commandeLivre = await Commande.findOne({
        where: {
          id_commande: id_commande,
          id_utilisateur,
          statut: 'Livrée'
        }
      });

      if (!commandeLivre) {
        return res.status(403).json({ 
          message: 'Vous devez avoir reçu votre commande pour laisser un avis sur la livraison' 
        });
      }

      // Vérifier si l'utilisateur a déjà laissé un avis sur cette livraison
      const existingReview = await Avis.findOne({
        where: { id_commande, id_utilisateur, type_avis: 'livraison' }
      });

      if (existingReview) {
        return res.status(400).json({ message: 'Vous avez déjà laissé un avis sur cette livraison' });
      }

      const avis = await Avis.create({
        id_utilisateur,
        note,
        commentaire,
        type_avis: 'livraison',
        id_commande
      });

      res.status(201).json({ message: 'Avis créé avec succès', avis });
    } else {
      return res.status(400).json({ message: 'Type d\'avis invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const avis = await Avis.findAll({
      where: { id_produit: req.params.id, type_avis: 'produit' },
      include: [{
        model: Utilisateur,
        attributes: ['nom']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getDeliveryReviews = async (req, res) => {
  try {
    const avis = await Avis.findAll({
      where: { type_avis: 'livraison' },
      include: [
        {
          model: Utilisateur,
          attributes: ['nom', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: false
    });

    res.json(avis);
  } catch (error) {
    console.error('Erreur getDeliveryReviews:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
