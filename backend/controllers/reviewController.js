const { Avis, Commande, LigneCommande, Utilisateur } = require('../models');

exports.createReview = async (req, res) => {
  try {
    const { id_produit, note, commentaire } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    // Vérifier que l'utilisateur a acheté ce produit et que la commande est livrée
    const commandeLivre = await Commande.findOne({
      where: {
        id_utilisateur,
        statut: 'Livrée'
      },
      include: [{
        model: LigneCommande,
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
      where: { id_produit, id_utilisateur }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit' });
    }

    const avis = await Avis.create({
      id_produit,
      id_utilisateur,
      note,
      commentaire
    });

    res.status(201).json({ message: 'Avis créé avec succès', avis });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const avis = await Avis.findAll({
      where: { id_produit: req.params.id },
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
