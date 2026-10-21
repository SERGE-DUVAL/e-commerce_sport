const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const CodeBarre = require('../models/CodeBarre');
const QRCode = require('qrcode');

async function assignCodesToExistingData() {
  try {
    console.log('Début de l\'attribution des codes-barres aux produits existants...');

    // Récupérer tous les produits
    const produits = await Produit.findAll();

    for (const produit of produits) {
      // Vérifier si le produit a déjà un code-barres
      const existingCode = await CodeBarre.findOne({
        where: { id_produit: produit.id_produit }
      });

      if (!existingCode) {
        // Générer un code-barres EAN13
        let code = '';
        for (let i = 0; i < 12; i++) {
          code += Math.floor(Math.random() * 10);
        }

        // Calculer le checksum
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          const digit = parseInt(code[i]);
          sum += i % 2 === 0 ? digit : digit * 3;
        }
        const checksum = (10 - (sum % 10)) % 10;
        const ean13 = code + checksum;

        // Créer le code-barres
        await CodeBarre.create({
          id_produit: produit.id_produit,
          code_barre: ean13,
          type_code: 'EAN13'
        });

        console.log(`Code-barres attribué au produit ${produit.id_produit}: ${ean13}`);
      } else {
        console.log(`Produit ${produit.id_produit} a déjà un code-barres: ${existingCode.code_barre}`);
      }
    }

    console.log('Attribution des codes-barres terminée.');

    console.log('Début de l\'attribution des QR codes aux commandes existantes...');

    // Récupérer toutes les commandes
    const commandes = await Commande.findAll();

    for (const commande of commandes) {
      // Vérifier si la commande a déjà un QR code
      if (!commande.qr_code) {
        // Générer un QR code unique pour le ticket de caisse
        const qrData = JSON.stringify({
          commande: commande.id_commande,
          date: commande.createdAt.toISOString(),
          total: commande.total_xaf,
          client: commande.id_utilisateur
        });
        const qrCode = await QRCode.toDataURL(qrData);

        // Mettre à jour la commande avec le QR code
        await commande.update({ qr_code: qrCode });

        console.log(`QR code attribué à la commande ${commande.id_commande}`);
      } else {
        console.log(`Commande ${commande.id_commande} a déjà un QR code`);
      }
    }

    console.log('Attribution des QR codes terminée.');
    console.log('Script terminé avec succès.');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'attribution des codes:', error);
    process.exit(1);
  }
}

assignCodesToExistingData();
