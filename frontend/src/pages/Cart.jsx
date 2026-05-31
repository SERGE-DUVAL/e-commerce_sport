import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, promotionAPI, userAPI } from '../services/api';
import { getProductImage } from '../utils/productImages';
import { QRCodeCanvas } from 'qrcode.react';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [codePromo, setCodePromo] = useState('');
  const [remise, setRemise] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [pointsUtilises, setPointsUtilises] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [moyenPaiement, setMoyenPaiement] = useState('Mobile Money');
  const [codeMarchand, setCodeMarchand] = useState('');
  const [paymentStep, setPaymentStep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentCategories, setRecentCategories] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Charger les points de l'utilisateur
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      loadUserPoints();
      loadRecentRecommendations();
      setAdresseLivraison(user.adresse_livraison || '');
    }
  }, [user]);

  const loadUserPoints = async () => {
    try {
      const response = await userAPI.getPoints();
      setUserPoints(response.data.points_fidelite);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Erreur chargement points:', error);
      }
    }
  };

  const loadRecentRecommendations = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      const categories = response.data
        .flatMap(order => order.LigneCommandes || [])
        .map(line => line.Produit?.categorie)
        .filter(Boolean);
      setRecentCategories([...new Set(categories)].slice(0, 3));
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Erreur chargement recommandations:', error);
      }
      setRecentCategories([]);
    }
  };

  const handleApplyPromo = async () => {
    if (!codePromo) return;
    if (user?.role !== 'admin') {
      setPromoError('Seul un administrateur peut appliquer une promotion');
      return;
    }
    
    try {
      const response = await promotionAPI.validate({ code: codePromo });
      setRemise(response.data.pourcentage_remise);
      setPromoError('');
    } catch (error) {
      setRemise(0);
      setPromoError(error.response?.data?.message || 'Code promo invalide');
    }
  };

  const handleRemovePromo = () => {
    setCodePromo('');
    setRemise(0);
    setPromoError('');
  };

  const sousTotal = getCartTotal();
  const remiseMontant = (sousTotal * remise) / 100;
  const reductionPoints = pointsUtilises / 10;
  const sousTotalApresRemise = sousTotal - remiseMontant - reductionPoints;
  const fraisLivraison = sousTotalApresRemise >= 45000 ? 0 : 3000;
  const total = sousTotalApresRemise + fraisLivraison;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    if (!adresseLivraison) {
      setError('Veuillez renseigner une adresse de livraison');
      return;
    }

    if (moyenPaiement === 'Mobile Money' && codeMarchand.trim().length < 4) {
      setError('Veuillez saisir un code marchand fictif valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const articles = cart.map(item => ({
        id_produit: item.id_produit,
        quantite: item.quantite,
        taille: item.taille,
        couleur: item.couleur
      }));

      const response = await orderAPI.create({
        articles,
        adresse_livraison: adresseLivraison,
        moyen_paiement: moyenPaiement,
        points_utilises: pointsUtilises,
        code_promo: codePromo || undefined
      });

      if (moyenPaiement === 'Mobile Money') {
        setPaymentStep('Connexion au service Mobile Money...');
        await new Promise(resolve => setTimeout(resolve, 800));
        setPaymentStep('Vérification du code marchand...');
        await new Promise(resolve => setTimeout(resolve, 800));
        setPaymentStep('Validation du paiement sécurisé...');
        await new Promise(resolve => setTimeout(resolve, 900));
      }

      await orderAPI.processPayment({
        id_commande: response.data.commande.id_commande
      });

      setOrderData(response.data.commande);
      setShowTicketModal(true);
      clearCart();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    navigate('/profil');
  };

  return (
    <Container className="py-4 cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Mon Panier</h1>
        <p className="cart-subtitle">Finalisez votre commande en toute simplicité</p>
      </div>

      {cart.length === 0 ? (
        <Alert variant="info" className="text-center">
          Votre panier est vide. <a href="/catalogue">Parcourir le catalogue</a>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            {cart.map((item, index) => (
              <Card key={`${item.id_produit}-${item.taille}-${item.couleur}-${index}`} className="mb-3 cart-item-card">
                <Card.Body>
                  <Row>
                    <Col md={2}>
                      <img 
                        src={getProductImage(item)}
                        alt={item.titre}
                        className="cart-item-image"
                      />
                    </Col>
                    <Col md={6}>
                      <h5 className="cart-item-title">{item.titre}</h5>
                      {item.taille && <p className="cart-item-details">Taille: {item.taille}</p>}
                      {item.couleur && <p className="cart-item-details">Couleur: {item.couleur}</p>}
                      <p className="cart-item-price">{formatPrice(item.prix_xaf)} FCFA</p>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantite}
                        onChange={(e) => updateQuantity(item.id_produit, item.taille, item.couleur, parseInt(e.target.value))}
                        className="cart-quantity-input mb-2"
                      />
                      <Button 
                        variant="danger" 
                        size="sm"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id_produit, item.taille, item.couleur)}
                      >
                        Supprimer
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          <Col md={4}>
            <Card className="cart-summary-card">
              <Card.Body>
                <h4 className="cart-summary-title">Récapitulatif</h4>
                
                <div className="cart-summary-row">
                  <span>Sous-total:</span>
                  <span>{formatPrice(sousTotal)} FCFA</span>
                </div>

                {remise > 0 && (
                  <>
                    <div className="cart-summary-row text-success">
                      <span>Remise ({remise}%):</span>
                      <span>-{formatPrice(remiseMontant)} FCFA</span>
                    </div>
                    <Button variant="link" className="p-0 mb-2" onClick={handleRemovePromo}>
                      Supprimer le code promo
                    </Button>
                  </>
                )}

                {user && (
                  <div className="mb-3">
                    <Form.Label>Utiliser vos points ({userPoints} disponibles):</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max={userPoints}
                      value={pointsUtilises}
                      onChange={(e) => setPointsUtilises(parseInt(e.target.value) || 0)}
                      className="cart-form-control"
                    />
                    <small className="text-muted">10 points = 1 FCFA de réduction</small>
                  </div>
                )}

                {pointsUtilises > 0 && (
                  <div className="cart-summary-row text-success">
                    <span>Réduction points:</span>
                    <span>-{formatPrice(reductionPoints)} FCFA</span>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>Frais de livraison:</span>
                  <span>{fraisLivraison === 0 ? 'Gratuit' : formatPrice(fraisLivraison) + ' FCFA'}</span>
                </div>

                <hr />

                <div className="cart-summary-row total">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total)} FCFA</span>
                </div>

                {!user && (
                  <Alert variant="warning">
                    <a href="/connexion">Connectez-vous</a> pour commander
                  </Alert>
                )}

                {user?.role === 'admin' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Code promo:</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        value={codePromo}
                        onChange={(e) => setCodePromo(e.target.value.toUpperCase())}
                        placeholder="Ex: KEYCE20"
                        className="cart-form-control me-2"
                      />
                      <Button variant="outline-primary" onClick={handleApplyPromo} className="cart-apply-promo-btn">
                        Appliquer
                      </Button>
                    </div>
                    {promoError && <small className="text-danger">{promoError}</small>}
                  </Form.Group>
                )}
                {user && user.role !== 'admin' && (
                  <Alert variant="info">
                    Les promotions sont réservées à l'administrateur.
                  </Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Adresse de livraison:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={adresseLivraison}
                    onChange={(e) => setAdresseLivraison(e.target.value)}
                    required
                    className="cart-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Moyen de paiement:</Form.Label>
                  <Form.Select value={moyenPaiement} onChange={(e) => setMoyenPaiement(e.target.value)} className="cart-form-select">
                    <option value="Mobile Money">Mobile Money (Orange/MTN)</option>
                    <option value="Carte bancaire">Carte bancaire</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Cash">Paiement à la livraison</option>
                    <option value="Points">Points de fidélité</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Cinet Pay">Cinet Pay</option>
                  </Form.Select>
                </Form.Group>

                {moyenPaiement === 'Mobile Money' && (
                  <Form.Group className="mb-3 payment-simulator">
                    <Form.Label>Code marchand fictif:</Form.Label>
                    <Form.Control
                      value={codeMarchand}
                      onChange={(e) => setCodeMarchand(e.target.value)}
                      placeholder="Ex: SE-MOMO-2026"
                      className="cart-form-control"
                    />
                    {paymentStep && (
                      <div className="mt-3">
                        <ProgressBar animated now={loading ? 75 : 100} />
                        <small>{paymentStep}</small>
                      </div>
                    )}
                  </Form.Group>
                )}

                <Card className="cart-recommendations mb-3">
                  <Card.Body>
                    <h6>Suggestions selon vos commandes</h6>
                    <Row className="g-2">
                      {(recentCategories.length > 0 ? recentCategories : ['Football', 'Running', 'Fitness']).map((category) => (
                        <Col key={category} xs={4}>
                          <Button variant="outline-primary" size="sm" className="w-100" onClick={() => navigate(`/catalogue?categorie=${category}`)}>
                            {category}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading || !user}
                >
                  {loading ? 'Traitement...' : 'Commander'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      <Modal show={showTicketModal} onHide={handleCloseTicketModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket de Commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderData && (
            <div className="ticket-container">
              <div className="ticket-header">
                <h3>Sport-Equip</h3>
                <p className="text-muted">Ticket de commande #{orderData.id_commande}</p>
                <p className="text-muted">{new Date().toLocaleString('fr-FR')}</p>
              </div>
              
              <div className="ticket-details">
                <h5>Détails de la commande</h5>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.LigneCommandes?.map((ligne) => (
                      <tr key={ligne.id_ligne_commande}>
                        <td>{ligne.Produit?.titre || '-'}</td>
                        <td>{ligne.quantite}</td>
                        <td>{formatPrice(ligne.prix_unitaire)} FCFA</td>
                        <td>{formatPrice(ligne.quantite * ligne.prix_unitaire)} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                      <td className="text-end"><strong>{formatPrice(orderData.total_xaf)} FCFA</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
              
              <div className="ticket-info">
                <h5>Informations de livraison</h5>
                <p><strong>Adresse:</strong> {orderData.adresse_livraison}</p>
                <p><strong>Moyen de paiement:</strong> {orderData.moyen_paiement}</p>
                <p><strong>Statut:</strong> <span className="badge bg-success">{orderData.statut}</span></p>
              </div>
              
              <div className="ticket-qr">
                <h5>QR Code de la commande</h5>
                <div className="qr-code-container d-flex justify-content-center mb-3">
                  <QRCodeCanvas 
                    value={`CMD-${orderData.id_commande}-${orderData.total_xaf}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-muted text-center">Scannez ce QR code pour suivre votre commande</p>
              </div>
              
              <div className="ticket-footer">
                <p className="text-muted small text-center">Merci de votre confiance !</p>
                <p className="text-muted small text-center">Politique de retour: 15 jours pour échange</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseTicketModal}>
            Fermer
          </Button>
          <Button variant="outline-primary" onClick={() => window.print()}>
            Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
