const { Promotion } = require('../models');
const { Op } = require('sequelize');

exports.validatePromotion = async (req, res) => {
  try {
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
