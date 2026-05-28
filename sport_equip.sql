-- --------------------------------------------------------
-- Hôte:                         C:\Users\EG\Documents\Sport-Equip\database\sport-equip.sqlite
-- Version du serveur:           3.39.0
-- SE du serveur:                
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour sport-equip
CREATE DATABASE IF NOT EXISTS "sport-equip";
;

-- Listage de la structure de table sport-equip. affectations_livraison
CREATE TABLE IF NOT EXISTS `affectations_livraison` (`id_affectation` INTEGER PRIMARY KEY AUTOINCREMENT, `id_commande` INTEGER NOT NULL REFERENCES `commandes` (`id_commande`) ON DELETE NO ACTION ON UPDATE CASCADE, `id_livreur` INTEGER NOT NULL REFERENCES `livreurs` (`id_livreur`) ON DELETE NO ACTION ON UPDATE CASCADE, `date_affectation` DATETIME NOT NULL, `date_livraison_prevue` DATETIME, `date_livraison_reelle` DATETIME, `statut` TEXT DEFAULT 'en attente', `notes` TEXT, `temperature` FLOAT, `conditions_meteo` VARCHAR(255), `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.affectations_livraison : 2 rows
/*!40000 ALTER TABLE "affectations_livraison" DISABLE KEYS */;
INSERT INTO "affectations_livraison" ("id_affectation", "id_commande", "id_livreur", "date_affectation", "date_livraison_prevue", "date_livraison_reelle", "statut", "notes", "temperature", "conditions_meteo", "created_at", "updated_at") VALUES
	(1, 1, 1, '2026-05-26 23:21:33.722 +00:00', '2026-05-28 23:21:33.722 +00:00', NULL, 'en_cours', NULL, NULL, 'Ensoleillé', '2026-05-26 23:21:33.722 +00:00', '2026-05-26 23:21:33.722 +00:00'),
	(2, 2, 2, '2026-05-26 23:21:33.722 +00:00', '2026-05-27 23:21:33.722 +00:00', NULL, 'en_cours', NULL, NULL, 'Nuageux', '2026-05-26 23:21:33.722 +00:00', '2026-05-26 23:21:33.722 +00:00');
/*!40000 ALTER TABLE "affectations_livraison" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. avis
CREATE TABLE IF NOT EXISTS `avis` (`id_avis` INTEGER PRIMARY KEY, `note` INTEGER NOT NULL, `commentaire` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_produit` INTEGER REFERENCES `produits` (`id_produit`), `id_utilisateur` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE, type_avis TEXT DEFAULT "produit", id_commande INTEGER);

-- Listage des données de la table sport-equip.avis : 12 rows
/*!40000 ALTER TABLE "avis" DISABLE KEYS */;
INSERT INTO "avis" ("id_avis", "note", "commentaire", "created_at", "updated_at", "id_produit", "id_utilisateur", "type_avis", "id_commande") VALUES
	(1, 5, 'Excellent produit, très confortable et de bonne qualité.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 1, 2, 'produit', NULL),
	(2, 4, 'Bon rapport qualité-prix, livraison rapide.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 2, 3, 'produit', NULL),
	(3, 5, 'Je recommande vivement ce produit, parfait pour le sport.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 3, 2, 'produit', NULL),
	(4, 3, 'Produit correct mais taille un peu petite.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 4, 4, 'produit', NULL),
	(5, 4, 'Très bon design, matériel résistant.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 5, 3, 'produit', NULL),
	(6, 5, 'Superbe qualité, je suis très satisfait.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 6, 5, 'produit', NULL),
	(7, 4, 'Bon produit, correspond à mes attentes.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 7, 2, 'produit', NULL),
	(8, 5, 'Exceptionnel, je le recommande à tous.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 8, 4, 'produit', NULL),
	(9, 3, 'Correct mais pourrait être mieux.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 9, 3, 'produit', NULL),
	(10, 4, 'Très bon achat, je suis content.', '2026-05-28 01:42:05.950 +00:00', '2026-05-28 01:42:05.950 +00:00', 10, 5, 'produit', NULL),
	(11, 5, 'test', '2026-05-28 10:37:21.816 +00:00', '2026-05-28 10:37:21.816 +00:00', 61, 1, 'produit', NULL),
	(12, 5, 'test', '2026-05-28 10:37:21.860 +00:00', '2026-05-28 10:37:21.860 +00:00', 62, 1, 'produit', NULL);
/*!40000 ALTER TABLE "avis" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. avoirs
CREATE TABLE IF NOT EXISTS `avoirs` (`id_avoir` INTEGER PRIMARY KEY AUTOINCREMENT, `numero_avoir` VARCHAR(255) NOT NULL UNIQUE, `montant` INTEGER NOT NULL, `motif` TEXT NOT NULL, `date_emission` DATETIME NOT NULL, `date_expiration` DATETIME, `statut` TEXT DEFAULT 'en attente', `notes` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_commande` INTEGER REFERENCES `commandes` (`id_commande`) ON DELETE SET NULL ON UPDATE CASCADE, `id_utilisateur` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.avoirs : 5 rows
/*!40000 ALTER TABLE "avoirs" DISABLE KEYS */;
INSERT INTO "avoirs" ("id_avoir", "numero_avoir", "montant", "motif", "date_emission", "date_expiration", "statut", "notes", "created_at", "updated_at", "id_commande", "id_utilisateur") VALUES
	(1, 'AVR-2024-001', 25000, 'Produit défectueux', '2024-01-20 00:00:00.000 +00:00', NULL, 'utilisé', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 1, NULL),
	(2, 'AVR-2024-002', 15000, 'Erreur de taille', '2024-02-15 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 2, NULL),
	(3, 'AVR-2024-003', 35000, 'Couleur différente', '2024-03-10 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 3, NULL),
	(4, 'AVR-2024-004', 20000, 'Client satisfait', '2024-04-05 00:00:00.000 +00:00', NULL, 'expiré', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 4, NULL),
	(5, 'AVR-2024-005', 40000, 'Retour produit', '2024-05-01 00:00:00.000 +00:00', NULL, 'en attente', NULL, '2026-05-28 01:42:05.835 +00:00', '2026-05-28 01:42:05.835 +00:00', 5, NULL);
/*!40000 ALTER TABLE "avoirs" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. caisses
CREATE TABLE IF NOT EXISTS `caisses` (`id_caisse` INTEGER PRIMARY KEY, `nom` VARCHAR(255) NOT NULL, `solde_initial` INTEGER DEFAULT '0', `solde_actuel` INTEGER DEFAULT '0', `date_ouverture` DATETIME NOT NULL, `date_fermeture` DATETIME, `statut` TEXT DEFAULT 'ouverte', `responsable_actuel` VARCHAR(255), `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_responsable` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.caisses : 6 rows
/*!40000 ALTER TABLE "caisses" DISABLE KEYS */;
INSERT INTO "caisses" ("id_caisse", "nom", "solde_initial", "solde_actuel", "date_ouverture", "date_fermeture", "statut", "responsable_actuel", "created_at", "updated_at", "id_responsable") VALUES
	(1, 'Caisse 1 - Entrée', 500000, 567993, '2026-05-28 01:41:27.117 +00:00', NULL, 'ouverte', 'Administrateur', '2026-05-28 01:41:27.117 +00:00', '2026-05-28 21:59:19.333 +00:00', NULL),
	(2, 'Caisse 2 - Sortie', 500000, 500000, '2026-05-28 01:41:27.117 +00:00', NULL, 'ouverte', 'Bob Dupont', '2026-05-28 01:41:27.117 +00:00', '2026-05-28 01:41:27.117 +00:00', NULL),
	(3, 'Caisse 3 - Réserve', 300000, 300000, '2026-05-28 01:41:27.117 +00:00', NULL, 'ouverte', 'Charles Mbarga', '2026-05-28 01:41:27.117 +00:00', '2026-05-28 01:41:27.117 +00:00', NULL),
	(4, 'Caisse 1 - Entrée', 500000, 500000, '2026-05-28 01:42:05.439 +00:00', NULL, 'ouverte', 'Alice Martin', '2026-05-28 01:42:05.439 +00:00', '2026-05-28 01:42:05.439 +00:00', NULL),
	(5, 'Caisse 2 - Sortie', 500000, 500000, '2026-05-28 01:42:05.439 +00:00', NULL, 'ouverte', 'Bob Dupont', '2026-05-28 01:42:05.439 +00:00', '2026-05-28 01:42:05.439 +00:00', NULL),
	(6, 'Caisse 3 - Réserve', 300000, 300000, '2026-05-28 01:42:05.439 +00:00', NULL, 'ouverte', 'Charles Mbarga', '2026-05-28 01:42:05.439 +00:00', '2026-05-28 01:42:05.439 +00:00', NULL);
/*!40000 ALTER TABLE "caisses" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. codes_barres
CREATE TABLE IF NOT EXISTS `codes_barres` (`id_code` INTEGER PRIMARY KEY AUTOINCREMENT, `code_barre` VARCHAR(255) NOT NULL UNIQUE, `type_code` TEXT NOT NULL DEFAULT 'EAN13', `qr_code_data` TEXT, `actif` TINYINT(1) DEFAULT 1, `date_generation` DATETIME, `date_scan` DATETIME, `nombre_scans` INTEGER DEFAULT 0, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_produit` INTEGER REFERENCES `produits` (`id_produit`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.codes_barres : 100 rows
/*!40000 ALTER TABLE "codes_barres" DISABLE KEYS */;
INSERT INTO "codes_barres" ("id_code", "code_barre", "type_code", "qr_code_data", "actif", "date_generation", "date_scan", "nombre_scans", "created_at", "updated_at", "id_produit") VALUES
	(1, '0938445531172', 'EAN13', NULL, 1, '2026-05-28 00:32:14.967 +00:00', NULL, 0, '2026-05-28 00:32:14.968 +00:00', '2026-05-28 00:32:14.968 +00:00', 1),
	(2, '5487391408304', 'EAN13', NULL, 1, '2026-05-28 00:32:14.981 +00:00', NULL, 0, '2026-05-28 00:32:14.981 +00:00', '2026-05-28 00:32:14.981 +00:00', 2),
	(3, '6960824681035', 'EAN13', NULL, 1, '2026-05-28 00:32:14.990 +00:00', NULL, 0, '2026-05-28 00:32:14.990 +00:00', '2026-05-28 00:32:14.990 +00:00', 3),
	(4, '7612081811470', 'EAN13', NULL, 1, '2026-05-28 00:32:14.997 +00:00', NULL, 0, '2026-05-28 00:32:14.997 +00:00', '2026-05-28 00:32:14.997 +00:00', 4),
	(5, '3371897411864', 'EAN13', NULL, 1, '2026-05-28 00:32:15.005 +00:00', NULL, 0, '2026-05-28 00:32:15.005 +00:00', '2026-05-28 00:32:15.005 +00:00', 5),
	(6, '1492648182320', 'EAN13', NULL, 1, '2026-05-28 00:32:15.013 +00:00', NULL, 0, '2026-05-28 00:32:15.013 +00:00', '2026-05-28 00:32:15.013 +00:00', 6),
	(7, '6387668639433', 'EAN13', NULL, 1, '2026-05-28 00:32:15.020 +00:00', NULL, 0, '2026-05-28 00:32:15.020 +00:00', '2026-05-28 00:32:15.020 +00:00', 7),
	(8, '9294858593208', 'EAN13', NULL, 1, '2026-05-28 00:32:15.028 +00:00', NULL, 0, '2026-05-28 00:32:15.028 +00:00', '2026-05-28 00:32:15.028 +00:00', 8),
	(9, '3932442797033', 'EAN13', NULL, 1, '2026-05-28 00:32:15.037 +00:00', NULL, 0, '2026-05-28 00:32:15.037 +00:00', '2026-05-28 00:32:15.037 +00:00', 9),
	(10, '2726070835981', 'EAN13', NULL, 1, '2026-05-28 00:32:15.045 +00:00', NULL, 0, '2026-05-28 00:32:15.045 +00:00', '2026-05-28 00:32:15.045 +00:00', 10),
	(11, '6128875858497', 'EAN13', NULL, 1, '2026-05-28 00:32:15.053 +00:00', NULL, 0, '2026-05-28 00:32:15.053 +00:00', '2026-05-28 00:32:15.053 +00:00', 11),
	(12, '3334288722789', 'EAN13', NULL, 1, '2026-05-28 00:32:15.060 +00:00', NULL, 0, '2026-05-28 00:32:15.060 +00:00', '2026-05-28 00:32:15.060 +00:00', 12),
	(13, '5724437360562', 'EAN13', NULL, 1, '2026-05-28 00:32:15.164 +00:00', NULL, 0, '2026-05-28 00:32:15.164 +00:00', '2026-05-28 00:32:15.164 +00:00', 13),
	(14, '4981865021231', 'EAN13', NULL, 1, '2026-05-28 00:32:15.201 +00:00', NULL, 0, '2026-05-28 00:32:15.201 +00:00', '2026-05-28 00:32:15.201 +00:00', 14),
	(15, '8121678060393', 'EAN13', NULL, 1, '2026-05-28 00:32:15.208 +00:00', NULL, 0, '2026-05-28 00:32:15.208 +00:00', '2026-05-28 00:32:15.208 +00:00', 15),
	(16, '5782872799057', 'EAN13', NULL, 1, '2026-05-28 00:32:15.215 +00:00', NULL, 0, '2026-05-28 00:32:15.215 +00:00', '2026-05-28 00:32:15.215 +00:00', 16),
	(17, '4751970969984', 'EAN13', NULL, 1, '2026-05-28 00:32:15.222 +00:00', NULL, 0, '2026-05-28 00:32:15.222 +00:00', '2026-05-28 00:32:15.222 +00:00', 17),
	(18, '9115314212351', 'EAN13', NULL, 1, '2026-05-28 00:32:15.228 +00:00', NULL, 0, '2026-05-28 00:32:15.228 +00:00', '2026-05-28 00:32:15.228 +00:00', 18),
	(19, '4576924060827', 'EAN13', NULL, 1, '2026-05-28 00:32:15.235 +00:00', NULL, 0, '2026-05-28 00:32:15.235 +00:00', '2026-05-28 00:32:15.235 +00:00', 19),
	(20, '4336105781657', 'EAN13', NULL, 1, '2026-05-28 00:32:15.243 +00:00', NULL, 0, '2026-05-28 00:32:15.243 +00:00', '2026-05-28 00:32:15.243 +00:00', 20),
	(21, '6824944016330', 'EAN13', NULL, 1, '2026-05-28 00:32:15.250 +00:00', NULL, 0, '2026-05-28 00:32:15.250 +00:00', '2026-05-28 00:32:15.250 +00:00', 21),
	(22, '7556018839802', 'EAN13', NULL, 1, '2026-05-28 00:32:15.258 +00:00', NULL, 0, '2026-05-28 00:32:15.258 +00:00', '2026-05-28 00:32:15.258 +00:00', 22),
	(23, '7315228078254', 'EAN13', NULL, 1, '2026-05-28 00:32:15.265 +00:00', NULL, 0, '2026-05-28 00:32:15.265 +00:00', '2026-05-28 00:32:15.265 +00:00', 23),
	(24, '7114719474021', 'EAN13', NULL, 1, '2026-05-28 00:32:15.272 +00:00', NULL, 0, '2026-05-28 00:32:15.272 +00:00', '2026-05-28 00:32:15.272 +00:00', 24),
	(25, '5263139650163', 'EAN13', NULL, 1, '2026-05-28 00:32:15.279 +00:00', NULL, 0, '2026-05-28 00:32:15.279 +00:00', '2026-05-28 00:32:15.279 +00:00', 25),
	(26, '9823881054822', 'EAN13', NULL, 1, '2026-05-28 00:32:15.287 +00:00', NULL, 0, '2026-05-28 00:32:15.287 +00:00', '2026-05-28 00:32:15.287 +00:00', 26),
	(27, '7790425290898', 'EAN13', NULL, 1, '2026-05-28 00:32:15.293 +00:00', NULL, 0, '2026-05-28 00:32:15.293 +00:00', '2026-05-28 00:32:15.293 +00:00', 27),
	(28, '3045263293285', 'EAN13', NULL, 1, '2026-05-28 00:32:15.300 +00:00', NULL, 0, '2026-05-28 00:32:15.300 +00:00', '2026-05-28 00:32:15.300 +00:00', 28),
	(29, '0502067700935', 'EAN13', NULL, 1, '2026-05-28 00:32:15.306 +00:00', NULL, 0, '2026-05-28 00:32:15.306 +00:00', '2026-05-28 00:32:15.306 +00:00', 29),
	(30, '6793668537042', 'EAN13', NULL, 1, '2026-05-28 00:32:15.313 +00:00', NULL, 0, '2026-05-28 00:32:15.313 +00:00', '2026-05-28 00:32:15.313 +00:00', 30),
	(31, '7215253249813', 'EAN13', NULL, 1, '2026-05-28 00:32:15.320 +00:00', NULL, 0, '2026-05-28 00:32:15.320 +00:00', '2026-05-28 00:32:15.320 +00:00', 31),
	(32, '7081671125370', 'EAN13', NULL, 1, '2026-05-28 00:32:15.327 +00:00', NULL, 0, '2026-05-28 00:32:15.327 +00:00', '2026-05-28 00:32:15.327 +00:00', 32),
	(33, '5517649353916', 'EAN13', NULL, 1, '2026-05-28 00:32:15.333 +00:00', NULL, 0, '2026-05-28 00:32:15.333 +00:00', '2026-05-28 00:32:15.333 +00:00', 33),
	(34, '8904136045183', 'EAN13', NULL, 1, '2026-05-28 00:32:15.341 +00:00', NULL, 0, '2026-05-28 00:32:15.341 +00:00', '2026-05-28 00:32:15.341 +00:00', 34),
	(35, '5376099580132', 'EAN13', NULL, 1, '2026-05-28 00:32:15.347 +00:00', NULL, 0, '2026-05-28 00:32:15.347 +00:00', '2026-05-28 00:32:15.347 +00:00', 35),
	(36, '1007875610586', 'EAN13', NULL, 1, '2026-05-28 00:32:15.355 +00:00', NULL, 0, '2026-05-28 00:32:15.355 +00:00', '2026-05-28 00:32:15.355 +00:00', 36),
	(37, '9231580652131', 'EAN13', NULL, 1, '2026-05-28 00:32:15.362 +00:00', NULL, 0, '2026-05-28 00:32:15.362 +00:00', '2026-05-28 00:32:15.362 +00:00', 37),
	(38, '5423984088690', 'EAN13', NULL, 1, '2026-05-28 00:32:15.372 +00:00', NULL, 0, '2026-05-28 00:32:15.372 +00:00', '2026-05-28 00:32:15.372 +00:00', 38),
	(39, '2141987718439', 'EAN13', NULL, 1, '2026-05-28 00:32:15.380 +00:00', NULL, 0, '2026-05-28 00:32:15.380 +00:00', '2026-05-28 00:32:15.380 +00:00', 39),
	(40, '8352281801664', 'EAN13', NULL, 1, '2026-05-28 00:32:15.396 +00:00', NULL, 0, '2026-05-28 00:32:15.396 +00:00', '2026-05-28 00:32:15.396 +00:00', 40),
	(41, '0178867994227', 'EAN13', NULL, 1, '2026-05-28 00:32:15.409 +00:00', NULL, 0, '2026-05-28 00:32:15.409 +00:00', '2026-05-28 00:32:15.409 +00:00', 41),
	(42, '8138929480244', 'EAN13', NULL, 1, '2026-05-28 00:32:15.416 +00:00', NULL, 0, '2026-05-28 00:32:15.416 +00:00', '2026-05-28 00:32:15.416 +00:00', 42),
	(43, '2795985824878', 'EAN13', NULL, 1, '2026-05-28 00:32:15.422 +00:00', NULL, 0, '2026-05-28 00:32:15.422 +00:00', '2026-05-28 00:32:15.422 +00:00', 43),
	(44, '2496163407882', 'EAN13', NULL, 1, '2026-05-28 00:32:15.428 +00:00', NULL, 0, '2026-05-28 00:32:15.428 +00:00', '2026-05-28 00:32:15.428 +00:00', 44),
	(45, '7159163994992', 'EAN13', NULL, 1, '2026-05-28 00:32:15.434 +00:00', NULL, 0, '2026-05-28 00:32:15.434 +00:00', '2026-05-28 00:32:15.434 +00:00', 45),
	(46, '2546457281756', 'EAN13', NULL, 1, '2026-05-28 00:32:15.441 +00:00', NULL, 0, '2026-05-28 00:32:15.441 +00:00', '2026-05-28 00:32:15.441 +00:00', 46),
	(47, '1970089106469', 'EAN13', NULL, 1, '2026-05-28 00:32:15.447 +00:00', NULL, 0, '2026-05-28 00:32:15.447 +00:00', '2026-05-28 00:32:15.447 +00:00', 47),
	(48, '4163030748536', 'EAN13', NULL, 1, '2026-05-28 00:32:15.454 +00:00', NULL, 0, '2026-05-28 00:32:15.454 +00:00', '2026-05-28 00:32:15.454 +00:00', 48),
	(49, '3090462535933', 'EAN13', NULL, 1, '2026-05-28 00:32:15.459 +00:00', NULL, 0, '2026-05-28 00:32:15.459 +00:00', '2026-05-28 00:32:15.459 +00:00', 49),
	(50, '5804796265545', 'EAN13', NULL, 1, '2026-05-28 00:32:15.465 +00:00', NULL, 0, '2026-05-28 00:32:15.465 +00:00', '2026-05-28 00:32:15.465 +00:00', 50),
	(51, '9988496376858', 'EAN13', NULL, 1, '2026-05-28 00:32:15.471 +00:00', NULL, 0, '2026-05-28 00:32:15.471 +00:00', '2026-05-28 00:32:15.471 +00:00', 51),
	(52, '1631664840177', 'EAN13', NULL, 1, '2026-05-28 00:32:15.478 +00:00', NULL, 0, '2026-05-28 00:32:15.478 +00:00', '2026-05-28 00:32:15.478 +00:00', 52),
	(53, '4078361194719', 'EAN13', NULL, 1, '2026-05-28 00:32:15.484 +00:00', NULL, 0, '2026-05-28 00:32:15.484 +00:00', '2026-05-28 00:32:15.484 +00:00', 53),
	(54, '8192264514156', 'EAN13', NULL, 1, '2026-05-28 00:32:15.490 +00:00', NULL, 0, '2026-05-28 00:32:15.490 +00:00', '2026-05-28 00:32:15.490 +00:00', 54),
	(55, '3524955737554', 'EAN13', NULL, 1, '2026-05-28 00:32:15.495 +00:00', NULL, 0, '2026-05-28 00:32:15.495 +00:00', '2026-05-28 00:32:15.495 +00:00', 55),
	(56, '5271846938986', 'EAN13', NULL, 1, '2026-05-28 00:32:15.501 +00:00', NULL, 0, '2026-05-28 00:32:15.501 +00:00', '2026-05-28 00:32:15.501 +00:00', 56),
	(57, '5895670671613', 'EAN13', NULL, 1, '2026-05-28 00:32:15.506 +00:00', NULL, 0, '2026-05-28 00:32:15.506 +00:00', '2026-05-28 00:32:15.506 +00:00', 57),
	(58, '7166699395162', 'EAN13', NULL, 1, '2026-05-28 00:32:15.513 +00:00', NULL, 0, '2026-05-28 00:32:15.513 +00:00', '2026-05-28 00:32:15.513 +00:00', 58),
	(59, '1035535167507', 'EAN13', NULL, 1, '2026-05-28 00:32:15.519 +00:00', NULL, 0, '2026-05-28 00:32:15.519 +00:00', '2026-05-28 00:32:15.519 +00:00', 59),
	(60, '1946887562950', 'EAN13', NULL, 1, '2026-05-28 00:32:15.524 +00:00', NULL, 0, '2026-05-28 00:32:15.524 +00:00', '2026-05-28 00:32:15.524 +00:00', 60),
	(61, '3849049111004', 'EAN13', NULL, 1, '2026-05-28 00:32:15.530 +00:00', NULL, 0, '2026-05-28 00:32:15.530 +00:00', '2026-05-28 00:32:15.530 +00:00', 61),
	(62, '2507051098065', 'EAN13', NULL, 1, '2026-05-28 00:32:15.536 +00:00', NULL, 0, '2026-05-28 00:32:15.536 +00:00', '2026-05-28 00:32:15.536 +00:00', 62),
	(63, '4044486378648', 'EAN13', NULL, 1, '2026-05-28 00:32:15.541 +00:00', NULL, 0, '2026-05-28 00:32:15.541 +00:00', '2026-05-28 00:32:15.541 +00:00', 63),
	(64, '9278299657088', 'EAN13', NULL, 1, '2026-05-28 00:32:15.546 +00:00', NULL, 0, '2026-05-28 00:32:15.546 +00:00', '2026-05-28 00:32:15.546 +00:00', 64),
	(65, '0010449223533', 'EAN13', NULL, 1, '2026-05-28 00:32:15.552 +00:00', NULL, 0, '2026-05-28 00:32:15.552 +00:00', '2026-05-28 00:32:15.552 +00:00', 65),
	(66, '2087154708141', 'EAN13', NULL, 1, '2026-05-28 00:32:15.558 +00:00', NULL, 0, '2026-05-28 00:32:15.558 +00:00', '2026-05-28 00:32:15.558 +00:00', 66),
	(67, '0606167480893', 'EAN13', NULL, 1, '2026-05-28 00:32:15.564 +00:00', NULL, 0, '2026-05-28 00:32:15.564 +00:00', '2026-05-28 00:32:15.564 +00:00', 67),
	(68, '8688040158909', 'EAN13', NULL, 1, '2026-05-28 00:32:15.572 +00:00', NULL, 0, '2026-05-28 00:32:15.572 +00:00', '2026-05-28 00:32:15.572 +00:00', 68),
	(69, '7983944526061', 'EAN13', NULL, 1, '2026-05-28 00:32:15.579 +00:00', NULL, 0, '2026-05-28 00:32:15.579 +00:00', '2026-05-28 00:32:15.579 +00:00', 69),
	(70, '1452582666973', 'EAN13', NULL, 1, '2026-05-28 00:32:15.585 +00:00', NULL, 0, '2026-05-28 00:32:15.585 +00:00', '2026-05-28 00:32:15.585 +00:00', 70),
	(71, '8494386187332', 'EAN13', NULL, 1, '2026-05-28 00:32:15.593 +00:00', NULL, 0, '2026-05-28 00:32:15.593 +00:00', '2026-05-28 00:32:15.593 +00:00', 71),
	(72, '1914432739072', 'EAN13', NULL, 1, '2026-05-28 00:32:15.599 +00:00', NULL, 0, '2026-05-28 00:32:15.599 +00:00', '2026-05-28 00:32:15.599 +00:00', 72),
	(73, '8836453497959', 'EAN13', NULL, 1, '2026-05-28 00:32:15.605 +00:00', NULL, 0, '2026-05-28 00:32:15.605 +00:00', '2026-05-28 00:32:15.605 +00:00', 73),
	(74, '7547250969228', 'EAN13', NULL, 1, '2026-05-28 00:32:15.611 +00:00', NULL, 0, '2026-05-28 00:32:15.611 +00:00', '2026-05-28 00:32:15.611 +00:00', 74),
	(75, '9036255929743', 'EAN13', NULL, 1, '2026-05-28 00:32:15.616 +00:00', NULL, 0, '2026-05-28 00:32:15.616 +00:00', '2026-05-28 00:32:15.616 +00:00', 75),
	(76, '3306627110922', 'EAN13', NULL, 1, '2026-05-28 00:32:15.621 +00:00', NULL, 0, '2026-05-28 00:32:15.621 +00:00', '2026-05-28 00:32:15.621 +00:00', 76),
	(77, '8014174035319', 'EAN13', NULL, 1, '2026-05-28 00:32:15.626 +00:00', NULL, 0, '2026-05-28 00:32:15.626 +00:00', '2026-05-28 00:32:15.626 +00:00', 77),
	(78, '8653363404132', 'EAN13', NULL, 1, '2026-05-28 00:32:15.632 +00:00', NULL, 0, '2026-05-28 00:32:15.632 +00:00', '2026-05-28 00:32:15.632 +00:00', 78),
	(79, '0110431433633', 'EAN13', NULL, 1, '2026-05-28 00:32:15.638 +00:00', NULL, 0, '2026-05-28 00:32:15.638 +00:00', '2026-05-28 00:32:15.638 +00:00', 79),
	(80, '3214944370274', 'EAN13', NULL, 1, '2026-05-28 00:32:15.644 +00:00', NULL, 0, '2026-05-28 00:32:15.644 +00:00', '2026-05-28 00:32:15.644 +00:00', 80),
	(81, '1598478213354', 'EAN13', NULL, 1, '2026-05-28 00:32:15.649 +00:00', NULL, 0, '2026-05-28 00:32:15.649 +00:00', '2026-05-28 00:32:15.649 +00:00', 81),
	(82, '0958467189410', 'EAN13', NULL, 1, '2026-05-28 00:32:15.655 +00:00', NULL, 0, '2026-05-28 00:32:15.655 +00:00', '2026-05-28 00:32:15.655 +00:00', 82),
	(83, '3319546465516', 'EAN13', NULL, 1, '2026-05-28 00:32:15.681 +00:00', NULL, 0, '2026-05-28 00:32:15.681 +00:00', '2026-05-28 00:32:15.681 +00:00', 83),
	(84, '5335775210176', 'EAN13', NULL, 1, '2026-05-28 00:32:15.824 +00:00', NULL, 0, '2026-05-28 00:32:15.824 +00:00', '2026-05-28 00:32:15.824 +00:00', 84),
	(85, '4093440878632', 'EAN13', NULL, 1, '2026-05-28 00:32:15.907 +00:00', NULL, 0, '2026-05-28 00:32:15.907 +00:00', '2026-05-28 00:32:15.907 +00:00', 85),
	(86, '0442983594006', 'EAN13', NULL, 1, '2026-05-28 00:32:15.922 +00:00', NULL, 0, '2026-05-28 00:32:15.922 +00:00', '2026-05-28 00:32:15.922 +00:00', 86),
	(87, '0719742494663', 'EAN13', NULL, 1, '2026-05-28 00:32:15.929 +00:00', NULL, 0, '2026-05-28 00:32:15.929 +00:00', '2026-05-28 00:32:15.929 +00:00', 87),
	(88, '3161948986393', 'EAN13', NULL, 1, '2026-05-28 00:32:15.936 +00:00', NULL, 0, '2026-05-28 00:32:15.936 +00:00', '2026-05-28 00:32:15.936 +00:00', 88),
	(89, '9954578403996', 'EAN13', NULL, 1, '2026-05-28 00:32:15.943 +00:00', NULL, 0, '2026-05-28 00:32:15.943 +00:00', '2026-05-28 00:32:15.943 +00:00', 89),
	(90, '5161137055525', 'EAN13', NULL, 1, '2026-05-28 00:32:15.950 +00:00', NULL, 0, '2026-05-28 00:32:15.950 +00:00', '2026-05-28 00:32:15.950 +00:00', 90),
	(91, '0499134872650', 'EAN13', NULL, 1, '2026-05-28 00:32:15.956 +00:00', NULL, 0, '2026-05-28 00:32:15.956 +00:00', '2026-05-28 00:32:15.956 +00:00', 91),
	(92, '0762307757147', 'EAN13', NULL, 1, '2026-05-28 00:32:15.961 +00:00', NULL, 0, '2026-05-28 00:32:15.962 +00:00', '2026-05-28 00:32:15.962 +00:00', 92),
	(93, '5182956554617', 'EAN13', NULL, 1, '2026-05-28 00:32:15.968 +00:00', NULL, 0, '2026-05-28 00:32:15.968 +00:00', '2026-05-28 00:32:15.968 +00:00', 93),
	(94, '6281198752771', 'EAN13', NULL, 1, '2026-05-28 00:32:15.975 +00:00', NULL, 0, '2026-05-28 00:32:15.975 +00:00', '2026-05-28 00:32:15.975 +00:00', 94),
	(95, '7926309594657', 'EAN13', NULL, 1, '2026-05-28 00:32:15.981 +00:00', NULL, 0, '2026-05-28 00:32:15.981 +00:00', '2026-05-28 00:32:15.981 +00:00', 95),
	(96, '0036851410729', 'EAN13', NULL, 1, '2026-05-28 00:32:15.988 +00:00', NULL, 0, '2026-05-28 00:32:15.989 +00:00', '2026-05-28 00:32:15.989 +00:00', 96),
	(97, '7410326953820', 'EAN13', NULL, 1, '2026-05-28 00:32:15.995 +00:00', NULL, 0, '2026-05-28 00:32:15.995 +00:00', '2026-05-28 00:32:15.995 +00:00', 97),
	(98, '3394034055745', 'EAN13', NULL, 1, '2026-05-28 00:32:16.001 +00:00', NULL, 0, '2026-05-28 00:32:16.001 +00:00', '2026-05-28 00:32:16.001 +00:00', 98),
	(99, '9497170134948', 'EAN13', NULL, 1, '2026-05-28 00:32:16.009 +00:00', NULL, 0, '2026-05-28 00:32:16.009 +00:00', '2026-05-28 00:32:16.009 +00:00', 99),
	(100, '5312740328678', 'EAN13', NULL, 1, '2026-05-28 00:32:16.016 +00:00', NULL, 0, '2026-05-28 00:32:16.016 +00:00', '2026-05-28 00:32:16.016 +00:00', 100);
/*!40000 ALTER TABLE "codes_barres" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. commandes
CREATE TABLE IF NOT EXISTS `commandes` (`id_commande` INTEGER PRIMARY KEY, `total_xaf` INTEGER NOT NULL, `moyen_paiement` TEXT NOT NULL, `frais_livraison` INTEGER DEFAULT '3000', `points_utilises` INTEGER DEFAULT '0', `remise_appliquee` INTEGER DEFAULT '0', `adresse_livraison` TEXT NOT NULL, `statut` TEXT DEFAULT 'En attente', `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_utilisateur` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE, `id_caisse` INTEGER REFERENCES `caisses` (`id_caisse`) ON DELETE SET NULL ON UPDATE CASCADE, `montant_rembourse` INTEGER DEFAULT 0);

-- Listage des données de la table sport-equip.commandes : 9 rows
/*!40000 ALTER TABLE "commandes" DISABLE KEYS */;
INSERT INTO "commandes" ("id_commande", "total_xaf", "moyen_paiement", "frais_livraison", "points_utilises", "remise_appliquee", "adresse_livraison", "statut", "created_at", "updated_at", "id_utilisateur", "id_caisse", "montant_rembourse") VALUES
	(1, 15000, 'Mobile Money', 3000, 0, 0, 'hfv', 'Payée', '2026-05-26 00:10:45.005 +00:00', '2026-05-26 00:10:45.034 +00:00', 3, NULL, 0),
	(2, 98396, 'Cash', 0, 36, 20, 'test', 'Payée', '2026-05-26 07:54:11.567 +00:00', '2026-05-26 07:54:11.619 +00:00', 1, NULL, 0),
	(3, 141990, 'Mobile Money', 0, 102, 0, 'Yaoundé, Cameroun', 'Payée', '2026-05-26 08:25:55.368 +00:00', '2026-05-26 08:25:55.404 +00:00', 2, NULL, 0),
	(4, 12000, 'Mobile Money', 3000, 0, 0, 'Admin adresse test
', 'Payée', '2026-05-26 09:11:33.165 +00:00', '2026-05-26 09:11:33.189 +00:00', 1, NULL, 0),
	(5, 58000, 'Cash', 0, 0, 0, 'Admin adresse test
', 'En attente', '2026-05-27 01:15:58.978 +00:00', '2026-05-27 01:15:58.978 +00:00', 1, NULL, 0),
	(6, 58000, 'Cash', 0, 0, 0, 'Admin adresse test
', 'Payée', '2026-05-27 01:25:10.832 +00:00', '2026-05-27 01:25:10.901 +00:00', 1, NULL, 0),
	(7, 130000, 'Mobile Money', 0, 0, 0, 'Admin adresse test
', 'Livrée', '2026-05-28 00:59:52.430 +00:00', '2026-05-28 01:01:34.629 +00:00', 1, NULL, 0),
	(8, 42993, 'PayPal', 3000, 73, 0, 'Admin adresse test
', 'Payée', '2026-05-28 21:46:42.993 +00:00', '2026-05-28 21:46:43.044 +00:00', 1, 1, 0),
	(9, 25000, 'Carte bancaire', 3000, 0, 0, 'Admin adresse test
', 'Payée', '2026-05-28 21:59:19.308 +00:00', '2026-05-28 21:59:19.338 +00:00', 1, 1, 0);
/*!40000 ALTER TABLE "commandes" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. commandes_backup
CREATE TABLE IF NOT EXISTS `commandes_backup` (`id_commande` INTEGER PRIMARY KEY, `total_xaf` INTEGER NOT NULL, `moyen_paiement` TEXT NOT NULL, `frais_livraison` INTEGER DEFAULT '3000', `points_utilises` INTEGER DEFAULT '0', `remise_appliquee` INTEGER DEFAULT '0', `adresse_livraison` TEXT NOT NULL, `statut` TEXT DEFAULT 'En attente', `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_utilisateur` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`));

-- Listage des données de la table sport-equip.commandes_backup : 4 rows
/*!40000 ALTER TABLE "commandes_backup" DISABLE KEYS */;
INSERT INTO "commandes_backup" ("id_commande", "total_xaf", "moyen_paiement", "frais_livraison", "points_utilises", "remise_appliquee", "adresse_livraison", "statut", "created_at", "updated_at", "id_utilisateur") VALUES
	(1, 15000, 'Mobile Money', 3000, 0, 0, 'hfv', 'Payée', '2026-05-26 00:10:45.005 +00:00', '2026-05-26 00:10:45.034 +00:00', NULL),
	(2, 98396, 'Cash', 0, 36, 20, 'test', 'Payée', '2026-05-26 07:54:11.567 +00:00', '2026-05-26 07:54:11.619 +00:00', NULL),
	(3, 141990, 'Mobile Money', 0, 102, 0, 'Yaoundé, Cameroun', 'Payée', '2026-05-26 08:25:55.368 +00:00', '2026-05-26 08:25:55.404 +00:00', NULL),
	(4, 12000, 'Mobile Money', 3000, 0, 0, 'Admin adresse test
', 'Payée', '2026-05-26 09:11:33.165 +00:00', '2026-05-26 09:11:33.189 +00:00', NULL);
/*!40000 ALTER TABLE "commandes_backup" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. demandes_remboursement
CREATE TABLE IF NOT EXISTS `demandes_remboursement` (`id_demande` INTEGER PRIMARY KEY AUTOINCREMENT, `id_commande` INTEGER NOT NULL REFERENCES `commandes` (`id_commande`) ON DELETE NO ACTION ON UPDATE CASCADE, `id_utilisateur` INTEGER NOT NULL REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE NO ACTION ON UPDATE CASCADE, `type_demande` TEXT NOT NULL, `raison` TEXT NOT NULL, `description` TEXT, `statut` TEXT DEFAULT 'en_attente', `date_demande` DATETIME NOT NULL, `date_traitement` DATETIME, `montant_rembourse` INTEGER, `notes_admin` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.demandes_remboursement : 3 rows
/*!40000 ALTER TABLE "demandes_remboursement" DISABLE KEYS */;
INSERT INTO "demandes_remboursement" ("id_demande", "id_commande", "id_utilisateur", "type_demande", "raison", "description", "statut", "date_demande", "date_traitement", "montant_rembourse", "notes_admin", "created_at", "updated_at") VALUES
	(1, 1, 2, 'remboursement', 'Produit défectueux', 'Le produit reçu est défectueux et ne fonctionne pas correctement', 'refuse', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:48:41.385 +00:00', NULL, 'produit endommagé', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:48:41.386 +00:00'),
	(2, 2, 3, 'echange', 'Taille incorrecte', 'La taille ne correspond pas à celle commandée', 'approuve', '2026-05-24 23:21:33.731 +00:00', NULL, 0, 'Échange autorisé', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:21:33.731 +00:00'),
	(3, 3, 3, 'remboursement', 'Produit ne correspond pas à la description', 'Le produit reçu ne correspond pas à la description sur le site', 'refuse', '2026-05-21 23:21:33.731 +00:00', NULL, NULL, 'Produit conforme à la description', '2026-05-26 23:21:33.731 +00:00', '2026-05-26 23:21:33.731 +00:00');
/*!40000 ALTER TABLE "demandes_remboursement" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. fournisseurs
CREATE TABLE IF NOT EXISTS `fournisseurs` (`id_fournisseur` INTEGER PRIMARY KEY AUTOINCREMENT, `nom` VARCHAR(255) NOT NULL, `contact` VARCHAR(255), `email` VARCHAR(255), `telephone` VARCHAR(255), `adresse` TEXT, `ville` VARCHAR(255), `pays` VARCHAR(255) DEFAULT 'Cameroun', `delai_livraison` INTEGER DEFAULT 7, `conditions_paiement` VARCHAR(255) DEFAULT '30 jours', `notes` TEXT, `actif` TINYINT(1) DEFAULT 1, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.fournisseurs : 10 rows
/*!40000 ALTER TABLE "fournisseurs" DISABLE KEYS */;
INSERT INTO "fournisseurs" ("id_fournisseur", "nom", "contact", "email", "telephone", "adresse", "ville", "pays", "delai_livraison", "conditions_paiement", "notes", "actif", "created_at", "updated_at") VALUES
	(1, 'Nike Cameroon', 'Jean Dupont', 'jean@nike.cm', '237699123456', 'Boulevard de la Liberté', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
	(2, 'Adidas Central Africa', 'Marie Kouame', 'marie@adidas.cm', '237699234567', 'Avenue Charles de Gaulle', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
	(3, 'Puma Sports', 'Paul Nkodo', 'paul@puma.cm', '237699345678', 'Rue de l''Indépendance', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
	(4, 'Under Armour', 'Sophie Mba', 'sophie@underarmour.cm', '237699456789', 'Boulevard du 20 Mai', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
	(5, 'Reebok Cameroon', 'Antoine Mbarga', 'antoine@reebok.cm', '237699567890', 'Rue Joffre', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:41:27.094 +00:00', '2026-05-28 01:41:27.094 +00:00'),
	(6, 'Nike Cameroon', 'Jean Dupont', 'jean@nike.cm', '237699123456', 'Boulevard de la Liberté', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:42:05.215 +00:00', '2026-05-28 02:14:42.413 +00:00'),
	(7, 'Adidas Central Africa', 'Marie Kouame', 'marie@adidas.cm', '237699234567', 'Avenue Charles de Gaulle', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:42:05.215 +00:00', '2026-05-28 01:42:05.215 +00:00'),
	(8, 'Puma Sports', 'Paul Nkodo', 'paul@puma.cm', '237699345678', 'Rue de l''Indépendance', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:42:05.215 +00:00', '2026-05-28 01:42:05.215 +00:00'),
	(9, 'Under Armour', 'Sophie Mba', 'sophie@underarmour.cm', '237699456789', 'Boulevard du 20 Mai', 'Yaoundé', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:42:05.215 +00:00', '2026-05-28 01:42:05.215 +00:00'),
	(10, 'Reebok Cameroon', 'Antoine Mbarga', 'antoine@reebok.cm', '237699567890', 'Rue Joffre', 'Douala', 'Cameroun', 7, '30 jours', NULL, 1, '2026-05-28 01:42:05.215 +00:00', '2026-05-28 01:42:05.215 +00:00');
/*!40000 ALTER TABLE "fournisseurs" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. inventaires
CREATE TABLE IF NOT EXISTS `inventaires` (`id_inventaire` INTEGER PRIMARY KEY AUTOINCREMENT, `type_inventaire` TEXT NOT NULL DEFAULT 'partiel', `zone` VARCHAR(255), `date_debut` DATETIME NOT NULL, `date_fin` DATETIME, `statut` TEXT DEFAULT 'en cours', `responsable` VARCHAR(255), `notes` TEXT, `total_theorique` INTEGER DEFAULT 0, `total_physique` INTEGER DEFAULT 0, `ecart` INTEGER DEFAULT 0, `taux_correspondance` FLOAT DEFAULT '0', `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_responsable` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.inventaires : 6 rows
/*!40000 ALTER TABLE "inventaires" DISABLE KEYS */;
INSERT INTO "inventaires" ("id_inventaire", "type_inventaire", "zone", "date_debut", "date_fin", "statut", "responsable", "notes", "total_theorique", "total_physique", "ecart", "taux_correspondance", "created_at", "updated_at", "id_responsable") VALUES
	(1, 'général', 'surface de vente', '2024-01-15 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 450, 448, 2, 99.56, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00', NULL),
	(2, 'partiel', 'mezzanine', '2024-03-20 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 280, 280, 0, 100.0, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00', NULL),
	(3, 'général', 'entrepôt', '2024-06-10 00:00:00.000 +00:00', NULL, 'en cours', NULL, NULL, 950, 0, 0, 0.0, '2026-05-28 01:41:27.123 +00:00', '2026-05-28 01:41:27.123 +00:00', NULL),
	(4, 'général', 'surface de vente', '2024-01-15 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 450, 448, 2, 99.56, '2026-05-28 01:42:05.556 +00:00', '2026-05-28 01:42:05.556 +00:00', NULL),
	(5, 'partiel', 'mezzanine', '2024-03-20 00:00:00.000 +00:00', NULL, 'terminé', NULL, NULL, 280, 280, 0, 100.0, '2026-05-28 01:42:05.556 +00:00', '2026-05-28 01:42:05.556 +00:00', NULL),
	(6, 'général', 'entrepôt', '2024-06-10 00:00:00.000 +00:00', NULL, 'en cours', NULL, NULL, 950, 0, 0, 0.0, '2026-05-28 01:42:05.556 +00:00', '2026-05-28 01:42:05.556 +00:00', NULL);
/*!40000 ALTER TABLE "inventaires" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. lignes_commandes
CREATE TABLE IF NOT EXISTS `lignes_commandes` (`id_ligne` INTEGER PRIMARY KEY, `quantite` INTEGER NOT NULL, `prix_unitaire_achat` INTEGER NOT NULL, `taille_selectionnee` VARCHAR(255), `couleur_selectionnee` VARCHAR(255), `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_commande` INTEGER REFERENCES `commandes` (`id_commande`), `id_produit` INTEGER REFERENCES `produits` (`id_produit`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.lignes_commandes : 20 rows
/*!40000 ALTER TABLE "lignes_commandes" DISABLE KEYS */;
INSERT INTO "lignes_commandes" ("id_ligne", "quantite", "prix_unitaire_achat", "taille_selectionnee", "couleur_selectionnee", "created_at", "updated_at", "id_commande", "id_produit") VALUES
	(1, 1, 15000, 'Unique', 'Noir', '2026-05-26 00:10:45.019 +00:00', '2026-05-26 00:10:45.019 +00:00', 1, 12),
	(2, 1, 25000, NULL, NULL, '2026-05-26 07:54:11.577 +00:00', '2026-05-26 07:54:11.577 +00:00', 2, 23),
	(3, 1, 45000, NULL, NULL, '2026-05-26 07:54:11.585 +00:00', '2026-05-26 07:54:11.585 +00:00', 2, 14),
	(4, 1, 35000, NULL, NULL, '2026-05-26 07:54:11.593 +00:00', '2026-05-26 07:54:11.593 +00:00', 2, 45),
	(5, 1, 18000, NULL, NULL, '2026-05-26 07:54:11.600 +00:00', '2026-05-26 07:54:11.600 +00:00', 2, 37),
	(6, 1, 55000, NULL, NULL, '2026-05-26 08:25:55.375 +00:00', '2026-05-26 08:25:55.375 +00:00', 3, 14),
	(7, 1, 75000, NULL, NULL, '2026-05-26 08:25:55.381 +00:00', '2026-05-26 08:25:55.381 +00:00', 3, 35),
	(8, 1, 12000, NULL, NULL, '2026-05-26 08:25:55.388 +00:00', '2026-05-26 08:25:55.388 +00:00', 3, 44),
	(9, 1, 12000, NULL, NULL, '2026-05-26 09:11:33.175 +00:00', '2026-05-26 09:11:33.175 +00:00', 4, 86),
	(10, 1, 18000, NULL, NULL, '2026-05-27 01:15:58.991 +00:00', '2026-05-27 01:15:58.991 +00:00', 5, 64),
	(11, 1, 5000, NULL, NULL, '2026-05-27 01:15:58.999 +00:00', '2026-05-27 01:15:58.999 +00:00', 5, 77),
	(12, 1, 35000, NULL, NULL, '2026-05-27 01:15:59.008 +00:00', '2026-05-27 01:15:59.008 +00:00', 5, 78),
	(13, 1, 18000, NULL, NULL, '2026-05-27 01:25:10.852 +00:00', '2026-05-27 01:25:10.852 +00:00', 6, 64),
	(14, 1, 5000, NULL, NULL, '2026-05-27 01:25:10.860 +00:00', '2026-05-27 01:25:10.860 +00:00', 6, 77),
	(15, 1, 35000, NULL, NULL, '2026-05-27 01:25:10.869 +00:00', '2026-05-27 01:25:10.869 +00:00', 6, 78),
	(16, 1, 85000, NULL, NULL, '2026-05-28 00:59:52.442 +00:00', '2026-05-28 00:59:52.442 +00:00', 7, 62),
	(17, 1, 45000, NULL, NULL, '2026-05-28 00:59:52.450 +00:00', '2026-05-28 00:59:52.450 +00:00', 7, 61),
	(18, 1, 25000, NULL, NULL, '2026-05-28 21:46:43.009 +00:00', '2026-05-28 21:46:43.009 +00:00', 8, 63),
	(19, 1, 18000, NULL, NULL, '2026-05-28 21:46:43.017 +00:00', '2026-05-28 21:46:43.017 +00:00', 8, 64),
	(20, 1, 25000, NULL, NULL, '2026-05-28 21:59:19.315 +00:00', '2026-05-28 21:59:19.315 +00:00', 9, 63);
/*!40000 ALTER TABLE "lignes_commandes" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. lignes_inventaires
CREATE TABLE IF NOT EXISTS `lignes_inventaires` (`id_ligne` INTEGER PRIMARY KEY AUTOINCREMENT, `quantite_theorique` INTEGER NOT NULL, `quantite_physique` INTEGER NOT NULL, `ecart` INTEGER DEFAULT 0, `methode_comptage` TEXT DEFAULT 'manuel', `notes` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_inventaire` INTEGER REFERENCES `inventaires` (`id_inventaire`) ON DELETE SET NULL ON UPDATE CASCADE, `id_produit` INTEGER REFERENCES `produits` (`id_produit`) ON DELETE SET NULL ON UPDATE CASCADE);

-- Listage des données de la table sport-equip.lignes_inventaires : 60 rows
/*!40000 ALTER TABLE "lignes_inventaires" DISABLE KEYS */;
INSERT INTO "lignes_inventaires" ("id_ligne", "quantite_theorique", "quantite_physique", "ecart", "methode_comptage", "notes", "created_at", "updated_at", "id_inventaire", "id_produit") VALUES
	(1, 49, 49, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 1),
	(2, 29, 29, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 2),
	(3, 24, 24, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 3),
	(4, 39, 39, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 4),
	(5, 60, 60, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 5),
	(6, 34, 34, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 6),
	(7, 79, 79, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 7),
	(8, 19, 19, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 8),
	(9, 4, 4, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 9),
	(10, 45, 45, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 1, 10),
	(11, 49, 49, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 1),
	(12, 29, 29, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 2),
	(13, 24, 24, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 3),
	(14, 39, 39, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 4),
	(15, 60, 60, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 5),
	(16, 34, 34, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 6),
	(17, 79, 79, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 7),
	(18, 19, 19, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 8),
	(19, 4, 4, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 9),
	(20, 45, 45, 0, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 2, 10),
	(21, 49, 0, 49, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 1),
	(22, 29, 0, 29, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 2),
	(23, 24, 0, 24, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 3),
	(24, 39, 0, 39, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 4),
	(25, 60, 0, 60, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 5),
	(26, 34, 0, 34, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 6),
	(27, 79, 0, 79, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 7),
	(28, 19, 0, 19, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 8),
	(29, 4, 0, 4, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 9),
	(30, 45, 0, 45, 'manuel', NULL, '2026-05-28 01:41:27.135 +00:00', '2026-05-28 01:41:27.135 +00:00', 3, 10),
	(31, 49, 49, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 1),
	(32, 29, 29, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 2),
	(33, 24, 24, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 3),
	(34, 39, 39, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 4),
	(35, 60, 60, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 5),
	(36, 34, 34, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 6),
	(37, 79, 79, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 7),
	(38, 19, 19, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 8),
	(39, 4, 4, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 9),
	(40, 45, 45, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 4, 10),
	(41, 49, 49, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 1),
	(42, 29, 29, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 2),
	(43, 24, 24, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 3),
	(44, 39, 39, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 4),
	(45, 60, 60, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 5),
	(46, 34, 34, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 6),
	(47, 79, 79, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 7),
	(48, 19, 19, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 8),
	(49, 4, 4, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 9),
	(50, 45, 45, 0, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 5, 10),
	(51, 49, 0, 49, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 1),
	(52, 29, 0, 29, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 2),
	(53, 24, 0, 24, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 3),
	(54, 39, 0, 39, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 4),
	(55, 60, 0, 60, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 5),
	(56, 34, 0, 34, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 6),
	(57, 79, 0, 79, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 7),
	(58, 19, 0, 19, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 8),
	(59, 4, 0, 4, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 9),
	(60, 45, 0, 45, 'manuel', NULL, '2026-05-28 01:42:05.677 +00:00', '2026-05-28 01:42:05.677 +00:00', 6, 10);
/*!40000 ALTER TABLE "lignes_inventaires" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. livreurs
CREATE TABLE IF NOT EXISTS `livreurs` (`id_livreur` INTEGER PRIMARY KEY AUTOINCREMENT, `nom` VARCHAR(255) NOT NULL, `prenom` VARCHAR(255) NOT NULL, `telephone` VARCHAR(255) NOT NULL UNIQUE, `email` VARCHAR(255), `vehicule` VARCHAR(255) NOT NULL, `plaque_immatriculation` VARCHAR(255) NOT NULL, `statut` TEXT DEFAULT 'disponible', `latitude` FLOAT, `longitude` FLOAT, `derniere_mise_a_jour_gps` DATETIME, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.livreurs : 5 rows
/*!40000 ALTER TABLE "livreurs" DISABLE KEYS */;
INSERT INTO "livreurs" ("id_livreur", "nom", "prenom", "telephone", "email", "vehicule", "plaque_immatriculation", "statut", "latitude", "longitude", "derniere_mise_a_jour_gps", "created_at", "updated_at") VALUES
	(1, 'Dupont', 'Jean', '+237 699 123 456', 'jean.dupont@sportequip.com', 'Moto', 'CE 123 AB', 'disponible', 3.8488, 11.5028, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
	(2, 'Martin', 'Marie', '+237 699 234 567', 'marie.martin@sportequip.com', 'Moto', 'CE 456 CD', 'disponible', 3.8588, 11.5128, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
	(3, 'Ngom', 'Pierre', '+237 699 345 678', 'pierre.ngom@sportequip.com', 'Scooter', 'CE 789 EF', 'disponible', 3.8688, 11.5228, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-28 02:23:06.700 +00:00'),
	(4, 'Faye', 'Aminata', '+237 699 456 789', 'aminata.faye@sportequip.com', 'Moto', 'CE 012 GH', 'disponible', 3.8788, 11.5328, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00'),
	(5, 'Kouame', 'Kofi', '+237 699 567 890', 'kofi.kouame@sportequip.com', 'Scooter', 'CE 345 IJ', 'disponible', 3.8888, 11.5428, '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00', '2026-05-26 23:21:33.703 +00:00');
/*!40000 ALTER TABLE "livreurs" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. mouvements_stock
CREATE TABLE IF NOT EXISTS `mouvements_stock` (`id_mouvement` INTEGER PRIMARY KEY, `id_produit` INTEGER NOT NULL REFERENCES `produits` (`id_produit`), `id_utilisateur` INTEGER REFERENCES `utilisateurs` (`id_utilisateur`), `type_mouvement` TEXT NOT NULL, `quantite` INTEGER NOT NULL, `stock_avant` INTEGER NOT NULL, `stock_apres` INTEGER NOT NULL, `motif` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.mouvements_stock : 50 rows
/*!40000 ALTER TABLE "mouvements_stock" DISABLE KEYS */;
INSERT INTO "mouvements_stock" ("id_mouvement", "id_produit", "id_utilisateur", "type_mouvement", "quantite", "stock_avant", "stock_apres", "motif", "created_at", "updated_at") VALUES
	(1, 9, 1, 'ajustement', 11, 4, 15, 'Réapprovisionnement', '2026-05-13 11:03:30.495 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(2, 2, 3, 'sortie', 6, 29, 23, 'Réception fournisseur', '2026-05-09 15:51:03.490 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(3, 3, 1, 'entree', 10, 24, 34, 'Vente client', '2026-05-24 00:27:27.781 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(4, 6, 2, 'entree', 1, 34, 35, 'Vente client', '2026-05-20 22:36:22.226 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(5, 6, 1, 'entree', 3, 34, 37, 'Perte', '2026-05-12 00:30:25.267 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(6, 4, 1, 'ajustement', -24, 39, 15, 'Perte', '2026-05-10 09:33:18.861 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(7, 10, 1, 'ajustement', -35, 45, 10, 'Réception fournisseur', '2026-04-28 05:09:51.862 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(8, 9, 1, 'entree', 10, 4, 14, 'Vente client', '2026-05-07 19:12:54.588 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(9, 6, 1, 'entree', 9, 34, 43, 'Perte', '2026-05-09 09:00:41.036 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(10, 2, 1, 'sortie', 10, 29, 19, 'Inventaire', '2026-05-19 12:24:28.871 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(11, 2, 1, 'sortie', 6, 29, 23, 'Réception fournisseur', '2026-05-04 19:57:13.604 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(12, 9, 1, 'entree', 3, 4, 7, 'Perte', '2026-05-02 17:18:14.059 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(13, 2, 2, 'ajustement', -5, 29, 24, 'Perte', '2026-05-28 00:10:13.988 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(14, 8, 2, 'ajustement', 1, 19, 20, 'Réapprovisionnement', '2026-04-30 21:54:15.170 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(15, 6, 2, 'entree', 2, 34, 36, 'Inventaire', '2026-05-15 18:29:05.602 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(16, 7, 3, 'sortie', 9, 79, 70, 'Vente client', '2026-05-24 10:03:03.041 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(17, 4, 1, 'sortie', 10, 39, 29, 'Réception fournisseur', '2026-05-02 05:19:45.293 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(18, 3, 3, 'entree', 4, 24, 28, 'Réception fournisseur', '2026-05-04 04:31:24.767 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(19, 5, 2, 'ajustement', -41, 60, 19, 'Perte', '2026-05-06 10:29:35.777 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(20, 4, 3, 'sortie', 4, 39, 35, 'Inventaire', '2026-05-13 06:50:08.507 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(21, 2, 3, 'sortie', 9, 29, 20, 'Inventaire', '2026-05-15 03:19:22.754 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(22, 1, 3, 'sortie', 4, 49, 45, 'Inventaire', '2026-05-04 21:12:10.760 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(23, 5, 3, 'ajustement', -44, 60, 16, 'Inventaire', '2026-05-02 06:50:29.500 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(24, 4, 3, 'entree', 3, 39, 42, 'Perte', '2026-05-16 02:25:09.818 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(25, 9, 2, 'sortie', 4, 4, 0, 'Réapprovisionnement', '2026-05-17 01:32:55.687 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(26, 1, 1, 'sortie', 9, 49, 40, 'Vente client', '2026-05-19 03:00:10.611 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(27, 7, 2, 'ajustement', -70, 79, 9, 'Perte', '2026-05-15 05:01:26.761 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(28, 7, 2, 'ajustement', -66, 79, 13, 'Perte', '2026-05-07 11:56:08.928 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(29, 2, 2, 'ajustement', -23, 29, 6, 'Réception fournisseur', '2026-05-06 21:01:28.627 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(30, 3, 2, 'ajustement', -15, 24, 9, 'Inventaire', '2026-05-19 03:13:27.092 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(31, 3, 3, 'sortie', 5, 24, 19, 'Perte', '2026-05-03 21:53:04.814 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(32, 2, 1, 'ajustement', -17, 29, 12, 'Perte', '2026-05-16 02:17:36.760 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(33, 7, 2, 'entree', 3, 79, 82, 'Inventaire', '2026-05-06 05:42:22.344 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(34, 9, 1, 'ajustement', 13, 4, 17, 'Réception fournisseur', '2026-05-15 02:49:15.109 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(35, 4, 1, 'sortie', 6, 39, 33, 'Réapprovisionnement', '2026-05-26 10:34:25.296 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(36, 4, 3, 'ajustement', -21, 39, 18, 'Vente client', '2026-05-20 17:20:21.535 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(37, 9, 1, 'sortie', 3, 4, 1, 'Inventaire', '2026-05-15 07:40:51.700 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(38, 3, 3, 'entree', 8, 24, 32, 'Réapprovisionnement', '2026-05-27 09:34:11.317 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(39, 9, 1, 'entree', 10, 4, 14, 'Réapprovisionnement', '2026-05-10 01:48:54.713 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(40, 9, 2, 'entree', 8, 4, 12, 'Vente client', '2026-05-16 12:36:26.560 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(41, 10, 1, 'entree', 10, 45, 55, 'Vente client', '2026-05-19 16:20:45.628 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(42, 8, 2, 'ajustement', -10, 19, 9, 'Réception fournisseur', '2026-05-27 15:12:50.848 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(43, 1, 1, 'entree', 7, 49, 56, 'Inventaire', '2026-04-30 23:24:54.700 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(44, 8, 1, 'entree', 9, 19, 28, 'Vente client', '2026-05-06 13:44:54.762 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(45, 9, 1, 'entree', 7, 4, 11, 'Inventaire', '2026-05-14 14:20:57.436 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(46, 3, 2, 'sortie', 2, 24, 22, 'Réapprovisionnement', '2026-05-15 19:09:22.077 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(47, 2, 1, 'entree', 5, 29, 34, 'Inventaire', '2026-04-28 01:49:42.232 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(48, 7, 3, 'entree', 6, 79, 85, 'Inventaire', '2026-05-27 16:35:46.603 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(49, 2, 3, 'sortie', 7, 29, 22, 'Vente client', '2026-05-01 21:03:53.786 +00:00', '2026-05-28 01:44:29.209 +00:00'),
	(50, 7, 3, 'sortie', 3, 79, 76, 'Réapprovisionnement', '2026-05-25 07:07:57.835 +00:00', '2026-05-28 01:44:29.209 +00:00');
/*!40000 ALTER TABLE "mouvements_stock" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. produits
CREATE TABLE IF NOT EXISTS `produits` (`id_produit` INTEGER PRIMARY KEY, `titre` VARCHAR(255) NOT NULL, `description` TEXT, `categorie` TEXT NOT NULL, `prix_xaf` INTEGER NOT NULL, `stock` INTEGER DEFAULT '0', `variantes` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.produits : 100 rows
/*!40000 ALTER TABLE "produits" DISABLE KEYS */;
INSERT INTO "produits" ("id_produit", "titre", "description", "categorie", "prix_xaf", "stock", "variantes", "created_at", "updated_at") VALUES
	(1, 'Maillot Football Pro', 'Maillot professionnel en polyester respirant', 'Football', 25000, 49, '{"tailles":["S","M","L","XL"],"couleurs":["Rouge","Bleu","Blanc"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 07:54:11.626 +00:00'),
	(2, 'Crampons Mercurial', 'Chaussures de football haute performance', 'Football', 45000, 29, '{"tailles":["38","39","40","41","42","43","44"],"couleurs":["Noir","Blanc"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 07:54:11.633 +00:00'),
	(3, 'Ballon Football Official', 'Ballon officiel FIFA qualité match', 'Football', 35000, 24, '{"tailles":["4","5"],"couleurs":["Blanc/Noir","Jaune"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 07:54:11.640 +00:00'),
	(4, 'Gants Gardien Pro', 'Gants avec grip amélioré et protection', 'Football', 18000, 39, '{"tailles":["7","8","9","10"],"couleurs":["Noir","Vert","Rouge"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 07:54:11.647 +00:00'),
	(5, 'Short Running Elite', 'Short léger avec poche zippée', 'Running', 15000, 60, '{"tailles":["S","M","L","XL"],"couleurs":["Noir","Bleu","Gris"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(6, 'Chaussures Running Ultra', 'Running shoes avec amorti maximal', 'Running', 55000, 34, '{"tailles":["38","39","40","41","42","43","44"],"couleurs":["Noir","Blanc","Rouge"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 08:25:55.411 +00:00'),
	(7, 'T-shirt Technique Dry', 'T-shirt respirant anti-transpiration', 'Running', 12000, 79, '{"tailles":["S","M","L","XL"],"couleurs":["Blanc","Noir","Bleu","Jaune"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 08:25:55.423 +00:00'),
	(8, 'Montre GPS Running', 'Montre connectée avec GPS et cardio', 'Running', 75000, 19, '{"tailles":["Unique"],"couleurs":["Noir","Blanc"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 08:25:55.417 +00:00'),
	(9, 'Haltères Réglables 20kg', 'Set d''haltères ajustables pour fitness', 'Fitness', 65000, 4, '{"tailles":["Unique"],"couleurs":["Noir","Rouge"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 07:51:36.157 +00:00'),
	(10, 'Tapis de Yoga Premium', 'Tapis antidérapant épaisseur 8mm', 'Fitness', 22000, 45, '{"tailles":["Unique"],"couleurs":["Bleu","Rose","Vert","Violet"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(11, 'Elastique Résistance', 'Bandes élastiques pour renforcement', 'Fitness', 8000, 100, '{"tailles":["Léger","Moyen","Fort"],"couleurs":["Jaune","Rouge","Bleu"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(12, 'Step Aerobic', 'Plateforme step ajustable', 'Fitness', 35000, 25, '{"tailles":["Unique"],"couleurs":["Gris","Noir"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(13, 'Raquette Tennis Pro', 'Raquette carbone pour joueurs avancés', 'Tennis', 85000, 20, '{"tailles":["Unique"],"couleurs":["Rouge","Bleu","Noir"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(14, 'Balle Tennis 3-pack', 'Lot de 3 balles pression', 'Tennis', 12000, 69, '{"tailles":["Unique"],"couleurs":["Jaune/Vert"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 09:11:33.197 +00:00'),
	(15, 'Sac Tennis Tour', 'Sac pour 6 raquettes avec compartiments', 'Tennis', 40000, 30, '{"tailles":["Unique"],"couleurs":["Noir","Rouge","Bleu"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(16, 'Chaussures Basketball Air', 'Basket avec technologie air cushion', 'Basketball', 60000, 25, '{"tailles":["40","41","42","43","44","45"],"couleurs":["Noir/Rouge","Blanc/Bleu"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(17, 'Ballon Basketball Official', 'Ballon NBA taille officielle', 'Basketball', 28000, 35, '{"tailles":["6","7"],"couleurs":["Orange","Marron"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(18, 'Maillot Basketball Jersey', 'Maillot respirant pour match', 'Basketball', 20000, 50, '{"tailles":["S","M","L","XL"],"couleurs":["Rouge","Bleu","Noir","Blanc"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(19, 'Protège-Tibia Pro', 'Protège-tibias avec coque rigide', 'Football', 10000, 60, '{"tailles":["S","M","L"],"couleurs":["Noir","Blanc","Bleu"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-25 11:06:31.608 +00:00'),
	(20, 'Gourde Isotermique 1L', 'Gourde garde température 24h', 'Running', 15000, 54, '{"tailles":["Unique"],"couleurs":["Noir","Bleu","Rouge","Vert"]}', '2026-05-25 11:06:31.608 +00:00', '2026-05-26 00:10:45.042 +00:00'),
	(21, 'Maillot PSG Domicile 2024', 'Maillot officiel PSG domicile 2024-2025', 'Football', 45000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Bleu/Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(22, 'Crampons Mercurial Vapor', 'Crampons de haute performance pour terrains fermes', 'Football', 85000, 10, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(23, 'Ballon UEFA Champions League', 'Ballon officiel UEFA Champions League', 'Football', 25000, 25, '"{\"tailles\":[\"5\"],\"couleurs\":[\"Blanc/Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(24, 'Gants de gardien Nike', 'Gants professionnels pour gardiens', 'Football', 18000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Vert\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(25, 'Short de football Adidas', 'Short technique pour football', 'Football', 12000, 30, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(26, 'Chaussures Running Ultraboost', 'Chaussures de running avec amorti boost', 'Running', 75000, 12, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(27, 'Montre GPS Running', 'Montre GPS avec suivi cardio', 'Running', 95000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(28, 'T-shirt technique respirant', 'T-shirt technique pour course à pied', 'Running', 15000, 35, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Bleu\",\"Rouge\",\"Vert\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(29, 'Legging de running', 'Legging compressif pour running', 'Running', 22000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Gris\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(30, 'Sac à dos running', 'Sac à dos léger pour running', 'Running', 18000, 15, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(31, 'Haltères réglables 20kg', 'Set d''haltères réglables jusqu''à 20kg', 'Fitness', 45000, 10, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(32, 'Tapis de yoga premium', 'Tapis de yoga antidérapant épais', 'Fitness', 25000, 25, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Bleu\",\"Rose\",\"Vert\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(33, 'Élastiques de résistance', 'Set d''élastiques de résistance', 'Fitness', 8000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Multicolore\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(34, 'Kettlebell 16kg', 'Kettleball en fonte 16kg', 'Fitness', 35000, 15, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(35, 'Banc de fitness réglable', 'Banc de fitness inclinable', 'Fitness', 85000, 5, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(36, 'Raquette Wilson Pro', 'Raquette professionnelle Wilson', 'Tennis', 120000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Rouge/Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(37, 'Balles de tennis (x3)', 'Pack de 3 balles de tennis', 'Tennis', 5000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Jaune\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(38, 'Sac de tennis Wilson', 'Sac de tennis avec 6 compartiments', 'Tennis', 35000, 12, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(39, 'Chaussures Tennis Court', 'Chaussures pour terrains durs', 'Tennis', 65000, 15, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Blanc\",\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(40, 'Manchettes de tennis', 'Manchettes pour protection du poignet', 'Tennis', 3000, 40, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(41, 'Chaussures Jordan Air', 'Chaussures Jordan Air pour basketball', 'Basketball', 95000, 10, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Rouge/Noir\",\"Bleu/Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(42, 'Ballon NBA officiel', 'Ballon officiel NBA taille 7', 'Basketball', 35000, 20, '"{\"tailles\":[\"7\"],\"couleurs\":[\"Orange\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(43, 'Maillot NBA Lakers', 'Maillot officiel Lakers', 'Basketball', 55000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Jaune/Violet\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(44, 'Panier de basket mural', 'Panier de basket mural professionnel', 'Basketball', 120000, 5, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Orange\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(45, 'Protège-dents basketball', 'Protège-dents pour basketball', 'Basketball', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(46, 'Casque cyclisme Pro', 'Casque professionnel avec ventilation', 'Cyclisme', 35000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(47, 'Gants cyclisme', 'Gants pour cyclisme route', 'Cyclisme', 8000, 30, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(48, 'Gourde 750ml', 'Gourde isotherme 750ml', 'Cyclisme', 3000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Bleu\",\"Rouge\",\"Vert\",\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(49, 'Maillot cyclisme équipe', 'Maillot cyclisme technique', 'Cyclisme', 25000, 18, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Jaune\",\"Bleu\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(50, 'Short cyclisme avec cuissard', 'Short cyclisme avec cuissard rembourré', 'Cyclisme', 28000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(51, 'Maillot de bain homme', 'Maillot de bain compétition', 'Natation', 18000, 25, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(52, 'Maillot de bain femme', 'Maillot de bain femme compétition', 'Natation', 22000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rose\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(53, 'Lunettes de natation', 'Lunettes anti-buée professionnelles', 'Natation', 5000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Noir\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(54, 'Bonne de natation silicone', 'Bonne de natation en silicone', 'Natation', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rouge\",\"Rose\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(55, 'Planches de natation', 'Planche de natation en mousse', 'Natation', 8000, 20, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Jaune\",\"Rose\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(56, 'Gants de boxe 16oz', 'Gants de boxe professionnels 16oz', 'Boxe', 35000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Rouge\",\"Noir\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(57, 'Sac de frappe 40kg', 'Sac de frappe rempli 40kg', 'Boxe', 65000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Rouge\",\"Noir\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(58, 'Bandages de boxe', 'Bandages élastiques pour boxe', 'Boxe', 3000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(59, 'Protège-dents boxe', 'Protège-dents professionnel', 'Boxe', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Rouge\",\"Bleu\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(60, 'Ceinture de boxe', 'Ceinture de boxe rembourrée', 'Boxe', 8000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Rouge\"]}"', '2026-05-26 22:36:44.436 +00:00', '2026-05-26 22:36:44.436 +00:00'),
	(61, 'Maillot PSG Domicile 2024', 'Maillot officiel PSG domicile 2024-2025', 'Football', 45000, 14, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Bleu/Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-28 00:59:55.015 +00:00'),
	(62, 'Crampons Mercurial Vapor', 'Crampons de haute performance pour terrains fermes', 'Football', 85000, 9, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-28 00:59:55.007 +00:00'),
	(63, 'Ballon UEFA Champions League', 'Ballon officiel UEFA Champions League', 'Football', 25000, 23, '"{\"tailles\":[\"5\"],\"couleurs\":[\"Blanc/Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-28 21:59:19.345 +00:00'),
	(64, 'Gants de gardien Nike', 'Gants professionnels pour gardiens', 'Football', 18000, 18, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Vert\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-28 21:46:43.059 +00:00'),
	(65, 'Short de football Adidas', 'Short technique pour football', 'Football', 12000, 30, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(66, 'Chaussures Running Ultraboost', 'Chaussures de running avec amorti boost', 'Running', 75000, 12, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(67, 'Montre GPS Running', 'Montre GPS avec suivi cardio', 'Running', 95000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(68, 'T-shirt technique respirant', 'T-shirt technique pour course à pied', 'Running', 15000, 35, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Bleu\",\"Rouge\",\"Vert\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(69, 'Legging de running', 'Legging compressif pour running', 'Running', 22000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Gris\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(70, 'Sac à dos running', 'Sac à dos léger pour running', 'Running', 18000, 15, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(71, 'Haltères réglables 20kg', 'Set d''haltères réglables jusqu''à 20kg', 'Fitness', 45000, 10, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(72, 'Tapis de yoga premium', 'Tapis de yoga antidérapant épais', 'Fitness', 25000, 25, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Bleu\",\"Rose\",\"Vert\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(73, 'Élastiques de résistance', 'Set d''élastiques de résistance', 'Fitness', 8000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Multicolore\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(74, 'Kettlebell 16kg', 'Kettleball en fonte 16kg', 'Fitness', 35000, 15, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(75, 'Banc de fitness réglable', 'Banc de fitness inclinable', 'Fitness', 85000, 5, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(76, 'Raquette Wilson Pro', 'Raquette professionnelle Wilson', 'Tennis', 120000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Rouge/Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(77, 'Balles de tennis (x3)', 'Pack de 3 balles de tennis', 'Tennis', 5000, 49, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Jaune\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-27 01:25:10.920 +00:00'),
	(78, 'Sac de tennis Wilson', 'Sac de tennis avec 6 compartiments', 'Tennis', 35000, 11, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-27 01:25:10.929 +00:00'),
	(79, 'Chaussures Tennis Court', 'Chaussures pour terrains durs', 'Tennis', 65000, 15, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Blanc\",\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(80, 'Manchettes de tennis', 'Manchettes pour protection du poignet', 'Tennis', 3000, 40, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(81, 'Chaussures Jordan Air', 'Chaussures Jordan Air pour basketball', 'Basketball', 95000, 10, '"{\"tailles\":[\"40\",\"41\",\"42\",\"43\",\"44\"],\"couleurs\":[\"Rouge/Noir\",\"Bleu/Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(82, 'Ballon NBA officiel', 'Ballon officiel NBA taille 7', 'Basketball', 35000, 20, '"{\"tailles\":[\"7\"],\"couleurs\":[\"Orange\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(83, 'Maillot NBA Lakers', 'Maillot officiel Lakers', 'Basketball', 55000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Jaune/Violet\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(84, 'Panier de basket mural', 'Panier de basket mural professionnel', 'Basketball', 120000, 5, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Orange\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(85, 'Protège-dents basketball', 'Protège-dents pour basketball', 'Basketball', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(86, 'Casque cyclisme Pro', 'Casque professionnel avec ventilation', 'Cyclisme', 35000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(87, 'Gants cyclisme', 'Gants pour cyclisme route', 'Cyclisme', 8000, 30, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Blanc\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(88, 'Gourde 750ml', 'Gourde isotherme 750ml', 'Cyclisme', 3000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Bleu\",\"Rouge\",\"Vert\",\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(89, 'Maillot cyclisme équipe', 'Maillot cyclisme technique', 'Cyclisme', 25000, 18, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Jaune\",\"Bleu\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(90, 'Short cyclisme avec cuissard', 'Short cyclisme avec cuissard rembourré', 'Cyclisme', 28000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(91, 'Maillot de bain homme', 'Maillot de bain compétition', 'Natation', 18000, 25, '"{\"tailles\":[\"S\",\"M\",\"L\",\"XL\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(92, 'Maillot de bain femme', 'Maillot de bain femme compétition', 'Natation', 22000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rose\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(93, 'Lunettes de natation', 'Lunettes anti-buée professionnelles', 'Natation', 5000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Noir\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(94, 'Bonne de natation silicone', 'Bonne de natation en silicone', 'Natation', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Bleu\",\"Rouge\",\"Rose\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(95, 'Planches de natation', 'Planche de natation en mousse', 'Natation', 8000, 20, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Jaune\",\"Rose\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(96, 'Gants de boxe 16oz', 'Gants de boxe professionnels 16oz', 'Boxe', 35000, 15, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Rouge\",\"Noir\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(97, 'Sac de frappe 40kg', 'Sac de frappe rempli 40kg', 'Boxe', 65000, 8, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Rouge\",\"Noir\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(98, 'Bandages de boxe', 'Bandages élastiques pour boxe', 'Boxe', 3000, 40, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Noir\",\"Blanc\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(99, 'Protège-dents boxe', 'Protège-dents professionnel', 'Boxe', 2000, 50, '"{\"tailles\":[\"Unique\"],\"couleurs\":[\"Transparent\",\"Rouge\",\"Bleu\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00'),
	(100, 'Ceinture de boxe', 'Ceinture de boxe rembourrée', 'Boxe', 8000, 20, '"{\"tailles\":[\"S\",\"M\",\"L\"],\"couleurs\":[\"Noir\",\"Rouge\"]}"', '2026-05-26 23:21:33.740 +00:00', '2026-05-26 23:21:33.740 +00:00');
/*!40000 ALTER TABLE "produits" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. ProduitZone
CREATE TABLE IF NOT EXISTS `ProduitZone` (`created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, `id_zone` INTEGER NOT NULL REFERENCES `zones_stockage` (`id_zone`) ON DELETE CASCADE ON UPDATE CASCADE, `id_produit` INTEGER NOT NULL REFERENCES `produits` (`id_produit`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`id_zone`, `id_produit`));

-- Listage des données de la table sport-equip.ProduitZone : 0 rows
/*!40000 ALTER TABLE "ProduitZone" DISABLE KEYS */;
/*!40000 ALTER TABLE "ProduitZone" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. promotions
CREATE TABLE IF NOT EXISTS `promotions` (`id_promotion` INTEGER PRIMARY KEY, `code` VARCHAR(255) NOT NULL UNIQUE, `pourcentage_remise` INTEGER NOT NULL, `est_active` TINYINT(1) DEFAULT 1, `date_expiration` DATETIME, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.promotions : 2 rows
/*!40000 ALTER TABLE "promotions" DISABLE KEYS */;
INSERT INTO "promotions" ("id_promotion", "code", "pourcentage_remise", "est_active", "date_expiration", "created_at", "updated_at") VALUES
	(1, 'KEYCE20', 20, 1, '2026-12-31 00:00:00.000 +00:00', '2026-05-25 11:06:31.621 +00:00', '2026-05-25 22:34:17.975 +00:00'),
	(3, 'JVJ', 10, 1, '2026-05-29 00:00:00.000 +00:00', '2026-05-25 22:41:26.557 +00:00', '2026-05-25 22:41:26.557 +00:00');
/*!40000 ALTER TABLE "promotions" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. utilisateurs
CREATE TABLE IF NOT EXISTS `utilisateurs` (`id_utilisateur` INTEGER PRIMARY KEY, `nom` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `mot_de_passe` VARCHAR(255) NOT NULL, `role` TEXT DEFAULT 'client', `points_fidelite` INTEGER DEFAULT '0', `adresse_livraison` TEXT, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.utilisateurs : 4 rows
/*!40000 ALTER TABLE "utilisateurs" DISABLE KEYS */;
INSERT INTO "utilisateurs" ("id_utilisateur", "nom", "email", "mot_de_passe", "role", "points_fidelite", "adresse_livraison", "created_at", "updated_at") VALUES
	(1, 'Administrateur', 'admin@sportequip.com', '$2b$10$.WiAbnslDJ7XFIgszrHbCurCFubYiMq45jZ6lzDRAOidb4voiTdlS', 'admin', 3703, 'Admin adresse test
', '2026-05-25 11:06:31.366 +00:00', '2026-05-28 21:59:19.351 +00:00'),
	(2, 'Client Test', 'client@test.com', '$2b$10$PjTQeVX2u.s4YkMpEwtIvudI7jClvB4TW1CpHcqUUu3wcW7DRQtpG', 'client', 1817, 'Yaoundé, Cameroun', '2026-05-25 11:06:31.598 +00:00', '2026-05-26 08:25:55.429 +00:00'),
	(3, 'Client Officiel', 'officiel@gmail.com', '$2b$10$Qqr7IuUCZtvpiZAw11V1ceuEjO90TPt31mDa.g69ONwbpXQ/dg8ZK', 'client', 0, 'Rue Pierre Loti, Bonanjo', '2026-05-26 08:54:13.791 +00:00', '2026-05-26 08:54:13.791 +00:00'),
	(4, 'Client test 2 ', 'client2@test.com', '$2b$10$Iz.Tt3EAwhSO7qnbdZzosuAtPu0H31R44bLHfciHq3/7Vks.9z4Je', 'client', 0, 'Rue Pierre Loti, Bonanjo', '2026-05-28 12:26:58.987 +00:00', '2026-05-28 12:26:58.987 +00:00');
/*!40000 ALTER TABLE "utilisateurs" ENABLE KEYS */;

-- Listage de la structure de table sport-equip. zones_stockage
CREATE TABLE IF NOT EXISTS `zones_stockage` (`id_zone` INTEGER PRIMARY KEY AUTOINCREMENT, `nom` VARCHAR(255) NOT NULL, `type_zone` TEXT NOT NULL, `description` TEXT, `capacite` INTEGER DEFAULT 0, `actif` TINYINT(1) DEFAULT 1, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);

-- Listage des données de la table sport-equip.zones_stockage : 10 rows
/*!40000 ALTER TABLE "zones_stockage" DISABLE KEYS */;
INSERT INTO "zones_stockage" ("id_zone", "nom", "type_zone", "description", "capacite", "actif", "created_at", "updated_at") VALUES
	(1, 'Surface de vente principale', 'surface de vente', 'Zone principale de vente au public', 500, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
	(2, 'Mezzanine', 'mezzanine', 'Zone de stockage intermédiaire', 300, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
	(3, 'Entrepôt principal', 'entrepôt', 'Zone de stockage principal', 1000, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
	(4, 'Zone réception', 'entrepôt', 'Zone de réception des livraisons', 200, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
	(5, 'Zone expédition', 'entrepôt', 'Zone de préparation des commandes', 150, 1, '2026-05-28 01:41:27.109 +00:00', '2026-05-28 01:41:27.109 +00:00'),
	(6, 'Surface de vente principale', 'surface de vente', 'Zone principale de vente au public', 500, 1, '2026-05-28 01:42:05.334 +00:00', '2026-05-28 01:42:05.334 +00:00'),
	(7, 'Mezzanine', 'mezzanine', 'Zone de stockage intermédiaire', 300, 1, '2026-05-28 01:42:05.334 +00:00', '2026-05-28 01:42:05.334 +00:00'),
	(8, 'Entrepôt principal', 'entrepôt', 'Zone de stockage principal', 1000, 1, '2026-05-28 01:42:05.334 +00:00', '2026-05-28 01:42:05.334 +00:00'),
	(9, 'Zone réception', 'entrepôt', 'Zone de réception des livraisons', 200, 1, '2026-05-28 01:42:05.334 +00:00', '2026-05-28 01:42:05.334 +00:00'),
	(10, 'Zone expédition', 'entrepôt', 'Zone de préparation des commandes', 150, 1, '2026-05-28 01:42:05.334 +00:00', '2026-05-28 01:42:05.334 +00:00');
/*!40000 ALTER TABLE "zones_stockage" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
