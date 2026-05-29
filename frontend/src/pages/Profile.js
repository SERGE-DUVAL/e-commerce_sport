import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI, orderAPI, reviewAPI } from '../services/api';
import api from '../services/api';
import { deliveryAPI } from '../api/delivery';
import { FaCheck, FaStar, FaUser, FaEdit, FaSignOutAlt, FaShoppingBag, FaDownload } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse_livraison: ''
  });
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    note: 5,
    commentaire: '',
    type_avis: 'produit'
  });
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState(null);
  const [refundForm, setRefundForm] = useState({
    type_demande: 'avoir',
    raison: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        adresse_livraison: user.adresse_livraison || ''
      });
      loadOrders();
      loadPoints();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
      const affectationsResponse = await deliveryAPI.getAffectations();
      setAffectations(affectationsResponse.data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPoints = async () => {
    try {
      const response = await userAPI.getPoints();
      setPoints(response.data);
    } catch (error) {
      console.error('Erreur chargement points:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(formData);
      updateUser({ ...user, ...formData });
      setEditing(false);
      setMessage('Profil mis à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      await orderAPI.confirmReception(orderId);
      loadOrders();
      setMessage('Réception confirmée avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la confirmation de réception');
    }
  };

  const handleDownloadDeliveryNote = async (orderId) => {
    try {
      const affectation = affectations.find(a => a.id_commande === orderId);
      if (affectation) {
        const response = await deliveryAPI.generateDeliveryNote(affectation.id_affectation);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bordereau-livraison-${affectation.id_affectation}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setMessage('Bordereau de livraison téléchargé');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Erreur lors du téléchargement du bordereau');
    }
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-caisse-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage('Ticket de caisse téléchargé');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors du téléchargement du ticket');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }
    try {
      await orderAPI.cancelOrder(orderId);
      loadOrders();
      setMessage('Commande annulée avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'annulation de la commande');
    }
  };

  const handleRequestRefund = (orderId) => {
    const order = orders.find(o => o.id_commande === orderId);
    setSelectedOrderForRefund(order);
    setRefundForm({
      type_demande: 'avoir',
      raison: '',
      description: ''
    });
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async () => {
    try {
      await orderAPI.requestRefund(selectedOrderForRefund.id_commande, {
        reason: refundForm.raison,
        type_demande: refundForm.type_demande,
        description: refundForm.description
      });
      setShowRefundModal(false);
      setSelectedOrderForRefund(null);
      loadOrders();
      setMessage('Demande de remboursement envoyée avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la demande de remboursement');
    }
  };

  const handleOpenReview = (order) => {
    setSelectedOrder(order);
    setReviewForm({ note: 5, commentaire: '', type_avis: 'produit' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (reviewForm.type_avis === 'produit') {
        // Pour chaque produit de la commande, ajouter un avis
        for (const ligne of selectedOrder.LigneCommandes || []) {
          await reviewAPI.create({
            id_produit: ligne.id_produit,
            note: reviewForm.note,
            commentaire: reviewForm.commentaire,
            type_avis: 'produit'
          });
        }
      } else if (reviewForm.type_avis === 'livraison') {
        // Avis sur la livraison
        await reviewAPI.create({
          id_commande: selectedOrder.id_commande,
          note: reviewForm.note,
          commentaire: reviewForm.commentaire,
          type_avis: 'livraison'
        });
      }
      setShowReviewModal(false);
      setMessage('Avis ajouté avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      setMessage(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis');
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Veuillez vous <a href="/connexion">connecter</a> pour accéder à votre profil
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 profile-page">
      <div className="profile-header mb-5">
        <h1 className="profile-title">Mon Profil</h1>
        <p className="profile-subtitle">Gérez vos informations et suivez vos commandes</p>
      </div>

      {message && <Alert variant="success" className="profile-alert">{message}</Alert>}

      <Row>
        <Col lg={4} md={5}>
          <Card className="profile-card mb-4">
            <Card.Body>
              <div className="profile-section-header">
                <h4><FaUser /> Informations personnelles</h4>
              </div>
              {!editing ? (
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Nom:</span>
                    <span className="info-value">{user.nom}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Adresse:</span>
                    <span className="info-value">{user.adresse_livraison || 'Non renseignée'}</span>
                  </div>
                  <Button variant="primary" className="profile-btn" onClick={() => setEditing(true)}>
                    <FaEdit /> Modifier
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                      className="profile-input"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse de livraison</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.adresse_livraison}
                      onChange={(e) => setFormData({ ...formData, adresse_livraison: e.target.value })}
                      className="profile-input"
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="profile-btn me-2">
                    Enregistrer
                  </Button>
                  <Button variant="outline-secondary" onClick={() => setEditing(false)}>
                    Annuler
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card className="profile-card mb-4">
            <Card.Body>
              <div className="profile-section-header">
                <h4><FaStar /> Points de fidélité</h4>
              </div>
              {points ? (
                <div className="loyalty-points">
                  <div className="points-display">
                    <span className="points-number">{points.points_fidelite}</span>
                    <span className="points-label">points</span>
                  </div>
                  <div className="points-value">
                    <span className="value-label">Valeur:</span>
                    <span className="value-amount">{formatPrice(points.valeur_fcfa)} FCFA</span>
                  </div>
                  <small className="points-info">10 points = 1 FCFA de réduction</small>
                </div>
              ) : (
                <p>Chargement...</p>
              )}
            </Card.Body>
          </Card>

          <Card className="profile-card">
            <Card.Body>
              <Button variant="outline-danger" className="w-100 profile-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Déconnexion
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          <Card className="profile-card">
            <Card.Body>
              <div className="profile-section-header">
                <h4><FaShoppingBag /> Mes Commandes</h4>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Chargement de vos commandes...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-orders text-center py-5">
                  <FaShoppingBag size={48} className="text-muted mb-3" />
                  <p className="text-muted">Aucune commande pour le moment</p>
                  <Button variant="primary" href="/catalogue">Découvrir nos produits</Button>
                </div>
              ) : (
                <Table responsive hover className="orders-table" style={{ color: '#000' }}>
                  <thead style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                    <tr>
                      <th style={{ color: '#000' }}>Commande #</th>
                      <th style={{ color: '#000' }}>Date</th>
                      <th style={{ color: '#000' }}>Total</th>
                      <th style={{ color: '#000' }}>Statut</th>
                      <th style={{ color: '#000' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id_commande} style={{ color: '#000' }}>
                        <td style={{ color: '#000' }}><strong>#{order.id_commande}</strong></td>
                        <td style={{ color: '#000' }}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td style={{ color: '#000' }} className="fw-bold">{formatPrice(order.total_xaf)} FCFA</td>
                        <td>
                          <Badge className={`order-status ${
                            order.statut === 'Livrée' ? 'status-delivered' :
                            order.statut === 'Payée' ? 'status-paid' :
                            order.statut === 'Annulée' ? 'status-cancelled' : 'status-pending'
                          }`}>
                            {order.statut}
                          </Badge>
                        </td>
                        <td>
                          <div className="order-actions">
                            {(order.statut === 'En livraison' || order.statut === 'Payée') && (
                              <Button size="sm" variant="success" className="action-btn me-2" onClick={() => handleConfirmDelivery(order.id_commande)}>
                                <FaCheck /> Confirmer
                              </Button>
                            )}
                            {(order.statut === 'Payée' || order.statut === 'En livraison') && (
                              <Button size="sm" variant="outline-danger" className="action-btn me-2" onClick={() => handleCancelOrder(order.id_commande)}>
                                Annuler
                              </Button>
                            )}
                            {order.statut === 'Livrée' && (
                              <Button size="sm" variant="outline-warning" className="action-btn me-2" onClick={() => handleRequestRefund(order.id_commande)}>
                                Remboursement
                              </Button>
                            )}
                            {order.statut === 'Payée' && (
                              <Button size="sm" variant="outline-secondary" className="action-btn me-2" onClick={() => handleDownloadReceipt(order.id_commande)}>
                                <FaDownload /> Ticket
                              </Button>
                            )}
                            {affectations.find(a => a.id_commande === order.id_commande) && (
                              <Button size="sm" variant="outline-info" className="action-btn me-2" onClick={() => handleDownloadDeliveryNote(order.id_commande)}>
                                <FaDownload /> Bordereau
                              </Button>
                            )}
                            {order.statut === 'Livrée' && (
                              <Button size="sm" variant="outline-primary" className="action-btn" onClick={() => handleOpenReview(order)}>
                                <FaStar /> Avis
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton><Modal.Title>Laisser un avis</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Alert variant="info" className="mb-3">
              <strong>Commande #{selectedOrder.id_commande}</strong><br />
              Montant: {selectedOrder.total_xaf?.toLocaleString('fr-FR')} FCFA
            </Alert>
          )}
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'avis</Form.Label>
              <Form.Control as="select" value={reviewForm.type_avis} onChange={(e) => setReviewForm({ ...reviewForm, type_avis: e.target.value })}>
                <option value="produit">Avis sur le produit</option>
                <option value="livraison">Avis sur la livraison</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control as="select" value={reviewForm.note} onChange={(e) => setReviewForm({ ...reviewForm, note: Number(e.target.value) })}>
                <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                <option value={4}>⭐⭐⭐⭐ Très bon</option>
                <option value={3}>⭐⭐⭐ Bon</option>
                <option value={2}>⭐⭐ Moyen</option>
                <option value={1}>⭐ Médiocre</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Commentaire</Form.Label>
              <Form.Control as="textarea" rows={4} value={reviewForm.commentaire} onChange={(e) => setReviewForm({ ...reviewForm, commentaire: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="primary">Envoyer l'avis</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton><Modal.Title>Demande de remboursement</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedOrderForRefund && (
            <>
              <Alert variant="info">
                <strong>Politique de remboursement :</strong><br />
                L'entreprise ne rembourse généralement pas les clients en espèces. Lorsqu'un produit ne convient pas, plusieurs solutions peuvent être proposées :
                <ul>
                  <li>Remplacer l'article par un autre</li>
                  <li>Établir un avoir (crédit) pour un futur achat</li>
                </ul>
              </Alert>
              <p><strong>Commande :</strong> #{selectedOrderForRefund.id_commande}</p>
              <p><strong>Montant total :</strong> {selectedOrderForRefund.total_xaf?.toLocaleString('fr-FR')} FCFA</p>
              <hr />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Type de demande</Form.Label>
                  <Form.Control as="select" value={refundForm.type_demande} onChange={(e) => setRefundForm({ ...refundForm, type_demande: e.target.value })}>
                    <option value="avoir">Avoir (crédit pour futur achat)</option>
                    <option value="remplacement">Remplacement de l'article</option>
                    <option value="remboursement">Remboursement (en espèces)</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Raison de la demande</Form.Label>
                  <Form.Control as="textarea" rows={3} value={refundForm.raison} onChange={(e) => setRefundForm({ ...refundForm, raison: e.target.value })} required placeholder="Veuillez indiquer la raison de votre demande..." />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description détaillée</Form.Label>
                  <Form.Control as="textarea" rows={3} value={refundForm.description} onChange={(e) => setRefundForm({ ...refundForm, description: e.target.value })} placeholder="Décrivez votre problème en détail..." />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleConfirmRefund}>Envoyer la demande</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
