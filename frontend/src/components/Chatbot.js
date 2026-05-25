import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { chatbotAPI } from '../services/api';

const Chatbot = ({ show, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour ! Je suis l\'assistant Sport-Equip. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await chatbotAPI.chat({ message: userMessage });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Désolé, une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="chatbot-window active">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <span><FaRobot /> Assistant Sport-Equip</span>
        <Button variant="link" className="text-white p-0" onClick={onClose}>
          <FaTimes />
        </Button>
      </Card.Header>
      <Card.Body className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}>
            <div className={`d-inline-block p-2 rounded ${
              msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'
            }`} style={{ maxWidth: '80%' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-start">
            <div className="d-inline-block p-2 rounded bg-light">
              <em>En train d'écrire...</em>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card.Body>
      <Card.Footer className="chatbot-input">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading}>
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </div>
  );
};

export default Chatbot;
