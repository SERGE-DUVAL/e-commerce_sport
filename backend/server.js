require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/cinetpay', require('./routes/cinetPay'));
 app.use('/api/stock', require('./routes/stock'));
 app.use('/api/delivery', require('./routes/delivery'));
 app.use('/api/refunds', require('./routes/refunds'));
 app.use('/api/barcode', require('./routes/barcode'));
 app.use('/api/inventory', require('./routes/inventory'));
 app.use('/api/suppliers', require('./routes/suppliers'));
 app.use('/api/credits', require('./routes/credits'));
 app.use('/api/zones', require('./routes/zones'));
 app.use('/api/cash', require('./routes/cash'));

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sport-Equip API',
      version: '1.0.0',
      description: 'API documentation for Sport-Equip E-Commerce Platform',
      contact: {
        name: 'Sport-Equip Support',
        email: 'support@sport-equip.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: process.env.BACKEND_URL || 'http://localhost:5000',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id_utilisateur: {
              type: 'integer',
              description: 'User ID'
            },
            nom: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['admin', 'client'],
              description: 'User role'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id_produit: {
              type: 'integer',
              description: 'Product ID'
            },
            titre: {
              type: 'string',
              description: 'Product title'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            prix_xaf: {
              type: 'number',
              description: 'Product price in XAF'
            },
            stock: {
              type: 'integer',
              description: 'Product stock quantity'
            },
            categorie: {
              type: 'string',
              description: 'Product category'
            },
            image_url: {
              type: 'string',
              description: 'Product image URL'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id_commande: {
              type: 'integer',
              description: 'Order ID'
            },
            id_utilisateur: {
              type: 'integer',
              description: 'User ID'
            },
            total_xaf: {
              type: 'number',
              description: 'Order total in XAF'
            },
            statut: {
              type: 'string',
              enum: ['en_attente', 'en_cours', 'livre', 'annule'],
              description: 'Order status'
            },
            adresse_livraison: {
              type: 'string',
              description: 'Delivery address'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sync database - désactivé car better-sqlite3 incompatible avec Sequelize sync
// La base de données existe déjà et est utilisée directement par better-sqlite3
const db = require('./config/database');
// db.sync({ force: false })
//   .then(async () => {
//     console.log('Base de données SQLite synchronisée');
//   })
//   .catch(err => {
//     console.error('Erreur de synchronisation BDD:', err);
//   });

// Serve frontend static files
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
