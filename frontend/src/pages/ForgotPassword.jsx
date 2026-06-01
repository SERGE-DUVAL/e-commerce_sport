import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ForgotPassword form submitted with email:', email);
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      console.log('ForgotPassword response:', response);
      
      // En mode développement, afficher le token/URL de réinitialisation
      if (response.data?.resetToken) {
        const resetUrl = `${window.location.origin}/reset-password/${response.data.resetToken}`;
        setMessage(
          <div>
            <p>{response.data.message}</p>
            <div style={{ marginTop: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', wordBreak: 'break-all' }}>
              <strong>Token de réinitialisation (mode développement) :</strong>
              <br />
              <code>{response.data.resetToken}</code>
              <br />
              <a href={resetUrl} style={{ color: '#667eea', textDecoration: 'none' }}>
                Cliquez ici pour réinitialiser
              </a>
            </div>
          </div>
        );
      } else {
        setMessage(response.data?.message || response.message || 'Email de réinitialisation envoyé');
      }
      setEmail('');
    } catch (err) {
      console.error('ForgotPassword error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Card.Body style={{ color: '#333' }}>
          <h2 className="text-center mb-4" style={{ color: '#333' }}>Mot de passe oublié</h2>
          
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#333' }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </Form>

          <div className="text-center mt-3" style={{ color: '#333' }}>
            <Link to="/connexion" style={{ color: '#667eea', textDecoration: 'none' }}>
              Retour à la connexion
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
