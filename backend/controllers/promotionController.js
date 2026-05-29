const { Promotion } = require('../models');
const { Op } = require('sequelize');

// Mettre à jour les promotions expirées automatiquement
exports.updateExpiredPromotions = async () => {
  try {
    const now = new Date();
    await Promotion.update(
      { est_active: false },
      {
        where: {
          est_active: true,
          date_expiration: { [Op.lt]: now }
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour des promotions expirées:', error);
  }
};

exports.validatePromotion = async (req, res) => {
  try {
    // Mettre à jour les promotions expirées avant de valider
    await exports.updateExpiredPromotions();

    const { code } = req.body;

    const promotion = await Promotion.findOne({
      where: {
        code: code.toUpperCase(),
        est_active: true,
        date_expiration: { [Op.gt]: new Date() }
      }
    });

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
