import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { creditAPI } from '../api/credits';
import { productAPI, orderAPI } from '../services/api';
import { FaShoppingCart, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

const MyAvoirs = () => {
  const { user } = useAuth();
  const [avoirs, setAvoirs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvoir, setSelectedAvoir] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadAvoirs();
      loadProducts();
    }
  }, [user]);

  const loadAvoirs = async () => {
    try {
      const response = await creditAPI.getAllCredits();
      // Filtrer les avoirs de l'utilisateur connecté
      const userAvoirs = response.data.filter(a => a.id_utilisateur === user.id_utilisateur);
      setAvoirs(userAvoirs);
    } catch (error) {
      console.error('Erreur lors du chargement des avoirs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const handleUseAvoir = (avoir) => {
    if (avoir.statut !== 'en attente') {
      setMessage('Cet avoir a déjà été utilisé ou est expiré');
      return;
    }
    setSelectedAvoir(avoir);
    setSelectedProducts([]);
    setTotalAmount(0);
    setShowProductModal(true);
  };

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id_produit === product.id_produit);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id_produit === product.id_produit 
          ? { ...p, quantite: p.quantite + 1 }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantite: 1 }]);
    }
    calculateTotal();
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id_produit !== productId));
    calculateTotal();
  };

  const handleUpdateQuantity = (productId, quantite) => {
    if (quantite <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setSelectedProducts(selectedProducts.map(p => 
      p.id_produit === productId 
        ? { ...p, quantite }
        : p
    ));
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce((sum, p) => sum + (p.prix_xaf * p.quantite), 0);
    setTotalAmount(total);
  };

  const handleConfirmOrder = async () => {
    if (totalAmount === 0) {
      setMessage('Veuillez sélectionner au moins un produit');
      return;
    }

    if (totalAmount > selectedAvoir.montant) {
      setMessage(`Le montant total (${totalAmount.toLocaleString('fr-FR')} FCFA) dépasse le montant de l'avoir (${selectedAvoir.montant.toLocaleString('fr-FR')} FCFA)`);
      return;
    }

    try {
      // Créer la commande avec les produits sélectionnés
      const orderData = {
        articles: selectedProducts.map(p => ({
          id_produit: p.id_produit,
          quantite: p.quantite
        })),
        adresse_livraison: user.adresse_livraison || '',
        moyen_paiement: 'avoir',
        id_avoir: selectedAvoir.id_avoir
      };

      const orderResponse = await orderAPI.create(orderData);
      
      // Marquer l'avoir comme utilisé
      await creditAPI.useCredit(selectedAvoir.id_avoir);
      
      // Mettre à jour la liste des avoirs
      loadAvoirs();
      
      setShowProductModal(false);
      setSelectedAvoir(null);
      setSelectedProducts([]);
      setTotalAmount(0);
      setMessage('Commande créée avec succès ! Votre avoir a été utilisé.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la création de la commande');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Mes Avoirs</h2>
      
      {message && (
        <Alert variant={message.includes('succès') ? 'success' : 'danger'} className="mb-3">
          {message}
        </Alert>
      )}

      {avoirs.length === 0 ? (
        <Alert variant="info">
          Vous n'avez aucun avoir. Les avoirs sont créés automatiquement lorsque vous demandez un remboursement de type "avoir".
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Montant</th>
                  <th>Commande associée</th>
                  <th>Date d'émission</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {avoirs.map((avoir) => (
                  <tr key={avoir.id_avoir}>
                    <td><strong>{avoir.numero_avoir}</strong></td>
                    <td>{avoir.montant.toLocaleString('fr-FR')} FCFA</td>
                    <td>{avoir.commande?.id_commande ? `#${avoir.commande.id_commande}` : 'N/A'}</td>
                    <td>{new Date(avoir.date_emission).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <Badge bg={
                        avoir.statut === 'en attente' ? 'warning' :
                        avoir.statut === 'utilisé' ? 'success' : 'danger'
                      }>
                        {avoir.statut}
                      </Badge>
                    </td>
                    <td>
                      {avoir.statut === 'en attente' && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleUseAvoir(avoir)}
                        >
                          <FaShoppingCart /> Utiliser
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal pour choisir les produits */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Utiliser l'avoir {selectedAvoir?.numero_avoir} - Budget: {selectedAvoir?.montant?.toLocaleString('fr-FR')} FCFA
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h5>Choisir des produits</h5>
              <div className="products-grid" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {products.map((product) => (
                  <Card key={product.id_produit} className="mb-2">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6>{product.titre}</h6>
                          <p className="mb-0 text-muted">{product.prix_xaf.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleAddProduct(product)}
                          disabled={totalAmount + product.prix_xaf > selectedAvoir?.montant}
                        >
                          <FaPlus /> Ajouter
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
            <Col md={4}>
              <h5>Panier</h5>
              {selectedProducts.length === 0 ? (
                <p className="text-muted">Aucun produit sélectionné</p>
              ) : (
                <div>
                  {selectedProducts.map((product) => (
                    <div key={product.id_produit} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <small>{product.titre}</small>
                        <div className="text-muted">{product.prix_xaf.toLocaleString('fr-FR')} FCFA</div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleUpdateQuantity(product.id_produit, product.quantite - 1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{product.quantite}</span>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleUpdateQuantity(product.id_produit, product.quantite + 1)}
                          disabled={totalAmount + product.prix_xaf > selectedAvoir?.montant}
                        >
                          +
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id_produit)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>{totalAmount.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Budget disponible:</span>
                    <span>{selectedAvoir?.montant?.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Reste:</span>
                    <span className={totalAmount > selectedAvoir?.montant ? 'text-danger' : 'text-success'}>
                      {(selectedAvoir?.montant - totalAmount).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>Annuler</Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmOrder}
            disabled={selectedProducts.length === 0 || totalAmount > selectedAvoir?.montant}
          >
            <FaCheck /> Confirmer la commande
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyAvoirs;
