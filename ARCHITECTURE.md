# Architecture Sport-Equip - Documentation Technique

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Backend](#architecture-backend)
3. [Architecture Frontend](#architecture-frontend)
4. [Authentification JWT](#authentification-jwt)
5. [Base de données](#base-de-données)
6. [API Endpoints](#api-endpoints)
7. [Fonctionnalités Clés](#fonctionnalités-clés)

---

## Vue d'ensemble

Sport-Equip est une application e-commerce pour la vente d'équipements sportifs, développée avec :
- **Backend**: Node.js + Express + Sequelize ORM + SQLite
- **Frontend**: React + React Bootstrap + Axios
- **Authentification**: JWT (JSON Web Tokens)

---

## Architecture Backend

### Structure du projet Backend
```
backend/
├── config/
│   └── database.js          # Configuration de la base de données SQLite
├── controllers/              # Logique métier
│   ├── adminController.js   # Gestion admin (statistiques, clients, commandes)
│   ├── authController.js    # Authentification (inscription, connexion)
│   ├── barcodeController.js # Gestion des codes-barres et QR codes
│   ├── chatbotController.js # Chatbot avec API Cohere
│   ├── creditController.js  # Gestion des avoirs
│   ├── deliveryController.js # Gestion des livraisons et livreurs
│   ├── inventoryController.js # Gestion des inventaires
│   ├── orderController.js   # Gestion des commandes et paiements
│   ├── paymentController.js # Traitement des paiements
│   ├── productController.js # Gestion des produits
│   ├── promotionController.js # Gestion des promotions
│   ├── refundController.js  # Gestion des remboursements
│   ├── stockController.js   # Gestion des mouvements de stock
│   └── supplyController.js  # Gestion des demandes de livraison (Be Sport)
├── middleware/              # Middlewares Express
│   └── auth.js              # Middleware d'authentification JWT
├── models/                   # Modèles Sequelize
│   ├── Avoir.js             # Modèle Avoir (crédits clients)
│   ├── AffectationLivraison.js # Affectation commande-livreur
│   ├── Avis.js              # Modèle Avis (produits et livraisons)
│   ├── Caisse.js            # Modèle Caisse (encaissement)
│   ├── CodeBarre.js         # Modèle Code-barres
│   ├── Commande.js          # Modèle Commande
│   ├── DemandeLivraison.js  # Modèle Demande de livraison (Be Sport)
│   ├── DemandeRemboursement.js # Modèle Demande de remboursement
│   ├── Fournisseur.js       # Modèle Fournisseur (Be Sport)
│   ├── Inventaire.js        # Modèle Inventaire (Be Sport)
│   ├── LigneCommande.js     # Modèle Ligne de commande
│   ├── LigneInventaire.js   # Modèle Ligne d'inventaire (Be Sport)
│   ├── Livreur.js           # Modèle Livreur
│   ├── MouvementStock.js    # Modèle Mouvement de stock
│   ├── Produit.js           # Modèle Produit
│   ├── Promotion.js         # Modèle Promotion
│   ├── Utilisateur.js       # Modèle Utilisateur
│   └── ZoneStockage.js      # Modèle Zone de stockage (Be Sport)
├── routes/                   # Routes Express
│   ├── admin.js             # Routes admin
│   ├── auth.js              # Routes authentification
│   ├── barcode.js           # Routes codes-barres
│   ├── chatbot.js           # Routes chatbot
│   ├── credits.js           # Routes avoirs
│   ├── delivery.js          # Routes livraisons
│   ├── inventory.js         # Routes inventaires
│   ├── orders.js            # Routes commandes
│   ├── payment.js           # Routes paiements
│   ├── products.js          # Routes produits
│   ├── promotions.js        # Routes promotions
│   ├── refunds.js           # Routes remboursements
│   ├── stock.js             # Routes stock
│   ├── suppliers.js         # Routes fournisseurs
│   ├── supply.js            # Routes demandes de livraison (Be Sport)
│   ├── users.js             # Routes utilisateurs
│   └── zones.js             # Routes zones
├── scripts/                  # Scripts utilitaires
│   ├── seedData.js          # Données de test initiales
│   └── seedStockMovements.js # Mouvements de stock de test
├── server.js                 # Point d'entrée du serveur
└── package.json              # Dépendances backend
```

### Contrôleurs Principaux

#### 1. **authController.js**
- `register()`: Inscription d'un nouvel utilisateur
- `login()`: Connexion et génération du token JWT
- `getProfile()`: Récupération du profil utilisateur

#### 2. **orderController.js**
- `createOrder()`: Création d'une commande
- `getAllOrders()`: Récupération de toutes les commandes
- `getOrderById()`: Récupération d'une commande par ID
- `updateOrderStatus()`: Mise à jour du statut d'une commande
- `confirmReception()`: Confirmation de réception par le client
- `generateCashReceipt()`: Génération du ticket de caisse PDF

#### 3. **productController.js**
- `create()`: Création d'un produit
- `getAll()`: Récupération de tous les produits
- `getById()`: Récupération d'un produit par ID
- `update()`: Mise à jour d'un produit
- `delete()`: Suppression d'un produit
- `assignToZone()`: Assignation d'un produit à une zone (Be Sport)
- `removeFromZone()`: Retrait d'un produit d'une zone (Be Sport)
- `organizeProductsByCategory()`: Organisation des produits par catégorie (Be Sport)

#### 4. **inventoryController.js** (Be Sport)
- `createInventaire()`: Création d'un inventaire (général ou partiel)
- `getAllInventaires()`: Récupération de tous les inventaires
- `getLignesByInventaire()`: Récupération des lignes d'un inventaire
- `addLigneInventaire()`: Ajout d'une ligne à un inventaire
- `updateLigneInventaire()`: Mise à jour d'une ligne d'inventaire
- `finishInventaire()`: Terminaison d'un inventaire
- `validateInventaire()`: Validation d'un inventaire (avec vérification du taux > 95%)

#### 5. **supplyController.js** (Be Sport)
- `createDemandeLivraison()`: Création d'une demande de livraison
- `getAllDemandesLivraison()`: Récupération de toutes les demandes
- `getProduitsEnRupture()`: Récupération des produits en rupture de stock
- `updateDemandeLivraison()`: Mise à jour d'une demande (avec vérification des quantités)

---

## Architecture Frontend

### Structure du projet Frontend
```
frontend/
├── public/                   # Fichiers statiques
├── src/
│   ├── api/                  # API clients (Axios)
│   │   ├── auth.js          # API authentification
│   │   ├── barcode.js       # API codes-barres
│   │   ├── cash.js          # API caisses
│   │   ├── chatbot.js       # API chatbot
│   │   ├── credit.js        # API avoirs
│   │   ├── delivery.js      # API livraisons
│   │   ├── inventory.js     # API inventaires
│   │   ├── order.js         # API commandes
│   │   ├── payment.js       # API paiements
│   │   ├── product.js       # API produits
│   │   ├── promotion.js     # API promotions
│   │   ├── refund.js        # API remboursements
│   │   ├── stock.js         # API stock
│   │   ├── supplier.js      # API fournisseurs
│   │   └── zone.js          # API zones
│   ├── components/           # Composants React réutilisables
│   ├── pages/                # Pages principales
│   │   ├── AdminDashboard.js # Tableau de bord admin
│   │   ├── Cart.js          # Panier
│   │   ├── Catalog.js       # Catalogue de produits
│   │   ├── Chatbot.js       # Chatbot
│   │   ├── Checkout.js      # Page de paiement
│   │   ├── Home.js          # Page d'accueil
│   │   ├── Login.js         # Page de connexion
│   │   ├── MyAvoirs.js      # Gestion des avoirs
│   │   ├── ProductDetail.js # Détails d'un produit
│   │   ├── Profile.js       # Profil utilisateur
│   │   └── Register.js      # Page d'inscription
│   ├── services/
│   │   └── api.js           # Configuration Axios
│   ├── App.js               # Composant principal
│   └── index.js             # Point d'entrée
└── package.json              # Dépendances frontend
```

### Pages Principales

#### 1. **AdminDashboard.js**
Tableau de bord administrateur avec onglets :
- **Commandes**: Gestion des commandes, modification de statut
- **Clients**: Gestion des clients, historique
- **Produits**: Gestion des produits, codes-barres, QR codes
- **Promotions**: Gestion des promotions
- **Livraison**: Gestion des livreurs, affectations
- **Remboursements**: Gestion des demandes de remboursement
- **Codes-barres**: Gestion des codes-barres
- **Inventaires**: Gestion des inventaires (Be Sport)
- **Fournisseurs**: Gestion des fournisseurs (Be Sport)
- **Zones**: Gestion des zones de stockage (Be Sport)
- **Caisses**: Gestion des caisses (Be Sport)
- **Avoirs**: Gestion des avoirs (Be Sport)

#### 2. **Profile.js**
Profil utilisateur avec :
- Historique des commandes
- Confirmation de réception
- Laisser un avis (produit ou livraison)
- Téléchargement des tickets de caisse
- Gestion des avoirs

#### 3. **Cart.js**
Panier avec :
- Liste des articles
- Modification des quantités
- Suppression d'articles
- Application des promotions
- Calcul du total

#### 4. **Checkout.js**
Page de paiement avec :
- Adresse de livraison
- Moyens de paiement (Mobile Money, Carte, PayPal, Chèque, Cash, Points)
- Validation du paiement
- Génération du ticket de caisse avec QR code

---

## Authentification JWT

### Configuration
L'authentification JWT est implémentée via le middleware `auth.js` :

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/Utilisateur');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé' });
  }
};
```

### Utilisation
- **Routes publiques**: Inscription, connexion
- **Routes protégées**: Profil, commandes, panier
- **Routes admin**: Tableau de bord, gestion produits, etc.

### Token JWT
Le token est généré lors de la connexion :
```javascript
const token = jwt.sign({ id: user.id_utilisateur }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});
```

Le token est stocké dans le localStorage du navigateur et envoyé dans le header Authorization :
```javascript
Authorization: Bearer <token>
```

---

## Base de données

### Modèles Principaux

#### 1. **Utilisateur**
- id_utilisateur (PK)
- nom, prenom, email, mot_de_passe
- role (client, admin, employe)
- adresse_livraison, telephone

#### 2. **Produit**
- id_produit (PK)
- titre, description, prix, stock
- categorie, image_url
- code_barre (unique)

#### 3. **Commande**
- id_commande (PK)
- id_utilisateur (FK)
- total_xaf, frais_livraison
- statut (En attente, Payée, En livraison, Livrée, Annulée)
- moyen_paiement, adresse_livraison
- id_caisse (FK), montant_rembourse

#### 4. **LigneCommande**
- id_ligne (PK)
- id_commande (FK), id_produit (FK)
- quantite, prix_unitaire

#### 5. **Inventaire** (Be Sport)
- id_inventaire (PK)
- type_inventaire (général, partiel)
- zone, responsable, notes
- date_debut, statut
- total_theorique, total_physique, ecart, taux_correspondance

#### 6. **LigneInventaire** (Be Sport)
- id_ligne (PK)
- id_inventaire (FK), id_produit (FK)
- quantite_theorique, quantite_physique, ecart
- methode_comptage, notes

#### 7. **ZoneStockage** (Be Sport)
- id_zone (PK)
- nom, type_zone (surface de vente, mezzanine, entrepôt, réserve)
- description, capacite
- actif

#### 8. **Caisse** (Be Sport)
- id_caisse (PK)
- solde_initial, solde_actuel
- responsable, statut (ouverte, fermée)

#### 9. **Avoir** (Be Sport)
- id_avoir (PK)
- numero_avoir, montant
- id_commande (FK)
- statut (en attente, actif, utilisé, expiré)

#### 10. **DemandeLivraison** (Be Sport)
- id_demande (PK)
- numero_demande, id_produit (FK), id_fournisseur (FK)
- quantite_demandee, quantite_recue
- date_livraison_souhaitee, date_livraison_reelle
- statut (en attente, en cours, livrée, annulée)

---

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Produits
- `GET /api/products` - Tous les produits
- `GET /api/products/:id` - Produit par ID
- `POST /api/products` - Créer produit (admin)
- `PUT /api/products/:id` - Modifier produit (admin)
- `DELETE /api/products/:id` - Supprimer produit (admin)

### Commandes
- `GET /api/orders` - Toutes les commandes (admin)
- `GET /api/orders/my-orders` - Mes commandes
- `POST /api/orders` - Créer commande
- `PUT /api/orders/:id/status` - Modifier statut (admin)
- `POST /api/orders/:id/reception` - Confirmer réception
- `GET /api/orders/:id/ticket` - Télécharger ticket PDF

### Inventaires (Be Sport)
- `GET /api/inventory` - Tous les inventaires (admin)
- `POST /api/inventory` - Créer inventaire (admin)
- `GET /api/inventory/:id/lignes` - Lignes d'inventaire (admin)
- `PUT /api/inventory/lignes/:id` - Modifier ligne (admin)
- `PUT /api/inventory/:id/finish` - Terminer inventaire (admin)
- `PUT /api/inventory/:id/validate` - Valider inventaire (admin)

### Zones (Be Sport)
- `GET /api/zones` - Toutes les zones (admin)
- `POST /api/zones` - Créer zone (admin)
- `PUT /api/zones/:id` - Modifier zone (admin)
- `DELETE /api/zones/:id` - Supprimer zone (admin)

### Caisses (Be Sport)
- `GET /api/cash` - Toutes les caisses (admin)
- `POST /api/cash` - Créer caisse (admin)
- `PUT /api/cash/:id` - Modifier caisse (admin)

### Avoirs (Be Sport)
- `GET /api/credits` - Tous les avoirs (admin)
- `POST /api/credits` - Créer avoir (admin)
- `PUT /api/credits/:id` - Modifier avoir (admin)
- `POST /api/credits/:id/use` - Utiliser avoir

### Demandes de livraison (Be Sport)
- `GET /api/supply/demandes` - Toutes les demandes (admin)
- `POST /api/supply/demandes` - Créer demande (admin)
- `GET /api/supply/produits-rupture` - Produits en rupture (admin)
- `PUT /api/supply/demandes/:id` - Modifier demande (admin)

---

## Fonctionnalités Clés

### 1. Gestion des Commandes
- Création de commandes avec panier
- Suivi des statuts (En attente → Payée → En livraison → Livrée)
- Confirmation de réception par le client
- Génération de tickets de caisse PDF avec QR code
- Gestion des remboursements

### 2. Gestion des Produits
- CRUD complet des produits
- Génération automatique de codes-barres EAN13
- Génération de QR codes
- Gestion des stocks
- Assignation aux zones (Be Sport)

### 3. Gestion des Inventaires (Be Sport)
- Inventaires généraux (toutes les zones)
- Inventaires partiels (zone spécifique)
- Saisie des quantités physiques
- Calcul automatique des écarts et taux de correspondance
- Validation avec avertissement si taux < 95%

### 4. Gestion des Zones (Be Sport)
- Création de zones (surface de vente, mezzanine, entrepôt, réserve)
- Définition de capacités
- Assignation de produits aux zones
- Vérification de capacité avant assignation

### 5. Gestion des Caisses (Be Sport)
- Création de caisses avec solde initial
- Ouverture/Fermeture des caisses
- Assignation de responsables
- Rotation des caisses

### 6. Gestion des Avoirs (Be Sport)
- Création d'avoirs pour remboursements
- Utilisation d'avoirs comme moyen de paiement
- Gestion des statuts (en attente, actif, utilisé, expiré)

### 7. Gestion des Livraisons
- Ajout de livreurs
- Affectation de commandes aux livreurs
- Suivi des livraisons
- Consultation de la météo

### 8. Chatbot
- Chatbot intégré avec API Cohere
- Réponses sur les stocks
- Fallback sur réponses basiques si API non configurée

### 9. Codes-barres et QR Codes
- Génération de codes-barres EAN13
- Génération de QR codes
- Scan de codes-barres pour vérification

### 10. Promotions
- Création de codes promo
- Application de remises
- Gestion de l'expiration automatique

---

## Sécurité

### Authentification JWT
- Tokens JWT avec expiration de 30 jours
- Middleware de protection des routes
- Vérification du rôle admin pour les routes sensibles

### Validation des données
- Validation des entrées utilisateur
- Vérification des stocks avant commande
- Contrôle des capacités des zones

### Gestion des erreurs
- Messages d'erreur clairs
- Logs détaillés côté serveur
- Gestion des cas critiques (rupture de stock, paiement échoué, etc.)

---

## Déploiement

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Base de données
La base de données SQLite est créée automatiquement au premier démarrage. Les données de test peuvent être chargées avec :
```bash
cd backend
node scripts/seedData.js
node scripts/seedStockMovements.js
```

---

## Explication Détaillée du Code

Cette section explique le code des fonctionnalités, des plus simples aux plus complexes.

### Niveau 1 : Fonctionnalités Simples (CRUD de Base)

#### 1.1 Création d'un Produit (Backend)

**Fichier** : `backend/controllers/productController.js`

```javascript
exports.createProduct = async (req, res) => {
  try {
    const { titre, description, categorie, prix_xaf, stock, image_url } = req.body;

    const produit = await Produit.create({
      titre,
      description,
      categorie,
      prix_xaf,
      stock,
      image_url
    });

    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction est un contrôleur Express qui gère la création d'un produit
- Elle reçoit les données du produit depuis `req.body` (le corps de la requête HTTP)
- Elle utilise Sequelize ORM pour créer un enregistrement dans la base de données
- `await Produit.create()` insère le produit dans la table `produits`
- En cas de succès, elle retourne le produit créé avec le code HTTP 201 (Created)
- En cas d'erreur, elle retourne un message d'erreur avec le code HTTP 500 (Internal Server Error)

**Route correspondante** : `POST /api/products` (dans `backend/routes/products.js`)

#### 1.2 Récupération de Tous les Produits (Backend)

**Fichier** : `backend/controllers/productController.js`

```javascript
exports.getAllProducts = async (req, res) => {
  try {
    const { categorie, recherche, prix_min, prix_max } = req.query;

    const where = {};

    if (categorie) {
      where.categorie = categorie;
    }

    if (recherche) {
      where[Op.or] = [
        { titre: { [Op.like]: `%${recherche}%` } },
        { description: { [Op.like]: `%${recherche}%` } }
      ];
    }

    if (prix_min || prix_max) {
      where.prix_xaf = {};
      if (prix_min) where.prix_xaf[Op.gte] = prix_min;
      if (prix_max) where.prix_xaf[Op.lte] = prix_max;
    }

    const produits = await Produit.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction récupère tous les produits avec des filtres optionnels
- Les filtres sont passés via `req.query` (les paramètres de l'URL : `?categorie=Football&recherche=ballon`)
- `where` est un objet Sequelize qui définit les conditions de filtrage
- `Op.or` permet de faire une recherche sur plusieurs champs (titre OU description)
- `Op.like` permet une recherche partielle (contient la chaîne)
- `Op.gte` (greater than or equal) et `Op.lte` (less than or equal) pour les filtres de prix
- `order: [['createdAt', 'DESC']]` trie les résultats par date de création, du plus récent au plus ancien

#### 1.3 Affichage des Produits dans le Catalogue (Frontend)

**Fichier** : `frontend/src/pages/Catalog.js`

```javascript
useEffect(() => {
  loadProducts();
}, [categorie, recherche, prixMin, prixMax]);

const loadProducts = async () => {
  try {
    setLoading(true);
    const response = await productAPI.getAll({
      categorie,
      recherche,
      prix_min: prixMin,
      prix_max: prixMax
    });
    setProducts(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    setLoading(false);
  }
};
```

**Explication** :
- `useEffect` est un hook React qui exécute le code lorsque les dépendances changent
- Le code se réexécute automatiquement si `categorie`, `recherche`, `prixMin` ou `prixMax` change
- `productAPI.getAll()` est une fonction Axios qui fait une requête HTTP GET au backend
- Les données reçues sont stockées dans l'état `products` via `setProducts`
- `loading` gère l'état de chargement pour afficher un spinner pendant la récupération

---

### Niveau 2 : Fonctionnalités Intermédiaires (Logique Métier)

#### 2.1 Création d'une Commande avec Vérification du Stock

**Fichier** : `backend/controllers/orderController.js`

```javascript
exports.createOrder = async (req, res) => {
  try {
    const { id_utilisateur, items, adresse_livraison, moyen_paiement } = req.body;

    // Vérifier le stock pour chaque produit
    for (const item of items) {
      const produit = await Produit.findByPk(item.id_produit);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${item.id_produit} non trouvé` });
      }
      if (produit.stock < item.quantite) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${produit.titre}. Disponible: ${produit.stock}, Demandé: ${item.quantite}` 
        });
      }
    }

    // Calculer le total
    let total_xaf = 0;
    for (const item of items) {
      const produit = await Produit.findByPk(item.id_produit);
      total_xaf += produit.prix_xaf * item.quantite;
    }

    // Créer la commande
    const commande = await Commande.create({
      id_utilisateur,
      total_xaf,
      frais_livraison: 2000,
      adresse_livraison,
      moyen_paiement,
      statut: 'En attente'
    });

    // Créer les lignes de commande et mettre à jour le stock
    for (const item of items) {
      await LigneCommande.create({
        id_commande: commande.id_commande,
        id_produit: item.id_produit,
        quantite: item.quantite,
        prix_unitaire: (await Produit.findByPk(item.id_produit)).prix_xaf
      });

      // Déduire du stock
      const produit = await Produit.findByPk(item.id_produit);
      await produit.update({ stock: produit.stock - item.quantite });
    }

    res.status(201).json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction effectue plusieurs étapes pour créer une commande
- **Étape 1 : Vérification du stock** - Pour chaque article du panier, on vérifie si le stock est suffisant
- **Étape 2 : Calcul du total** - On parcourt les articles pour calculer le montant total de la commande
- **Étape 3 : Création de la commande** - On crée l'en-tête de commande dans la table `commandes`
- **Étape 4 : Création des lignes** - Pour chaque article, on crée une ligne dans la table `lignes_commandes`
- **Étape 5 : Mise à jour du stock** - On déduit la quantité commandée du stock de chaque produit
- Si une étape échoue, la commande n'est pas créée (transaction implicite)

#### 2.2 Traitement du Paiement avec Remboursement

**Fichier** : `backend/controllers/orderController.js`

```javascript
exports.processPayment = async (req, res) => {
  try {
    const { id_commande, id_caisse, montant_donne } = req.body;
    const commande = await Commande.findByPk(id_commande, {
      include: [{
        model: LigneCommande,
        as: 'LigneCommandes'
      }]
    });

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (commande.statut !== 'En attente') {
      return res.status(400).json({ message: 'Cette commande a déjà été traitée' });
    }

    // Gérer le remboursement si le client donne trop
    let montant_rembourse = 0;
    if (montant_donne && montant_donne > commande.total_xaf) {
      montant_rembourse = montant_donne - commande.total_xaf;
    }

    // Mettre à jour le solde de la caisse
    const caisse = await Caisse.findByPk(id_caisse);
    if (!caisse) {
      return res.status(404).json({ message: 'Caisse non trouvée' });
    }

    await caisse.update({
      solde_actuel: caisse.solde_actuel + commande.total_xaf
    });

    // Mettre à jour le statut de la commande
    await commande.update({
      statut: 'Payée',
      id_caisse,
      montant_rembourse
    });

    res.json({ 
      message: 'Paiement traité avec succès',
      commande,
      montant_rembourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction traite le paiement d'une commande
- Elle vérifie d'abord que la commande existe et qu'elle est en attente
- **Calcul du remboursement** : Si le client donne plus que le montant dû, on calcule la différence
- **Mise à jour de la caisse** : On ajoute le montant de la commande au solde actuel de la caisse
- **Mise à jour de la commande** : On change le statut à "Payée" et on enregistre le montant remboursé
- Le remboursement est calculé mais non distribué ici (la distribution se fait physiquement)

#### 2.3 Vérification du Stock lors de l'Ajout au Panier (Frontend)

**Fichier** : `frontend/src/context/CartContext.js`

```javascript
const addToCart = (product, quantity = 1, taille = null, couleur = null) => {
  // Vérifier si le stock est suffisant
  if (product.stock <= 0) {
    alert('Rupture de stock : ce produit n\'est plus disponible');
    return;
  }

  // Calculer la quantité totale dans le panier pour ce produit
  const existingItem = cart.find(
    item => item.id_produit === product.id_produit && 
            item.taille === taille && 
            item.couleur === couleur
  );
  const currentQuantity = existingItem ? existingItem.quantite : 0;
  const totalQuantity = currentQuantity + quantity;

  if (totalQuantity > product.stock) {
    alert(`Stock insuffisant : il ne reste que ${product.stock} unité(s) disponible(s)`);
    return;
  }

  setCartAnimation(true);
  setTimeout(() => setCartAnimation(false), 600);
  
  setCart(prevCart => {
    const existingItem = prevCart.find(
      item => item.id_produit === product.id_produit && 
              item.taille === taille && 
              item.couleur === couleur
    );

    if (existingItem) {
      return prevCart.map(item =>
        item.id_produit === product.id_produit && 
        item.taille === taille && 
        item.couleur === couleur
          ? { ...item, quantite: item.quantite + quantity }
          : item
      );
    }

    return [
      ...prevCart,
      {
        id_produit: product.id_produit,
        titre: product.titre,
        prix_xaf: product.prix_xaf,
        quantite: quantity,
        taille,
        couleur,
        image: product.image
      }
    ];
  });
};
```

**Explication** :
- Cette fonction ajoute un produit au panier avec vérification du stock
- **Première vérification** : Si le stock est à 0, on empêche l'ajout
- **Deuxième vérification** : On calcule la quantité totale (déjà dans le panier + nouvelle quantité)
- Si la quantité totale dépasse le stock disponible, on empêche l'ajout
- `setCartAnimation` ajoute une animation visuelle pendant 600ms
- `setCart` met à jour l'état du panier de manière immuable
- Si l'article existe déjà, on met à jour sa quantité
- Sinon, on ajoute un nouvel article au panier

---

### Niveau 3 : Fonctionnalités Complexes (Calculs et Validations Avancées)

#### 3.1 Gestion des Inventaires avec Calcul des Écarts

**Fichier** : `backend/controllers/inventoryController.js`

```javascript
exports.createInventaire = async (req, res) => {
  try {
    const { type_inventaire, zone, responsable, notes } = req.body;

    const inventaire = await Inventaire.create({
      type_inventaire,
      zone,
      date_debut: new Date(),
      statut: 'en cours',
      responsable,
      notes
    });

    // Si inventaire général, ajouter tous les produits automatiquement
    if (type_inventaire === 'général') {
      const produits = await Produit.findAll();
      for (const produit of produits) {
        await LigneInventaire.create({
          id_inventaire: inventaire.id_inventaire,
          id_produit: produit.id_produit,
          quantite_theorique: produit.stock,
          quantite_physique: 0,
          ecart: -produit.stock,
          methode_comptage: 'automatique',
          notes: 'À compter'
        });
      }
      await updateInventaireTotals(inventaire.id_inventaire);
    } 
    // Si inventaire partiel pour une zone, ajouter les produits de cette zone
    else if (type_inventaire === 'partiel' && zone) {
      const { ZoneStockage } = require('../models');
      const zoneStockage = await ZoneStockage.findOne({ where: { nom: zone } });
      if (zoneStockage) {
        const produits = await zoneStockage.getProduits();
        for (const produit of produits) {
          await LigneInventaire.create({
            id_inventaire: inventaire.id_inventaire,
            id_produit: produit.id_produit,
            quantite_theorique: produit.stock,
            quantite_physique: 0,
            ecart: -produit.stock,
            methode_comptage: 'automatique',
            notes: `Zone: ${zone}`
          });
        }
        await updateInventaireTotals(inventaire.id_inventaire);
      }
    }

    res.status(201).json(inventaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction auxiliaire pour mettre à jour les totaux de l'inventaire
const updateInventaireTotals = async (id_inventaire) => {
  const lignes = await LigneInventaire.findAll({
    where: { id_inventaire }
  });

  let total_theorique = 0;
  let total_physique = 0;

  for (const ligne of lignes) {
    total_theorique += ligne.quantite_theorique;
    total_physique += ligne.quantite_physique;
  }

  const ecart = total_physique - total_theorique;
  const taux_correspondance = total_theorique > 0 
    ? (total_physique / total_theorique) * 100 
    : 0;

  await Inventaire.update(
    { 
      total_theorique, 
      total_physique, 
      ecart, 
      taux_correspondance 
    },
    { where: { id_inventaire } }
  );
};
```

**Explication** :
- Cette fonction crée un inventaire (général ou partiel) avec calcul automatique des écarts
- **Inventaire général** : On ajoute tous les produits de la base de données
- **Inventaire partiel** : On ajoute seulement les produits de la zone spécifiée
- Pour chaque produit, on crée une ligne d'inventaire avec :
  - `quantite_theorique` : le stock actuel dans la base de données
  - `quantite_physique` : initialisé à 0 (à compter par l'utilisateur)
  - `ecart` : initialisé à -stock (écart maximal si rien n'est compté)
- La fonction `updateInventaireTotals` calcule les totaux :
  - Somme de toutes les quantités théoriques
  - Somme de toutes les quantités physiques
  - Écart total = physique - théorique
  - Taux de correspondance = (physique / théorique) * 100

#### 3.2 Validation d'Inventaire avec Avertissement

**Fichier** : `backend/controllers/inventoryController.js`

```javascript
exports.validateInventaire = async (req, res) => {
  try {
    const inventaire = await Inventaire.findByPk(req.params.id);
    if (!inventaire) {
      return res.status(404).json({ message: 'Inventaire non trouvé' });
    }

    if (inventaire.statut !== 'terminé') {
      return res.status(400).json({ message: 'L\'inventaire doit être terminé avant validation' });
    }

    // Recalculer les totaux
    await updateInventaireTotals(inventaire.id_inventaire);

    // Vérifier le taux de correspondance
    if (inventaire.taux_correspondance < 95) {
      return res.status(400).json({ 
        message: `Attention : Taux de correspondance insuffisant (${inventaire.taux_correspondance.toFixed(2)}%). Le seuil minimum est 95%.`,
        warning: true,
        taux_correspondance: inventaire.taux_correspondance
      });
    }

    // Valider l'inventaire
    await inventaire.update({
      statut: 'validé',
      date_fin: new Date()
    });

    // Mettre à jour le stock des produits
    const lignes = await LigneInventaire.findAll({
      where: { id_inventaire: inventaire.id_inventaire }
    });

    for (const ligne of lignes) {
      const produit = await Produit.findByPk(ligne.id_produit);
      if (produit) {
        await produit.update({ stock: ligne.quantite_physique });
      }
    }

    res.json({ message: 'Inventaire validé avec succès', inventaire });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction valide un inventaire après vérification du taux de correspondance
- **Préconditions** : L'inventaire doit être terminé
- **Recalcul des totaux** : On s'assure que les totaux sont à jour
- **Vérification du taux** : Si le taux est inférieur à 95%, on retourne un avertissement
- **Validation** : Si le taux est acceptable, on valide l'inventaire
- **Mise à jour du stock** : Pour chaque produit, on met à jour son stock avec la quantité physique comptée
- Cette fonction garantit que les stocks de la base de données reflètent la réalité physique

#### 3.3 Assignation de Produits aux Zones avec Vérification de Capacité

**Fichier** : `backend/controllers/productController.js`

```javascript
exports.assignProductToZone = async (req, res) => {
  try {
    const { id_produit, id_zone } = req.body;

    const produit = await Produit.findByPk(id_produit);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const zone = await ZoneStockage.findByPk(id_zone);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }

    // Vérifier si le produit est déjà dans cette zone
    const existingAssignment = await zone.getProduits({
      where: { id_produit }
    });

    if (existingAssignment.length > 0) {
      return res.status(400).json({ message: 'Ce produit est déjà dans cette zone' });
    }

    // Vérifier la capacité de la zone
    const currentProducts = await zone.getProduits();
    if (currentProducts.length >= zone.capacite) {
      return res.status(400).json({ 
        message: `La zone ${zone.nom} est pleine. Capacité: ${zone.capacite}, Occupée: ${currentProducts.length}` 
      });
    }

    // Assigner le produit à la zone
    await zone.addProduit(produit);

    res.json({ message: 'Produit assigné à la zone avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction assigne un produit à une zone de stockage avec vérification de capacité
- **Vérification du produit** : On s'assure que le produit existe
- **Vérification de la zone** : On s'assure que la zone existe
- **Vérification de duplication** : On empêche d'assigner le même produit deux fois à la même zone
- **Vérification de capacité** : On compte les produits déjà dans la zone et on compare à la capacité
- Si la capacité est dépassée, on empêche l'assignation
- `zone.addProduit(produit)` est une méthode Sequelize qui crée l'association dans la table de liaison

#### 3.4 Gestion des Avoirs avec Vérification d'Expiration

**Fichier** : `backend/controllers/creditController.js`

```javascript
exports.useAvoir = async (req, res) => {
  try {
    const avoir = await Avoir.findByPk(req.params.id);
    if (!avoir) {
      return res.status(404).json({ message: 'Avoir non trouvé' });
    }

    if (avoir.statut !== 'en attente') {
      return res.status(400).json({ message: 'Cet avoir a déjà été utilisé ou est expiré' });
    }

    // Vérifier si l'avoir est expiré
    if (avoir.date_expiration && new Date(avoir.date_expiration) < new Date()) {
      await avoir.update({ statut: 'expiré' });
      return res.status(400).json({ message: 'Cet avoir est expiré' });
    }

    await avoir.update({ statut: 'utilisé' });
    res.json(avoir);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction utilise un avoir comme moyen de paiement
- **Vérification de l'avoir** : On s'assure que l'avoir existe
- **Vérification du statut** : On empêche d'utiliser un avoir déjà utilisé ou expiré
- **Vérification de l'expiration** : On compare la date d'expiration avec la date actuelle
- Si l'avoir est expiré, on met à jour son statut à "expiré" et on empêche l'utilisation
- Si tout est OK, on met à jour le statut à "utilisé"

---

### Niveau 4 : Fonctionnalités Avancées (Intégration et Automatisation)

#### 4.1 Chatbot avec API Cohere

**Fichier** : `backend/controllers/chatbotController.js`

```javascript
const cohere = require('cohere-ai');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.COHERE_API_KEY) {
      // Fallback : réponses basiques si API non configurée
      const basicResponses = {
        'stock': 'Pour vérifier le stock, veuillez consulter le catalogue de produits.',
        'prix': 'Les prix sont affichés sur chaque produit dans le catalogue.',
        'livraison': 'La livraison est généralement effectuée sous 2-3 jours ouvrés.',
        'default': 'Je suis un assistant virtuel. Comment puis-je vous aider ?'
      };

      const lowerMessage = message.toLowerCase();
      let response = basicResponses.default;

      for (const key in basicResponses) {
        if (lowerMessage.includes(key)) {
          response = basicResponses[key];
          break;
        }
      }

      return res.json({ response });
    }

    // Utiliser l'API Cohere si configurée
    cohere.init(process.env.COHERE_API_KEY);

    const response = await cohere.generate({
      model: 'command',
      prompt: `Vous êtes un assistant client pour Sport-Equip, une boutique d'équipements sportifs. Répondez à cette question : ${message}`,
      maxTokens: 300,
      temperature: 0.7
    });

    res.json({ response: response.body.generations[0].text });
  } catch (error) {
    console.error('Erreur chatbot:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction implémente un chatbot avec l'API Cohere
- **Fallback** : Si l'API n'est pas configurée (pas de clé API), on utilise des réponses basiques
- Les réponses basiques sont basées sur des mots-clés dans le message
- **API Cohere** : Si configurée, on utilise le modèle "command" de Cohere pour générer des réponses
- `prompt` définit le contexte du chatbot (assistant pour Sport-Equip)
- `maxTokens` limite la longueur de la réponse
- `temperature` contrôle la créativité (0.7 = équilibré)

#### 4.2 Génération de Codes-Barres EAN13

**Fichier** : `backend/controllers/barcodeController.js`

```javascript
exports.generateEAN13 = async (req, res) => {
  try {
    const { id_produit } = req.body;

    // Vérifier si le produit a déjà un code barre
    const existingCode = await CodeBarre.findOne({ where: { id_produit } });
    if (existingCode) {
      return res.json({ code_barre: existingCode.code_barre, existing: true });
    }

    // Générer un code EAN13 unique (12 chiffres + checksum)
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += Math.floor(Math.random() * 10);
    }

    // Calculer le checksum selon l'algorithme EAN13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    const ean13 = code + checksum;

    res.json({ code_barre: ean13, existing: false });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
```

**Explication** :
- Cette fonction génère un code-barres EAN13 valide
- **Vérification de duplication** : On vérifie si le produit a déjà un code-barres
- **Génération des 12 premiers chiffres** : On génère 12 chiffres aléatoires
- **Calcul du checksum** : L'algorithme EAN13 utilise une formule spécifique :
  - Les chiffres aux positions paires sont multipliés par 3
  - Les chiffres aux positions impaires sont multipliés par 1
  - On fait la somme de tous les résultats
  - Le checksum est (10 - (somme % 10)) % 10
- Le code final est les 12 chiffres + le checksum (13 chiffres au total)

---

## Conclusion

Cette architecture permet une séparation claire entre le frontend et le backend, avec une API RESTful bien structurée et une authentification JWT sécurisée. Les fonctionnalités Be Sport (inventaires, zones, caisses, avoirs) sont intégrées de manière cohérente dans l'application existante.
