const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer une zone de stockage
exports.createZone = async (req, res) => {
  try {
    const { nom, emplacement, capacite, description } = req.body;
    
    const result = db.prepare(`
      INSERT INTO zones_stockage (nom, emplacement, capacite, description, actif, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `).run(nom, emplacement, capacite, description);
    
    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(result.lastInsertRowid);
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les zones de stockage
exports.getAllZones = async (req, res) => {
  try {
    const zones = db.prepare('SELECT * FROM zones_stockage ORDER BY created_at DESC').all();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une zone par ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une zone
exports.updateZone = async (req, res) => {
  try {
    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    const { nom, emplacement, capacite, description, actif } = req.body;
    db.prepare(`
      UPDATE zones_stockage 
      SET nom = ?, emplacement = ?, capacite = ?, description = ?, actif = ?, updated_at = datetime('now')
      WHERE id_zone = ?
    `).run(nom, emplacement, capacite, description, actif, req.params.id);
    
    const updatedZone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    res.json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Activer/Désactiver une zone
exports.toggleZone = async (req, res) => {
  try {
    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    db.prepare("UPDATE zones_stockage SET actif = ?, updated_at = datetime('now') WHERE id_zone = ?").run(!zone.actif, req.params.id);
    
    const updatedZone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    res.json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une zone
exports.deleteZone = async (req, res) => {
  try {
    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    db.prepare('DELETE FROM zones_stockage WHERE id_zone = ?').run(req.params.id);
    res.json({ message: 'Zone supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter un produit à une zone
exports.addProductToZone = async (req, res) => {
  try {
    const { id_zone } = req.params;
    const { id_produit } = req.body;

    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(id_zone);
    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);

    if (!zone || !produit) {
      return res.status(404).json({ message: 'Zone ou produit non trouvé' });
    }

    db.prepare(`
      INSERT INTO ProduitZone (id_produit, id_zone, created_at, updated_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `).run(id_produit, id_zone);
    
    res.json({ message: 'Produit ajouté à la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Retirer un produit d'une zone
exports.removeProductFromZone = async (req, res) => {
  try {
    const { id_zone } = req.params;
    const { id_produit } = req.body;

    const zone = db.prepare('SELECT * FROM zones_stockage WHERE id_zone = ?').get(id_zone);
    const produit = db.prepare('SELECT * FROM produits WHERE id_produit = ?').get(id_produit);

    if (!zone || !produit) {
      return res.status(404).json({ message: 'Zone ou produit non trouvé' });
    }

    db.prepare('DELETE FROM ProduitZone WHERE id_produit = ? AND id_zone = ?').run(id_produit, id_zone);
    res.json({ message: 'Produit retiré de la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
