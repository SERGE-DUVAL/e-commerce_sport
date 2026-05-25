import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, promotionAPI, userAPI } from '../services/api';
import { getProductImage } from '../utils/productImages';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Charger les points de l'utilisateur
  React.useEffect(() => {
    if (user) {
      loadUserPoints();
      setAdresseLivraison(user.adresse_livraison || '');
    }
  }, [user]);

  const loadUserPoints = async () => {
    try {
      const response = await userAPI.getPoints();
      setUserPoints(response.data.points_fidelite);
    } catch (error) {
      console.error('Erreur chargement points:', error);
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

      // Simuler le paiement
      await orderAPI.processPayment({
        id_commande: response.data.commande.id_commande
      });

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/profil');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  if (success) {
    return (
      <Container className="py-5">
        <Alert variant="success">
          <h4>Commande validée avec succès !</h4>
          <p>Vous allez être redirigé vers votre profil...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Mon Panier</h1>

      {cart.length === 0 ? (
        <Alert variant="info">
          Votre panier est vide. <a href="/catalogue">Parcourir le catalogue</a>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            {cart.map((item, index) => (
              <Card key={`${item.id_produit}-${item.taille}-${item.couleur}-${index}`} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={2}>
                      <img 
                        src={getProductImage(item)}
                        alt={item.titre}
                        className="img-fluid"
                        style={{ borderRadius: '14px', height: '92px', width: '100%', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col md={6}>
                      <h5>{item.titre}</h5>
                      {item.taille && <p className="mb-0">Taille: {item.taille}</p>}
                      {item.couleur && <p className="mb-0">Couleur: {item.couleur}</p>}
                      <p className="fw-bold">{formatPrice(item.prix_xaf)} FCFA</p>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantite}
                        onChange={(e) => updateQuantity(item.id_produit, item.taille, item.couleur, parseInt(e.target.value))}
                        style={{ width: '80px', marginBottom: '10px' }}
                      />
                      <Button 
                        variant="danger" 
                        size="sm"
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
            <Card>
              <Card.Body>
                <h4>Récapitulatif</h4>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>{formatPrice(sousTotal)} FCFA</span>
                </div>

                {remise > 0 && (
                  <>
                    <div className="d-flex justify-content-between mb-2 text-success">
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
                    />
                    <small className="text-muted">10 points = 1 FCFA de réduction</small>
                  </div>
                )}

                {pointsUtilises > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Réduction points:</span>
                    <span>-{formatPrice(reductionPoints)} FCFA</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span>Frais de livraison:</span>
                  <span>{fraisLivraison === 0 ? 'Gratuit' : formatPrice(fraisLivraison) + ' FCFA'}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">{formatPrice(total)} FCFA</strong>
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
                      />
                      <Button variant="outline-primary" onClick={handleApplyPromo}>
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Moyen de paiement:</Form.Label>
                  <Form.Select value={moyenPaiement} onChange={(e) => setMoyenPaiement(e.target.value)}>
                    <option value="Mobile Money">Mobile Money (Orange/MTN)</option>
                    <option value="Cash">Paiement à la livraison</option>
                  </Form.Select>
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
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
    </Container>
  );
};

export default Cart;
