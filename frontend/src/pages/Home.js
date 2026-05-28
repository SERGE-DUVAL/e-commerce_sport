import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBolt, FaChartLine, FaCreditCard, FaDumbbell, FaRobot, FaShieldAlt, FaShippingFast, FaStar, FaMapMarkerAlt, FaCloudSun, FaTruck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { deliveryAPI } from '../api/delivery';

const Home = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [livreurs, setLivreurs] = useState([]);
  const [loadingLivreurs, setLoadingLivreurs] = useState(false);
  const [selectedCity, setSelectedCity] = useState('yaounde');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Coordonnées des villes
  const cities = {
    yaounde: { lat: 3.8488, lon: 11.5028, name: 'Yaoundé' },
    douala: { lat: 4.0483, lon: 9.7043, name: 'Douala' }
  };

  useEffect(() => {
    loadWeather();
    loadLivreurs();
  }, [selectedCity]);

  const loadWeather = async () => {
    setLoadingWeather(true);
    try {
      const city = cities[selectedCity];
      const response = await deliveryAPI.getWeather(city.lat, city.lon);
      setWeather(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la météo:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const loadLivreurs = async () => {
    setLoadingLivreurs(true);
    try {
      const response = await deliveryAPI.getAllLivreurs();
      setLivreurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des livreurs:', error);
    } finally {
      setLoadingLivreurs(false);
    }
  };
  const categories = [
    {
      title: 'Football',
      text: 'Maillots, crampons, ballons et accessoires de performance.',
      icon: '⚽',
      image: '/images2/Foot2.jfif'
    },
    {
      title: 'Running',
      text: 'Chaussures, textiles respirants, montres et équipements cardio.',
      icon: '🏃',
      image: '/images2/running.jfif'
    },
    {
      title: 'Fitness',
      text: 'Haltères, tapis, élastiques et matériel de renforcement.',
      icon: '🏋️',
      image: '/images2/Fitness1.jfif'
    },
    {
      title: 'Tennis',
      text: 'Raquettes, balles, sacs et accessoires pour progresser.',
      icon: '🎾',
      image: '/images2/tennis2.jfif'
    },
    {
      title: 'Basketball',
      text: 'Chaussures montantes, ballons, jerseys et protections.',
      icon: '🏀',
      image: '/images2/basketball.jfif'
    },
    {
      title: 'Cyclisme',
      text: 'Casques, gants, gourdes, maillots et accessoires vélo.',
      icon: '🚴',
      image: '/images2/cyclisme1.jfif'
    },
    {
      title: 'Natation',
      text: 'Lunettes, bonnets, maillots et équipements aquatiques.',
      icon: '🏊',
      image: '/images2/Natation.jfif'
    },
    {
      title: 'Boxe',
      text: 'Gants, bandages, sacs de frappe et protections.',
      icon: '🥊',
      image: '/images2/Boxe.jfif'
    }
  ];

  const features = [
    { icon: <FaCreditCard />, title: 'Paiement Mobile', text: 'Paiement local via Switch, Orange Money et MTN MoMo.' },
    { icon: <FaRobot />, title: 'Assistant IA', text: 'Chatbot connecté à la base pour les stocks et commandes.' },
    { icon: <FaStar />, title: 'Avis certifiés', text: 'Notes vérifiées uniquement après commande livrée.' },
    { icon: <FaChartLine />, title: 'Back-office', text: 'Statistiques, ventes, clients, promotions, PDF et CSV.' }
  ];

  return (
    <div className="landing-page">
      <section className="hero-pro">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-copy">
              <span className="eyebrow"><FaBolt /> Plateforme e-commerce sportive intelligente</span>
              <h1>Sport-Equip transforme l’achat d’équipements sportifs en expérience premium.</h1>
              <p>
                Découvrez une boutique moderne dédiée au Football, Running, Fitness, Tennis et Basketball,
                avec paiement mobile local, fidélité, avis certifiés et assistant IA connecté.
              </p>
              <div className="hero-actions">
                <Button as={Link} to="/connexion" className="btn-neon" size="lg" disabled={!!user}>
                  {user ? 'Déjà connecté' : 'Réservé à la connexion'}
                </Button>
                <Button as={Link} to="/catalogue" variant="outline-light" size="lg" className="btn-glass">
                  Voir le catalogue
                </Button>
              </div>
              <div className="hero-metrics">
                <div><strong>20+</strong><span>articles initiaux</span></div>
                <div><strong>XAF</strong><span>prix en FCFA</span></div>
                <div><strong>IA</strong><span>assistant client</span></div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="sport-3d-stage">
                <div className="orbit-ring orbit-one" />
                <div className="orbit-ring orbit-two" />
                <div className="sport-card-3d main-card">
                  <div className="shoe-shape">👟</div>
                  <h3>Performance Gear</h3>
                  <p>Chaussures, maillots, accessoires et équipements sportifs professionnels.</p>
                </div>
                <div className="floating-chip chip-one"><FaShippingFast /> Livraison rapide</div>
                <div className="floating-chip chip-two"><FaShieldAlt /> Paiement sécurisé</div>
                <div className="floating-chip chip-three"><FaDumbbell /> Stock réel</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="visual-showcase">
        <Container>
          <Row className="g-4 align-items-stretch">
            <Col lg={7}>
              <div className="showcase-large">
                <span>Collection premium</span>
                <h2>Dépassez vos limites avec des équipements fiables.</h2>
                <p>Une vitrine sportive conçue pour inspirer, vendre et fidéliser.</p>
              </div>
            </Col>
            <Col lg={5}>
              <Row className="g-4 h-100">
                <Col sm={6}>
                  <div className="showcase-small showcase-foot">Football Pro</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-run">Running Elite</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-fit">Fitness Club</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-bike">Cyclisme</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="info-section">
        <Container>
          <div className="section-heading">
            <span>Pourquoi Sport-Equip ?</span>
            <h2>Une plateforme conçue pour vendre, gérer et fidéliser.</h2>
            <p>
              Le site combine une vitrine e-commerce, une logique de paiement local, un système de fidélité,
              un chatbot intelligent et une console d’administration complète.
            </p>
          </div>
          <Row className="g-4">
            {features.map((feature) => (
              <Col md={6} lg={3} key={feature.title}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="weather-gps-section">
        <Container>
          <div className="section-heading">
            <span>Services de livraison intelligente</span>
            <h2>Suivez la météo et la disponibilité des livreurs en temps réel avec suivi GPS intégré.</h2>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="feature-card weather-card h-100">
                <Card.Body>
                  <div className="weather-icon-wrapper">
                    <div className="feature-icon weather-icon"><FaCloudSun /></div>
                  </div>
                  <div className="weather-header">
                    <Card.Title>Météo</Card.Title>
                    <Form.Select size="sm" className="city-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                      <option value="yaounde">Yaoundé</option>
                      <option value="douala">Douala</option>
                    </Form.Select>
                  </div>
                  {loadingWeather ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : weather ? (
                    <div className="weather-data">
                      <div className="weather-temp">
                        <span className="temp-value">{weather.temperature || '28'}</span>
                        <span className="temp-unit">°C</span>
                      </div>
                      <div className="weather-condition">{weather.condition || 'Ensoleillé'}</div>
                      <div className="weather-details">
                        <div className="weather-detail">
                          <span className="detail-label">Humidité</span>
                          <span className="detail-value">{weather.humidity || '65'}%</span>
                        </div>
                        <div className="weather-detail">
                          <span className="detail-label">Vent</span>
                          <span className="detail-value">{weather.wind || '12'} km/h</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">Météo non disponible</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card delivery-card h-100">
                <Card.Body>
                  <div className="delivery-icon-wrapper">
                    <div className="feature-icon delivery-icon"><FaTruck /></div>
                  </div>
                  <Card.Title>Livreurs disponibles</Card.Title>
                  {loadingLivreurs ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : livreurs.length > 0 ? (
                    <div>
                      <div className="delivery-count">
                        <span className="count-value">{livreurs.filter(l => l.statut === 'disponible').length}</span>
                        <span className="count-total">/ {livreurs.length}</span>
                      </div>
                      <p className="delivery-label">Livreurs disponibles</p>
                      <div className="livreurs-list">
                        {livreurs.slice(0, 3).map(livreur => (
                          <div key={livreur.id_livreur} className="livreur-item">
                            <div className="livreur-icon">
                              <FaMapMarkerAlt />
                            </div>
                            <div className="livreur-info">
                              <div className="livreur-name">{livreur.nom} {livreur.prenom}</div>
                              <div className="livreur-status">
                                <span className={`status-badge ${livreur.statut === 'disponible' ? 'status-available' : 'status-busy'}`}>
                                  {livreur.vehicule} - {livreur.statut === 'disponible' ? 'Disponible' : 'En livraison'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">Aucun livreur disponible</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card gps-card h-100">
                <Card.Body>
                  <div className="gps-icon-wrapper">
                    <div className="feature-icon gps-icon"><FaMapMarkerAlt /></div>
                  </div>
                  <Card.Title>Suivi GPS en temps réel</Card.Title>
                  <Card.Text className="feature-description">
                    Localisez vos livraisons en temps réel grâce à notre système de suivi GPS intégré.
                    Les livreurs sont géolocalisés pour une meilleure visibilité sur votre commande.
                  </Card.Text>
                  <div className="feature-visual">
                    <div className="gps-pulse"></div>
                    <div className="gps-pulse gps-pulse-2"></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="feature-card forecast-card h-100">
                <Card.Body>
                  <div className="forecast-icon-wrapper">
                    <div className="feature-icon forecast-icon"><FaCloudSun /></div>
                  </div>
                  <Card.Title>Prévisions météo</Card.Title>
                  <Card.Text className="feature-description">
                    Consultez les conditions météo pour optimiser vos livraisons.
                    Notre système intègre les données météo pour planifier les tournées et éviter les intempéries.
                  </Card.Text>
                  <div className="feature-visual">
                    <div className="weather-pulse"></div>
                    <div className="weather-pulse weather-pulse-2"></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="categories-pro">
        <Container>
          <div className="section-heading">
            <span>Univers sportifs</span>
            <h2>Des catégories pensées pour les athlètes et passionnés.</h2>
          </div>
          <Row className="g-4">
            {categories.map((cat) => (
              <Col md={6} lg={3} key={cat.title}>
                <Card className="category-3d-card h-100">
                  <div className="category-photo" style={{ backgroundImage: `url(${cat.image})` }} />
                <Card.Body>
                    <div className="category-icon">{cat.icon}</div>
                    <Card.Title>{cat.title}</Card.Title>
                    <Card.Text>{cat.text}</Card.Text>
                    <Button as={Link} to={`/catalogue?categorie=${cat.title}`} variant="outline-light">
                      Explorer
                    </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </Container>
      </section>

      {!user && (
        <section className="process-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={5}>
                <div className="section-heading text-start">
                  <span>Parcours utilisateur</span>
                  <h2>Connectez-vous, achetez, payez et suivez vos commandes.</h2>
                  <p>
                    Après connexion, les clients accèdent à leur espace, panier, historique et points.
                    Les administrateurs sont redirigés vers le tableau de bord de gestion.
                  </p>
                  <Button as={Link} to="/connexion" className="btn-neon">
                    Accéder à mon espace
                  </Button>
                </div>
              </Col>
              <Col lg={7}>
                <div className="timeline-pro">
                  <div><strong>01</strong><span>Connexion sécurisée JWT</span></div>
                  <div><strong>02</strong><span>Choix des produits et variantes</span></div>
                  <div><strong>03</strong><span>Paiement Mobile Money via Switch</span></div>
                  <div><strong>04</strong><span>Points fidélité et suivi par IA</span></div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)}>
        <Modal.Header closeButton><Modal.Title><FaRobot /> Aide et guide visiteur</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>Comment utiliser Sport-Equip ?</h5>
          <ol>
            <li>Parcourez le catalogue et filtrez par catégorie</li>
            <li>Ajoutez vos articles au panier</li>
            <li>Connectez-vous pour commander</li>
            <li>Payez via Mobile Money (Switch, Orange Money, MTN MoMo)</li>
            <li>Suivez vos colis depuis votre profil</li>
          </ol>
          <p className="mt-3">Pour toute assistance, utilisez le chatbot IA disponible sur le site.</p>
        </Modal.Body>
      </Modal>

      <Modal show={showPrivacyModal} onHide={() => setShowPrivacyModal(false)}>
        <Modal.Header closeButton><Modal.Title><FaShieldAlt /> Politique de confidentialité</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>Protection de vos données</h5>
          <p>Vos informations servent uniquement à :</p>
          <ul>
            <li>Gérer votre compte utilisateur</li>
            <li>Traiter vos commandes</li>
            <li>Organiser la livraison</li>
            <li>Gérer les points fidélité</li>
            <li>Fournir une assistance personnalisée</li>
          </ul>
          <p className="mt-3">Les données sensibles ne sont jamais exposées publiquement. Nous utilisons une authentification sécurisée JWT pour protéger votre compte.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
