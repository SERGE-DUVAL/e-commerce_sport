const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

const JWT_SECRET = process.env.JWT_SECRET || 'sport_equip_secret_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

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


// Configuration Google OAuth
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || 'your-google-client-id'
);

exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, adresse_livraison } = req.body;

    const existingUser = db.prepare('SELECT * FROM utilisateurs WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const result = db.prepare(`
      INSERT INTO utilisateurs (nom, email, mot_de_passe, adresse_livraison, role, points_fidelite, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'client', 0, datetime('now'), datetime('now'))
    `).run(nom, email, hashedPassword, adresse_livraison);

    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(result.lastInsertRowid);

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
    console.error('Erreur register:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE email = ?').get(email);
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
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const utilisateur = db.prepare(`
      SELECT id_utilisateur, nom, email, role, points_fidelite, adresse_livraison, created_at, updated_at 
      FROM utilisateurs 
      WHERE id_utilisateur = ?
    `).get(req.utilisateur.id_utilisateur);

    res.json(utilisateur);
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE email = ?').get(email);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Email non trouvé' });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    db.prepare(`
      UPDATE utilisateurs 
      SET reset_token = ?, reset_token_expiry = ? 
      WHERE id_utilisateur = ?
    `).run(resetToken, resetTokenExpiry.toISOString(), utilisateur.id_utilisateur);

    // Envoyer l'email de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Sport-Equip',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a237e;">Réinitialisation de mot de passe</h2>
          <p>Bonjour ${utilisateur.nom},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour le réinitialiser:</p>
          <a href="${resetUrl}" style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">Réinitialiser mon mot de passe</a>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <p style="color: #666; font-size: 12px;">Cordialement,<br>L'équipe Sport-Equip</p>
        </div>
      `
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

    // En développement, on log l'URL pour faciliter les tests
    if (process.env.NODE_ENV !== 'production') {
      console.log('Reset URL (dev mode):', resetUrl);
    }

    res.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, mot_de_passe } = req.body;

    const utilisateur = db.prepare(`
      SELECT * FROM utilisateurs 
      WHERE reset_token = ? AND reset_token_expiry > datetime('now')
    `).get(token);

    if (!utilisateur) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    db.prepare(`
      UPDATE utilisateurs 
      SET mot_de_passe = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = datetime('now')
      WHERE id_utilisateur = ?
    `).run(hashedPassword, utilisateur.id_utilisateur);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Vérifier le token Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id'
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Vérifier si l'utilisateur existe déjà
    let utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE email = ?').get(email);

    if (utilisateur) {
      // Utilisateur existe, générer un token
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
    } else {
      // Créer un nouvel utilisateur
      const result = db.prepare(`
        INSERT INTO utilisateurs (nom, email, mot_de_passe, role, points_fidelite, google_id, created_at, updated_at)
        VALUES (?, ?, ?, 'client', 0, ?, datetime('now'), datetime('now'))
      `).run(name, email, 'google-auth-' + crypto.randomBytes(32).toString('hex'), googleId);

      utilisateur = db.prepare('SELECT * FROM utilisateurs WHERE id_utilisateur = ?').get(result.lastInsertRowid);

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
    }
  } catch (error) {
    console.error('Erreur googleAuth:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
