import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
// import Chatbot, { ChatbotButton } from './Chatbot';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/logo.svg';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount, cartAnimation } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const [showChatbot, setShowChatbot] = useState(false);
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
            <img src={logo} alt="Sport Equip Logo" width="60" height="60" className="me-3" style={{ filter: 'drop-shadow(0 4px 8px rgba(97, 244, 196, 0.4))' }} />
            <span style={{ background: 'linear-gradient(135deg, #61f4c4, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sport-Equip</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">{t('nav_home')}</Nav.Link>
              <Nav.Link as={Link} to="/catalogue">{t('nav_catalog')}</Nav.Link>
              {user?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin">{t('nav_admin')}</Nav.Link>
              )}
            </Nav>
            <Nav>
              <LanguageSelector />
              <span className={`role-pill role-${roleLabel.toLowerCase()}`}>
                <FaUserShield /> {roleLabel}
              </span>
              <Nav.Link as={Link} to="/panier" className={cartAnimation ? 'cart-animate' : ''}>
                <FaShoppingCart /> {t('nav_cart')}
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
                    <Dropdown.Item as={Link} to="/profil">{t('nav_profile')}</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>{t('nav_logout')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/connexion" className="nav-cta">{t('nav_login')}</Nav.Link>
                  <Nav.Link as={Link} to="/inscription">{t('nav_register')}</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Chatbot retiré ici: on le garde globalement dans App.jsx */}
    </>
  );
};

export default Header;
