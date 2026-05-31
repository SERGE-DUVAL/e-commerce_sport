import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBolt, FaChartLine, FaCreditCard, FaDumbbell, FaRobot, FaShieldAlt, FaShippingFast, FaStar, FaMapMarkerAlt, FaCloudSun, FaTruck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { deliveryAPI } from '../api/delivery';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      console.log('Weather response:', response.data);
      setWeather(response.data || null);
    } catch (error) {
      console.error('Erreur lors du chargement de la météo:', error);
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  const loadLivreurs = async () => {
    setLoadingLivreurs(true);
    try {
      const response = await deliveryAPI.getAllLivreurs();
      console.log('Livreurs response:', response.data);
      setLivreurs(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des livreurs:', error);
      setLivreurs([]);
    } finally {
      setLoadingLivreurs(false);
    }
  };
  const categories = [
    {
      title: t('home_category_football_title'),
      text: t('home_category_football_text'),
      icon: '⚽',
      image: '/images2/Foot2.jfif'
    },
    {
      title: t('home_category_running_title'),
      text: t('home_category_running_text'),
      icon: '🏃',
      image: '/images2/running.jfif'
    },
    {
      title: t('home_category_fitness_title'),
      text: t('home_category_fitness_text'),
      icon: '🏋️',
      image: '/images2/Fitness1.jfif'
    },
    {
      title: t('home_category_tennis_title'),
      text: t('home_category_tennis_text'),
      icon: '🎾',
      image: '/images2/tennis2.jfif'
    },
    {
      title: t('home_category_basketball_title'),
      text: t('home_category_basketball_text'),
      icon: '🏀',
      image: '/images2/basketball.jfif'
    },
    {
      title: t('home_category_cycling_title'),
      text: t('home_category_cycling_text'),
      icon: '🚴',
      image: '/images2/cyclisme1.jfif'
    },
    {
      title: t('home_category_swimming_title'),
      text: t('home_category_swimming_text'),
      icon: '🏊',
      image: '/images2/Natation.jfif'
    },
    {
      title: t('home_category_boxing_title'),
      text: t('home_category_boxing_text'),
      icon: '🥊',
      image: '/images2/Boxe.jfif'
    }
  ];

  const features = [
    { icon: <FaCreditCard />, title: t('home_feature_payment_title'), text: t('home_feature_payment_text') },
    { icon: <FaRobot />, title: t('home_feature_ai_title'), text: t('home_feature_ai_text') },
    { icon: <FaStar />, title: t('home_feature_reviews_title'), text: t('home_feature_reviews_text') },
    { icon: <FaChartLine />, title: t('home_feature_backoffice_title'), text: t('home_feature_backoffice_text') }
  ];

  return (
    <div className="landing-page">
      <section className="hero-pro">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-copy">
              <span className="eyebrow"><FaBolt /> {t('home_eyebrow')}</span>
              <h1>Sport-Equip transforme l’achat d’équipements sportifs en expérience premium.</h1>
              <p>
                {t('home_hero_subtitle')}
              </p>
              <div className="hero-actions">
                <Button as={Link} to="/connexion" className="btn-neon" size="lg" disabled={!!user}>
                  {user ? t('home_hero_btn_logged') : t('home_hero_btn_login')}
                </Button>
                <Button as={Link} to="/catalogue" variant="outline-light" size="lg" className="btn-glass">
                  {t('home_hero_btn_catalog')}
                </Button>
              </div>
              <div className="hero-metrics">
                <div><strong>20+</strong><span>{t('home_metric_articles')}</span></div>
                <div><strong>XAF</strong><span>{t('home_metric_price')}</span></div>
                <div><strong>IA</strong><span>{t('home_metric_ai')}</span></div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="sport-3d-stage">
                <div className="orbit-ring orbit-one" />
                <div className="orbit-ring orbit-two" />
                <div className="sport-card-3d main-card">
                  <div className="shoe-shape">👟</div>
                  <h3>{t('home_card_title')}</h3>
                  <p>{t('home_card_text')}</p>
                </div>
                <div className="floating-chip chip-one"><FaShippingFast /> {t('home_chip_delivery')}</div>
                <div className="floating-chip chip-two"><FaShieldAlt /> {t('home_chip_payment')}</div>
                <div className="floating-chip chip-three"><FaDumbbell /> {t('home_chip_stock')}</div>
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
                <span>{t('home_showcase_badge')}</span>
                <h2>{t('home_showcase_title')}</h2>
                <p>{t('home_showcase_subtitle')}</p>
              </div>
            </Col>
            <Col lg={5}>
              <Row className="g-4 h-100">
                <Col sm={6}>
                  <div className="showcase-small showcase-foot">{t('home_football')}</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-run">{t('home_running')}</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-fit">{t('home_fitness')}</div>
                </Col>
                <Col sm={6}>
                  <div className="showcase-small showcase-bike">{t('home_cycling')}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="info-section">
        <Container>
          <div className="section-heading">
            <span>{t('home_section_why')}</span>
            <h2>{t('home_section_why_title')}</h2>
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
            <span>{t('home_weather_title')}</span>
            <h2>{t('home_weather_subtitle')}</h2>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="feature-card weather-card h-100">
                <Card.Body>
                  <div className="weather-icon-wrapper">
                    <div className="feature-icon weather-icon"><FaCloudSun /></div>
                  </div>
                  <div className="weather-header">
                    <Card.Title style={{ color: '#333' }}>{t('home_weather_card_title')}</Card.Title>
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
                      <div className="weather-condition">{weather.condition || t('home_weather_sunny')}</div>
                      <div className="weather-details">
                        <div className="weather-detail">
                          <span className="detail-label">{t('home_weather_humidity')}</span>
                          <span className="detail-value">{weather.humidity || '65'}%</span>
                        </div>
                        <div className="weather-detail">
                          <span className="detail-label">{t('home_weather_wind')}</span>
                          <span className="detail-value">{weather.wind || '12'} km/h</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#333' }}>{t('home_weather_not_available')}</p>
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
                  <Card.Title>{t('home_delivery_title')}</Card.Title>
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
                      <p className="delivery-label">{t('home_delivery_title')}</p>
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
                                  {livreur.vehicule} - {livreur.statut === 'disponible' ? t('home_delivery_status_available') : t('home_delivery_status_busy')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">{t('home_delivery_none')}</p>
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
                  <Card.Title style={{ color: '#333' }}>{t('home_gps_title')}</Card.Title>
                  <Card.Text className="feature-description">
                    {t('home_gps_text')}
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
                  <Card.Title>{t('home_forecast_title')}</Card.Title>
                  <Card.Text className="feature-description">
                    {t('home_forecast_text')}
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
            <span>{t('home_categories_title')}</span>
            <h2>{t('home_categories_subtitle')}</h2>
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
                      {t('home_category_explore')}
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
                  <span>{t('home_process_title')}</span>
                  <h2>{t('home_process_subtitle')}</h2>
                  <p>
                    {t('home_process_text')}
                  </p>
                  <Button as={Link} to="/connexion" className="btn-neon">
                    {t('home_process_btn')}
                  </Button>
                </div>
              </Col>
              <Col lg={7}>
                <div className="timeline-pro">
                  <div><strong>01</strong><span>{t('home_process_step1')}</span></div>
                  <div><strong>02</strong><span>{t('home_process_step2')}</span></div>
                  <div><strong>03</strong><span>{t('home_process_step3')}</span></div>
                  <div><strong>04</strong><span>{t('home_process_step4')}</span></div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)}>
        <Modal.Header closeButton><Modal.Title><FaRobot /> {t('home_help_title')}</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>{t('home_help_question')}</h5>
          <ol>
            <li>{t('home_help_step1')}</li>
            <li>{t('home_help_step2')}</li>
            <li>{t('home_help_step3')}</li>
            <li>{t('home_help_step4')}</li>
            <li>{t('home_help_step5')}</li>
          </ol>
          <p className="mt-3">{t('home_help_assistance')}</p>
        </Modal.Body>
      </Modal>

      <Modal show={showPrivacyModal} onHide={() => setShowPrivacyModal(false)}>
        <Modal.Header closeButton><Modal.Title><FaShieldAlt /> {t('home_privacy_title')}</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>{t('home_privacy_subtitle')}</h5>
          <p>{t('home_privacy_intro')}</p>
          <ul>
            <li>{t('home_privacy_point1')}</li>
            <li>{t('home_privacy_point2')}</li>
            <li>{t('home_privacy_point3')}</li>
            <li>{t('home_privacy_point4')}</li>
            <li>{t('home_privacy_point5')}</li>
          </ul>
          <p className="mt-3">{t('home_privacy_note')}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
