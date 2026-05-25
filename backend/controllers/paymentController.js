const axios = require('axios');

exports.initiateSwitchPayment = async (req, res) => {
  try {
    const { id_commande, telephone, operateur } = req.body;

    // Configuration de l'API Switch (simulation pour développement)
    const switchConfig = {
      apiUrl: process.env.SWITCH_API_URL || 'https://api.switch.cm',
      apiKey: process.env.SWITCH_API_KEY,
      merchantId: process.env.SWITCH_MERCHANT_ID
    };

    // Préparer les données pour la requête Switch
    const paymentData = {
      merchant_id: switchConfig.merchantId,
      amount: req.body.montant,
      phone_number: telephone,
      operator: operateur, // 'ORANGE' ou 'MTN'
      reference: `CMD-${id_commande}`,
      callback_url: `${process.env.BACKEND_URL}/api/payment/webhook`
    };

    // En environnement de développement, simuler la réponse
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        message: 'Paiement initié (mode simulation)',
        reference: paymentData.reference,
        instruction: `Veuillez entrer votre code PIN sur votre téléphone ${operateur}`
      });
    }

    // En production, envoyer la vraie requête à l'API Switch
    try {
      const response = await axios.post(
        `${switchConfig.apiUrl}/payment/push`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${switchConfig.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({
        success: true,
        reference: response.data.reference,
        message: 'Paiement initié via Switch'
      });
    } catch (switchError) {
      console.error('Erreur API Switch:', switchError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'initiation du paiement Switch'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.switchWebhook = async (req, res) => {
  try {
    const { reference, status, transaction_id } = req.body;

    // Extraire l'ID de la commande depuis la référence
    const commandeId = reference.replace('CMD-', '');

    // Mettre à jour le statut de la commande selon la réponse du webhook
    if (status === 'SUCCESS') {
      // Le traitement complet est déjà fait dans processPayment
      // Ici on pourrait juste confirmer le webhook
      console.log(`Paiement réussi pour commande ${commandeId}`);
    } else if (status === 'FAILED') {
      // Annuler la commande
      const { Commande } = require('../models');
      await Commande.update(
        { statut: 'Annulée' },
        { where: { id_commande: commandeId } }
      );
      console.log(`Paiement échoué pour commande ${commandeId}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ message: 'Erreur webhook' });
  }
};
