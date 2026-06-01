const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

exports.validatePromotion = async (req, res) => {
  try {
    const { code } = req.body;

    const promotion = db.prepare(`
      SELECT * FROM promotions 
      WHERE code = ? AND est_active = 1 AND date_expiration > datetime('now')
    `).get(code.toUpperCase());

    if (!promotion) {
      return res.status(404).json({ message: 'Code promo invalide ou expiré' });
    }

    res.json({
      code: promotion.code,
      pourcentage_remise: promotion.pourcentage_remise
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
