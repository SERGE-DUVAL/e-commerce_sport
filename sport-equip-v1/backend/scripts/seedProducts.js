const { Produit } = require('../models');
const sequelize = require('../config/database');

const products = [
  // Football
  { titre: 'Maillot PSG Domicile 2024', categorie: 'Football', prix_xaf: 45000, stock: 15, description: 'Maillot officiel PSG domicile 2024-2025', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Bleu/Rouge'] }) },
  { titre: 'Crampons Mercurial Vapor', categorie: 'Football', prix_xaf: 85000, stock: 10, description: 'Crampons de haute performance pour terrains fermes', variantes: JSON.stringify({ tailles: ['40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc'] }) },
  { titre: 'Ballon UEFA Champions League', categorie: 'Football', prix_xaf: 25000, stock: 25, description: 'Ballon officiel UEFA Champions League', variantes: JSON.stringify({ tailles: ['5'], couleurs: ['Blanc/Noir'] }) },
  { titre: 'Gants de gardien Nike', categorie: 'Football', prix_xaf: 18000, stock: 20, description: 'Gants professionnels pour gardiens', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Vert'] }) },
  { titre: 'Short de football Adidas', categorie: 'Football', prix_xaf: 12000, stock: 30, description: 'Short technique pour football', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Noir', 'Blanc', 'Rouge'] }) },
  
  // Running
  { titre: 'Chaussures Running Ultraboost', categorie: 'Running', prix_xaf: 75000, stock: 12, description: 'Chaussures de running avec amorti boost', variantes: JSON.stringify({ tailles: ['40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc'] }) },
  { titre: 'Montre GPS Running', categorie: 'Running', prix_xaf: 95000, stock: 8, description: 'Montre GPS avec suivi cardio', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir'] }) },
  { titre: 'T-shirt technique respirant', categorie: 'Running', prix_xaf: 15000, stock: 35, description: 'T-shirt technique pour course à pied', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Bleu', 'Rouge', 'Vert'] }) },
  { titre: 'Legging de running', categorie: 'Running', prix_xaf: 22000, stock: 20, description: 'Legging compressif pour running', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Gris'] }) },
  { titre: 'Sac à dos running', categorie: 'Running', prix_xaf: 18000, stock: 15, description: 'Sac à dos léger pour running', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Bleu'] }) },
  
  // Fitness
  { titre: 'Haltères réglables 20kg', categorie: 'Fitness', prix_xaf: 45000, stock: 10, description: 'Set d\'haltères réglables jusqu\'à 20kg', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir'] }) },
  { titre: 'Tapis de yoga premium', categorie: 'Fitness', prix_xaf: 25000, stock: 25, description: 'Tapis de yoga antidérapant épais', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Bleu', 'Rose', 'Vert'] }) },
  { titre: 'Élastiques de résistance', categorie: 'Fitness', prix_xaf: 8000, stock: 40, description: 'Set d\'élastiques de résistance', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Multicolore'] }) },
  { titre: 'Kettlebell 16kg', categorie: 'Fitness', prix_xaf: 35000, stock: 15, description: 'Kettleball en fonte 16kg', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir'] }) },
  { titre: 'Banc de fitness réglable', categorie: 'Fitness', prix_xaf: 85000, stock: 5, description: 'Banc de fitness inclinable', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir'] }) },
  
  // Tennis
  { titre: 'Raquette Wilson Pro', categorie: 'Tennis', prix_xaf: 120000, stock: 8, description: 'Raquette professionnelle Wilson', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Rouge/Noir'] }) },
  { titre: 'Balles de tennis (x3)', categorie: 'Tennis', prix_xaf: 5000, stock: 50, description: 'Pack de 3 balles de tennis', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Jaune'] }) },
  { titre: 'Sac de tennis Wilson', categorie: 'Tennis', prix_xaf: 35000, stock: 12, description: 'Sac de tennis avec 6 compartiments', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Rouge'] }) },
  { titre: 'Chaussures Tennis Court', categorie: 'Tennis', prix_xaf: 65000, stock: 15, description: 'Chaussures pour terrains durs', variantes: JSON.stringify({ tailles: ['40', '41', '42', '43', '44'], couleurs: ['Blanc', 'Noir'] }) },
  { titre: 'Manchettes de tennis', categorie: 'Tennis', prix_xaf: 3000, stock: 40, description: 'Manchettes pour protection du poignet', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Blanc'] }) },
  
  // Basketball
  { titre: 'Chaussures Jordan Air', categorie: 'Basketball', prix_xaf: 95000, stock: 10, description: 'Chaussures Jordan Air pour basketball', variantes: JSON.stringify({ tailles: ['40', '41', '42', '43', '44'], couleurs: ['Rouge/Noir', 'Bleu/Noir'] }) },
  { titre: 'Ballon NBA officiel', categorie: 'Basketball', prix_xaf: 35000, stock: 20, description: 'Ballon officiel NBA taille 7', variantes: JSON.stringify({ tailles: ['7'], couleurs: ['Orange'] }) },
  { titre: 'Maillot NBA Lakers', categorie: 'Basketball', prix_xaf: 55000, stock: 15, description: 'Maillot officiel Lakers', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Jaune/Violet'] }) },
  { titre: 'Panier de basket mural', categorie: 'Basketball', prix_xaf: 120000, stock: 5, description: 'Panier de basket mural professionnel', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Orange'] }) },
  { titre: 'Protège-dents basketball', categorie: 'Basketball', prix_xaf: 2000, stock: 50, description: 'Protège-dents pour basketball', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Transparent', 'Bleu'] }) },
  
  // Cyclisme
  { titre: 'Casque cyclisme Pro', categorie: 'Cyclisme', prix_xaf: 35000, stock: 20, description: 'Casque professionnel avec ventilation', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Blanc', 'Rouge'] }) },
  { titre: 'Gants cyclisme', categorie: 'Cyclisme', prix_xaf: 8000, stock: 30, description: 'Gants pour cyclisme route', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Blanc'] }) },
  { titre: 'Gourde 750ml', categorie: 'Cyclisme', prix_xaf: 3000, stock: 50, description: 'Gourde isotherme 750ml', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Bleu', 'Rouge', 'Vert', 'Noir'] }) },
  { titre: 'Maillot cyclisme équipe', categorie: 'Cyclisme', prix_xaf: 25000, stock: 18, description: 'Maillot cyclisme technique', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Jaune', 'Bleu', 'Rouge'] }) },
  { titre: 'Short cyclisme avec cuissard', categorie: 'Cyclisme', prix_xaf: 28000, stock: 15, description: 'Short cyclisme avec cuissard rembourré', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir'] }) },
  
  // Natation
  { titre: 'Maillot de bain homme', categorie: 'Natation', prix_xaf: 18000, stock: 25, description: 'Maillot de bain compétition', variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Noir', 'Bleu', 'Rouge'] }) },
  { titre: 'Maillot de bain femme', categorie: 'Natation', prix_xaf: 22000, stock: 20, description: 'Maillot de bain femme compétition', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Bleu', 'Rose'] }) },
  { titre: 'Lunettes de natation', categorie: 'Natation', prix_xaf: 5000, stock: 40, description: 'Lunettes anti-buée professionnelles', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Transparent', 'Noir', 'Bleu'] }) },
  { titre: 'Bonne de natation silicone', categorie: 'Natation', prix_xaf: 2000, stock: 50, description: 'Bonne de natation en silicone', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Bleu', 'Rouge', 'Rose'] }) },
  { titre: 'Planches de natation', categorie: 'Natation', prix_xaf: 8000, stock: 20, description: 'Planche de natation en mousse', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Jaune', 'Rose', 'Bleu'] }) },
  
  // Boxe
  { titre: 'Gants de boxe 16oz', categorie: 'Boxe', prix_xaf: 35000, stock: 15, description: 'Gants de boxe professionnels 16oz', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Rouge', 'Noir', 'Bleu'] }) },
  { titre: 'Sac de frappe 40kg', categorie: 'Boxe', prix_xaf: 65000, stock: 8, description: 'Sac de frappe rempli 40kg', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Rouge', 'Noir'] }) },
  { titre: 'Bandages de boxe', categorie: 'Boxe', prix_xaf: 3000, stock: 40, description: 'Bandages élastiques pour boxe', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Blanc', 'Rouge'] }) },
  { titre: 'Protège-dents boxe', categorie: 'Boxe', prix_xaf: 2000, stock: 50, description: 'Protège-dents professionnel', variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Transparent', 'Rouge', 'Bleu'] }) },
  { titre: 'Ceinture de boxe', categorie: 'Boxe', prix_xaf: 8000, stock: 20, description: 'Ceinture de boxe rembourrée', variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Rouge'] }) }
];

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');

    await Produit.bulkCreate(products);
    console.log(`${products.length} produits ajoutés avec succès`);

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'ajout des produits:', error);
    process.exit(1);
  }
}

seedProducts();
