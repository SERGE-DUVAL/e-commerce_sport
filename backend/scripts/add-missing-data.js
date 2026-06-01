const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Check and add missing tables if needed
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
const tableNames = tables.map(t => t.name);

console.log('Tables existantes:', tableNames);

// Add missing tables
const requiredTables = [
  'affectations_livraison',
  'avis',
  'avoirs',
  'caisses',
  'codes_barres',
  'commandes',
  'commandes_backup',
  'demandes_remboursement',
  'fournisseurs',
  'inventaires',
  'lignes_commandes',
  'lignes_inventaires',
  'livreurs',
  'mouvements_stock',
  'produits',
  'ProduitZone',
  'promotions',
  'utilisateurs',
  'zones_stockage'
];

requiredTables.forEach(tableName => {
  if (!tableNames.includes(tableName)) {
    console.log(`Table ${tableName} manquante, création...`);
    // Create table based on SQL structure
    switch(tableName) {
      case 'affectations_livraison':
        db.exec(`CREATE TABLE affectations_livraison (
          id_affectation INTEGER PRIMARY KEY AUTOINCREMENT,
          id_commande INTEGER NOT NULL REFERENCES commandes(id_commande),
          id_livreur INTEGER NOT NULL REFERENCES livreurs(id_livreur),
          date_affectation DATETIME NOT NULL,
          date_livraison_prevue DATETIME,
          date_livraison_reelle DATETIME,
          statut TEXT DEFAULT 'en attente',
          notes TEXT,
          temperature FLOAT,
          conditions_meteo VARCHAR(255),
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'livreurs':
        db.exec(`CREATE TABLE livreurs (
          id_livreur INTEGER PRIMARY KEY AUTOINCREMENT,
          nom VARCHAR(255) NOT NULL,
          prenom VARCHAR(255) NOT NULL,
          telephone VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255),
          vehicule VARCHAR(255) NOT NULL,
          plaque_immatriculation VARCHAR(255) NOT NULL,
          statut TEXT DEFAULT 'disponible',
          latitude FLOAT,
          longitude FLOAT,
          derniere_mise_a_jour_gps DATETIME,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'fournisseurs':
        db.exec(`CREATE TABLE fournisseurs (
          id_fournisseur INTEGER PRIMARY KEY AUTOINCREMENT,
          nom VARCHAR(255) NOT NULL,
          contact VARCHAR(255),
          email VARCHAR(255),
          telephone VARCHAR(255),
          adresse TEXT,
          ville VARCHAR(255),
          pays VARCHAR(255) DEFAULT 'Cameroun',
          delai_livraison INTEGER DEFAULT 7,
          conditions_paiement VARCHAR(255) DEFAULT '30 jours',
          notes TEXT,
          actif INTEGER DEFAULT 1,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'inventaires':
        db.exec(`CREATE TABLE inventaires (
          id_inventaire INTEGER PRIMARY KEY AUTOINCREMENT,
          type_inventaire TEXT NOT NULL DEFAULT 'partiel',
          zone VARCHAR(255),
          date_debut DATETIME NOT NULL,
          date_fin DATETIME,
          statut TEXT DEFAULT 'en cours',
          responsable VARCHAR(255),
          notes TEXT,
          total_theorique INTEGER DEFAULT 0,
          total_physique INTEGER DEFAULT 0,
          ecart INTEGER DEFAULT 0,
          taux_correspondance FLOAT DEFAULT 0,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          id_responsable INTEGER REFERENCES utilisateurs(id_utilisateur)
        )`);
        break;
      case 'lignes_inventaires':
        db.exec(`CREATE TABLE lignes_inventaires (
          id_ligne INTEGER PRIMARY KEY AUTOINCREMENT,
          quantite_theorique INTEGER NOT NULL,
          quantite_physique INTEGER NOT NULL,
          ecart INTEGER DEFAULT 0,
          methode_comptage TEXT DEFAULT 'manuel',
          notes TEXT,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          id_inventaire INTEGER REFERENCES inventaires(id_inventaire),
          id_produit INTEGER REFERENCES produits(id_produit)
        )`);
        break;
      case 'mouvements_stock':
        db.exec(`CREATE TABLE mouvements_stock (
          id_mouvement INTEGER PRIMARY KEY,
          id_produit INTEGER NOT NULL REFERENCES produits(id_produit),
          id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur),
          type_mouvement TEXT NOT NULL,
          quantite INTEGER NOT NULL,
          stock_avant INTEGER NOT NULL,
          stock_apres INTEGER NOT NULL,
          motif TEXT,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'zones_stockage':
        db.exec(`CREATE TABLE zones_stockage (
          id_zone INTEGER PRIMARY KEY AUTOINCREMENT,
          nom VARCHAR(255) NOT NULL,
          type_zone TEXT NOT NULL,
          description TEXT,
          capacite INTEGER DEFAULT 0,
          actif INTEGER DEFAULT 1,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'ProduitZone':
        db.exec(`CREATE TABLE ProduitZone (
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          id_zone INTEGER NOT NULL REFERENCES zones_stockage(id_zone),
          id_produit INTEGER NOT NULL REFERENCES produits(id_produit),
          PRIMARY KEY (id_zone, id_produit)
        )`);
        break;
      case 'avoirs':
        db.exec(`CREATE TABLE avoirs (
          id_avoir INTEGER PRIMARY KEY AUTOINCREMENT,
          numero_avoir VARCHAR(255) NOT NULL UNIQUE,
          montant INTEGER NOT NULL,
          motif TEXT NOT NULL,
          date_emission DATETIME NOT NULL,
          date_expiration DATETIME,
          statut TEXT DEFAULT 'en attente',
          notes TEXT,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          id_commande INTEGER REFERENCES commandes(id_commande),
          id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur)
        )`);
        break;
      case 'demandes_remboursement':
        db.exec(`CREATE TABLE demandes_remboursement (
          id_demande INTEGER PRIMARY KEY AUTOINCREMENT,
          id_commande INTEGER NOT NULL REFERENCES commandes(id_commande),
          id_utilisateur INTEGER NOT NULL REFERENCES utilisateurs(id_utilisateur),
          type_demande TEXT NOT NULL,
          raison TEXT NOT NULL,
          description TEXT,
          statut TEXT DEFAULT 'en_attente',
          date_demande DATETIME NOT NULL,
          date_traitement DATETIME,
          montant_rembourse INTEGER,
          notes_admin TEXT,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )`);
        break;
      case 'commandes_backup':
        db.exec(`CREATE TABLE commandes_backup (
          id_commande INTEGER PRIMARY KEY,
          total_xaf INTEGER NOT NULL,
          moyen_paiement TEXT NOT NULL,
          frais_livraison INTEGER DEFAULT 3000,
          points_utilises INTEGER DEFAULT 0,
          remise_appliquee INTEGER DEFAULT 0,
          adresse_livraison TEXT NOT NULL,
          statut TEXT DEFAULT 'En attente',
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur)
        )`);
        break;
    }
  }
});

// Add missing data from SQL file
console.log('Adding missing data...');

// Add livreurs
const livreursCount = db.prepare('SELECT COUNT(*) as count FROM livreurs').get();
if (livreursCount.count === 0) {
  console.log('Adding livreurs...');
  db.prepare(`INSERT INTO livreurs (nom, prenom, telephone, email, vehicule, plaque_immatriculation, statut, latitude, longitude, derniere_mise_a_jour_gps, created_at, updated_at) VALUES
    ('Dupont', 'Jean', '+237 699 123 456', 'jean.dupont@sportequip.com', 'Moto', 'CE 123 AB', 'disponible', 3.8488, 11.5028, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
    ('Martin', 'Marie', '+237 699 234 567', 'marie.martin@sportequip.com', 'Moto', 'CE 456 CD', 'disponible', 3.8588, 11.5128, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
    ('Ngom', 'Pierre', '+237 699 345 678', 'pierre.ngom@sportequip.com', 'Scooter', 'CE 789 EF', 'disponible', 3.8688, 11.5228, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-28 02:23:06.700 +00:00'),
    ('Faye', 'Aminata', '+237 699 456 789', 'aminata.faye@sportequip.com', 'Moto', 'CE 012 GH', 'disponible', 3.8788, 11.5328, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
    ('Kouame', 'Kofi', '+237 699 567 890', 'kofi.kouame@sportequip.com', 'Scooter', 'CE 345 IJ', 'disponible', 3.8888, 11.5428, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00')`).run();
  console.log('Livreurs added');
}

// Add fournisseurs
const fournisseursCount = db.prepare('SELECT COUNT(*) as count FROM fournisseurs').get();
if (fournisseursCount.count === 0) {
  console.log('Adding fournisseurs...');
  db.prepare(`INSERT INTO fournisseurs (nom, contact, email, telephone, adresse, ville, pays, delai_livraison, conditions_paiement, notes, actif, created_at, updated_at) VALUES
    ('Nike Cameroon', 'Jean Dupont', 'jean@nike.cm', '237699123456', 'Boulevard de la Liberté', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
    ('Adidas Central Africa', 'Marie Kouame', 'marie@adidas.cm', '237699234567', 'Avenue Charles de Gaulle', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
    ('Puma Sports', 'Paul Nkodo', 'paul@puma.cm', '237699345678', 'Rue de l''Indépendance', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
    ('Under Armour', 'Sophie Mba', 'sophie@underarmour.cm', '237699456789', 'Boulevard du 20 Mai', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
    ('Reebok Cameroon', 'Antoine Mbarga', 'antoine@reebok.cm', '237699567890', 'Rue Joffre', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00')`).run();
  console.log('Fournisseurs added');
}

// Add zones_stockage
const zonesCount = db.prepare('SELECT COUNT(*) as count FROM zones_stockage').get();
if (zonesCount.count === 0) {
  console.log('Adding zones_stockage...');
  db.prepare(`INSERT INTO zones_stockage (nom, type_zone, description, capacite, actif, created_at, updated_at) VALUES
    ('Surface de vente principale', 'surface de vente', 'Zone principale de vente au public', 500, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
    ('Mezzanine', 'mezzanine', 'Zone de stockage intermédiaire', 300, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
    ('Entrepôt principal', 'entrepôt', 'Zone de stockage principal', 1000, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
    ('Zone réception', 'entrepôt', 'Zone de réception des livraisons', 200, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
    ('Zone expédition', 'entrepôt', 'Zone de préparation des commandes', 150, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00')`).run();
  console.log('Zones_stockage added');
}

// Add inventaires
const inventairesCount = db.prepare('SELECT COUNT(*) as count FROM inventaires').get();
if (inventairesCount.count === 0) {
  console.log('Adding inventaires...');
  db.prepare(`INSERT INTO inventaires (type_inventaire, zone, date_debut, date_fin, statut, responsable, notes, total_theorique, total_physique, ecart, taux_correspondance, created_at, updated_at) VALUES
    ('général', 'surface de vente', '2024-01-15 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 450, 448, 2, 99.56, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00'),
    ('partiel', 'mezzanine', '2024-03-20 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 280, 280, 0, 100.0, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00'),
    ('général', 'entrepôt', '2024-06-10 00:00:00.000 +00:00', NULL, 'en cours', NULL, NULL, 950, 0, 0, 0.0, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00')`).run();
  console.log('Inventaires added');
}

// Add avoirs
const avoirsCount = db.prepare('SELECT COUNT(*) as count FROM avoirs').get();
if (avoirsCount.count === 0) {
  console.log('Adding avoirs...');
  db.prepare(`INSERT INTO avoirs (numero_avoir, montant, motif, date_emission, date_expiration, statut, notes, created_at, updated_at, id_commande, id_utilisateur) VALUES
    ('AVR-2024-001', 25000, 'Produit défectueux', '2024-01-20 00:00:00.000 +00:00', NULL, 'utilisé', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 1, NULL),
    ('AVR-2024-002', 15000, 'Erreur de taille', '2024-02-15 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 2, NULL),
    ('AVR-2024-003', 35000, 'Couleur différente', '2024-03-10 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 3, NULL),
    ('AVR-2024-004', 20000, 'Client satisfait', '2024-04-05 00:00:00.000 +00:00', NULL, 'expiré', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 4, NULL),
    ('AVR-2024-005', 40000, 'Retour produit', '2024-05-01 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 5, NULL)`).run();
  console.log('Avoirs added');
}

// Add demandes_remboursement
const demandesCount = db.prepare('SELECT COUNT(*) as count FROM demandes_remboursement').get();
if (demandesCount.count === 0) {
  console.log('Adding demandes_remboursement...');
  db.prepare(`INSERT INTO demandes_remboursement (id_commande, id_utilisateur, type_demande, raison, description, statut, date_demande, date_traitement, montant_rembourse, notes_admin, created_at, updated_at) VALUES
    (1, 2, 'remboursement', 'Produit défectueux', 'Le produit reçu est défectueux et ne fonctionne pas correctement', 'refuse', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:48:41.385 +00:00', NULL, 'produit endommagé', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:48:41.386 +00:00'),
    (2, 3, 'echange', 'Taille incorrecte', 'La taille ne correspond pas à celle commandée', 'approuve', '2026-05-24 23:21:33.731 +00:00', NULL, 0, 'Échange autorisé', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:21:33.731 +00:00'),
    (3, 3, 'remboursement', 'Produit ne correspond pas à la description', 'Le produit reçu ne correspond pas à la description sur le site', 'refuse', '2026-05-21 23:21:33.731 +00:00', NULL, NULL, 'Produit conforme à la description', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:21:33.731 +00:00')`).run();
  console.log('Demandes_remboursement added');
}

// Add affectations_livraison
const affectationsCount = db.prepare('SELECT COUNT(*) as count FROM affectations_livraison').get();
if (affectationsCount.count === 0) {
  console.log('Adding affectations_livraison...');
  db.prepare(`INSERT INTO affectations_livraison (id_commande, id_livreur, date_affectation, date_livraison_prevue, date_livraison_reelle, statut, notes, temperature, conditions_meteo, created_at, updated_at) VALUES
    (1, 1, '2026-05-26 23:21:33.722 +00:00', '2026-05-28 23:21:33.722 +00:00', NULL, 'en_cours', NULL, NULL, 'Ensoleillé', '2026-05-26 23:21:33.722 +00:00', '2026-05-26 23:21:33.722 +00:00'),
    (2, 2, '2026-05-26 23:21:33.722 +00:00', '2026-05-27 23:21:33.722 +00:00', NULL, 'en_cours', NULL, NULL, 'Nuageux', '2026-05-26 23:21:33.722 +00:00', '2026-05-26 23:21:33.722 +00:00')`).run();
  console.log('Affectations_livraison added');
}

console.log('Data import completed successfully');
