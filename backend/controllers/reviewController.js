const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

exports.createReview = async (req, res) => {
  try {
    const { id_produit, note, commentaire, type_avis, id_commande } = req.body;
    const id_utilisateur = req.utilisateur.id_utilisateur;

    if (type_avis === 'produit') {
      // Vérifier que l'utilisateur a acheté ce produit et que la commande est livrée
      const commandeLivre = db.prepare(`
        SELECT c.* FROM commandes c
        INNER JOIN ligne_commandes lc ON c.id_commande = lc.id_commande
        WHERE c.id_utilisateur = ? AND c.statut = 'Livrée' AND lc.id_produit = ?
      `).get(id_utilisateur, id_produit);

      if (!commandeLivre) {
        return res.status(403).json({ 
          message: 'Vous devez avoir acheté ce produit et reçu votre commande pour laisser un avis' 
        });
      }

      // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
      const existingReview = db.prepare(`
        SELECT * FROM avis 
        WHERE id_produit = ? AND id_utilisateur = ? AND type_avis = 'produit'
      `).get(id_produit, id_utilisateur);

      if (existingReview) {
        return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit' });
      }

      const result = db.prepare(`
        INSERT INTO avis (id_produit, id_utilisateur, note, commentaire, type_avis, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'produit', datetime('now'), datetime('now'))
      `).run(id_produit, id_utilisateur, note, commentaire);

      const avis = db.prepare('SELECT * FROM avis WHERE id_avis = ?').get(result.lastInsertRowid);
      res.status(201).json({ message: 'Avis créé avec succès', avis });
    } else if (type_avis === 'livraison') {
      // Vérifier que l'utilisateur a une commande livrée
      const commandeLivre = db.prepare(`
        SELECT * FROM commandes 
        WHERE id_commande = ? AND id_utilisateur = ? AND statut = 'Livrée'
      `).get(id_commande, id_utilisateur);

      if (!commandeLivre) {
        return res.status(403).json({ 
          message: 'Vous devez avoir reçu votre commande pour laisser un avis sur la livraison' 
        });
      }

      // Vérifier si l'utilisateur a déjà laissé un avis sur cette livraison
      const existingReview = db.prepare(`
        SELECT * FROM avis 
        WHERE id_commande = ? AND id_utilisateur = ? AND type_avis = 'livraison'
      `).get(id_commande, id_utilisateur);

      if (existingReview) {
        return res.status(400).json({ message: 'Vous avez déjà laissé un avis sur cette livraison' });
      }

      const result = db.prepare(`
        INSERT INTO avis (id_utilisateur, note, commentaire, type_avis, id_commande, created_at, updated_at)
        VALUES (?, ?, ?, 'livraison', ?, datetime('now'), datetime('now'))
      `).run(id_utilisateur, note, commentaire, id_commande);

      const avis = db.prepare('SELECT * FROM avis WHERE id_avis = ?').get(result.lastInsertRowid);
      res.status(201).json({ message: 'Avis créé avec succès', avis });
    } else {
      return res.status(400).json({ message: 'Type d\'avis invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const avis = db.prepare(`
      SELECT a.*, u.nom as utilisateur_nom 
      FROM avis a
      LEFT JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateur
      WHERE a.id_produit = ? AND a.type_avis = 'produit'
      ORDER BY a.created_at DESC
    `).all(req.params.id);

    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getDeliveryReviews = async (req, res) => {
  try {
    const avis = db.prepare(`
      SELECT a.*, u.nom, u.email 
      FROM avis a
      LEFT JOIN utilisateurs u ON a.id_utilisateur = u.id_utilisateur
      WHERE a.type_avis = 'livraison'
      ORDER BY a.created_at DESC
    `).all();

    res.json(avis);
  } catch (error) {
    console.error('Erreur getDeliveryReviews:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
