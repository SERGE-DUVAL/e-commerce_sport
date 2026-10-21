const { Utilisateur } = require('../models');

exports.updateProfile = async (req, res) => {
  try {
    const { nom, adresse_livraison } = req.body;
    
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id_utilisateur);
    
    await utilisateur.update({
      nom: nom || utilisateur.nom,
      adresse_livraison: adresse_livraison || utilisateur.adresse_livraison
    });

    res.json({ message: 'Profil mis à jour', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id_utilisateur);
    
    res.json({
      points_fidelite: utilisateur.points_fidelite,
      valeur_fcfa: utilisateur.points_fidelite / 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
