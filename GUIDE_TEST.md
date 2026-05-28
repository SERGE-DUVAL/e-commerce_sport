# Guide de Test Complet - Sport-Equip

## Table des matières
1. [Préparation](#préparation)
2. [Test des fonctionnalités utilisateur](#test-des-fonctionnalités-utilisateur)
3. [Test des fonctionnalités administrateur](#test-des-fonctionnalités-administrateur)
4. [Test des fonctionnalités Be Sport](#test-des-fonctionnalités-be-sport)
5. [Cas critiques](#cas-critiques)

## Préparation

### 1. Démarrage du backend
```bash
cd backend
npm install cohere-ai
npm start
```

### 3. Démarrage du frontend
```bash
cd frontend
npm start
```

### 4. Chargement des données de test
```bash
cd backend
node scripts/seedData.js
node scripts/seedStockMovements.js
```

## Test des fonctionnalités utilisateur

### 1. Inscription et connexion
- **Test 1.1**: Inscription d'un nouvel utilisateur
  - Aller sur `/inscription`
  - Remplir le formulaire avec des données valides
  - Vérifier que l'utilisateur est créé et connecté
  - **Cas critique**: Email déjà utilisé → Message d'erreur approprié

- **Test 1.2**: Connexion avec identifiants valides
  - Aller sur `/connexion`
  - Entrer email et mot de passe corrects
  - Vérifier la redirection vers l'accueil
  - **Cas critique**: Identifiants incorrects → Message d'erreur

- **Test 1.3**: Connexion avec identifiants administrateur
  - Email: `admin@sportequip.com`
  - Mot de passe: `admin123`
  - Vérifier l'accès au tableau de bord admin

### 2. Navigation et catalogue
- **Test 2.1**: Navigation dans le catalogue
  - Cliquer sur différentes catégories (Football, Running, etc.)
  - Vérifier le filtrage par catégorie
  - **Cas critique**: Catégorie sans produits → Message approprié

- **Test 2.2**: Recherche de produits
  - Utiliser la barre de recherche
  - Vérifier les résultats de recherche
  - **Cas critique**: Aucun résultat → Message "Aucun produit trouvé"

- **Test 2.3**: Détails d'un produit
  - Cliquer sur un produit
  - Vérifier l'affichage des détails (prix, stock, variantes)
  - Vérifier la présence du code-barres
  - **Cas critique**: Produit hors stock → Message "Rupture de stock"

### 3. Panier et commande
- **Test 3.1**: Ajout au panier
  - Ajouter un produit au panier
  - Vérifier la mise à jour du compteur du panier
  - **Cas critique**: Stock insuffisant → Message d'erreur

- **Test 3.2**: Modification du panier
  - Changer la quantité d'un article
  - Supprimer un article
  - Vérifier le recalcul du total

- **Test 3.3**: Validation du panier
  - Cliquer sur "Commander"
  - Remplir l'adresse de livraison
  - Choisir le moyen de paiement
  - **Cas critique**: Panier vide → Message "Votre panier est vide"

- **Test 3.4**: Paiement et ticket
  - Effectuer le paiement
  - Vérifier l'affichage du ticket de commande avec QR code
  - **Cas critique**: Paiement échoué → Message d'erreur

- **Test 3.5**: Modes de paiement
  - Tester Mobile Money
  - Tester Carte bancaire
  - Tester PayPal
  - Tester Chèque
  - Tester Paiement à la livraison
  - Tester Points de fidélité
  - Vérifier que chaque moyen fonctionne correctement

- **Test 3.6**: Remboursement si client donne trop
  - Simuler un paiement avec montant_donne > total_xaf
  - Vérifier le calcul du remboursement
  - Vérifier que le solde de la caisse est correct
  - Vérifier l'alerte admin

### 4. Suivi de commande
- **Test 4.1**: Consultation des commandes
  - Aller sur `/profil`
  - Vérifier l'affichage des commandes
  - **Cas critique**: Aucune commande → Message "Aucune commande"

- **Test 4.2**: Confirmation de réception
  - Pour une commande "En livraison", cliquer sur "Confirmer réception"
  - Vérifier le changement de statut vers "Livrée"
  - **Cas critique**: Commande déjà livrée → Bouton désactivé

- **Test 4.3**: Laisser un avis
  - Pour une commande "Livrée", cliquer sur "Laisser un avis"
  - Remplir le formulaire (note et commentaire)
  - Vérifier l'ajout de l'avis
  - **Cas critique**: Avis déjà laissé → Message approprié

- **Test 4.4**: Télécharger bordereau de livraison
  - Pour une commande avec affectation, cliquer sur "Bordereau"
  - Vérifier le téléchargement du PDF
  - Vérifier les informations dans le PDF (client, commande, livreur, articles)
  - **Cas critique**: Aucune affectation → Bouton non affiché

- **Test 4.5**: Télécharger ticket de caisse
  - Pour une commande "Payée", cliquer sur "Ticket"
  - Vérifier le téléchargement du PDF
  - Vérifier les informations dans le PDF (caisse, client, articles, totaux)
  - Vérifier l'affichage du remboursement si applicable
  - **Cas critique**: Commande non payée → Bouton non affiché

### 5. Chatbot
- **Test 5.1**: Interaction avec le chatbot
  - Cliquer sur l'icône du chatbot
  - Poser une question sur les stocks
  - Vérifier la réponse cohérente
  - **Cas critique**: API Cohere non configurée → Fallback sur réponses basiques

## Test des fonctionnalités administrateur

### 1. Tableau de bord
- **Test 1.1**: Accès au tableau de bord
  - Se connecter en tant qu'admin
  - Vérifier l'affichage des statistiques
  - Vérifier les graphiques et KPIs

- **Test 1.2**: Mouvements de stock
  - Vérifier l'affichage des derniers mouvements
  - Vérifier les prévisions de rupture de stock
  - **Cas critique**: Aucun mouvement → Message "Aucun mouvement enregistré"

### 2. Gestion des produits
- **Test 2.1**: Création d'un produit
  - Cliquer sur "Nouveau produit"
  - Remplir le formulaire
  - Vérifier la création automatique du code-barres
  - **Cas critique**: Données invalides → Message d'erreur

- **Test 2.2**: Modification d'un produit
  - Cliquer sur l'icône d'édition
  - Modifier les informations
  - Vérifier la mise à jour

- **Test 2.3**: Suppression d'un produit
  - Cliquer sur l'icône de suppression
  - Confirmer la suppression
  - **Cas critique**: Produit avec commandes → Message d'erreur

- **Test 2.4**: Génération de codes-barres
  - Cliquer sur le bouton "📊" pour générer un code-barres
  - Vérifier l'affichage du code-barres
  - Sauvegarder le code-barres

- **Test 2.5**: Génération de QR codes
  - Cliquer sur le bouton "📱" pour générer un QR code
  - Vérifier l'affichage du QR code
  - Sauvegarder le QR code

### 3. Gestion des commandes
- **Test 3.1**: Consultation des commandes
  - Vérifier l'affichage de toutes les commandes
  - Filtrer par statut
  - **Cas critique**: Filtre sans résultat → Message approprié

- **Test 3.2**: Modification du statut
  - Changer le statut d'une commande
  - Vérifier la mise à jour

### 4. Gestion des clients
- **Test 4.1**: Consultation des clients
  - Vérifier l'affichage de tous les clients
  - Rechercher un client
  - **Cas critique**: Client non trouvé → Message approprié

- **Test 4.2**: Historique d'un client
  - Cliquer sur l'icône graphique
  - Vérifier l'affichage de l'historique complet
  - Vérifier les commandes du client

- **Test 4.3**: Suppression d'un client
  - Cliquer sur l'icône de suppression
  - Confirmer la suppression
  - **Cas critique**: Client avec commandes → Message d'erreur

### 5. Gestion des fournisseurs (Be Sport)
- **Test 5.1**: Création d'un fournisseur
  - Aller sur l'onglet "Fournisseurs"
  - Cliquer sur "Nouveau fournisseur"
  - Remplir le formulaire
  - Vérifier la création

- **Test 5.2**: Modification d'un fournisseur
  - Cliquer sur l'icône d'édition
  - Modifier les informations
  - Vérifier la mise à jour

- **Test 5.3**: Activation/Désactivation
  - Cliquer sur le bouton "Activer/Désactiver"
  - Vérifier le changement de statut

- **Test 5.4**: Suppression d'un fournisseur
  - Cliquer sur l'icône de suppression
  - Confirmer la suppression
  - **Cas critique**: Fournisseur avec produits → Message d'erreur

### 6. Gestion des inventaires (Be Sport)
- **Test 6.1**: Création d'un inventaire
  - Aller sur l'onglet "Inventaires"
  - Cliquer sur "Nouvel inventaire"
  - Choisir le type (général ou partiel)
  - Sélectionner la zone
  - Vérifier la création

- **Test 6.2**: Consultation des inventaires
  - Vérifier l'affichage des inventaires
  - Vérifier les taux de correspondance
  - **Cas critique**: Inventaire en cours → Boutons appropriés

- **Test 6.3**: Validation d'un inventaire
  - Pour un inventaire terminé, vérifier la validation
  - Vérifier la mise à jour des stocks

### 7. Gestion des zones (Be Sport)
- **Test 7.1**: Création d'une zone
  - Aller sur l'onglet "Zones"
  - Cliquer sur "Nouvelle zone"
  - Choisir le type (surface de vente, mezzanine, entrepôt, réserve)
  - Définir la capacité
  - Vérifier la création

- **Test 7.2**: Modification d'une zone
  - Cliquer sur l'icône d'édition
  - Modifier les informations
  - Vérifier la mise à jour

- **Test 7.3**: Activation/Désactivation
  - Cliquer sur le bouton "Activer/Désactiver"
  - Vérifier le changement de statut

- **Test 7.4**: Assigner un produit à une zone
  - Sélectionner un produit
  - Cliquer sur "Assigner à une zone"
  - Choisir la zone
  - Vérifier l'assignation
  - **Cas critique**: Zone pleine → Message d'erreur

- **Test 7.5**: Retirer un produit d'une zone
  - Sélectionner un produit assigné à une zone
  - Cliquer sur "Retirer de la zone"
  - Vérifier le retrait

- **Test 7.6**: Consulter les zones d'un produit
  - Sélectionner un produit
  - Vérifier l'affichage des zones assignées
  - **Cas critique**: Aucune zone assignée → Message approprié

### 8. Gestion des caisses (Be Sport)
- **Test 8.1**: Création d'une caisse
  - Aller sur l'onglet "Caisses"
  - Cliquer sur "Nouvelle caisse"
  - Définir le solde initial
  - Assigner un responsable
  - Vérifier la création

- **Test 8.2**: Ouverture/Fermeture d'une caisse
  - Cliquer sur le bouton "Ouvrir/Fermer"
  - Vérifier le changement de statut
  - **Cas critique**: Caisse déjà ouverte → Message d'erreur

- **Test 8.3**: Consultation des soldes
  - Vérifier l'affichage des soldes
  - Vérifier les responsables actuels

### 9. Gestion des avoirs (Be Sport)
- **Test 9.1**: Création d'un avoir
  - Aller sur l'onglet "Avoirs"
  - Cliquer sur "Nouvel avoir"
  - Définir le numéro et le montant
  - Associer une commande
  - Vérifier la création

- **Test 9.2**: Utilisation d'un avoir
  - Pour un avoir "en attente", cliquer sur "Utiliser"
  - Vérifier le changement de statut
  - **Cas critique**: Avoir expiré → Bouton désactivé

- **Test 9.3**: Consultation des avoirs
  - Vérifier l'affichage des avoirs
  - Filtrer par statut

### 10. Gestion des livraisons
- **Test 10.1**: Ajout d'un livreur
  - Aller sur l'onglet "Livraison"
  - Cliquer sur "Ajouter un livreur"
  - Remplir le formulaire
  - Vérifier la création

- **Test 10.2**: Affectation d'une commande
  - Sélectionner une commande
  - Assigner un livreur
  - Vérifier l'affectation

- **Test 10.3**: Consultation de la météo
  - Cliquer sur l'icône météo
  - Vérifier l'affichage des conditions météo

### 11. Gestion des remboursements
- **Test 11.1**: Consultation des demandes
  - Aller sur l'onglet "Remboursements"
  - Vérifier l'affichage des demandes
  - **Cas critique**: Aucune demande → Message approprié

- **Test 11.2**: Traitement d'une demande
  - Approuver ou rejeter une demande
  - Vérifier la mise à jour

### 12. Gestion des promotions
- **Test 12.1**: Création d'une promotion
  - Aller sur l'onglet "Promotions"
  - Cliquer sur "Nouvelle promotion"
  - Définir le code et la remise
  - Vérifier la création

- **Test 12.2**: Activation/Désactivation
  - Cliquer sur le bouton d'activation
  - Vérifier le changement de statut

## Test des fonctionnalités Be Sport

### 1. Organisation de l'approvisionnement
- **Test 1.1**: Processus de réassort
  - Identifier les produits en rupture de stock
  - Créer une demande de livraison auprès d'un fournisseur
  - Vérifier l'enregistrement de la demande

- **Test 1.2**: Bordereau de livraison (BL)
  - Simuler la réception d'un BL
  - Vérifier les informations du BL
  - **Cas critique**: Quantités incorrectes → Message d'erreur

### 2. Réception des marchandises
- **Test 2.1**: Vérification codes-barres
  - Scanner un code-barres avec un produit
  - Vérifier la correspondance
  - **Cas critique**: Code-barres invalide → Message d'erreur

- **Test 2.2**: Contrôle physique
  - Comparer les quantités physiques avec le BL
  - Enregistrer les écarts
  - Valider la réception

### 3. Échelonnage et rangement
- **Test 3.1**: Répartition par zones
  - Assigner des produits à des zones
  - Vérifier la capacité des zones
  - **Cas critique**: Zone pleine → Message d'erreur

- **Test 3.2**: Organisation des rayons
  - Organiser les produits par catégorie
  - Vérifier l'affichage dans les zones

### 4. Gestion de la relation client
- **Test 4.1**: Politique d'échange (15 jours)
  - Créer un échange pour un produit < 15 jours
  - Vérifier l'acceptation
  - **Cas critique**: Produit > 15 jours → Refus

- **Test 4.2**: Gestion des promotions
  - Appliquer une promotion
  - Vérifier le calcul du prix
  - Vérifier le ticket de caisse

- **Test 4.3**: Politique de remboursement
  - Créer un avoir au lieu d'un remboursement
  - Vérifier la création de l'avoir
  - **Cas critique**: Avoir déjà utilisé → Message d'erreur

### 5. Gestion des inventaires
- **Test 5.1**: Inventaire général
  - Créer un inventaire général
  - Compter les produits dans toutes les zones
  - Calculer les écarts
  - Valider l'inventaire

- **Test 5.2**: Inventaire partiel
  - Créer un inventaire partiel pour une zone
  - Compter les produits de la zone
  - Calculer les écarts
  - Valider l'inventaire

- **Test 5.3**: Taux de correspondance
  - Vérifier le calcul du taux
  - Valider si taux > 95%
  - **Cas critique**: Taux < 95% → Message d'avertissement

### 6. Système d'encaissement
- **Test 6.1**: Bipage des produits
  - Scanner un code-barres à la caisse
  - Vérifier l'affichage du prix
  - Vérifier l'application des promotions

- **Test 6.2**: Moyens de paiement
  - Tester chaque moyen de paiement (carte, chèque, Mobile Money, etc.)
  - Vérifier la validation
  - **Cas critique**: Paiement refusé → Message d'erreur

- **Test 6.3**: Rotation des caisses
  - Assigner un responsable à une caisse
  - Ouvrir la caisse
  - Fermer la caisse
  - Changer le responsable
  - **Cas critique**: Caisse déjà ouverte → Message d'erreur

## Cas critiques

### 1. Rupture de stock
- **Scénario**: Plusieurs commandes simultanées pour un produit avec stock limité
- **Test**: Créer 3 commandes pour un produit avec stock = 2
- **Attendu**: La 3ème commande échoue avec message "Stock insuffisant"

### 2. Paiement échoué
- **Scénario**: Erreur lors du paiement
- **Test**: Simuler une erreur de paiement
- **Attendu**: Message d'erreur et conservation du panier

### 3. Commande annulée
- **Scénario**: Annulation d'une commande payée
- **Test**: Annuler une commande payée
- **Attendu**: Création automatique d'un avoir

### 4. Inventaire avec écarts importants
- **Scénario**: Écarts > 10% entre théorique et physique
- **Test**: Créer un inventaire avec écarts importants
- **Attendu**: Message d'avertissement et blocage de la validation

### 5. Caisse avec solde négatif
- **Scénario**: Tentative de sortie supérieure au solde
- **Test**: Effectuer une sortie supérieure au solde
- **Attendu**: Message d'erreur et blocage de l'opération

### 6. Utilisateur non connecté
- **Scénario**: Accès à une page protégée sans connexion
- **Test**: Essayer d'accéder au profil sans être connecté
- **Attendu**: Redirection vers la page de connexion

### 7. Promotion expirée
- **Scénario**: Utilisation d'une promotion expirée
- **Test**: Appliquer une promotion avec date d'expiration passée
- **Attendu**: Message "Promotion expirée"

### 8. Avoir expiré
- **Scénario**: Utilisation d'un avoir expiré
- **Test**: Essayer d'utiliser un avoir expiré
- **Attendu**: Message "Avoir expiré"

### 9. Livreur non disponible
- **Scénario**: Affectation d'une commande à un livreur indisponible
- **Test**: Affecter une commande à un livreur avec statut "indisponible"
- **Attendu**: Message d'erreur

### 10. Code-barres invalide
- **Scénario**: Scan d'un code-barres inexistant
- **Test**: Scanner un code-barres qui n'existe pas
- **Attendu**: Message "Code-barres non trouvé"

## Checklist de validation

### Fonctionnalités utilisateur
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Navigation fonctionne
- [ ] Recherche fonctionne
- [ ] Panier fonctionne
- [ ] Paiement fonctionne
- [ ] Ticket de commande avec QR code s'affiche
- [ ] Modes de paiement (Mobile Money, Carte bancaire, PayPal, Chèque, Cash, Points) fonctionnent
- [ ] Remboursement si client donne trop fonctionne
- [ ] Suivi de commande fonctionne
- [ ] Confirmation de réception fonctionne
- [ ] Avis fonctionne
- [ ] Téléchargement bordereau de livraison fonctionne
- [ ] Téléchargement ticket de caisse fonctionne
- [ ] Chatbot fonctionne

### Fonctionnalités administrateur
- [ ] Tableau de bord fonctionne
- [ ] Gestion des produits fonctionne
- [ ] Génération de codes-barres fonctionne
- [ ] Génération de QR codes fonctionne
- [ ] Gestion des commandes fonctionne
- [ ] Gestion des clients fonctionne
- [ ] Historique des clients fonctionne
- [ ] Gestion des fournisseurs fonctionne
- [ ] Gestion des inventaires fonctionne
- [ ] Gestion des zones fonctionne
- [ ] Gestion des caisses fonctionne
- [ ] Gestion des avoirs fonctionne
- [ ] Gestion des livraisons fonctionne
- [ ] Gestion des remboursements fonctionne
- [ ] Gestion des promotions fonctionne

### Fonctionnalités Be Sport
- [ ] Réassort fonctionne
- [ ] Réception avec codes-barres fonctionne
- [ ] Échelonnage fonctionne
- [ ] Échanges (15 jours) fonctionne
- [ ] Promotions fonctionnent
- [ ] Avoirs fonctionnent
- [ ] Inventaires généraux fonctionnent
- [ ] Inventaires partiels fonctionnent
- [ ] Encaissement avec codes-barres fonctionne
- [ ] Rotation des caisses fonctionne

## Conclusion

Ce guide couvre l'ensemble des fonctionnalités du site Sport-Equip, y compris celles inspirées du rapport de visite d'entreprise Be Sport. Chaque test doit être effectué méthodiquement et les résultats documentés.

En cas d'erreur, vérifier :
1. Les logs du backend
2. Les logs du navigateur
3. La configuration du .env
4. La connexion à la base de données
