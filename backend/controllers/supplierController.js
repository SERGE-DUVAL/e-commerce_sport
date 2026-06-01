const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer un fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const { nom, contact, adresse, email } = req.body;
    
    const result = db.prepare(`
      INSERT INTO fournisseurs (nom, contact, adresse, email, actif, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `).run(nom, contact, adresse, email);
    
    const fournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(result.lastInsertRowid);
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les fournisseurs
exports.getAllFournisseurs = async (req, res) => {
  try {
    const fournisseurs = db.prepare('SELECT * FROM fournisseurs ORDER BY created_at DESC').all();
    res.json(fournisseurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un fournisseur par ID
exports.getFournisseurById = async (req, res) => {
  try {
    const fournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    res.json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un fournisseur
exports.updateFournisseur = async (req, res) => {
  try {
    const fournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    const { nom, contact, adresse, email, actif } = req.body;
    db.prepare(`
      UPDATE fournisseurs 
      SET nom = ?, contact = ?, adresse = ?, email = ?, actif = ?, updated_at = datetime('now')
      WHERE id_fournisseur = ?
    `).run(nom, contact, adresse, email, actif, req.params.id);
    
    const updatedFournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    res.json(updatedFournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Activer/Désactiver un fournisseur
exports.toggleFournisseur = async (req, res) => {
  try {
    const fournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    db.prepare("UPDATE fournisseurs SET actif = ?, updated_at = datetime('now') WHERE id_fournisseur = ?").run(!fournisseur.actif, req.params.id);
    
    const updatedFournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    res.json(updatedFournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un fournisseur
exports.deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = db.prepare('SELECT * FROM fournisseurs WHERE id_fournisseur = ?').get(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    db.prepare('DELETE FROM fournisseurs WHERE id_fournisseur = ?').run(req.params.id);
    res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
