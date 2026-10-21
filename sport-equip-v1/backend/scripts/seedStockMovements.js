const { MouvementStock, Produit, Utilisateur } = require('../models');

async function seedStockMovements() {
  try {
    console.log('Début de l\'ajout des mouvements de stock test...');

    const produits = await Produit.findAll({ limit: 10 });
    const utilisateurs = await Utilisateur.findAll({ limit: 5 });

    const mouvements = [];
    const types = ['entree', 'sortie', 'ajustement'];
    const motifs = ['Réception fournisseur', 'Vente client', 'Inventaire', 'Perte', 'Réapprovisionnement'];

    for (let i = 0; i < 50; i++) {
      const produit = produits[Math.floor(Math.random() * produits.length)];
      const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const motif = motifs[Math.floor(Math.random() * motifs.length)];
      
      const stock_avant = produit.stock;
      let quantite = Math.floor(Math.random() * 10) + 1;
      let stock_apres = stock_avant;

      if (type === 'entree') {
        stock_apres = stock_avant + quantite;
      } else if (type === 'sortie') {
        quantite = Math.min(quantite, stock_avant);
        stock_apres = stock_avant - quantite;
      } else if (type === 'ajustement') {
        stock_apres = Math.floor(Math.random() * 20) + 5;
        quantite = stock_apres - stock_avant;
      }

      mouvements.push({
        id_produit: produit.id_produit,
        id_utilisateur: utilisateur.id_utilisateur,
        type_mouvement: type,
        quantite: quantite,
        stock_avant: stock_avant,
        stock_apres: stock_apres,
        motif: motif,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Date aléatoire dans les 30 derniers jours
      });
    }

    await MouvementStock.bulkCreate(mouvements);
    console.log(`${mouvements.length} mouvements de stock ajoutés`);

    console.log('Mouvements de stock test ajoutés avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'ajout des mouvements de stock test:', error);
    process.exit(1);
  }
}

seedStockMovements();
