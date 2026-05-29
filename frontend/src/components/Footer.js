import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaRobot, FaShieldAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDumbbell } from 'react-icons/fa';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="footer-pro mt-auto">
        <Container>
          <Row className="g-5">
            <Col lg={4} md={6}>
              <div className="footer-brand">
                <div className="brand-mark">SE</div>
                <h4>Sport-Equip</h4>
                <p className="mt-3">
                  Votre destination premium pour l'équipement sportif en Afrique. 
                  Qualité professionnelle, livraison rapide et paiement mobile sécurisé.
                </p>
                <div className="footer-social mt-4">
                  <a href="#" className="social-link"><FaFacebookF /></a>
                  <a href="#" className="social-link"><FaTwitter /></a>
                  <a href="#" className="social-link"><FaInstagram /></a>
                  <a href="#" className="social-link"><FaLinkedinIn /></a>
                </div>
              </div>
            </Col>
            <Col lg={2} md={6}>
              <h5>Navigation</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="/">Accueil</a></li>
                <li><a href="/catalogue">Catalogue</a></li>
                <li><a href="/connexion">Connexion</a></li>
                <li><a href="/inscription">Inscription</a></li>
              </ul>
            </Col>
            <Col lg={2} md={6}>
              <h5>Catégories</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="/catalogue?categorie=Football">Football</a></li>
                <li><a href="/catalogue?categorie=Running">Running</a></li>
                <li><a href="/catalogue?categorie=Fitness">Fitness</a></li>
                <li><a href="/catalogue?categorie=Tennis">Tennis</a></li>
                <li><a href="/catalogue?categorie=Basketball">Basketball</a></li>
              </ul>
            </Col>
            <Col lg={2} md={6}>
              <h5>Support</h5>
              <ul className="list-unstyled footer-links">
                <li><button type="button" onClick={() => setShowAbout(true)}>À propos</button></li>
                <li><button type="button" onClick={() => setShowContact(true)}>Contact</button></li>
                <li><button type="button" onClick={() => setShowHelp(true)}><FaRobot /> Aide</button></li>
                <li><button type="button" onClick={() => setShowPrivacy(true)}><FaShieldAlt /> Confidentialité</button></li>
                <li><button type="button" onClick={() => setShowTerms(true)}>Conditions</button></li>
              </ul>
            </Col>
            <Col lg={2} md={6}>
              <h5>Contact</h5>
              <ul className="list-unstyled footer-contact">
                <li><FaMapMarkerAlt /> Douala, Cameroun</li>
                <li><FaPhone /> +237 600 000 000</li>
                <li><FaEnvelope /> contact@sportequip.com</li>
              </ul>
            </Col>
          </Row>
          <hr className="footer-divider" />
          <div className="footer-bottom">
            <p className="mb-0">&copy; 2026 Sport-Equip - Groupe 3. Tous droits réservés.</p>
            <div className="footer-badges">
              <span className="badge"><FaDumbbell /> Équipements Pro</span>
              <span className="badge"><FaShieldAlt /> Paiement Sécurisé</span>
            </div>
          </div>
        </Container>
      </footer>

      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>À propos de Sport-Equip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Notre mission</h5>
          <p>Sport-Equip est une plateforme e-commerce dédiée aux équipements sportifs professionnels en Afrique.</p>
          <p>Nous proposons une large gamme d'équipements pour le Football, Running, Fitness, Tennis et Basketball.</p>
          <h5 className="mt-4">Nos engagements</h5>
          <ul>
            <li>Équipements de haute qualité et durables</li>
            <li>Paiement mobile sécurisé (Switch, Orange Money, MTN MoMo)</li>
            <li>Livraison rapide avec suivi GPS en temps réel</li>
            <li>Programme de fidélité pour récompenser nos clients</li>
            <li>Assistant IA disponible 24/7 pour vous aider</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowAbout(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contactez-nous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Adresse :</strong> Douala, Cameroun</p>
          <p><strong>Email :</strong> contact@sportequip.com</p>
          <p><strong>Téléphone :</strong> +237 600 000 000</p>
          <p><strong>Heures d'ouverture :</strong> Lundi - Samedi, 8h - 18h</p>
          <p className="mt-3">Notre équipe est disponible pour répondre à toutes vos questions concernant nos produits, commandes et services.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowContact(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHelp} onHide={() => setShowHelp(false)} centered>
        <Modal.Header closeButton><Modal.Title><FaRobot /> Guide d'utilisation</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>Comment utiliser Sport-Equip ?</h5>
          <ol>
            <li>Parcourez notre catalogue et filtrez par catégorie</li>
            <li>Ajoutez vos articles préférés au panier</li>
            <li>Connectez-vous ou créez un compte pour commander</li>
            <li>Payez facilement via Mobile Money (Switch, Orange Money, MTN MoMo)</li>
            <li>Suivez vos livraisons en temps réel depuis votre profil</li>
            <li>Gagnez des points fidélité à chaque achat</li>
          </ol>
          <p className="mt-3">Pour toute assistance, utilisez notre chatbot IA disponible sur le site ou contactez notre support client.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowHelp(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
        <Modal.Header closeButton><Modal.Title><FaShieldAlt /> Politique de confidentialité</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>Protection de vos données</h5>
          <p>Vos informations personnelles sont utilisées uniquement pour :</p>
          <ul>
            <li>Gérer votre compte utilisateur et vos commandes</li>
            <li>Organiser la livraison de vos achats</li>
            <li>Gérer votre programme de fidélité</li>
            <li>Fournir une assistance personnalisée</li>
            <li>Améliorer nos services et produits</li>
          </ul>
          <p className="mt-3">Les données sensibles ne sont jamais partagées avec des tiers. Nous utilisons une authentification sécurisée JWT pour protéger votre compte.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowPrivacy(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conditions d'utilisation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Conditions générales de vente</h5>
          <p>En utilisant Sport-Equip, vous acceptez les conditions suivantes :</p>
          <ul>
            <li>Tous les prix sont en FCFA et incluent la TVA</li>
            <li>Les paiements sont sécurisés via Switch, Orange Money et MTN MoMo</li>
            <li>Les délais de livraison varient selon votre localisation</li>
            <li>Les retours sont acceptés sous 7 jours sous conditions</li>
            <li>Les points fidélité sont crédités après livraison confirmée</li>
          </ul>
          <p className="mt-3">Pour plus d'informations, contactez notre service client.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowTerms(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
