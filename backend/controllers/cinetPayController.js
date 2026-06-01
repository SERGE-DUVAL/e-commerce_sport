const axios = require('axios');
const Database = require('better-sqlite3');
const path = require('path');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Configuration Cinet Pay
const CINETPAY_API_URL = process.env.CINETPAY_API_URL || 'https://api.cinetpay.com/v1';
const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY;
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID;
const CINETPAY_SECRET_KEY = process.env.CINETPAY_SECRET_KEY;

// Créer une session de paiement Cinet Pay
exports.createPaymentSession = async (req, res) => {
  try {
    const { amount, orderId, description, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'Montant et ID de commande requis'
      });
    }

    // Générer un identifiant de transaction unique
    const transactionId = `TXN_${Date.now()}_${orderId}`;

    // Préparer les données pour Cinet Pay
    const paymentData = {
      amount: amount,
      currency: 'XOF',
      transaction_id: transactionId,
      description: description || 'Paiement Sport-Equip',
      customer_name: customerName || 'Client',
      customer_email: customerEmail || '',
      customer_phone: customerPhone || '',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/paiement/success?transaction_id=${transactionId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/paiement/cancel?transaction_id=${transactionId}`,
      notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/cinetpay/webhook`,
      metadata: {
        orderId: orderId
      }
    };

    // Appel à l'API Cinet Pay
    const response = await axios.post(
      `${CINETPAY_API_URL}/payment`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CINETPAY_API_KEY}`
        }
      }
    );

    if (response.data.success) {
      res.json({
        success: true,
        transactionId: transactionId,
        paymentUrl: response.data.payment_url,
        sessionId: response.data.session_id
      });
    } else {
      res.status(500).json({
        success: false,
        error: response.data.message || 'Erreur lors de la création du paiement'
      });
    }
  } catch (error) {
    console.error('Erreur Cinet Pay:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vérifier le statut d'une transaction Cinet Pay
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'ID de transaction requis'
      });
    }

    // Appel à l'API Cinet Pay pour vérifier le statut
    const response = await axios.get(
      `${CINETPAY_API_URL}/payment/${transactionId}/status`,
      {
        headers: {
          'Authorization': `Bearer ${CINETPAY_API_KEY}`
        }
      }
    );

    res.json({
      success: true,
      status: response.data.status,
      transaction: response.data
    });
  } catch (error) {
    console.error('Erreur Cinet Pay:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Webhook Cinet Pay pour confirmer le paiement
exports.webhook = async (req, res) => {
  try {
    const { transaction_id, status, amount, metadata } = req.body;

    // Vérifier la signature du webhook pour la sécurité
    // (à implémenter avec CINETPAY_SECRET_KEY)

    if (status === 'success' || status === 'completed') {
      const orderId = metadata?.orderId;

      if (orderId) {
        // Mettre à jour la commande dans la base de données
        try {
          const updateOrder = db.prepare(`
            UPDATE commandes 
            SET statut = 'payée', 
                methode_paiement = 'cinetpay',
                date_paiement = datetime('now')
            WHERE id_commande = ?
          `);
          updateOrder.run(orderId);
          console.log(`Commande ${orderId} marquée comme payée via Cinet Pay`);
        } catch (dbError) {
          console.error('Erreur mise à jour commande:', dbError);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Cinet Pay:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
