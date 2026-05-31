
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaCommentDots,
  FaUser,
  FaCheck,
  FaCheckDouble,
  FaClock
} from 'react-icons/fa';

import { chatbotAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

import './Chatbot.css';

const Chatbot = () => {

  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const messagesEndRef = useRef(null);

  // Message de bienvenue
  useEffect(() => {
    const welcomeMessage = {
      sender: 'bot',
      text: t('chatbot_welcome'),
      timestamp: new Date(),
      status: 'delivered'
    };
    setMessages([welcomeMessage]);
  }, [i18n.language]);

  // Scroll automatique
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setShowQuickReplies(false);
  };

  const quickReplies = [
    t('quick_reply_products'),
    t('quick_reply_orders'),
    t('quick_reply_support'),
    t('quick_reply_prices')
  ].filter(reply => reply);

  // Envoyer message
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    // Ajouter message utilisateur
    const newUserMessage = {
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages(prev => [...prev, newUserMessage]);

    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {

      const response = await chatbotAPI.chat({
        message: userMessage
      });

      // Réponse erreur backend
      if (response.data.success === false) {
        const botMessage = {
          sender: 'bot',
          text: response.data.message || t('chatbot_error'),
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Réponse normale
        const botMessage = {
          sender: 'bot',
          text: response.data.response || t('chatbot_error'),
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, botMessage]);
      }

    } catch (error) {

      console.error('Erreur chatbot :', error);

      let errorMessage = t('chatbot_error');

      if (error.response?.data?.message) {

        errorMessage =
          error.response.data.message;

      } else if (
        error.message?.includes('Network Error') ||
        error.message?.includes('ERR_CONNECTION_REFUSED')
      ) {

        errorMessage =
          t('chatbot_network_error');

      }

      const errorBotMessage = {
        sender: 'bot',
        text: errorMessage,
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, errorBotMessage]);

    } finally {
      setLoading(false);
      setIsTyping(false);
      // Update user message status to read
      setMessages(prev => 
        prev.map(msg => 
          msg.sender === 'user' && msg.status === 'sent' 
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }

  };

  return (
    <>
      <button 
        className="chatbot-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </button>

      {isOpen && (
        <div className="chatbot-window active">
          <Card className="chatbot-window-card">
            <Card.Header className="chatbot-header">
              <div className="chatbot-header-content">
                <div className="chatbot-header-icon">
                  <FaRobot />
                </div>
                <div className="chatbot-header-text">
                  <h5>{t('chatbot_title')}</h5>
                  <div className="chatbot-header-status">
                    <span className="status-indicator"></span>
                    <span className="status-text">
                      {t('chatbot_online')}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="link"
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                <FaTimes />
              </Button>
            </Card.Header>

            <Card.Body className="chatbot-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === 'user'
                      ? 'user-message'
                      : 'bot-message'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="message-avatar bot-avatar">
                      <FaRobot />
                    </div>
                  )}
                  <div className="message-wrapper">
                    <div className="message-content">
                      {msg.text}
                    </div>
                    <div className="message-meta">
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.sender === 'user' && (
                        <span className={`message-status status-${msg.status}`}>
                          {msg.status === 'sent' && <FaCheck />}
                          {msg.status === 'delivered' && <FaCheckDouble />}
                          {msg.status === 'read' && (
                            <FaCheckDouble style={{ color: '#667eea' }} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="message-avatar user-avatar">
                      <FaUser />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message bot-message">
                  <div className="message-avatar bot-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-wrapper">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              <div ref={messagesEndRef} />
            </Card.Body>

            <div className="chatbot-input-footer">
              <Form onSubmit={handleSubmit} className="chatbot-input-form">
                <div className="chatbot-input-wrapper">
                  <Form.Control
                    type="text"
                    placeholder={t('chatbot_placeholder')}
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    disabled={loading}
                    className="chatbot-input-field"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={
                      loading || !input.trim()
                    }
                    className="chatbot-send-btn"
                    variant="primary"
                  >
                    {loading ? (
                      <span className="send-btn-spinner"></span>
                    ) : (
                      <FaPaperPlane />
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </div>
      )}
    </>
  );

};

export default Chatbot;

