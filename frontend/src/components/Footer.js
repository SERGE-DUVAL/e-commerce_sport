import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer className="footer-pro mt-auto">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <h5><span className="brand-mark">SE</span> Sport-Equip</h5>
              <p>Boutique e-commerce d’équipements sportifs basée à Douala, Cameroun.</p>
            </Col>
            <Col md={4}>
              <h5>Liens utiles</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="/catalogue">Catalogue</a></li>
                <li><button type="button" onClick={() => setShowAbout(true)}>À propos</button></li>
                <li><button type="button" onClick={() => setShowContact(true)}>Contact</button></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact</h5>
              <p>Email: contact@sportequip.com</p>
              <p>Tél: +237 600 000 000</p>
              <p>Douala, Cameroun</p>
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
          <p><strong>Services :</strong> vente d’équipements sportifs, suivi de commandes, assistance client.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-neon" onClick={() => setShowContact(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
