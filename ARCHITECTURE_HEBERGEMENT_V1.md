# Sport-Equip v1 — architecture et hébergement gratuit

## Architecture

Sport-Equip v1 est une application web organisée en deux applications Node.js :

- **Frontend** — `sport-equip-v1/frontend` : interface monopage React 18, React Router et Bootstrap. Les pages se trouvent dans `src/pages`, les composants partagés dans `src/components`, les états de connexion et de panier dans `src/context` et les appels HTTP dans `src/services` et `src/api`.
- **Backend** — `sport-equip-v1/backend` : API REST Express. `app.js` configure les middlewares et monte les routes sous `/api`; `server.js` initialise la base puis démarre le serveur local. Les routes délèguent aux contrôleurs, et le middleware d'authentification protège les opérations qui le nécessitent. Sequelize relie l'API à la base de données.
- **Données** — SQLite dans `sport-equip-v1/database/sport-equip.sqlite` en développement ; PostgreSQL via `DATABASE_URL` en production. Les modèles couvrent notamment les utilisateurs, produits, commandes et lignes de commande, avis, promotions, stock et inventaires, fournisseurs, livraisons, remboursements, avoirs, caisses et zones de stockage.
- **Sécurité et services externes** — connexion par JWT et mots de passe hachés avec bcrypt. Le projet comporte des modules de paiement Switch et de chatbot ; leurs éventuels accès externes doivent être fournis par variables d'environnement et ne doivent pas être publiés dans le dépôt.

### Flux d'une requête

```text
Navigateur → application React → API Express (/api/...) → contrôleur
                                                    → modèle Sequelize → SQLite (développement)
                                                                    → PostgreSQL (production)
```

En développement, le frontend utilise `http://localhost:5000/api` par défaut. La variable `REACT_APP_API_URL` permet de configurer l'URL de l'API ; le champ `proxy` de `package.json` ne sert qu'au serveur de développement React.

### Démarrage local

Depuis deux terminaux, à la racine du dépôt :

```powershell
Set-Location .\sport-equip-v1\backend
npm start
```

```powershell
Set-Location .\sport-equip-v1\frontend
npm start
```

Le backend écoute sur le port 5000 et le frontend utilise le port 3000 s'il est libre (sinon React en propose un autre). `PORT` permet de configurer le port du backend.

> **Attention :** ne lancez pas `npm run seed` sur une base à conserver. Le script `backend/seeds/seed.js` appelle `sync({ force: true })`, ce qui supprime puis recrée les tables.

## Hébergement gratuit

### Configuration de déploiement préparée

Le fichier [`render.yaml`](./render.yaml) décrit le frontend statique et l’API Node.js sur Render Free. L’API utilise PostgreSQL au moyen de `DATABASE_URL`; la base doit être créée séparément sur un fournisseur gratuit compatible, par exemple Neon. Le disque SQLite local reste réservé au développement.

Dans Render, renseignez les valeurs demandées par le Blueprint :

- `DATABASE_URL` : URL de connexion PostgreSQL fournie par le service de base de données.
- `FRONTEND_URL` : URL exacte du site statique, sans slash final.
- `BACKEND_URL` : URL publique de l’API, sans slash final.
- `REACT_APP_API_URL` : URL de l’API suivie de `/api` (par exemple `https://.../api`).
- `INITIAL_ADMIN_EMAIL` et `INITIAL_ADMIN_PASSWORD` : identifiants initiaux pour créer le premier compte administrateur (mot de passe d’au moins 12 caractères). Le mot de passe n’est utilisé que si aucun administrateur n’existe ; après création, retirez ces deux variables du service.

Le Blueprint crée un `JWT_SECRET` aléatoire. Le paiement en ligne et le chatbot restent désactivés en production : le premier n’authentifie pas les callbacks Switch et le second exécute du SQL généré par IA. Les changements de schéma sont non destructifs ; ne lancez pas le script `seed`, qui réinitialise toute la base.

### Déploiement Netlify (frontend et API)

Le fichier [`netlify.toml`](./netlify.toml) configure le build du frontend et redirige `/api/*` vers une Netlify Function qui enveloppe Express. En production, la Function authentifie la connexion PostgreSQL sans exécuter `sync()` ni modifier le schéma au démarrage. Le frontend utilise `/api` sur le même domaine.

Pour déployer, créez un site Netlify lié au dépôt GitHub et à la branche `branch_sc`. Le fichier `netlify.toml` fixe le répertoire de base `sport-equip-v1` et les commandes de build ; aucun secret ne doit être ajouté au dépôt. Dans **Site configuration → Environment variables**, configurez :

- `DATABASE_URL` : URL PostgreSQL **poolée** fournie par Neon.
- `DATABASE_SSL` : `true`.
- `JWT_SECRET` : une nouvelle valeur aléatoire, longue et unique (ne réutilisez pas le secret exposé auparavant).
- `FRONTEND_URL` : URL exacte du site Netlify, sans slash final, après le premier déploiement. Netlify fournit aussi les URL de déploiement dans l’environnement d’exécution pour les contrôles CORS.
- `NODE_ENV` : `production`.

Après avoir enregistré ces variables, relancez le déploiement. Vérifiez `https://<site>.netlify.app/health` puis le catalogue `/api/products`. Le quota Free de Netlify est limité et susceptible d’évoluer ; cette architecture convient à une démonstration sous quota, pas à une disponibilité commerciale garantie.

### Migration des données SQLite existantes

La base locale [`sport-equip-v1/database/sport-equip.sqlite`](./sport-equip-v1/database/sport-equip.sqlite) contient des données (40 produits, 17 commandes, 3 comptes). Le déploiement Render ne les copie pas automatiquement. Le script `backend/scripts/migrateSqliteToPostgres.js` transfère les tables et les identifiants vers une base PostgreSQL **vide**, dans une transaction ; il refuse les tables de destination non vides ou un schéma incompatible et n’affiche pas les données des clients.

Dans le dépôt, `neon env pull` écrit les variables Neon dans `.env.local`, ignoré par Git. L’API et le script de migration chargent ce fichier automatiquement. Neon fournit une URL poolée `DATABASE_URL` pour l’application et une URL directe `DATABASE_URL_UNPOOLED` pour la migration.

Avant de créer/démarrer l’API Render, récupérez les variables du projet avec `neon env pull`, puis exécutez :

```powershell
Set-Location .\sport-equip-v1\backend
npm ci
$env:MIGRATE_SQLITE_TO_POSTGRES = 'YES'
npm run migrate:postgres
```

Le script utilise par défaut la base SQLite v1 du dépôt, exige une URL directe (pas le host `-pooler`), vérifie d’abord l’intégrité des clés étrangères et demande une confirmation explicite. Ne fournissez jamais l’URL PostgreSQL dans un commit ou dans le code frontend. La migration conserve les comptes existants et leurs mots de passe hachés : utilisez les identifiants administrateur existants. Après vérification de l’import, configurez `DATABASE_URL` poolée dans l’API Render. Si vous choisissez de ne pas importer les données, l’API crée un compte administrateur initial à partir de `INITIAL_ADMIN_EMAIL` et `INITIAL_ADMIN_PASSWORD`, puis vous pourrez recréer le catalogue.

#### Migration Neon de Sport-Equip v1

La migration vers le projet Neon configuré a été exécutée et validée : 40 produits, 3 utilisateurs, 17 commandes, ainsi que les autres tables métier ont été importés avec des comptages identiques entre SQLite et Neon. La base SQLite source contenait 164 lignes orphelines (références à des produits, commandes, utilisateurs ou inventaires absents). Avec autorisation explicite, seules ces lignes dépendantes orphelines ont été supprimées après création et vérification SHA-256 de `sport-equip-v1/database/sport-equip.pre-neon-migration.sqlite.bak`. La vérification des clés étrangères SQLite est maintenant sans violation. Les tables `lignes_commandes` et `ProduitZone` comptent respectivement 8 et 0 lignes après ce nettoyage ; 12 commandes n’ont pas de ligne d’article. Les détails de ces commandes ne sont pas récupérables depuis la base actuelle ; restaurer la sauvegarde dans un environnement séparé si ces données doivent être examinées avant usage commercial.

Le démarrage de l’API sur Neon, `/health`, la lecture des 40 produits et la connexion du compte administrateur existant ont été testés. Le build frontend passe avec `npm run build` depuis la racine du dépôt. Cela valide la connexion locale à Neon, mais ne constitue pas un déploiement public : Render et le frontend hébergé restent à configurer.

### Option de démonstration recommandée

Pour un prototype gratuit, le déploiement peut être séparé en :

1. **Frontend statique** sur Render Static Sites, Netlify ou Cloudflare Pages.
2. **API Node.js** sur un service web gratuit, par exemple Render Free.
3. **Base de données distante** sur une offre gratuite PostgreSQL telle que Neon Free.

Render indique que ses services web gratuits s'arrêtent après une période d'inactivité et utilisent un système de fichiers éphémère : une base SQLite locale peut donc être perdue lors d'un redémarrage, d'une mise en veille ou d'un redéploiement. Ce montage convient à une démonstration, pas à des données réelles ou à une production.

### Adaptations nécessaires avant mise en ligne

La configuration permet maintenant PostgreSQL en production et SQLite en développement. Le pilote PostgreSQL est inclus et le schéma est créé au démarrage avec `sync()` sans suppression des tables. Le transfert des données SQLite est une étape manuelle distincte, décrite ci-dessus ; le déploiement ne copie pas automatiquement les données existantes.

Le frontend statique et l'API doivent être servis en HTTPS. Toute clé incluse dans une variable `REACT_APP_*` est intégrée au code livré au navigateur : ne jamais y placer un secret.

### Limites du gratuit

- Le premier appel à une API gratuite mise en veille peut être lent ; Render indique un délai de redémarrage d'environ une minute.
- Les quotas et conditions des offres gratuites changent. Vérifiez les conditions officielles avant déploiement : [Render — Free](https://render.com/docs/free), [Neon — tarifs](https://neon.com/pricing).
- Une offre gratuite n'est pas une sauvegarde ni une garantie de disponibilité. Pour un vrai service, prévoir une base persistante, des sauvegardes et un hébergement adapté.

### Vérifications et limites avant ouverture au public

- Le frontend doit être compilé avec `REACT_APP_API_URL` défini ; une compilation sans cette variable échoue au lieu de produire un site pointant vers `localhost`. Un `.env` local présent peut fournir cette valeur pendant les tests locaux ; Render doit recevoir sa propre variable.
- L’API ne démarre pas en production sans `DATABASE_URL`, `JWT_SECRET` et `FRONTEND_URL`. Configurez aussi `BACKEND_URL` avant toute intégration de paiement.
- Vérifiez après déploiement `/health`, l’inscription, la connexion, le catalogue, la création d’une commande et les pages servies directement par URL. Réalisez les opérations de commande avec des données de test.
- Le paiement en ligne et le chatbot répondent volontairement par une indisponibilité en production. Switch nécessite une intégration vérifiée et des callbacks authentifiés ; le chatbot doit être refondu pour éviter l’exécution de SQL généré par IA.
- Sans import, la base PostgreSQL démarre avec le schéma vide : créez les produits avec le compte administrateur initial ou préparez une migration des données existantes.
- La compilation frontend a été vérifiée avec `CI=true` et ne produit plus d’avertissements ESLint. L’avertissement restant concerne une API Node dépréciée dans la chaîne de compilation.
- Node.js 20 ou plus récent est requis par le frontend et l’API.
- Dernier audit npm : aucune vulnérabilité dans les dépendances runtime du frontend ; l’audit runtime du backend signale encore deux avis modérés sur `uuid` apporté par Sequelize. L’audit complet du frontend signale encore des vulnérabilités élevées dans l’ancienne chaîne de construction Create React App/Jest ; un correctif automatique exige des mises à niveau majeures. Le build statique déployé n’inclut pas cette chaîne, mais une modernisation du tooling reste recommandée.
- Les installations reproductibles `npm ci` du frontend et `npm ci --omit=dev` de l’API ont été validées. L’API a été exercée localement sur SQLite, puis sur Neon (santé, catalogue et connexion administrateur). Les routes de commande, CORS public et les URL hébergées doivent encore être testés après déploiement.
