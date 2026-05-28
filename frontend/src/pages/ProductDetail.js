import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI, reviewAPI } from '../services/api';
import StarRating from '../components/StarRating';
import { getProductImage } from '../utils/productImages';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaille, setSelectedTaille] = useState('');
  const [selectedCouleur, setSelectedCouleur] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Avis
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ note: 5, commentaire: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);
      setReviews(response.data.avis || []);
      
      // Sélectionner la première taille et couleur par défaut
      if (response.data.variantes) {
        if (response.data.variantes.tailles && response.data.variantes.tailles.length > 0) {
          setSelectedTaille(response.data.variantes.tailles[0]);
        }
        if (response.data.variantes.couleurs && response.data.variantes.couleurs.length > 0) {
          setSelectedCouleur(response.data.variantes.couleurs[0]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.variantes?.tailles?.length > 0 && !selectedTaille) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (product.variantes?.couleurs?.length > 0 && !selectedCouleur) {
      alert('Veuillez sélectionner une couleur');
      return;
    }

    addToCart(product, quantity, selectedTaille, selectedCouleur);
    alert('Produit ajouté au panier !');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour laisser un avis');
      return;
    }

    try {
      await reviewAPI.create({
        id_produit: parseInt(id),
        note: newReview.note,
        commentaire: newReview.commentaire
      });
      setReviewSubmitted(true);
      setReviewError('');
      loadProduct(); // Recharger pour voir le nouvel avis
      setNewReview({ note: 5, commentaire: '' });
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Erreur lors de la soumission de l\'avis');
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  if (loading) {
    return <Container className="py-5"><p>Chargement...</p></Container>;
  }

  if (!product) {
    return <Container className="py-5"><p>Produit non trouvé</p></Container>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img 
              src={getProductImage(product)}
              alt={product.titre}
              style={{ height: '450px', objectFit: 'contain' }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <h1>{product.titre}</h1>
          <p className="text-muted">{product.categorie}</p>
          <h2 className="text-primary mb-3">{formatPrice(product.prix_xaf)} FCFA</h2>
          
          <div className="mb-3">
            <StarRating rating={product.moyenneNote || 0} />
            <span className="ms-2 text-muted">({product.nombreAvis || 0} avis)</span>
          </div>

          <p>{product.description}</p>

          <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
            Stock: {product.stock} unités
          </p>

          {/* Variantes */}
          {product.variantes?.tailles && product.variantes.tailles.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Taille:</Form.Label>
              <div>
                {product.variantes.tailles.map((taille) => (
                  <Button
                    key={taille}
                    variant={selectedTaille === taille ? 'primary' : 'outline-secondary'}
                    className="me-2 mb-2"
                    onClick={() => setSelectedTaille(taille)}
                  >
                    {taille}
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          {product.variantes?.couleurs && product.variantes.couleurs.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Couleur:</Form.Label>
              <div>
                {product.variantes.couleurs.map((couleur) => (
                  <Button
                    key={couleur}
                    variant={selectedCouleur === couleur ? 'primary' : 'outline-secondary'}
                    className="me-2 mb-2"
                    onClick={() => setSelectedCouleur(couleur)}
                  >
                    {couleur}
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Quantité:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), product.stock))}
              style={{ width: '100px' }}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            size="lg" 
            className="w-100"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
          </Button>
        </Col>
      </Row>

      {/* Avis */}
      <Row className="mt-5">
        <Col>
          <h2>Avis Clients</h2>
          <Tabs defaultActiveKey="lire" className="mb-3">
            <Tab eventKey="lire" title="Lire les avis">
              {reviews.length === 0 ? (
                <p>Aucun avis pour ce produit</p>
              ) : (
                reviews.map((avis) => (
                  <Card key={avis.id_avis} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <strong>{avis.Utilisateur?.nom || 'Anonyme'}</strong>
                        <StarRating rating={avis.note} />
                      </div>
                      <Card.Text className="mt-2">{avis.commentaire}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Tab>
            <Tab eventKey="ecrire" title="Écrire un avis">
              {reviewSubmitted ? (
                <Alert variant="success">Merci pour votre avis !</Alert>
              ) : (
                <Form onSubmit={handleSubmitReview}>
                  {reviewError && <Alert variant="danger">{reviewError}</Alert>}
                  <Form.Group className="mb-3">
                    <Form.Label>Note:</Form.Label>
                    <StarRating 
                      rating={newReview.note} 
                      interactive 
                      onRate={(note) => setNewReview({ ...newReview, note })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Commentaire:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={newReview.commentaire}
                      onChange={(e) => setNewReview({ ...newReview, commentaire: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Soumettre l'avis
                  </Button>
                </Form>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
