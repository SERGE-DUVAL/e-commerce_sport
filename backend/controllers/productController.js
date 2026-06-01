const Database = require('better-sqlite3');
const path = require('path');
const nodemailer = require('nodemailer');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Configuration de l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

exports.getAllProducts = async (req, res) => {
  try {
    const { categorie, recherche, prix_min, prix_max, sort } = req.query;

    let query = 'SELECT * FROM produits WHERE 1=1';
    const params = [];

    if (categorie) {
      query += ' AND categorie = ?';
      params.push(categorie);
    }

    if (recherche) {
      query += ' AND (titre LIKE ? OR description LIKE ?)';
      params.push(`%${recherche}%`, `%${recherche}%`);
    }

    if (prix_min) {
      query += ' AND prix_xaf >= ?';
      params.push(prix_min);
    }

    if (prix_max) {
      query += ' AND prix_xaf <= ?';
      params.push(prix_max);
    }

    // Gestion du tri
    if (sort === 'prix_asc') {
      query += ' ORDER BY prix_xaf ASC';
    } else if (sort === 'prix_desc') {
      query += ' ORDER BY prix_xaf DESC';
    } else if (sort === 'titre') {
      query += ' ORDER BY titre ASC';
    } else if (sort === 'stock') {
      query += ' ORDER BY stock DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const produits = db.prepare(query).all(...params);
    res.json(produits);
  } catch (error) {
    console.error('Erreur getAllProducts:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Récupérer les avis du produit
    const avis = db.prepare(`
      SELECT a.*, u.nom 
      FROM avis a 
      LEFT JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateur 
      WHERE a.id_produit = ?
    `).all(req.params.id);

    // Calculer la moyenne des notes
    const moyenneNote = avis.length > 0
      ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length
      : 0;

    res.json({
      ...produit,
      avis,
      moyenneNote: parseFloat(moyenneNote.toFixed(1)),
      nombreAvis: avis.length
    });
  } catch (error) {
    console.error('Erreur getProductById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { titre, description, categorie, prix_xaf, stock, variantes } = req.body;

    const result = db.prepare(`
      INSERT INTO produits (titre, description, categorie, prix_xaf, stock, variantes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(titre, description, categorie, prix_xaf, stock, JSON.stringify(variantes || {}));

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(result.lastInsertRowid);

    // Générer automatiquement un code-barres EAN13 pour le produit
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

    // Créer le code-barres pour le produit
    db.prepare(`
      INSERT INTO codes_barres (id_produit, code_barre, type_code, created_at, updated_at)
      VALUES (?, ?, 'EAN13', datetime('now'), datetime('now'))
    `).run(produit.id_produit, ean13);

    res.status(201).json(produit);
  } catch (error) {
    console.error('Erreur createProduct:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { titre, description, categorie, prix_xaf, stock, variantes } = req.body;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    db.prepare(`
      UPDATE produits 
      SET titre = ?, description = ?, categorie = ?, prix_xaf = ?, stock = ?, variantes = ?, updated_at = datetime('now')
      WHERE id_produit = ?
    `).run(titre, description, categorie, prix_xaf, stock, JSON.stringify(variantes || {}), req.params.id);

    const updatedProduit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(req.params.id);
    res.json(updatedProduit);
  } catch (error) {
    console.error('Erreur updateProduct:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    db.prepare('DELETE FROM produits WHERE id_produit = ?').run(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur deleteProduct:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.assignProductToZone = async (req, res) => {
  try {
    const { id_produit, id_zone } = req.body;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const zone = db.prepare('SELECT * FROM zones WHERE id_zone = ?').get(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    // Créer une association produit-zone
    db.prepare(`
      INSERT INTO zone_stocks (id_produit, id_zone, quantite, created_at)
      VALUES (?, ?, 0, datetime('now'))
    `).run(id_produit, id_zone);

    res.status(201).json({ message: 'Produit assigné à la zone avec succès' });
  } catch (error) {
    console.error('Erreur assignProductToZone:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductZones = async (req, res) => {
  try {
    const zones = db.prepare(`
      SELECT z.* 
      FROM zones z
      INNER JOIN zone_stocks zs ON z.id_zone = zs.id_zone
      WHERE zs.id_produit = ?
    `).all(req.params.id);

    res.json(zones);
  } catch (error) {
    console.error('Erreur getProductZones:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.removeProductFromZone = async (req, res) => {
  try {
    const { id_produit, id_zone } = req.body;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const zone = db.prepare('SELECT * FROM zones WHERE id_zone = ?').get(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    db.prepare('DELETE FROM zone_stocks WHERE id_produit = ? AND id_zone = ?').run(id_produit, id_zone);

    res.json({ message: 'Produit retiré de la zone avec succès' });
  } catch (error) {
    console.error('Erreur removeProductFromZone:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.requestStockNotification = async (req, res) => {
  try {
    const { email, id_produit } = req.body;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si une notification existe déjà pour cet email et produit
    const existing = db.prepare(`
      SELECT * FROM notifications_stock 
      WHERE email = ? AND id_produit = ? AND statut = 'en_attente'
    `).get(email, id_produit);

    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà demandé une notification pour ce produit' });
    }

    // Créer la demande de notification
    db.prepare(`
      INSERT INTO notifications_stock (email, id_produit, statut, created_at, updated_at)
      VALUES (?, ?, 'en_attente', datetime('now'), datetime('now'))
    `).run(email, id_produit);

    res.json({ message: 'Demande de notification enregistrée avec succès' });
  } catch (error) {
    console.error('Erreur requestStockNotification:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.sendStockNotifications = async (req, res) => {
  try {
    const { id_produit } = req.body;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Récupérer toutes les notifications en attente pour ce produit
    const notifications = db.prepare(`
      SELECT * FROM notifications_stock 
      WHERE id_produit = ? AND statut = 'en_attente'
    `).all(id_produit);

    if (notifications.length === 0) {
      return res.json({ message: 'Aucune notification en attente pour ce produit' });
    }

    // Envoyer les emails
    for (const notification of notifications) {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: notification.email,
        subject: `Produit de nouveau disponible - ${produit.titre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a237e;">Bonne nouvelle !</h2>
            <p>Le produit que vous attendez est de nouveau disponible :</p>
            <h3 style="color: #333;">${produit.titre}</h3>
            <p>Prix: ${produit.prix_xaf} FCFA</p>
            <p>Stock: ${produit.stock} unités</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/produit/${produit.id_produit}" 
               style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
              Voir le produit
            </a>
            <p style="color: #666; font-size: 12px;">Cordialement,<br>L'équipe Sport-Equip</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      // Marquer la notification comme envoyée
      db.prepare(`
        UPDATE notifications_stock 
        SET statut = 'envoyée', updated_at = datetime('now') 
        WHERE id_notification = ?
      `).run(notification.id_notification);
    }

    res.json({ message: `${notifications.length} notifications envoyées avec succès` });
  } catch (error) {
    console.error('Erreur sendStockNotifications:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
