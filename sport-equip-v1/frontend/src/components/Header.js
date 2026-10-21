import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaRobot, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Chatbot from './Chatbot';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount, cartAnimation } = useCart();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const roleLabel = user ? (user.role === 'admin' ? 'Admin' : 'Client') : 'Visiteur';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="navbar-pro">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <div className="brand-mark">SE</div>
            <span style={{ background: 'linear-gradient(135deg, #4a90a4, #6c8ebf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sport-Equip</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/catalogue">Catalogue</Nav.Link>
              {user?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
            </Nav>
            <Nav>
              <span className={`role-pill role-${roleLabel.toLowerCase()}`}>
                <FaUserShield /> {roleLabel}
              </span>
              <Nav.Link as={Link} to="/panier" className={cartAnimation ? 'cart-animate' : ''}>
                <FaShoppingCart /> Panier
                {getCartCount() > 0 && (
                  <Badge bg="danger" className="ms-1">{getCartCount()}</Badge>
                )}
              </Nav.Link>
              
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle className="btn-glass">
                    <FaUser /> {user.nom}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profil">Mon Profil</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Déconnexion</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/connexion" className="nav-cta">Connexion</Nav.Link>
                  <Nav.Link as={Link} to="/inscription">Inscription</Nav.Link>
                </>
              )}

              {user && (
                <Nav.Link onClick={() => setShowChatbot(!showChatbot)}>
                  <FaRobot /> Assistant
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {user && <Chatbot show={showChatbot} onClose={() => setShowChatbot(false)} />}
    </>
  );
};

export default Header;
