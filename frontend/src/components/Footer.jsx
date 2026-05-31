import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaRobot, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="footer-pro mt-auto">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <h5><span className="brand-mark">SE</span> Sport-Equip</h5>
              <p>Boutique e-commerce d'équipements sportifs basée à Douala, Cameroun.</p>
              <p className="mt-2">Votre boutique e-commerce sportive intelligente</p>
            </Col>
            <Col md={4}>
              <h5>Liens utiles</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="/catalogue" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none', display: 'inline-block', padding: '4px 0' }}>Catalogue</a></li>
                <li><button type="button" onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', padding: '4px 0', fontSize: 'inherit', fontFamily: 'inherit' }}>À propos</button></li>
                <li><button type="button" onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', padding: '4px 0', fontSize: 'inherit', fontFamily: 'inherit' }}>Contact</button></li>
                <li><button type="button" onClick={() => setShowHelp(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', padding: '4px 0', fontSize: 'inherit', fontFamily: 'inherit' }}><FaRobot /> Aide</button></li>
                <li><button type="button" onClick={() => setShowPrivacy(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', padding: '4px 0', fontSize: 'inherit', fontFamily: 'inherit' }}><FaShieldAlt /> Politique de confidentialité</button></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact</h5>
              <p><strong>Email:</strong> contact@sportequip.com</p>
              <p><strong>Tél:</strong> +237 600 000 000</p>
              <p><strong>Adresse:</strong> Douala, Cameroun</p>
            </Col>
          </Row>
          <hr />
          <p className="text-center mb-0">&copy; 2026 Sport-Equip - Groupe 3. Tous droits réservés.</p>
        </Container>
      </footer>

      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered style={{ zIndex: 99999 }}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>
          <Modal.Title style={{ color: 'white', fontWeight: 700 }}>À propos de Sport-Equip</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8f9fa', color: '#333' }}>
          Sport-Equip est une plateforme e-commerce dédiée aux équipements sportifs :
          Football, Running, Fitness, Tennis et Basketball. Elle intègre un catalogue dynamique,
          le paiement mobile, un programme de fidélité, un chatbot IA et un back-office administrateur.
        </Modal.Body>
        <Modal.Footer style={{ background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <Button className="btn-neon" onClick={() => setShowAbout(false)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showContact} onHide={() => setShowContact(false)} centered style={{ zIndex: 99999 }}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>
          <Modal.Title style={{ color: 'white', fontWeight: 700 }}>Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8f9fa', color: '#1e293b !important' }}>
          <p style={{ color: '#1e293b !important' }}><strong>Adresse :</strong> Douala, Cameroun</p>
          <p style={{ color: '#1e293b !important' }}><strong>Email :</strong> contact@sportequip.com</p>
          <p style={{ color: '#1e293b !important' }}><strong>Téléphone :</strong> +237 600 000 000</p>
          <p style={{ color: '#1e293b !important' }}><strong>Services :</strong> vente d'équipements sportifs, suivi de commandes, assistance client.</p>
        </Modal.Body>
        <Modal.Footer style={{ background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <Button className="btn-neon" onClick={() => setShowContact(false)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHelp} onHide={() => setShowHelp(false)} centered style={{ zIndex: 99999 }}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}><Modal.Title style={{ color: 'white', fontWeight: 700 }}><FaRobot /> Aide et guide visiteur</Modal.Title></Modal.Header>
        <Modal.Body style={{ background: '#f8f9fa', color: '#333' }}>
          <h5 style={{ color: '#333' }}>Comment utiliser Sport-Equip ?</h5>
          <ol>
            <li>Parcourez le catalogue et filtrez par catégorie</li>
            <li>Ajoutez vos articles au panier</li>
            <li>Connectez-vous pour commander</li>
            <li>Payez via Mobile Money (Switch, Orange Money, MTN MoMo)</li>
            <li>Suivez vos colis depuis votre profil</li>
          </ol>
          <p className="mt-3">Pour toute assistance, utilisez le chatbot IA disponible sur le site.</p>
        </Modal.Body>
        <Modal.Footer style={{ background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <Button className="btn-neon" onClick={() => setShowHelp(false)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered style={{ zIndex: 99999 }}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}><Modal.Title style={{ color: 'white', fontWeight: 700 }}><FaShieldAlt /> Politique de confidentialité</Modal.Title></Modal.Header>
        <Modal.Body style={{ background: '#f8f9fa', color: '#333' }}>
          <h5 style={{ color: '#333' }}>Protection de vos données</h5>
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
        <Modal.Footer style={{ background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <Button className="btn-neon" onClick={() => setShowPrivacy(false)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
