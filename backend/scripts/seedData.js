const { Avis, Inventaire, LigneInventaire, Fournisseur, Avoir, ZoneStockage, Caisse, Produit, Commande } = require('../models');

async function seedData() {
  try {
    console.log('Début de l\'ajout des données test...');

    // Ajouter des fournisseurs
    const fournisseurs = await Fournisseur.bulkCreate([
      { nom: 'Nike Cameroon', contact: 'Jean Dupont', email: 'jean@nike.cm', telephone: '237699123456', ville: 'Douala', adresse: 'Boulevard de la Liberté', actif: true },
      { nom: 'Adidas Central Africa', contact: 'Marie Kouame', email: 'marie@adidas.cm', telephone: '237699234567', ville: 'Yaoundé', adresse: 'Avenue Charles de Gaulle', actif: true },
      { nom: 'Puma Sports', contact: 'Paul Nkodo', email: 'paul@puma.cm', telephone: '237699345678', ville: 'Douala', adresse: 'Rue de l\'Indépendance', actif: true },
      { nom: 'Under Armour', contact: 'Sophie Mba', email: 'sophie@underarmour.cm', telephone: '237699456789', ville: 'Yaoundé', adresse: 'Boulevard du 20 Mai', actif: true },
      { nom: 'Reebok Cameroon', contact: 'Antoine Mbarga', email: 'antoine@reebok.cm', telephone: '237699567890', ville: 'Douala', adresse: 'Rue Joffre', actif: true }
    ]);
    console.log(`${fournisseurs.length} fournisseurs ajoutés`);

    // Ajouter des zones de stockage
    const zones = await ZoneStockage.bulkCreate([
      { nom: 'Surface de vente principale', type_zone: 'surface de vente', description: 'Zone principale de vente au public', capacite: 500, actif: true },
      { nom: 'Mezzanine', type_zone: 'mezzanine', description: 'Zone de stockage intermédiaire', capacite: 300, actif: true },
      { nom: 'Entrepôt principal', type_zone: 'entrepôt', description: 'Zone de stockage principal', capacite: 1000, actif: true },
      { nom: 'Zone réception', type_zone: 'entrepôt', description: 'Zone de réception des livraisons', capacite: 200, actif: true },
      { nom: 'Zone expédition', type_zone: 'entrepôt', description: 'Zone de préparation des commandes', capacite: 150, actif: true }
    ]);
    console.log(`${zones.length} zones ajoutées`);

    // Ajouter des caisses
    const caisses = await Caisse.bulkCreate([
      { nom: 'Caisse 1 - Entrée', solde_initial: 500000, solde_actuel: 500000, statut: 'ouverte', responsable_actuel: 'Alice Martin', date_ouverture: new Date() },
      { nom: 'Caisse 2 - Sortie', solde_initial: 500000, solde_actuel: 500000, statut: 'ouverte', responsable_actuel: 'Bob Dupont', date_ouverture: new Date() },
      { nom: 'Caisse 3 - Réserve', solde_initial: 300000, solde_actuel: 300000, statut: 'ouverte', responsable_actuel: 'Charles Mbarga', date_ouverture: new Date() }
    ]);
    console.log(`${caisses.length} caisses ajoutées`);

    // Ajouter des inventaires
    const inventaires = await Inventaire.bulkCreate([
      { type_inventaire: 'général', zone: 'surface de vente', date_debut: new Date('2024-01-15'), statut: 'terminé', total_theorique: 450, total_physique: 448, ecart: 2, taux_correspondance: 99.56 },
      { type_inventaire: 'partiel', zone: 'mezzanine', date_debut: new Date('2024-03-20'), statut: 'terminé', total_theorique: 280, total_physique: 280, ecart: 0, taux_correspondance: 100 },
      { type_inventaire: 'général', zone: 'entrepôt', date_debut: new Date('2024-06-10'), statut: 'en cours', total_theorique: 950, total_physique: 0, ecart: 0, taux_correspondance: 0 }
    ]);
    console.log(`${inventaires.length} inventaires ajoutés`);

    // Ajouter des lignes d'inventaire
    const produits = await Produit.findAll({ limit: 10 });
    const lignesInventaire = [];
    inventaires.forEach((inventaire, index) => {
      produits.forEach((produit, pIndex) => {
        lignesInventaire.push({
          id_inventaire: inventaire.id_inventaire,
          id_produit: produit.id_produit,
          quantite_theorique: produit.stock,
          quantite_physique: index === 2 ? 0 : produit.stock,
          ecart: index === 2 ? produit.stock : 0
        });
      });
    });
    await LigneInventaire.bulkCreate(lignesInventaire);
    console.log(`${lignesInventaire.length} lignes d'inventaire ajoutées`);

    // Ajouter des avoirs
    const commandes = await Commande.findAll({ limit: 5 });
    const avoirs = await Avoir.bulkCreate([
      { numero_avoir: 'AVR-2024-001', montant: 25000, id_commande: commandes[0]?.id_commande || null, date_emission: new Date('2024-01-20'), statut: 'utilisé', motif: 'Produit défectueux' },
      { numero_avoir: 'AVR-2024-002', montant: 15000, id_commande: commandes[1]?.id_commande || null, date_emission: new Date('2024-02-15'), statut: 'en attente', motif: 'Erreur de taille' },
      { numero_avoir: 'AVR-2024-003', montant: 35000, id_commande: commandes[2]?.id_commande || null, date_emission: new Date('2024-03-10'), statut: 'en attente', motif: 'Couleur différente' },
      { numero_avoir: 'AVR-2024-004', montant: 20000, id_commande: commandes[3]?.id_commande || null, date_emission: new Date('2024-04-05'), statut: 'expiré', motif: 'Client satisfait' },
      { numero_avoir: 'AVR-2024-005', montant: 40000, id_commande: commandes[4]?.id_commande || null, date_emission: new Date('2024-05-01'), statut: 'en attente', motif: 'Retour produit' }
    ]);
    console.log(`${avoirs.length} avoirs ajoutés`);

    // Ajouter des avis
    const avis = await Avis.bulkCreate([
      { id_produit: produits[0]?.id_produit || 1, id_utilisateur: 2, note: 5, commentaire: 'Excellent produit, très confortable et de bonne qualité.', date_avis: new Date('2024-01-25') },
      { id_produit: produits[1]?.id_produit || 2, id_utilisateur: 3, note: 4, commentaire: 'Bon rapport qualité-prix, livraison rapide.', date_avis: new Date('2024-02-10') },
      { id_produit: produits[2]?.id_produit || 3, id_utilisateur: 2, note: 5, commentaire: 'Je recommande vivement ce produit, parfait pour le sport.', date_avis: new Date('2024-03-05') },
      { id_produit: produits[3]?.id_produit || 4, id_utilisateur: 4, note: 3, commentaire: 'Produit correct mais taille un peu petite.', date_avis: new Date('2024-03-20') },
      { id_produit: produits[4]?.id_produit || 5, id_utilisateur: 3, note: 4, commentaire: 'Très bon design, matériel résistant.', date_avis: new Date('2024-04-15') },
      { id_produit: produits[5]?.id_produit || 6, id_utilisateur: 5, note: 5, commentaire: 'Superbe qualité, je suis très satisfait.', date_avis: new Date('2024-05-01') },
      { id_produit: produits[6]?.id_produit || 7, id_utilisateur: 2, note: 4, commentaire: 'Bon produit, correspond à mes attentes.', date_avis: new Date('2024-05-10') },
      { id_produit: produits[7]?.id_produit || 8, id_utilisateur: 4, note: 5, commentaire: 'Exceptionnel, je le recommande à tous.', date_avis: new Date('2024-05-15') },
      { id_produit: produits[8]?.id_produit || 9, id_utilisateur: 3, note: 3, commentaire: 'Correct mais pourrait être mieux.', date_avis: new Date('2024-05-20') },
      { id_produit: produits[9]?.id_produit || 10, id_utilisateur: 5, note: 4, commentaire: 'Très bon achat, je suis content.', date_avis: new Date('2024-05-25') }
    ]);
    console.log(`${avis.length} avis ajoutés`);

    console.log('Données test ajoutées avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'ajout des données test:', error);
    process.exit(1);
  }
}

seedData();
