const Utilisateur = require('./Utilisateur');
const Produit = require('./Produit');
const Commande = require('./Commande');
const LigneCommande = require('./LigneCommande');
const Avis = require('./Avis');
const Promotion = require('./Promotion');
const MouvementStock = require('./MouvementStock');
const Livreur = require('./Livreur');
const AffectationLivraison = require('./AffectationLivraison');
const DemandeRemboursement = require('./DemandeRemboursement');
const CodeBarre = require('./CodeBarre');
const Inventaire = require('./Inventaire');
const LigneInventaire = require('./LigneInventaire');
const Fournisseur = require('./Fournisseur');
const Avoir = require('./Avoir');
const ZoneStockage = require('./ZoneStockage');
const Caisse = require('./Caisse');

// Définir l'association entre Avis et Commande après le chargement de tous les modèles
// pour éviter la dépendance circulaire
Avis.belongsTo(Commande, { foreignKey: 'id_commande', as: 'Commande' });
Commande.hasMany(Avis, { foreignKey: 'id_commande', as: 'Avis' });

module.exports = {
  Utilisateur,
  Produit,
  Commande,
  LigneCommande,
  Avis,
  Promotion,
  MouvementStock,
  Livreur,
  AffectationLivraison,
  DemandeRemboursement,
  CodeBarre,
  Inventaire,
  LigneInventaire,
  Fournisseur,
  Avoir,
  ZoneStockage,
  Caisse
};
