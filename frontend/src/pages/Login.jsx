import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleInitialized = useRef(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.utilisateur, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await authAPI.googleAuth({ idToken: credentialResponse.credential });
      login(response.data.utilisateur, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la connexion Google');
    }
  };

  useEffect(() => {
    // Prevent multiple initialization
    if (googleInitialized.current) {
      return;
    }

    // Check if Google script is already loaded
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        callback: handleGoogleLogin,
        locale: 'fr'
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', locale: 'fr' }
      );
      googleInitialized.current = true;
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        callback: handleGoogleLogin,
        locale: 'fr'
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', locale: 'fr' }
      );
      googleInitialized.current = true;
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <Card.Body style={{ color: '#333' }}>
              <h2 className="text-center mb-4" style={{ color: '#333' }}>Connexion</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#333' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#333' }}>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </Form>

              <div className="text-center my-3">
                <span style={{ color: '#666' }}>ou</span>
              </div>

              <div className="text-center">
                <div id="google-signin-button"></div>
              </div>

              <p className="text-center mt-3" style={{ color: '#333' }}>
                Pas encore de compte ? <Link to="/inscription" style={{ color: '#667eea', textDecoration: 'none' }}>S'inscrire</Link>
              </p>
              <p className="text-center">
                <Link to="/mot-de-passe-oublie" style={{ color: '#667eea', textDecoration: 'none' }}>Mot de passe oublié ?</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
