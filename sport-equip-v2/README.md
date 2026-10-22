# Sport-Equip V2

Version modernisée de la plateforme e-commerce Sport-Equip avec Supabase, React et Tailwind CSS.

## Architecture

```
SPORT-EQUIP V2
     │
     ├─ FRONTEND (React + Tailwind + shadcn/ui)
     │   ├── pages/
     │   ├── components/
     │   ├── lib/ (Supabase client)
     │   └── hooks/
     │
     └─ SUPABASE
          ├── PostgreSQL (Base de données)
          ├── Supabase Auth (Authentification)
          ├── Storage (Images)
          ├── RLS (Sécurité)
          └── Edge Functions (API sensible)
```

## Différences avec V1

| Élément | V1 | V2 |
|---------|----|----|
| Frontend | React + Bootstrap | React + Tailwind + shadcn/ui |
| Backend | Node.js + Express + SQLite | Supabase (PostgreSQL) |
| Auth | JWT manuel (localStorage) | Supabase Auth |
| Base de données | SQLite | PostgreSQL |
| Sécurité | Middleware backend | RLS (Row Level Security) |
| Images | Serveur Node | Supabase Storage |
| Panier | Context (mémoire) | Persistance Supabase |
| Paiements | Express | Edge Functions |

## Structure du Projet

```
sport-equip-v2/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── pages/           # Pages de l'application
│   │   ├── components/      # Composants réutilisables
│   │   ├── lib/             # Configuration Supabase
│   │   └── hooks/           # Hooks personnalisés
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── supabase/                 # Configuration Supabase
    └── migrations/          # Scripts SQL
        └── 001_mvp_tables.sql
```

## Tables MVP Supabase (11 tables)

### Phase 1 - Core E-commerce
1. **profiles** - Extension de auth.users
2. **adresses** - Adresses multiples par utilisateur
3. **categories** - Catégories hiérarchiques
4. **produits** - Catalogue produits
5. **produit_variantes** - Variantes (taille, couleur, SKU, stock)
6. **produit_images** - Images produits
7. **paniers** - Paniers persistants
8. **panier_items** - Articles du panier
9. **commandes** - Commandes clients
10. **lignes_commande** - Lignes de commande
11. **paiements** - Transactions de paiement
12. **stock_mouvements** - Historique des mouvements de stock

## Installation

### Prérequis
- Node.js 18+
- Compte Supabase

### Étapes

1. **Cloner le projet**
```bash
cd sport-equip-v2/frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```
Éditez `.env` avec vos clés Supabase :
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

4. **Créer les tables Supabase**
Allez dans votre dashboard Supabase et exécutez le script SQL :
`supabase/migrations/001_mvp_tables.sql`

5. **Démarrer le développement**
```bash
npm run dev
```

## Migration depuis V1

Voir `PLAN_MIGRATION_V1_V2.md` pour le plan détaillé de migration.

### Pages à adapter depuis V1
- ✅ Home.js → Adapter pour Tailwind
- ✅ Catalogue.js → Adapter pour Tailwind
- ✅ ProductDetail.js → Adapter pour variantes Supabase
- ✅ Cart.js → Ajouter persistance Supabase
- ✅ Profile.js → Adapter pour Supabase Auth
- ✅ MyAvoirs.js → Adapter pour Supabase
- ⚠️ AdminDashboard.js → Découper en composants

### Pages à supprimer
- ❌ Login.js → Remplacé par Supabase Auth UI
- ❌ Register.js → Remplacé par Supabase Auth UI

### Controllers à migrer vers Supabase
- productController.js → Supabase PostgreSQL
- orderController.js → Supabase PostgreSQL
- adminController.js → Supabase PostgreSQL
- inventoryController.js → Supabase PostgreSQL
- etc.

### Controllers à migrer vers Edge Functions
- paymentController.js → Edge Function (sécurité)
- barcodeController.js → Edge Function
- chatbotController.js → Edge Function

## Technologies

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Composants UI
- **React Router** - Routing
- **Supabase JS** - Client Supabase
- **Lucide React** - Icônes

### Backend (Supabase)
- **PostgreSQL** - Base de données
- **Supabase Auth** - Authentification
- **Supabase Storage** - Stockage images
- **RLS** - Sécurité au niveau des lignes
- **Edge Functions** - API sensible

## Fonctionnalités

### MVP (Phase 1)
- ✅ Authentification (Supabase Auth)
- ✅ Catalogue produits avec filtrage
- ✅ Gestion des variantes (taille, couleur)
- ✅ Panier persistant
- ✅ Commandes
- ✅ Paiements (Mobile Money, Orange Money, etc.)
- ✅ Profil utilisateur
- ✅ Gestion des adresses

### Phase 2 (Be Sport)
- ⏳ Inventaires
- ⏳ Zones de stockage
- ⏳ Caisses
- ⏳ Avoirs
- ⏳ Fournisseurs
- ⏳ Livraisons
- ⏳ Promotions
- ⏳ Avis

## Sécurité

- **RLS (Row Level Security)** - Protection des données au niveau de la base
- **Supabase Auth** - Authentification sécurisée
- **Edge Functions** - Opérations sensibles côté serveur
- **Validation des entrées** - Vérification des données

## Déploiement

### Frontend
- Vercel ou Netlify

### Backend
- Supabase (hébergement inclus)

## Contributing

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence ISC.

## Contact

Pour toute question, contactez l'équipe Sport-Equip.
