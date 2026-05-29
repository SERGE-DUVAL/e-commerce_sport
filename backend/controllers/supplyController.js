const { Produit, Fournisseur, DemandeLivraison } = require('../models');

// Créer une demande de livraison
exports.createDemandeLivraison = async (req, res) => {
  try {
    const { id_produit, id_fournisseur, quantite_demandee, date_livraison_souhaitee, notes } = req.body;

    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const fournisseur = await Fournisseur.findByPk(id_fournisseur);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    // Générer un numéro de demande unique
    const numero_demande = `DL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const demande = await DemandeLivraison.create({
      numero_demande,
      id_produit,
      id_fournisseur,
      quantite_demandee,
      date_livraison_souhaitee,
      notes,
      statut: 'en attente'
    });

    res.status(201).json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les demandes de livraison
exports.getAllDemandesLivraison = async (req, res) => {
  try {
    const demandes = await DemandeLivraison.findAll({
      include: [
        { model: Produit, as: 'produit' },
        { model: Fournisseur, as: 'fournisseur' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les produits en rupture de stock
exports.getProduitsEnRupture = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      where: {
        stock: {
          [require('sequelize').Op.lt]: 5
        }
      }
    });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'une demande de livraison
exports.updateDemandeLivraison = async (req, res) => {
  try {
    const { statut, quantite_recue, notes_reception, ecarts } = req.body;
    const demande = await DemandeLivraison.findByPk(req.params.id);

    if (!demande) {
      return res.status(404).json({ message: 'Demande de livraison non trouvée' });
    }

    // Vérifier les quantités si la demande est livrée
    if (statut === 'livrée' && quantite_recue) {
      if (quantite_recue !== demande.quantite_demandee) {
        // Enregistrer l'écart si fourni
        const ecart = quantite_recue - demande.quantite_demandee;
        if (ecarts) {
          await DemandeLivraison.update(
            { ecarts: JSON.stringify([...JSON.parse(demande.ecarts || '[]'), ...ecarts]) },
            { where: { id_demande: demande.id_demande } }
          );
        }
        return res.status(400).json({ 
          message: `Erreur: Quantité reçue (${quantite_recue}) différente de la quantité demandée (${demande.quantite_demandee})`,
          quantite_demandee: demande.quantite_demandee,
          quantite_recue,
          ecart,
          avertissement: true
        });
      }
    }

    const updateData = { statut };
    if (quantite_recue) updateData.quantite_recue = quantite_recue;
    if (notes_reception) updateData.notes_reception = notes_reception;
    if (statut === 'livrée') updateData.date_livraison_reelle = new Date();
    if (ecarts) updateData.ecarts = JSON.stringify(ecarts);

    await demande.update(updateData);

    // Si la demande est livrée, mettre à jour le stock du produit
    if (statut === 'livrée' && quantite_recue) {
      const produit = await Produit.findByPk(demande.id_produit);
      if (produit) {
        await produit.update({ stock: produit.stock + quantite_recue });
      }
    }

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une demande de livraison
exports.deleteDemandeLivraison = async (req, res) => {
  try {
    const demande = await DemandeLivraison.findByPk(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande de livraison non trouvée' });
    }

    await demande.destroy();
    res.json({ message: 'Demande de livraison supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
