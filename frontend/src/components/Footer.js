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
                <li><a href="/catalogue">Catalogue</a></li>
                <li><button type="button" onClick={() => setShowAbout(true)}>À propos</button></li>
                <li><button type="button" onClick={() => setShowContact(true)}>Contact</button></li>
                <li><button type="button" onClick={() => setShowHelp(true)}><FaRobot /> Aide</button></li>
                <li><button type="button" onClick={() => setShowPrivacy(true)}><FaShieldAlt /> Politique de confidentialité</button></li>
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

      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>À propos de Sport-Equip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sport-Equip est une plateforme e-commerce dédiée aux équipements sportifs :
          Football, Running, Fitness, Tennis et Basketball. Elle intègre un catalogue dynamique,
          le paiement mobile, un programme de fidélité, un chatbot IA et un back-office administrateur.
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowAbout(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Adresse :</strong> Douala, Cameroun</p>
          <p><strong>Email :</strong> contact@sportequip.com</p>
          <p><strong>Téléphone :</strong> +237 600 000 000</p>
          <p><strong>Services :</strong> vente d'équipements sportifs, suivi de commandes, assistance client.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowContact(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHelp} onHide={() => setShowHelp(false)} centered>
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
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowHelp(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
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
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowPrivacy(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
