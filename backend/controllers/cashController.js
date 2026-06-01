const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer une caisse
exports.createCaisse = async (req, res) => {
  try {
    const { nom, solde_initial, id_responsable } = req.body;

    const result = db.prepare(`
      INSERT INTO caisses (nom, solde_initial, solde_actuel, date_ouverture, statut, id_responsable, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), 'ouverte', ?, datetime('now'), datetime('now'))
    `).run(nom, solde_initial, solde_initial, id_responsable);

    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(result.lastInsertRowid);
    res.status(201).json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer toutes les caisses
exports.getAllCaisses = async (req, res) => {
  try {
    const caisses = db.prepare(`
      SELECT c.*, u.nom as responsable_nom, u.email as responsable_email
      FROM caisses c
      LEFT JOIN utilisateurs u ON c.id_responsable = u.id_utilisateur
      ORDER BY c.created_at DESC
    `).all();
    res.json(caisses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une caisse par ID
exports.getCaisseById = async (req, res) => {
  try {
    const caisse = db.prepare(`
      SELECT c.*, u.nom as responsable_nom, u.email as responsable_email
      FROM caisses c
      LEFT JOIN utilisateurs u ON c.id_responsable = u.id_utilisateur
      WHERE c.id_caisse = ?
    `).get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    res.json(caisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une caisse
exports.updateCaisse = async (req, res) => {
  try {
    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    
    const { nom, solde_initial, solde_actuel, statut, id_responsable } = req.body;
    db.prepare(`
      UPDATE caisses 
      SET nom = ?, solde_initial = ?, solde_actuel = ?, statut = ?, id_responsable = ?, updated_at = datetime('now')
      WHERE id_caisse = ?
    `).run(nom, solde_initial, solde_actuel, statut, id_responsable, req.params.id);
    
    const updatedCaisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    res.json(updatedCaisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fermer une caisse
exports.closeCaisse = async (req, res) => {
  try {
    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    
    db.prepare("UPDATE caisses SET statut = ?, date_fermeture = datetime('now'), updated_at = datetime('now') WHERE id_caisse = ?").run('fermée', req.params.id);
    
    const updatedCaisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    res.json(updatedCaisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ouvrir une caisse
exports.openCaisse = async (req, res) => {
  try {
    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    
    db.prepare("UPDATE caisses SET statut = ?, date_ouverture = datetime('now'), updated_at = datetime('now') WHERE id_caisse = ?").run('ouverte', req.params.id);
    
    const updatedCaisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    res.json(updatedCaisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le solde d'une caisse
exports.updateSolde = async (req, res) => {
  try {
    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    const { montant } = req.body;
    
    db.prepare("UPDATE caisses SET solde_actuel = solde_actuel + ?, updated_at = datetime('now') WHERE id_caisse = ?").run(montant, req.params.id);
    
    const updatedCaisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    res.json(updatedCaisse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une caisse
exports.deleteCaisse = async (req, res) => {
  try {
    const caisse = db.prepare('SELECT * FROM caisses WHERE id_caisse = ?').get(req.params.id);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }
    
    db.prepare('DELETE FROM caisses WHERE id_caisse = ?').run(req.params.id);
    res.json({ message: 'Caisse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
