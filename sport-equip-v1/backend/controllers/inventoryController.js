const Inventaire = require('../models/Inventaire');
const LigneInventaire = require('../models/LigneInventaire');
const Produit = require('../models/Produit');

// Créer un inventaire
exports.createInventaire = async (req, res) => {
  try {
    const { type_inventaire, zone, responsable, notes } = req.body;

    const inventaire = await Inventaire.create({
      type_inventaire,
      zone,
      date_debut: new Date(),
      statut: 'en cours',
      responsable,
      notes
    });

    // Si inventaire général, ajouter tous les produits automatiquement
    if (type_inventaire === 'général') {
      const produits = await Produit.findAll();
      for (const produit of produits) {
        await LigneInventaire.create({
          id_inventaire: inventaire.id_inventaire,
          id_produit: produit.id_produit,
          quantite_theorique: produit.stock,
          quantite_physique: 0,
          ecart: -produit.stock,
          methode_comptage: 'automatique',
          notes: 'À compter'
        });
      }
      await updateInventaireTotals(inventaire.id_inventaire);
    } 
    // Si inventaire partiel pour une zone, ajouter les produits de cette zone
    else if (type_inventaire === 'partiel' && zone) {
      const { ZoneStockage } = require('../models');
      const zoneStockage = await ZoneStockage.findOne({ where: { nom: zone } });
      if (zoneStockage) {
        const produits = await zoneStockage.getProduits();
        for (const produit of produits) {
          await LigneInventaire.create({
            id_inventaire: inventaire.id_inventaire,
            id_produit: produit.id_produit,
            quantite_theorique: produit.stock,
            quantite_physique: 0,
            ecart: -produit.stock,
            methode_comptage: 'automatique',
            notes: `Zone: ${zone}`
          });
        }
        await updateInventaireTotals(inventaire.id_inventaire);
      }
    }

    res.status(201).json(inventaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les inventaires
exports.getAllInventaires = async (req, res) => {
  try {
    const inventaires = await Inventaire.findAll({
      include: [
        { model: LigneInventaire, as: 'lignes', include: [{ model: Produit, as: 'produit' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(inventaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un inventaire par ID
exports.getInventaireById = async (req, res) => {
  try {
    const inventaire = await Inventaire.findByPk(req.params.id, {
      include: [
        { model: LigneInventaire, as: 'lignes', include: [{ model: Produit, as: 'produit' }] }
      ]
    });

    if (!inventaire) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    res.json(inventaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les lignes d'un inventaire
exports.getLignesByInventaire = async (req, res) => {
  try {
    const lignes = await LigneInventaire.findAll({
      where: { id_inventaire: req.params.id },
      include: [{ model: Produit, as: 'produit' }]
    });

    res.json(lignes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter une ligne à un inventaire
exports.addLigneInventaire = async (req, res) => {
  try {
    const { id_inventaire } = req.params;
    const { id_produit, quantite_theorique, quantite_physique, methode_comptage, notes } = req.body;

    const ecart = quantite_physique - quantite_theorique;

    const ligne = await LigneInventaire.create({
      id_inventaire,
      id_produit,
      quantite_theorique,
      quantite_physique,
      ecart,
      methode_comptage,
      notes
    });

    // Mettre à jour les totaux de l'inventaire
    await updateInventaireTotals(id_inventaire);

    res.status(201).json(ligne);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une ligne d'inventaire
exports.updateLigneInventaire = async (req, res) => {
  try {
    const ligne = await LigneInventaire.findByPk(req.params.id);

    if (!ligne) {
      return res.status(404).json({ message: 'Ligne d\'inventaire non trouvée' });
    }

    const ecart = req.body.quantite_physique - req.body.quantite_theorique;

    await ligne.update({
      ...req.body,
      ecart
    });

    // Mettre à jour les totaux de l'inventaire
    await updateInventaireTotals(ligne.id_inventaire);

    res.json(ligne);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Terminer un inventaire
exports.finishInventaire = async (req, res) => {
  try {
    const inventaire = await Inventaire.findByPk(req.params.id);

    if (!inventaire) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    await inventaire.update({
      date_fin: new Date(),
      statut: 'terminé'
    });

    res.json(inventaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Valider un inventaire
exports.validateInventaire = async (req, res) => {
  try {
    const inventaire = await Inventaire.findByPk(req.params.id);

    if (!inventaire) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    // Vérifier le taux de correspondance
    if (inventaire.taux_correspondance < 95) {
      return res.status(400).json({ 
        message: 'Attention: Le taux de correspondance est inférieur à 95%. Veuillez vérifier les écarts avant de valider.',
        taux_correspondance: inventaire.taux_correspondance,
        avertissement: true
      });
    }

    await inventaire.update({
      statut: 'validé'
    });

    res.json(inventaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un inventaire
exports.deleteInventaire = async (req, res) => {
  try {
    const inventaire = await Inventaire.findByPk(req.params.id);

    if (!inventaire) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    await inventaire.destroy();
    res.json({ message: 'Inventaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction helper pour mettre à jour les totaux de l'inventaire
async function updateInventaireTotals(id_inventaire) {
  const lignes = await LigneInventaire.findAll({ where: { id_inventaire } });

  const total_theorique = lignes.reduce((sum, l) => sum + l.quantite_theorique, 0);
  const total_physique = lignes.reduce((sum, l) => sum + l.quantite_physique, 0);
  const ecart = total_physique - total_theorique;

  const taux_correspondance = total_theorique > 0 
    ? ((total_theorique - Math.abs(ecart)) / total_theorique) * 100 
    : 0;

  await Inventaire.update(
    { total_theorique, total_physique, ecart, taux_correspondance },
    { where: { id_inventaire } }
  );
}
