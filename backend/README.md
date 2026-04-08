# 🏗 iTourisme Nomade - Backend

Backend robuste et sécurisé pour la plateforme iTourisme Nomade, construit avec **Node.js**, **Express**, **TypeScript**, **PostgreSQL** et **Prisma**.

---

## 🚀 Fonctionnalités

- ✅ **API RESTful** complète avec routes publiques et privées
- ✅ **Authentification JWT** sécurisée avec bcrypt
- ✅ **Upload d'images** vers Cloudinary avec gestion automatique
- ✅ **CMS complet** pour la gestion des articles et catégories
- ✅ **Newsletter** avec inscription/désinscription
- ✅ **Destinations** avec filtres par continent
- ✅ **Magazine** avec plans d'abonnement
- ✅ **Contact partenaires** avec validation Zod
- ✅ **Validation des données** avec Zod
- ✅ **Pagination** sur toutes les listes
- ✅ **Gestion des rôles** (SUPER_ADMIN, EDITOR)
- ✅ **Statistiques** pour le dashboard admin
- ✅ **Rate limiting** contre les attaques (100 req/15min)
- ✅ **Logs structurés** et colorés avec Winston
- ✅ **Clean Architecture** avec séparation des responsabilités
- ✅ **Filtres avancés** (vidéos, année, catégorie, continent)
- ✅ **Couleurs dynamiques** pour les catégories

---

## 📋 Prérequis

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** ou **yarn**
- Compte **Cloudinary** (gratuit)

---

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd itourisme-nomade-backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Puis éditer `.env` avec vos propres valeurs :
```env
# Environnement
NODE_ENV=development
PORT=5000

# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/itourisme_nomade"

# JWT Secret (générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS (frontend URLs séparées par des virgules)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=50
```

### 4. Créer la base de données
```bash
# Créer la base PostgreSQL
createdb itourisme_nomade

# Ou via psql
psql -U postgres
CREATE DATABASE itourisme_nomade;
\q
```

### 5. Générer le client Prisma et exécuter les migrations
```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# Ou en une seule commande
npm run prisma:setup
```

### 6. Peupler avec des données de test
```bash
npm run seed
```

**Cela créera :**
- ✅ **2 utilisateurs** : 
  - Super Admin : `admin@itourisme-nomade.com` / `Admin123!`
  - Éditeur : `editor@itourisme-nomade.com` / `Admin123!`
- ✅ **6 catégories** (Actualités, Reportages Salons, Interviews, Destinations, Analyses, Magazine)
- ✅ **6 destinations** (Sénégal, Côte d'Ivoire, Maroc, Kenya, Tanzanie, Cap-Vert)
- ✅ **23 articles** (3 Hero, 6 Actualités, 4 Vidéos, 3 Magazines, 4 Salons, 3 autres)
- ✅ **3 abonnés newsletter** de test

---

## 🚀 Démarrage

### Mode développement (avec hot-reload)
```bash
npm run dev
```

Le serveur démarre sur **`http://localhost:5000`**

Console :
```
✅ [2024-03-06T10:00:00.000Z] SUCCESS: 🚀 Serveur démarré sur le port 5000
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 📡 Environnement: development
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 🌍 URL: http://localhost:5000
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 📚 Documentation: http://localhost:5000/api
```

### Mode production
```bash
# 1. Compiler le TypeScript
npm run build

# 2. Démarrer le serveur
npm start
```

---

## 📁 Structure du Projet
```
/itourisme-nomade-backend
├── /prisma
│   ├── schema.prisma              # Schéma de base de données
│   ├── seed.ts                    # Données initiales complètes
│   └── /migrations                # Historique des migrations
├── /src
│   ├── /config                    # Configuration
│   │   ├── cloudinary.ts          # Setup Cloudinary
│   │   ├── database.ts            # Connexion Prisma
│   │   └── env.ts                 # Validation variables d'env
│   ├── /controllers               # Logique des requêtes HTTP
│   │   ├── article.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── destination.controller.ts     # ✅ NOUVEAU
│   │   ├── newsletter.controller.ts      # ✅ NOUVEAU
│   │   ├── magazine.controller.ts        # ✅ NOUVEAU
│   │   ├── partners.controller.ts        # ✅ NOUVEAU
│   │   ├── media.controller.ts
│   │   └── stats.controller.ts
│   ├── /middlewares               # Middlewares
│   │   ├── auth.ts                # Protection JWT
│   │   ├── errorHandler.ts        # Gestion erreurs globale
│   │   ├── upload.ts              # Upload Multer
│   │   └── validate.ts            # Validation Zod
│   ├── /routes                    # Définition des endpoints
│   │   ├── admin-articles.routes.ts
│   │   ├── admin-categories.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── destinations.routes.ts         # ✅ NOUVEAU
│   │   ├── newsletter.routes.ts           # ✅ NOUVEAU
│   │   ├── magazine.routes.ts             # ✅ NOUVEAU
│   │   ├── partners.routes.ts             # ✅ NOUVEAU
│   │   ├── media.routes.ts
│   │   ├── public-articles.routes.ts
│   │   ├── public-categories.routes.ts
│   │   ├── stats.routes.ts
│   │   └── index.ts               # Routes centralisées
│   ├── /services                  # Logique métier
│   │   ├── article.service.ts
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── media.service.ts
│   │   └── stats.service.ts
│   ├── /utils                     # Utilitaires
│   │   ├── logger.ts              # Winston logger
│   │   ├── response.ts            # Réponses standardisées
│   │   └── slugify.ts             # Génération de slugs
│   └── app.ts                     # Point d'entrée principal
├── /scripts                       # Scripts utilitaires
│   └── update-colors.ts           # Mise à jour couleurs catégories
├── .env.example                   # Template de configuration
├── .gitignore
├── package.json
├── tsconfig.json
├── API_DOCUMENTATION.md           # 📚 Documentation complète de l'API
└── README.md
```

---

## 🔐 Authentification

L'API utilise **JWT (JSON Web Token)** pour l'authentification. 

Après connexion, vous recevez un token à inclure dans le header `Authorization` de chaque requête protégée :
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Exemple de connexion :**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@itourisme-nomade.com",
    "password": "Admin123!"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@itourisme-nomade.com",
      "name": "Super Admin",
      "role": "SUPER_ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📚 Documentation de l'API

📖 **Voir le fichier [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** pour la liste complète des endpoints et exemples d'utilisation.

### Endpoints Principaux

#### 🌐 Public (Front-Office)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/mag/articles` | GET | Liste des articles publiés |
| `/api/mag/articles/:slug` | GET | Détail d'un article |
| `/api/categories` | GET | Liste des catégories |
| `/api/destinations` | GET | Liste des destinations |
| `/api/destinations/featured` | GET | Destinations coup de cœur |
| `/api/newsletter/subscribe` | POST | Inscription newsletter |
| `/api/magazine/subscription-plans` | GET | Plans d'abonnement |
| `/api/pages/partners` | GET | Page partenaires |
| `/api/contacts/partners` | POST | Contact partenariat |

#### 🔐 Admin (Back-Office)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/login` | POST | Connexion admin |
| `/api/admin/articles` | GET, POST | Gestion articles |
| `/api/admin/articles/:id` | GET, PUT, DELETE | CRUD article |
| `/api/admin/categories` | GET, POST | Gestion catégories |
| `/api/admin/media/upload` | POST | Upload d'image |
| `/api/admin/stats/dashboard` | GET | Statistiques globales |

---

## 🗄️ Base de Données

### Modèles Principaux

| Modèle | Description |
|--------|-------------|
| **User** | Utilisateurs (admin/éditeurs) |
| **Article** | Articles du magazine avec contenu JSON |
| **Category** | Catégories (Magazine + Destinations) avec couleurs |
| **Destination** | Destinations touristiques |
| **Media** | Bibliothèque de médias (Cloudinary) |
| **NewsletterSubscriber** | Abonnés newsletter |
| **PartnerContact** | Demandes de partenariat |

### Relations
```mermaid
graph LR
    User -->|author| Article
    Category -->|has many| Article
    Destination -->|has many| Article
    Article -->|belongs to| Category
    Article -->|belongs to| Destination
```

### Commandes Prisma
```bash
# Générer le client Prisma
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Réinitialiser la BDD (⚠️ supprime toutes les données)
npx prisma migrate reset

# Peupler la base
npm run seed
```

---

## 🔧 Scripts NPM

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrage en mode développement avec hot-reload |
| `npm run build` | Compilation TypeScript vers `dist/` |
| `npm start` | Démarrage en production (nécessite `npm run build`) |
| `npm run seed` | Peuplement de la BDD avec données de test |
| `npx prisma generate` | Génération du client Prisma |
| `npx prisma studio` | Interface graphique Prisma Studio |
| `npx prisma migrate dev` | Création et application d'une migration |
| `npx ts-node scripts/update-colors.ts` | Mise à jour des couleurs de catégories |

---

## 🛡️ Sécurité

- ✅ **Hachage des mots de passe** avec bcrypt (10 rounds)
- ✅ **Tokens JWT** avec expiration configurable (défaut: 7 jours)
- ✅ **Helmet** pour sécuriser les headers HTTP
- ✅ **CORS** configuré avec origines autorisées
- ✅ **Rate limiting** (100 requêtes / 15 minutes par IP)
- ✅ **Validation stricte** avec Zod sur toutes les entrées
- ✅ **Protection contre les injections SQL** via Prisma ORM
- ✅ **Sanitization** des fichiers uploadés (types MIME vérifiés)
- ✅ **Gestion centralisée des erreurs** avec logging

---

## 🌐 Variables d'Environnement

| Variable | Description | Exemple / Défaut |
|----------|-------------|------------------|
| `NODE_ENV` | Environnement d'exécution | `development` / `production` |
| `PORT` | Port du serveur | `5000` |
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret pour signer les JWT | Généré aléatoirement (min 32 caractères) |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | Depuis cloudinary.com |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | Depuis cloudinary.com |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | Depuis cloudinary.com |
| `CORS_ORIGIN` | URLs autorisées (séparées par `,`) | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Fenêtre de rate limiting (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Nombre max de requêtes | `100` |
| `DEFAULT_PAGE_SIZE` | Taille de page par défaut | `10` |
| `MAX_PAGE_SIZE` | Taille de page maximale | `50` |

---

## 📊 Optimisations

- ⚡ **Indexes** sur les champs critiques (slug, status, categoryId, featured)
- ⚡ **Pagination** sur toutes les listes pour limiter la charge
- ⚡ **Cloudinary** pour optimisation automatique des images (resize, format)
- ⚡ **Lazy loading** des relations Prisma (include/select stratégique)
- ⚡ **Promise.all** pour exécuter les requêtes en parallèle
- ⚡ **Connection pooling** PostgreSQL via Prisma

---

## 🧪 Tests

### Exemples avec cURL
```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Récupérer les articles featured
curl "http://localhost:5000/api/mag/articles?featured=true&pageSize=3"

# 3. Connexion admin
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@itourisme-nomade.com","password":"Admin123!"}'

# 4. Liste des articles (avec authentification)
TOKEN="<votre_token_jwt>"
curl http://localhost:5000/api/admin/articles \
  -H "Authorization: Bearer $TOKEN"

# 5. Inscription newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"website"}'

# 6. Destinations Afrique
curl "http://localhost:5000/api/destinations?continent=AFRIQUE"
```

### Test avec Postman

Importez la collection Postman disponible sur :  
📦 `http://localhost:5000/api/postman-collection` (TODO)

---

## 🐛 Débogage

Les logs sont affichés en temps réel avec **Winston** et des emojis pour faciliter le débogage :

- ℹ️  **INFO** - Informations générales
- ✅ **SUCCESS** - Opérations réussies
- ⚠️  **WARN** - Avertissements
- ❌ **ERROR** - Erreurs
- 🐛 **DEBUG** - Debug (uniquement en développement)

**Exemple de logs :**
```
✅ [2024-03-06T10:00:00.000Z] SUCCESS: 🚀 Serveur démarré sur le port 5000
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 📡 Environnement: development
❌ [2024-03-06T10:05:12.000Z] ERROR: Erreur sur GET /api/mag/articles: ...
```

---

## 🆕 Nouveautés (Version 1.1.0)

### ✅ Destinations
- Gestion complète des destinations touristiques
- Filtres par continent (AFRIQUE, EUROPE, etc.)
- Destinations "coup de cœur" (featured)
- Relation avec les articles

### ✅ Newsletter
- Inscription/Désinscription
- Types d'abonnements multiples
- Vérification par email (TODO)

### ✅ Magazine
- Plans d'abonnement (Digital, Papier, Premium)
- Session de paiement (Stripe à intégrer)

### ✅ Partenaires
- Page partenaires avec données complètes
- Formulaire de contact avec validation
- Stockage des demandes en BDD

### ✅ Filtres Avancés Articles
- `hasVideo` - Filtrer les articles avec vidéos
- `year` - Filtrer par année
- `sortBy` - Tri personnalisé (date, vues, titre)

### ✅ Couleurs Dynamiques
- Chaque catégorie a une couleur unique
- Utilisable dans le frontend pour les badges

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Suivez ces étapes :

1. **Fork** le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Guidelines

- Suivre les conventions de code TypeScript
- Ajouter des tests si possible
- Mettre à jour la documentation
- Utiliser des commits sémantiques

---

## 📝 Licence

**MIT License**

Copyright (c) 2024 iTourisme Nomade

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 👥 Auteurs

**iTourisme Nomade Team**

- 🌍 Website: [https://itourisme-nomade.com](https://itourisme-nomade.com)
- 📧 Email: dev@itourisme-nomade.com
- 💼 LinkedIn: [iTourisme Nomade](https://linkedin.com/company/itourisme-nomade)

---

## 📞 Support

Pour toute question ou problème :

1. 📚 Consultez la [documentation de l'API](./API_DOCUMENTATION.md)
2. 💬 Ouvrez une [issue sur GitHub](https://github.com/itourisme-nomade/backend/issues)
3. 📧 Contactez-nous à **dev@itourisme-nomade.com**

---

## 🙏 Remerciements

- [Express.js](https://expressjs.com/) - Framework web
- [Prisma](https://www.prisma.io/) - ORM moderne
- [Cloudinary](https://cloudinary.com/) - Gestion des médias
- [Zod](https://zod.dev/) - Validation TypeScript-first
- [Winston](https://github.com/winstonjs/winston) - Logging

---

**Dernière mise à jour :** 6 mars 2026  
**Version API :** 1.1.0  
**Status :** ✅ Production Ready





<!-- # 🏗 iTourisme Nomade - Backend

Backend robuste et sécurisé pour la plateforme iTourisme Nomade, construit avec Node.js, Express, TypeScript, PostgreSQL et Prisma.

## 🚀 Fonctionnalités

- ✅ **API RESTful** complète avec routes publiques et privées
- ✅ **Authentification JWT** sécurisée avec bcrypt
- ✅ **Upload d'images** vers Cloudinary avec gestion automatique
- ✅ **CMS complet** pour la gestion des articles et catégories
- ✅ **Validation des données** avec Zod
- ✅ **Cache intelligent** pour optimiser les performances
- ✅ **Pagination** sur toutes les listes
- ✅ **Gestion des rôles** (SUPER_ADMIN, EDITOR)
- ✅ **Statistiques** pour le dashboard admin
- ✅ **Rate limiting** contre les attaques
- ✅ **Logs** structurés et colorés
- ✅ **Clean Architecture** avec séparation des responsabilités

## 📋 Prérequis

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** ou **yarn**
- Compte **Cloudinary** (gratuit)

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd it-nomade-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Puis éditer `.env` avec vos propres valeurs :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/itourisme_nomade"

# JWT Secret (générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS (frontend URLs)
CORS_ORIGIN=http://localhost:3000
```

### 4. Générer le client Prisma

```bash
npm run prisma:generate
```

### 5. Créer la base de données

```bash
npm run prisma:migrate
```

### 6. Peupler avec des données de test (optionnel)

```bash
npm run prisma:seed
```

Cela créera :
- Un super admin : `admin@itourisme-nomade.com` / `Admin123!`
- Des catégories de base
- Des destinations
- Un article exemple

## 🚀 Démarrage

### Mode développement (avec hot-reload)

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Mode production

```bash
# Compiler le TypeScript
npm run build

# Démarrer le serveur
npm start
```

## 📁 Structure du Projet

```
/it-nomade-backend
├── /prisma
│   ├── schema.prisma          # Schéma de base de données
│   └── seed.ts                # Données initiales
├── /src
│   ├── /config                # Configuration (DB, Cloudinary, Env)
│   │   ├── cloudinary.ts
│   │   ├── database.ts
│   │   └── env.ts
│   ├── /controllers           # Logique des requêtes HTTP
│   │   ├── article.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── media.controller.ts
│   │   └── stats.controller.ts
│   ├── /middlewares           # Middlewares (Auth, Erreurs, Upload)
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── upload.ts
│   │   └── validate.ts
│   ├── /routes                # Définition des endpoints
│   │   ├── admin-articles.routes.ts
│   │   ├── admin-categories.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── destinations.routes.ts
│   │   ├── media.routes.ts
│   │   ├── public-articles.routes.ts
│   │   ├── public-categories.routes.ts
│   │   ├── stats.routes.ts
│   │   └── index.ts
│   ├── /services              # Logique métier
│   │   ├── article.service.ts
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── media.service.ts
│   │   └── stats.service.ts
│   ├── /utils                 # Utilitaires
│   │   ├── cache.ts
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── slugify.ts
│   ├── /validators            # Schémas de validation Zod
│   │   ├── article.validator.ts
│   │   ├── auth.validator.ts
│   │   └── category.validator.ts
│   └── app.ts                 # Point d'entrée
├── .env.example               # Template de configuration
├── .gitignore
├── package.json
├── tsconfig.json
└── API_DOCUMENTATION.md       # Documentation complète de l'API
```

## 🔐 Authentification

L'API utilise **JWT** pour l'authentification. Après connexion, vous recevez un token à inclure dans le header de chaque requête protégée :

```
Authorization: Bearer <votre_token>
```

## 📚 Documentation de l'API

Voir le fichier [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la liste complète des endpoints et exemples d'utilisation.

### Endpoints principaux

#### Public (Front-Office)
- `GET /api/mag/articles` - Liste des articles
- `GET /api/mag/articles/:slug` - Détail d'un article
- `GET /api/categories` - Liste des catégories
- `GET /api/destinations/featured` - Articles mis en avant

#### Admin (Back-Office)
- `POST /api/admin/login` - Connexion
- `POST /api/admin/articles` - Créer un article
- `PUT /api/admin/articles/:id` - Modifier un article
- `POST /api/admin/media/upload` - Upload d'image
- `GET /api/admin/stats` - Statistiques

## 🗄️ Base de Données

### Modèles principaux

- **User** - Utilisateurs (admin/éditeurs)
- **Article** - Articles du magazine
- **Category** - Catégories (Magazine + Destinations)
- **Media** - Bibliothèque de médias

### Migrations Prisma

```bash
# Créer une nouvelle migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface visuelle)
npm run prisma:studio
```

## 🔧 Scripts NPM

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrage en mode développement |
| `npm run build` | Compilation TypeScript |
| `npm start` | Démarrage en production |
| `npm run prisma:generate` | Génération du client Prisma |
| `npm run prisma:migrate` | Exécution des migrations |
| `npm run prisma:studio` | Interface Prisma Studio |
| `npm run prisma:seed` | Peuplement de la BDD |

## 🛡️ Sécurité

- ✅ Hachage des mots de passe avec **bcrypt** (10 rounds)
- ✅ Tokens JWT avec expiration configurable
- ✅ **Helmet** pour sécuriser les headers HTTP
- ✅ **CORS** configuré
- ✅ **Rate limiting** (100 req/15min par IP)
- ✅ Validation stricte avec **Zod**
- ✅ Protection contre les injections SQL via Prisma

## 🌐 Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `development` / `production` |
| `PORT` | Port du serveur | `5000` |
| `DATABASE_URL` | URL PostgreSQL | `postgresql://...` |
| `JWT_SECRET` | Secret pour JWT | Généré aléatoirement |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |
| `CLOUDINARY_*` | Credentials Cloudinary | Depuis cloudinary.com |
| `CORS_ORIGIN` | URLs autorisées | `http://localhost:3000` |

## 📊 Optimisations

- **Cache** pour les catégories (Node-cache)
- **Pagination** sur toutes les listes
- **Indexes** sur les champs critiques (slug, status, categoryId)
- **Cloudinary** pour optimisation automatique des images
- **Lazy loading** des relations Prisma

## 🧪 Tests

Exemple de test avec Postman / cURL :

```bash
# Health check
curl http://localhost:5000/api/health

# Connexion
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@itourisme-nomade.com","password":"Admin123!"}'

# Liste des articles (avec token)
curl http://localhost:5000/api/admin/articles \
  -H "Authorization: Bearer <TOKEN>"
```

## 🐛 Débogage

Les logs sont affichés en temps réel avec des emojis pour faciliter le débogage :

- ℹ️ INFO
- ✅ SUCCESS
- ⚠️ WARN
- ❌ ERROR
- 🐛 DEBUG (en dev uniquement)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT

## 👥 Auteurs

iTourisme Nomade Team

---

**📞 Support**: Pour toute question, consultez la documentation de l'API ou ouvrez une issue. -->