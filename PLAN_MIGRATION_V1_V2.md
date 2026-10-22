# Plan de Migration Sport-Equip V1 → V2

## Analyse de l'Architecture Actuelle

### FRONTEND V1 - Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.js (22KB) ✅ Adapter
│   │   ├── Catalogue.js (8KB) ✅ Adapter
│   │   ├── ProductDetail.js (9KB) ✅ Adapter
│   │   ├── Cart.js (18KB) ✅ Adapter + Persistance
│   │   ├── Profile.js (21KB) ✅ Adapter
│   │   ├── MyAvoirs.js (11KB) ✅ Adapter
│   │   ├── AdminDashboard.js (126KB) ⚠️ Découper
│   │   ├── Login.js ❌ Supprimer
│   │   └── Register.js ❌ Supprimer
│   ├── components/
│   │   ├── Header.js ✅ Adapter
│   │   ├── Footer.js ✅ Adapter
│   │   ├── ProductCard.js ✅ Adapter
│   │   ├── StarRating.js ✅ Adapter
│   │   └── Chatbot.js ✅ Adapter
│   ├── context/
│   │   ├── CartContext.js ❌ Supprimer
│   │   └── AuthContext.js ❌ Supprimer
│   └── api/ ❌ Supprimer (remplacer par Supabase)
├── package.json
└── index.css (68KB - Bootstrap)
```

### BACKEND V1 - Structure
```
backend/
├── controllers/ (20 fichiers)
│   ├── authController.js ❌ Supprimer (Supabase Auth)
│   ├── userController.js ❌ Supprimer (Supabase Auth)
│   ├── paymentController.js 🔄 Edge Function
│   ├── barcodeController.js 🔄 Edge Function
│   ├── chatbotController.js 🔄 Edge Function
│   └── (15 autres) 🔄 Migrer vers Supabase PostgreSQL
├── models/ (19 fichiers) ❌ Supprimer (Tables Supabase)
├── routes/ (19 fichiers) ❌ Supprimer (Appels Supabase)
└── server.js ❌ Supprimer
```

## Architecture Cible V2

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

## Tables MVP Supabase (11 tables)

### Phase 1 - MVP Core
1. **profiles** (extension auth.users)
2. **adresses**
3. **categories**
4. **produits**
5. **produit_variantes**
6. **produit_images**
7. **paniers**
8. **panier_items**
9. **commandes**
10. **lignes_commande**
11. **paiements**

### Phase 2 - Stock
12. **stock_mouvements**

### Phase 3 - Be Sport
13. **promotions**
14. **livreurs**
15. **affectations_livraison**
16. **avis_produits**
17. **avis_livraisons**
18. **zones_stockage**
19. **inventaires**
20. **inventaire_lignes**
21. **caisses**
22. **operations_caisse**
23. **fournisseurs**
24. **remboursements**
25. **avoirs**
26. **permissions**

## Étapes de Migration

### ÉTAPE 1 ✅ - Créer structure V2
- [x] Créer dossier sport-equip-v2/
- [x] Créer dossier frontend/

### ÉTAPE 2 - Initialiser Frontend
- [x] Installer React + Vite
- [x] Installer Tailwind CSS
- [ ] Installer shadcn/ui
- [x] Installer Supabase client
- [x] Installer React Router

### ÉTAPE 3 - Créer Structure Frontend
- [x] src/pages/
- [ ] src/components/ui/ (shadcn)
- [ ] src/components/product/
- [ ] src/components/cart/
- [x] src/components/layout/
- [x] src/lib/supabase.js
- [ ] src/hooks/

### ÉTAPE 4 - Migrer Pages V1 vers V2
- [x] Adapter Home.js pour Tailwind
- [x] Adapter Catalogue.js pour Tailwind
- [x] Adapter ProductDetail.js pour Tailwind
- [x] Adapter Cart.js avec persistance Supabase
- [x] Adapter Profile.js pour Supabase Auth
- [x] Créer AdminDashboard avec Tailwind

### ÉTAPE 5 - Créer Projet Supabase
- [x] Créer projet Supabase
- [x] Configurer Auth
- [x] Configurer Storage
- [x] Configurer RLS

### ÉTAPE 6 - Créer Tables MVP
- [x] Créer tables SQL (11 tables MVP)
- [x] Configurer RLS policies
- [x] Créer triggers pour timestamps

### ÉTAPE 7 - Migrer Logique Backend
- [x] Migrer logique productController vers Supabase
- [ ] Migrer logique orderController vers Supabase
- [ ] Migrer logique adminController vers Supabase

### ÉTAPE 8 - Créer Edge Functions
- [ ] paymentController → Edge Function
- [ ] barcodeController → Edge Function
- [ ] chatbotController → Edge Function

## Dépendances Frontend V2

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.39.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0"
  }
}
```

## Notes Importantes

1. **NE PAS SUPPRIMER V1** - Garder comme référence
2. **Migration Progressive** - Ne pas tout refaire d'un coup
3. **Conserver la logique métier** - Récupérer des controllers V1
4. **Sécurité** - Utiliser RLS Supabase au lieu de middleware backend
5. **Persistance** - Panier stocké dans Supabase au lieu de Context
