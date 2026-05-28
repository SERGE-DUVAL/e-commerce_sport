const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'sport_equip_secret_key_2026';

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Non autorisé - Pas de token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const utilisateur = await Utilisateur.findByPk(decoded.id);
    
    if (!utilisateur) {
      return res.status(401).json({ message: 'Non autorisé - Utilisateur non trouvé' });
    }

    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé - Token invalide' });
  }
};

exports.admin = (req, res, next) => {
  if (req.utilisateur.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
  }
  next();
};
