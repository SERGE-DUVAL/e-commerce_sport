const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    role TEXT DEFAULT 'client',
    points_fidelite INTEGER DEFAULT 0,
    adresse_livraison TEXT,
    reset_token TEXT,
    reset_token_expiry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS produits (
    id_produit INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT,
    categorie TEXT,
    prix_xaf INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    variantes TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS commandes (
    id_commande INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INTEGER,
    total_xaf INTEGER NOT NULL,
    moyen_paiement TEXT NOT NULL,
    frais_livraison INTEGER DEFAULT 3000,
    points_utilises INTEGER DEFAULT 0,
    remise_appliquee INTEGER DEFAULT 0,
    adresse_livraison TEXT NOT NULL,
    statut TEXT DEFAULT 'En attente',
    id_caisse INTEGER,
    montant_rembourse INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
    FOREIGN KEY (id_caisse) REFERENCES caisses(id_caisse)
  );

  CREATE TABLE IF NOT EXISTS ligne_commandes (
    id_ligne INTEGER PRIMARY KEY AUTOINCREMENT,
    id_commande INTEGER,
    id_produit INTEGER,
    quantite INTEGER NOT NULL,
    prix_unitaire_achat INTEGER NOT NULL,
    taille_selectionnee TEXT,
    couleur_selectionnee TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES commandes(id_commande),
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
  );

  CREATE TABLE IF NOT EXISTS caisses (
    id_caisse INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    solde_initial INTEGER DEFAULT 0,
    solde_actuel INTEGER DEFAULT 0,
    date_ouverture DATETIME NOT NULL,
    date_fermeture DATETIME,
    statut TEXT DEFAULT 'ouverte',
    responsable_actuel TEXT,
    id_responsable INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_responsable) REFERENCES utilisateurs(id_utilisateur)
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id_promotion INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    pourcentage_remise INTEGER NOT NULL,
    est_active INTEGER DEFAULT 1,
    date_expiration DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS avis (
    id_avis INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produit INTEGER,
    id_utilisateur INTEGER,
    note INTEGER NOT NULL,
    commentaire TEXT,
    type_avis TEXT DEFAULT 'produit',
    id_commande INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
  );

  CREATE TABLE IF NOT EXISTS codes_barres (
    id_code INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produit INTEGER,
    code_barre TEXT NOT NULL UNIQUE,
    type_code TEXT DEFAULT 'EAN13',
    qr_code_data TEXT,
    actif INTEGER DEFAULT 1,
    date_generation DATETIME,
    date_scan DATETIME,
    nombre_scans INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
  );

  CREATE TABLE IF NOT EXISTS notifications_stock (
    id_notification INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INTEGER,
    id_produit INTEGER,
    email TEXT NOT NULL,
    statut TEXT DEFAULT 'en_attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
  );

  CREATE TABLE IF NOT EXISTS livreurs (
    id_livreur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    vehicule TEXT,
    plaque_immatriculation TEXT,
    statut TEXT DEFAULT 'disponible',
    latitude REAL,
    longitude REAL,
    derniere_mise_a_jour_gps DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS affectations_livraison (
    id_affectation INTEGER PRIMARY KEY AUTOINCREMENT,
    id_commande INTEGER NOT NULL,
    id_livreur INTEGER NOT NULL,
    date_livraison_prevue DATETIME,
    date_livraison_reelle DATETIME,
    statut TEXT DEFAULT 'en attente',
    notes TEXT,
    date_affectation DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES commandes(id_commande),
    FOREIGN KEY (id_livreur) REFERENCES livreurs(id_livreur)
  );
`);

console.log('Database initialized successfully');
