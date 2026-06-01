const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer un mouvement de stock
exports.createMouvement = async (req, res) => {
  try {
    const { id_produit, type_mouvement, quantite, motif } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const stock_avant = produit.stock;
    let stock_apres = stock_avant;

    if (type_mouvement === 'entree') {
      stock_apres = stock_avant + quantite;
    } else if (type_mouvement === 'sortie') {
      stock_apres = stock_avant - quantite;
    } else if (type_mouvement === 'ajustement') {
      stock_apres = quantite;
    }

    if (stock_apres < 0) {
      return res.status(400).json({ message: 'Stock insuffisant pour cette sortie' });
    }

    const mouvement = db.prepare(`
      INSERT INTO mouvements_stock (id_produit, id_utilisateur, type_mouvement, quantite, stock_avant, stock_apres, motif, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(id_produit, id_utilisateur, type_mouvement, quantite, stock_avant, stock_apres, motif);

    db.prepare("UPDATE produits SET stock = ?, updated_at = datetime('now') WHERE id_produit = ?").run(stock_apres, id_produit);

    res.json({ id_mouvement: mouvement.lastInsertRowid, ...req.body, stock_avant, stock_apres });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer l'historique des mouvements de stock
exports.getMouvements = async (req, res) => {
  try {
    const { id_produit } = req.query;
    
    let query = `
      SELECT ms.*, p.titre as produit_titre, u.nom as utilisateur_nom, u.email as utilisateur_email
      FROM mouvements_stock ms
      LEFT JOIN produits p ON ms.id_produit = p.id_produit
      LEFT JOIN utilisateurs u ON ms.id_utilisateur = u.id_utilisateur
    `;
    const params = [];
    
    if (id_produit) {
      query += ' WHERE ms.id_produit = ?';
      params.push(id_produit);
    }
    
    query += ' ORDER BY ms.created_at DESC';
    
    const mouvements = db.prepare(query).all(...params);

    res.json(mouvements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les alertes de stock bas
exports.getStockAlerts = async (req, res) => {
  try {
    const produits = db.prepare('SELECT * FROM produits WHERE stock < 5 ORDER BY stock ASC').all();

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Prévision de rupture de stock basée sur les ventes
exports.getStockForecast = async (req, res) => {
  try {
    const produits = db.prepare('SELECT * FROM produits').all();
    const trenteJours = new Date();
    trenteJours.setDate(trenteJours.getDate() - 30);

    const forecasts = produits.map(produit => {
      // Calculer les ventes sur les 30 derniers jours
      const lignesCommandes = db.prepare(`
        SELECT lc.quantite
        FROM ligne_commandes lc
        LEFT JOIN commandes c ON lc.id_commande = c.id_commande
        WHERE lc.id_produit = ? AND c.created_at >= ? AND c.statut = 'Livrée'
      `).all(produit.id_produit, trenteJours.toISOString());

      const totalVendu = lignesCommandes.reduce((sum, ligne) => sum + ligne.quantite, 0);
      const venteMoyenneParJour = totalVendu / 30;

      let joursRestants = null;
      if (venteMoyenneParJour > 0) {
        joursRestants = Math.floor(produit.stock / venteMoyenneParJour);
      }

      return {
        id_produit: produit.id_produit,
        titre: produit.titre,
        categorie: produit.categorie,
        stock_actuel: produit.stock,
        vente_moyenne_journaliere: venteMoyenneParJour.toFixed(2),
        jours_restants: joursRestants,
        alerte: joursRestants !== null && joursRestants < 7
      };
    });

    // Filtrer uniquement les produits avec alerte
    const alerts = forecasts.filter(f => f.alerte).sort((a, b) => a.jours_restants - b.jours_restants);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
