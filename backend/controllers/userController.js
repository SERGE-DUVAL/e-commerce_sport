const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

exports.updateProfile = async (req, res) => {
  try {
    const { nom, adresse_livraison } = req.body;
    
    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(req.utilisateur.id_utilisateur);
    
    db.prepare(`
      UPDATE utilisateurs 
      SET nom = ?, adresse_livraison = ?, updated_at = datetime('now')
      WHERE id_utilisateur = ?
    `).run(nom || utilisateur.nom, adresse_livraison || utilisateur.adresse_livraison, req.utilisateur.id_utilisateur);

    const updatedUtilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(req.utilisateur.id_utilisateur);
    res.json({ message: 'Profil mis à jour', utilisateur: updatedUtilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(req.utilisateur.id_utilisateur);
    
    res.json({
      points_fidelite: utilisateur.points_fidelite,
      valeur_fcfa: utilisateur.points_fidelite / 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
