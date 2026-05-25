import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, productAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Forms
  const [newPromo, setNewPromo] = useState({
    code: '',
    pourcentage_remise: 10,
    est_active: true,
    date_expiration: ''
  });
  
  const [newProduct, setNewProduct] = useState({
    titre: '',
    description: '',
    categorie: 'Football',
    prix_xaf: 0,
    stock: 0,
    variantes: { tailles: [], couleurs: [] }
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes, clientsRes, promosRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders(),
        adminAPI.getAllClients(),
        adminAPI.getAllPromotions()
      ]);
      
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setClients(clientsRes.data);
      setPromotions(promosRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPromotion(newPromo);
      setShowPromoModal(false);
      setNewPromo({
        code: '',
        pourcentage_remise: 10,
        est_active: true,
        date_expiration: ''
      });
      loadData();
    } catch (error) {
      alert('Erreur lors de la création de la promotion');
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Supprimer cette promotion ?')) return;
    try {
      await adminAPI.deletePromotion(id);
      loadData();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateOrderStatus = async (orderId, statut) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { statut });
      loadData();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.create(newProduct);
      setShowProductModal(false);
      setNewProduct({
        titre: '',
        description: '',
        categorie: 'Football',
        prix_xaf: 0,
        stock: 0,
        variantes: { tailles: [], couleurs: [] }
      });
      loadData();
    } catch (error) {
      alert('Erreur lors de la création du produit');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await adminAPI.exportPDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport_ventes.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Erreur lors de l\'export PDF');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await adminAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ventes.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Erreur lors de l\'export CSV');
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('fr-FR') || '0';
  };

  if (loading) {
    return <Container className="py-5"><p>Chargement...</p></Container>;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Back-Office Administrateur</h1>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{formatPrice(stats?.totalRevenus)} FCFA</h3>
              <p className="text-muted">Total Revenus</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats?.totalCommandes}</h3>
              <p className="text-muted">Commandes Payées</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats?.totalClients}</h3>
              <p className="text-muted">Clients Inscrits</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats?.produitsEnStock}</h3>
              <p className="text-muted">Produits en Stock</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="commandes" className="mb-3">
        {/* Tab Commandes */}
        <Tab eventKey="commandes" title="Commandes">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h4>Gestion des Commandes</h4>
                <div>
                  <Button variant="success" className="me-2" onClick={handleExportPDF}>
                    Export PDF
                  </Button>
                  <Button variant="primary" onClick={handleExportCSV}>
                    Export CSV
                  </Button>
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paiement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id_commande}>
                      <td>{order.id_commande}</td>
                      <td>{order.Utilisateur?.nom}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>{formatPrice(order.total_xaf)} FCFA</td>
                      <td>{order.moyen_paiement}</td>
                      <td>
                        <span className={`badge ${
                          order.statut === 'Livrée' ? 'bg-success' :
                          order.statut === 'Payée' ? 'bg-primary' :
                          order.statut === 'Annulée' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {order.statut}
                        </span>
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={order.statut}
                          onChange={(e) => handleUpdateOrderStatus(order.id_commande, e.target.value)}
                          style={{ width: '120px' }}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Payée">Payée</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab Clients */}
        <Tab eventKey="clients" title="Clients">
          <Card>
            <Card.Body>
              <h4>Liste des Clients</h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Points Fidélité</th>
                    <th>Adresse</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id_utilisateur}>
                      <td>{client.nom}</td>
                      <td>{client.email}</td>
                      <td>{client.points_fidelite}</td>
                      <td>{client.adresse_livraison || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab Promotions */}
        <Tab eventKey="promotions" title="Promotions">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h4>Gestion des Promotions</h4>
                <Button variant="primary" onClick={() => setShowPromoModal(true)}>
                  Nouvelle Promotion
                </Button>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Remise</th>
                    <th>Expiration</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promo) => (
                    <tr key={promo.id_promotion}>
                      <td><strong>{promo.code}</strong></td>
                      <td>{promo.pourcentage_remise}%</td>
                      <td>{new Date(promo.date_expiration).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <span className={`badge ${promo.est_active ? 'bg-success' : 'bg-secondary'}`}>
                          {promo.est_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeletePromotion(promo.id_promotion)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab Produits */}
        <Tab eventKey="produits" title="Produits">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h4>Gestion du Catalogue</h4>
                <Button variant="primary" onClick={() => setShowProductModal(true)}>
                  Nouveau Produit
                </Button>
              </div>
              <p className="text-muted">
                Utilisez l'endpoint API /api/products pour la gestion complète CRUD des produits.
              </p>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal Promotion */}
      <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePromotion}>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={newPromo.code}
                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                required
                placeholder="Ex: KEYCE20"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pourcentage de remise (%)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="100"
                value={newPromo.pourcentage_remise}
                onChange={(e) => setNewPromo({ ...newPromo, pourcentage_remise: parseInt(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date d'expiration</Form.Label>
              <Form.Control
                type="date"
                value={newPromo.date_expiration}
                onChange={(e) => setNewPromo({ ...newPromo, date_expiration: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Créer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Produit */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nouveau Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.titre}
                onChange={(e) => setNewProduct({ ...newProduct, titre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select
                    value={newProduct.categorie}
                    onChange={(e) => setNewProduct({ ...newProduct, categorie: e.target.value })}
                  >
                    <option value="Football">Football</option>
                    <option value="Running">Running</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Basketball">Basketball</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix (FCFA)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.prix_xaf}
                    onChange={(e) => setNewProduct({ ...newProduct, prix_xaf: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Créer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
