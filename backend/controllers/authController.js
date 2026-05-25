const { Utilisateur } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sport_equip_secret_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, adresse_livraison } = req.body;

    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const utilisateur = await Utilisateur.create({
      nom,
      email,
      mot_de_passe: hashedPassword,
      adresse_livraison,
      role: 'client',
      points_fidelite: 0
    });

    const token = jwt.sign(
      { id: utilisateur.id_utilisateur, role: utilisateur.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      utilisateur: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
        points_fidelite: utilisateur.points_fidelite
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: utilisateur.id_utilisateur, role: utilisateur.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
        points_fidelite: utilisateur.points_fidelite,
        adresse_livraison: utilisateur.adresse_livraison
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id_utilisateur, {
      attributes: { exclude: ['mot_de_passe'] }
    });

    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
