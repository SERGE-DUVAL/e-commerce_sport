const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Database = require('better-sqlite3');
const path = require('path');

// Base de données directe avec better-sqlite3
const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer une session de paiement Stripe
exports.createPaymentSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items requis'
      });
    }

    // Calculer le montant total
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'xof', // Franc CFA de l'Afrique de l'Ouest
        product_data: {
          name: item.nom || 'Produit',
          description: item.description || '',
        },
        unit_amount: Math.round(item.prix * 100), // Stripe utilise les centimes
      },
      quantity: item.quantite || 1,
    }));

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/paiement/cancel`,
      metadata: {
        orderId: orderId || '',
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Vérifier le statut d'une session de paiement
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID requis'
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      status: session.payment_status,
      session: session,
    });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Webhook Stripe pour confirmer le paiement
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erreur webhook Stripe:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      // Mettre à jour la commande dans la base de données
      if (orderId) {
        try {
          const updateOrder = db.prepare(`
            UPDATE commandes 
            SET statut = 'payée', 
                methode_paiement = 'stripe',
                date_paiement = datetime('now')
            WHERE id_commande = ?
          `);
          updateOrder.run(orderId);
          console.log(`Commande ${orderId} marquée comme payée via Stripe`);
        } catch (dbError) {
          console.error('Erreur mise à jour commande:', dbError);
        }
      }
      break;
    case 'checkout.session.expired':
      console.log('Session de paiement expirée');
      break;
    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.json({ received: true });
};
