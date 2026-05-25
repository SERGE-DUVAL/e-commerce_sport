import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBolt, FaChartLine, FaCreditCard, FaDumbbell, FaRobot, FaShieldAlt, FaShippingFast, FaStar } from 'react-icons/fa';

const Home = () => {
  const categories = [
    {
      title: 'Football',
      text: 'Maillots, crampons, ballons et accessoires de performance.',
      icon: '⚽',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Running',
      text: 'Chaussures, textiles respirants, montres et équipements cardio.',
      icon: '🏃',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Fitness',
      text: 'Haltères, tapis, élastiques et matériel de renforcement.',
      icon: '🏋️',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Tennis',
      text: 'Raquettes, balles, sacs et accessoires pour progresser.',
      icon: '🎾',
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Basketball',
      text: 'Chaussures montantes, ballons, jerseys et protections.',
      icon: '🏀',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Cyclisme',
      text: 'Casques, gants, gourdes, maillots et accessoires vélo.',
      icon: '🚴',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Natation',
      text: 'Lunettes, bonnets, maillots et équipements aquatiques.',
      icon: '🏊',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Boxe',
      text: 'Gants, bandages, sacs de frappe et protections.',
      icon: '🥊',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80'
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
                <Button as={Link} to="/connexion" className="btn-neon" size="lg">
                  Réservé à la connexion
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
    </div>
  );
};

export default Home;
