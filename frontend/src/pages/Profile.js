import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI, orderAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse_livraison: ''
  });
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(null);

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
    window.location.href = '/';
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
    <Container className="py-4">
      <h1 className="mb-4">Mon Profil</h1>

      {message && <Alert variant="success">{message}</Alert>}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h4>Informations personnelles</h4>
              {!editing ? (
                <>
                  <p><strong>Nom:</strong> {user.nom}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Adresse:</strong> {user.adresse_livraison || 'Non renseignée'}</p>
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    Modifier
                  </Button>
                </>
              ) : (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse de livraison</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.adresse_livraison}
                      onChange={(e) => setFormData({ ...formData, adresse_livraison: e.target.value })}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="me-2">
                    Enregistrer
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Annuler
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h4>Points de fidélité</h4>
              {points ? (
                <>
                  <p className="display-4 text-primary">{points.points_fidelite}</p>
                  <p className="text-muted">Valeur: {formatPrice(points.valeur_fcfa)} FCFA</p>
                  <small className="text-muted">10 points = 1 FCFA de réduction</small>
                </>
              ) : (
                <p>Chargement...</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Button variant="danger" className="w-100" onClick={handleLogout}>
                Déconnexion
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h4>Mes Commandes</h4>
              {loading ? (
                <p>Chargement...</p>
              ) : orders.length === 0 ? (
                <p>Aucune commande</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Commande #</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id_commande}>
                        <td>#{order.id_commande}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{formatPrice(order.total_xaf)} FCFA</td>
                        <td>
                          <span className={`badge ${
                            order.statut === 'Livrée' ? 'bg-success' :
                            order.statut === 'Payée' ? 'bg-primary' :
                            order.statut === 'Annulée' ? 'bg-danger' : 'bg-warning'
                          }`}>
                            {order.statut}
                          </span>
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
    </Container>
  );
};

export default Profile;
