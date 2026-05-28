const CodeBarre = require('../models/CodeBarre');
const Produit = require('../models/Produit');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Générer un code-barres EAN13
exports.generateEAN13 = (req, res) => {
  try {
    const { id_produit } = req.body;

    // Générer un code EAN13 unique (12 chiffres + checksum)
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

    res.json({ code_barre: ean13 });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Générer un QR code
exports.generateQRCode = async (req, res) => {
  try {
    const { id_produit, data } = req.body;

    const qrData = data || JSON.stringify({
      produit: id_produit,
      timestamp: new Date().toISOString(),
      uuid: uuidv4()
    });

    const qrCode = await QRCode.toDataURL(qrData);

    res.json({ qr_code: qrCode, data: qrData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer un code-barres pour un produit
exports.createCodeBarre = async (req, res) => {
  try {
    const { id_produit, code_barre, type_code, qr_code_data } = req.body;

    // Vérifier si le produit existe
    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si le code-barres existe déjà
    const existingCode = await CodeBarre.findOne({ where: { code_barre } });
    if (existingCode) {
      return res.status(400).json({ message: 'Ce code-barres existe déjà' });
    }

    const codeBarre = await CodeBarre.create({
      id_produit,
      code_barre,
      type_code: type_code || 'EAN13',
      qr_code_data
    });

    res.status(201).json(codeBarre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les codes-barres
exports.getAllCodesBarres = async (req, res) => {
  try {
    const codes = await CodeBarre.findAll({
      include: [{ model: Produit, as: 'produit' }]
    });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les codes-barres d'un produit
exports.getCodesByProduit = async (req, res) => {
  try {
    const { id_produit } = req.params;
    const codes = await CodeBarre.findAll({
      where: { id_produit },
      include: [{ model: Produit, as: 'produit' }]
    });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Scanner un code-barres
exports.scanCodeBarre = async (req, res) => {
  try {
    const { code_barre } = req.body;

    const code = await CodeBarre.findOne({
      where: { code_barre, actif: true },
      include: [{ model: Produit, as: 'produit' }]
    });

    if (!code) {
      return res.status(404).json({ message: 'Code-barres non trouvé ou inactif' });
    }

    // Mettre à jour les informations de scan
    await code.update({
      date_scan: new Date(),
      nombre_scans: code.nombre_scans + 1
    });

    res.json({
      code_barre: code,
      produit: code.produit
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Activer/Désactiver un code-barres
exports.toggleCodeBarre = async (req, res) => {
  try {
    const { id } = req.params;
    const code = await CodeBarre.findByPk(id);

    if (!code) {
      return res.status(404).json({ message: 'Code-barres non trouvé' });
    }

    await code.update({ actif: !code.actif });
    res.json(code);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un code-barres
exports.deleteCodeBarre = async (req, res) => {
  try {
    const { id } = req.params;
    const code = await CodeBarre.findByPk(id);

    if (!code) {
      return res.status(404).json({ message: 'Code-barres non trouvé' });
    }

    await code.destroy();
    res.json({ message: 'Code-barres supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
