const axios = require('axios');

exports.initiateSwitchPayment = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        success: false,
        message: 'Les paiements Switch sont indisponibles : le callback fournisseur doit être authentifié avant activation.'
      });
    }

    const { id_commande, telephone, operateur } = req.body;

    const switchConfig = {
      apiUrl: process.env.SWITCH_API_URL || 'https://api.switch.cm',
      apiKey: process.env.SWITCH_API_KEY,
      merchantId: process.env.SWITCH_MERCHANT_ID
    };

    const montant = Number(req.body.montant);
    if (
      !id_commande ||
      !telephone ||
      !['ORANGE', 'MTN'].includes(operateur) ||
      !Number.isSafeInteger(montant) ||
      montant <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Les informations de paiement sont invalides.'
      });
    }

    const paymentData = {
      merchant_id: switchConfig.merchantId,
      amount: montant,
      phone_number: telephone,
      operator: operateur,
      reference: `CMD-${id_commande}`,
      callback_url: `${process.env.BACKEND_URL}/api/payment/webhook`
    };

    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        message: 'Paiement initié (mode simulation)',
        reference: paymentData.reference,
        instruction: `Veuillez entrer votre code PIN sur votre téléphone ${operateur}`
      });
    }

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
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        received: false,
        message: 'Le callback Switch est désactivé tant que son authentification n’est pas configurée.'
      });
    }

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
