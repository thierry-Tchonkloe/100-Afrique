# 📚 Documentation API Complète - iTourisme Nomade Backend

## 🌍 URL de Base

- **Production**: `https://itourisme-nomade-api.onrender.com/api`
- **Development**: `http://localhost:5000/api`

---

## 🔐 Authentification

L'authentification se fait via **JWT (JSON Web Token)**. Une fois connecté, incluez le token dans le header `Authorization` de chaque requête protégée :
```http
Authorization: Bearer <votre_token_jwt>
```

---

## 🌐 ENDPOINTS PUBLIC (FRONT-OFFICE)

### 📰 Articles du Magazine

#### Liste des articles publiés
```http
GET /api/mag/articles
```

**Query Parameters:**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | number | Numéro de la page (défaut: 1) |
| `pageSize` | number | Nombre d'articles par page (défaut: 10, max: 50) |
| `search` | string | Recherche dans le titre et l'extrait |
| `categoryId` | number | Filtrer par ID de catégorie |
| `categorySlug` | string | Filtrer par slug de catégorie (ex: `actualites`) |
| `featured` | boolean | Filtrer les articles mis en avant (`true` ou `false`) |
| `hasVideo` | boolean | Filtrer les articles contenant des vidéos |
| `year` | number | Filtrer par année de publication (ex: `2024`) |
| `sortBy` | string | Tri (défaut: `createdAt:desc`)<br>Options: `createdAt:asc`, `createdAt:desc`, `views:desc`, `title:asc` |
| `status` | string | Statut (défaut: `PUBLISHED`) |

**Exemples d'utilisation:**
```bash
# Articles featured (page d'accueil)
GET /api/mag/articles?featured=true&pageSize=3

# Dernières actualités
GET /api/mag/articles?categorySlug=actualites&pageSize=6

# Vidéos uniquement
GET /api/mag/articles?hasVideo=true&pageSize=8

# Articles de 2024
GET /api/mag/articles?year=2024

# Articles les plus vus
GET /api/mag/articles?sortBy=views:desc&pageSize=10
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IFTM Top Resa 2024 : Les Tendances du Tourisme Africain",
      "slug": "iftm-top-resa-2024-tendances-tourisme-africain",
      "content": [...],
      "excerpt": "Retour sur les temps forts du plus grand salon...",
      "coverImage": "https://images.unsplash.com/photo-...",
      "status": "PUBLISHED",
      "featured": true,
      "views": 150,
      "metaTitle": "IFTM Top Resa 2024 - Tourisme Africain",
      "metaDescription": "Découvrez les tendances...",
      "category": {
        "id": 2,
        "name": "Reportages Salons",
        "slug": "reportages-salons",
        "type": "MAGAZINE",
        "color": "#3498DB"
      },
      "author": {
        "id": 1,
        "name": "Super Admin",
        "email": "admin@itourisme-nomade.com"
      },
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 23,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Détail d'un article
```http
GET /api/mag/articles/:slug
```

**Paramètres:**

- `slug` (string, requis) - Slug de l'article (ex: `senegal-destination-tendance-2025`)

**Réponse:** Article complet avec catégorie et auteur

> **Note:** Cette route incrémente automatiquement le compteur de vues.

---

### 🗂️ Catégories

#### Liste de toutes les catégories
```http
GET /api/categories
```

**Query Parameters:**

- `type` (string, optionnel) - Filtrer par type: `MAGAZINE` ou `DESTINATION`

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Actualités",
      "slug": "actualites",
      "description": "Les dernières nouvelles du tourisme",
      "type": "MAGAZINE",
      "order": 1,
      "color": "#E74C3C",
      "_count": {
        "articles": 15
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Détail d'une catégorie
```http
GET /api/categories/:slug
```

**Paramètres:**

- `slug` (string, requis) - Slug de la catégorie

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Actualités",
    "slug": "actualites",
    "description": "Les dernières nouvelles",
    "type": "MAGAZINE",
    "order": 1,
    "color": "#E74C3C",
    "_count": {
      "articles": 15
    },
    "articles": [
      {
        "id": 1,
        "title": "Article 1",
        "slug": "article-1",
        "excerpt": "...",
        "coverImage": "https://..."
      }
    ]
  }
}
```

---

### 🌍 Destinations

#### Liste des destinations
```http
GET /api/destinations
```

**Query Parameters:**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `continent` | string | Filtrer par continent<br>Options: `AFRIQUE`, `EUROPE`, `AMÉRIQUES`, `ASIE/MOYEN-ORIENT`, `OCÉANIE` |
| `search` | string | Recherche dans nom et description |
| `page` | number | Numéro de la page (défaut: 1) |
| `pageSize` | number | Résultats par page (défaut: 8) |
| `status` | string | Statut (défaut: `PUBLISHED`) |

**Exemples:**
```bash
# Toutes les destinations
GET /api/destinations?pageSize=8

# Destinations Afrique uniquement
GET /api/destinations?continent=AFRIQUE

# Recherche
GET /api/destinations?search=senegal
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Sénégal",
        "slug": "senegal",
        "description": "Terre de la Téranga...",
        "coverImage": "https://images.unsplash.com/photo-...",
        "continent": "AFRIQUE",
        "featured": true,
        "status": "PUBLISHED",
        "_count": {
          "articles": 5
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 6,
      "pageSize": 8
    }
  }
}
```

---

#### Destinations coup de cœur
```http
GET /api/destinations/featured
```

**Query Parameters:**

- `limit` (number, optionnel) - Nombre de résultats (défaut: 6)
- `region` (string, optionnel) - Filtrer par région (ex: `AFRIQUE`)

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sénégal",
      "slug": "senegal",
      "excerpt": "Terre de la Téranga...",
      "coverImage": "https://...",
      "category": {
        "id": 0,
        "name": "Destination"
      }
    }
  ]
}
```

---

#### Détail d'une destination
```http
GET /api/destinations/:slug
```

**Paramètres:**

- `slug` (string, requis) - Slug de la destination

---

### 📧 Newsletter

#### S'abonner à la newsletter
```http
POST /api/newsletter/subscribe
```

**Body:**
```json
{
  "email": "user@example.com",
  "source": "website",
  "type": "general"
}
```

**Validation:**

- `email` (string, requis) - Email valide
- `source` (string, optionnel) - Source d'inscription (`website`, `salons_page`, `actualites_page`)
- `type` (string, optionnel) - Type d'abonnement (`general`, `alerts_salons`, `actualites_page`)

**Réponse:**
```json
{
  "success": true,
  "message": "Inscription réussie ! Vous allez recevoir nos actualités.",
  "data": {
    "email": "user@example.com"
  }
}
```

**Codes d'erreur:**

- `409` - Email déjà inscrit
- `400` - Email invalide

---

#### Se désabonner
```http
POST /api/newsletter/unsubscribe
```

**Body:**
```json
{
  "email": "user@example.com"
}
```

---

### 📚 Magazine & Abonnements

#### Plans d'abonnement disponibles
```http
GET /api/magazine/subscription-plans
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "digital",
      "name": "Numérique",
      "description": "Version digitale",
      "price": 49,
      "currency": "EUR",
      "duration": "an",
      "issuesPerYear": 12,
      "features": [
        "Accès illimité aux 12 numéros annuels",
        "Archives complètes en ligne",
        "Newsletter exclusive hebdomadaire",
        "Format PDF haute qualité"
      ],
      "isPopular": false
    }
  ]
}
```

---

#### Créer une session de paiement
```http
POST /api/magazine/create-checkout-session
```

**Body:**
```json
{
  "planId": "premium"
}
```

**Validation:**

- `planId` (enum, requis) - Un des plans : `digital`, `print`, `premium`

---

### 🤝 Contact & Partenariats

#### 1. Données de la page partenaires
```http
GET /api/pages/partners
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Devenez partenaire du média référence...",
      "description": "Augmentez votre visibilité...",
      "imageUrl": "https://images.unsplash.com/..."
    },
    "values": [...],
    "stats": [...],
    "mediaKitUrl": "/files/waxeho-media-kit.pdf",
    "opportunities": [...],
    "partners": [...]
  }
}
```

---

#### 2. Contact Partenariat Général
```http
POST /api/contacts/partners
```

**Body:**
```json
{
  "lastname": "Dupont",
  "firstname": "Jean",
  "company": "Office de Tourisme Paris",
  "email": "jean@paris-tourism.fr",
  "service_type": "display",
  "message": "Je souhaite obtenir un devis..."
}
```

**Validation:**

- `lastname` (string, requis) - Min 2 caractères
- `firstname` (string, requis) - Min 2 caractères
- `company` (string, requis) - Nom de l'organisation
- `email` (string, requis) - Email valide
- `service_type` (enum, requis) - `display`, `content`, `magazine`, `event`
- `message` (string, requis) - Min 10 caractères

**Réponse:**
```json
{
  "success": true,
  "message": "Votre demande a été envoyée avec succès. Notre équipe vous contactera sous 24h.",
  "data": {
    "contactId": 1
  }
}
```

---

#### 3. Demande Kit Média Annonceurs
```http
POST /api/contacts/annonceurs
```

**Body:**
```json
{
  "interest": "publicite",
  "firstName": "Marie",
  "lastName": "Martin",
  "company": "Agence Voyage Plus",
  "email": "marie@voyageplus.fr",
  "phone": "+33612345678",
  "message": "Je souhaite recevoir le kit média..."
}
```

**Validation:**

- `interest` (enum, requis) - `publicite`, `partenariat`, `webtv`, `evenement`
- `firstName` (string, requis) - Min 2 caractères
- `lastName` (string, requis) - Min 2 caractères
- `company` (string, requis) - Nom de l'entreprise
- `email` (string, requis) - Email valide
- `phone` (string, requis) - Téléphone valide
- `message` (string, optionnel) - Message additionnel

**Mapping des types:**

- `publicite` → `display`
- `partenariat` → `content`
- `webtv` → `magazine`
- `evenement` → `event`

**Réponse:**
```json
{
  "success": true,
  "message": "Demande de kit média envoyée avec succès. Vous recevrez notre documentation sous 24h.",
  "data": {
    "contactId": 2
  }
}
```

---

#### 4. Demande Couverture Éditoriale
```http
POST /api/contacts/editorial
```

**Body:**
```json
{
  "subject": "Lancement nouveau produit touristique",
  "type": "presse",
  "eventName": "Soirée de lancement",
  "sender": {
    "firstname": "Paul",
    "lastname": "Bernard",
    "email": "paul@example.com",
    "company": "Tour Operator Global"
  },
  "message": "Nous organisons un événement...",
  "source": "website"
}
```

**Validation:**

- `subject` (string, requis) - Objet de la demande
- `type` (enum, requis) - `presse`, `video`, `social`, `global`
- `eventName` (string, requis) - Nom de l'événement
- `sender` (object, requis):
  - `firstname` (string, requis)
  - `lastname` (string, requis)
  - `email` (string, requis)
  - `company` (string, optionnel)
- `message` (string, optionnel) - Détails supplémentaires
- `source` (string, optionnel) - Source de la demande

**Mapping des types:**

- `presse` → `content`
- `video` → `magazine`
- `social` → `display`
- `global` → `event`

**Réponse:**
```json
{
  "success": true,
  "message": "Demande de couverture éditoriale envoyée. Notre rédaction vous répondra sous 48h.",
  "data": {
    "contactId": 3
  }
}
```

---

#### 5. Partenariat Destination
```http
POST /api/contacts/partenariat-destination
```

**Body:**
```json
{
  "destinations": "Sénégal, Maroc, Côte d'Ivoire",
  "collabType": "campaign",
  "officeName": "Office du Tourisme Dakar",
  "firstname": "Aminata",
  "lastname": "Diop",
  "email": "aminata@tourisme-dakar.sn",
  "objectives": "Promouvoir nos destinations auprès des professionnels français..."
}
```

**Validation:**

- `destinations` (string, requis) - Liste des destinations
- `collabType` (enum, requis) - `campaign`, `video`, `edito`
- `officeName` (string, requis) - Nom de l'office
- `firstname` (string, requis)
- `lastname` (string, requis)
- `email` (string, requis)
- `objectives` (string, optionnel) - Objectifs de la collaboration

**Mapping des types:**

- `campaign` → `display`
- `video` → `magazine`
- `edito` → `content`

**Réponse:**
```json
{
  "success": true,
  "message": "Demande de partenariat destination envoyée. Nous reviendrons vers vous sous 48h.",
  "data": {
    "contactId": 4
  }
}
```

---

#### 6. Demande de Devis Vidéo
```http
POST /api/contacts/demande-devis
```

**Body:**
```json
{
  "format": "reportage",
  "theme": "Découverte du patrimoine sénégalais",
  "location": "Dakar, Gorée, Saint-Louis",
  "duration": "3-5min",
  "firstname": "Ibrahim",
  "lastname": "Sow",
  "organization": "Ministère du Tourisme",
  "email": "ibrahim@tourisme.sn",
  "budget": "5000-10000",
  "source": "website"
}
```

**Validation:**

- `format` (enum, requis) - `interview`, `reportage`, `mesure`
- `theme` (string, requis) - Thématique de la vidéo
- `location` (string, requis) - Lieu(x) de tournage
- `duration` (enum, requis) - `1-3min`, `3-5min`, `plus`
- `firstname` (string, requis)
- `lastname` (string, requis)
- `organization` (string, requis) - Nom de l'organisation
- `email` (string, requis)
- `budget` (string, optionnel) - Budget indicatif
- `source` (string, optionnel)

**Réponse:**
```json
{
  "success": true,
  "message": "Demande de devis vidéo envoyée. Notre équipe production vous contactera sous 48h.",
  "data": {
    "contactId": 5
  }
}
```

---

#### 7. Contact Général
```http
POST /api/contact
```

**Body:**
```json
{
  "type": "technique",
  "firstname": "Sophie",
  "lastname": "Dubois",
  "email": "sophie@example.com",
  "message": "J'ai un problème avec mon abonnement...",
  "rgpd": true
}
```

**Validation:**

- `type` (enum, requis) - `partenariat`, `publicite`, `technique`
- `firstname` (string, requis)
- `lastname` (string, requis)
- `email` (string, requis)
- `message` (string, requis) - Min 10 caractères
- `rgpd` (boolean, requis) - Doit être `true`

**Mapping des types:**

- `partenariat` → `content`
- `publicite` → `display`
- `technique` → `event`

**Réponse:**
```json
{
  "success": true,
  "message": "Message envoyé avec succès. Nous vous répondrons sous 48h.",
  "data": {
    "contactId": 6
  }
}
```

---

## 🔐 ENDPOINTS ADMIN (BACK-OFFICE)

### 🔑 Authentification

#### Inscription
```http
POST /api/admin/register
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!",
  "name": "Admin Name"
}
```

**Validation:**

- **Email**: format valide
- **Password**: min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
- **Name**: min 2 caractères

**Réponse:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "EDITOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Connexion
```http
POST /api/admin/login
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

---

#### Profil utilisateur
```http
GET /api/admin/me
```

**Headers:** `Authorization: Bearer <token>`

---

### 📝 Articles Admin

#### Liste de tous les articles
```http
GET /api/admin/articles
```

**Headers:** `Authorization: Bearer <token>`

---

#### Détail d'un article par ID
```http
GET /api/admin/articles/:id
```

---

#### Créer un article
```http
POST /api/admin/articles
```

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Mon nouvel article",
  "content": [
    {
      "type": "text",
      "value": "Contenu de l'article..."
    },
    {
      "type": "heading",
      "value": "Titre de section"
    },
    {
      "type": "image",
      "url": "https://cloudinary.com/image.jpg",
      "caption": "Légende de l'image"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ],
  "excerpt": "Court extrait de l'article",
  "coverImage": "https://cloudinary.com/cover.jpg",
  "categoryId": 1,
  "status": "DRAFT",
  "featured": false,
  "metaTitle": "Titre SEO",
  "metaDescription": "Description SEO"
}
```

---

#### Modifier un article
```http
PUT /api/admin/articles/:id
```

---

#### Supprimer un article
```http
DELETE /api/admin/articles/:id
```

---

### 🗂️ Catégories Admin

#### Liste de toutes les catégories
```http
GET /api/admin/categories
```

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Actualités",
      "slug": "actualites",
      "description": "Les dernières nouvelles",
      "type": "MAGAZINE",
      "order": 1,
      "color": "#E74C3C",
      "_count": {
        "articles": 15
      }
    }
  ]
}
```

---

#### Détail d'une catégorie par ID
```http
GET /api/admin/categories/:id
```

---

#### Créer une catégorie
```http
POST /api/admin/categories
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Body:**
```json
{
  "name": "Nouvelle catégorie",
  "slug": "nouvelle-categorie",
  "description": "Description de la catégorie",
  "type": "MAGAZINE",
  "order": 1,
  "color": "#3498DB"
}
```

---

#### Modifier une catégorie
```http
PUT /api/admin/categories/:id
```

**Permissions:** SUPER_ADMIN uniquement

---

#### Supprimer une catégorie
```http
DELETE /api/admin/categories/:id
```

**Permissions:** SUPER_ADMIN uniquement

> **Note:** Impossible de supprimer une catégorie contenant des articles

---

### 🏷️ Tags Admin

#### Liste de tous les tags
```http
GET /api/admin/tags
```

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "message": "Tags récupérés avec succès",
  "data": [
    {
      "id": 1,
      "name": "#Voyage",
      "slug": "voyage",
      "_count": {
        "articles": 12
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Détail d'un tag par ID
```http
GET /api/admin/tags/:id
```

**Headers:** `Authorization: Bearer <token>`

---

#### Créer un tag
```http
POST /api/admin/tags
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Body:**
```json
{
  "name": "#TourismeAfrique",
  "slug": "tourisme-afrique"
}
```

**Validation:**

- `name` (string, requis) - Nom du tag (commence généralement par #)
- `slug` (string, requis) - Slug unique (lettres minuscules, chiffres, tirets uniquement)

**Réponse:**
```json
{
  "success": true,
  "message": "Tag créé avec succès",
  "data": {
    "id": 2,
    "name": "#TourismeAfrique",
    "slug": "tourisme-afrique",
    "_count": {
      "articles": 0
    }
  }
}
```

---

#### Modifier un tag
```http
PUT /api/admin/tags/:id
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Body:**
```json
{
  "name": "#NouveauNom",
  "slug": "nouveau-nom"
}
```

---

#### Supprimer un tag
```http
DELETE /api/admin/tags/:id
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Réponse:**
```json
{
  "success": true,
  "message": "Tag supprimé avec succès",
  "data": {
    "message": "Tag supprimé avec succès"
  }
}
```

> **Note:** Les relations avec les articles sont automatiquement supprimées

---

### ⚙️ Paramètres (Settings)

#### Récupérer les paramètres de taxonomie
```http
GET /api/admin/settings/taxonomy
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Réponse:**
```json
{
  "success": true,
  "message": "Paramètres récupérés avec succès",
  "data": {
    "maxTags": 5,
    "tagsEnabled": true
  }
}
```

---

#### Sauvegarder les paramètres de taxonomie
```http
PUT /api/admin/settings/taxonomy
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** SUPER_ADMIN uniquement

**Body:**
```json
{
  "maxTags": 10,
  "tagsEnabled": true
}
```

**Validation:**

- `maxTags` (number, optionnel) - Nombre max de tags (1-50)
- `tagsEnabled` (boolean, optionnel) - Tags activés ou non

**Réponse:**
```json
{
  "success": true,
  "message": "Paramètres sauvegardés avec succès",
  "data": {
    "maxTags": 10,
    "tagsEnabled": true
  }
}
```

---

### 🖼️ Médias (Upload & Bibliothèque)

#### Upload d'une image
```http
POST /api/admin/media/upload
```

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `image` (file, requis) - Fichier image (JPEG, PNG, GIF, WebP, max 5MB)
- `altText` (string, optionnel) - Texte alternatif

---

#### Liste des médias
```http
GET /api/admin/media
```

---

#### Supprimer un média
```http
DELETE /api/admin/media/:id
```

---

### 📊 Statistiques

#### Statistiques du dashboard
```http
GET /api/admin/stats/dashboard
```

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "data": {
    "articles": {
      "total": 23,
      "published": 20,
      "draft": 3
    },
    "categories": 14,
    "destinations": 6,
    "tags": 8,
    "users": 3,
    "media": 50,
    "totalViews": 15000,
    "newsletterSubscribers": 156
  }
}
```

---

## 🔒 Gestion des Rôles

### EDITOR (Rôle par défaut)

- ✅ Créer, modifier, supprimer ses propres articles
- ✅ Upload de médias
- ✅ Voir toutes les catégories et tags
- ❌ Créer/modifier/supprimer des catégories
- ❌ Créer/modifier/supprimer des tags
- ❌ Gérer les paramètres
- ❌ Gérer les utilisateurs

### SUPER_ADMIN

- ✅ Toutes les permissions EDITOR
- ✅ Créer, modifier, supprimer des catégories
- ✅ Créer, modifier, supprimer des tags
- ✅ Gérer les paramètres du site
- ✅ Gérer les utilisateurs
- ✅ Accès complet aux statistiques

---

## 🛡️ Codes d'Erreur HTTP

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Non autorisé (permissions insuffisantes) |
| `404` | Ressource non trouvée |
| `409` | Conflit (ex: email déjà utilisé, slug déjà pris) |
| `500` | Erreur serveur |

---

## 🚀 Rate Limiting

- **100 requêtes** par fenêtre de **15 minutes** par IP
- Configurable via les variables d'environnement `RATE_LIMIT_WINDOW_MS` et `RATE_LIMIT_MAX_REQUESTS`

---

## 📦 Format du Contenu des Articles

Le contenu des articles est stocké au format JSON sous forme d'un tableau d'objets :
```json
[
  {
    "type": "text",
    "value": "Texte de l'article..."
  },
  {
    "type": "heading",
    "value": "Titre de section"
  },
  {
    "type": "image",
    "url": "https://cloudinary.com/image.jpg",
    "caption": "Légende optionnelle"
  },
  {
    "type": "video",
    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    "type": "quote",
    "value": "Citation importante",
    "author": "Nom de l'auteur"
  },
  {
    "type": "code",
    "value": "console.log('Hello');",
    "language": "javascript"
  }
]
```

---

## 🎯 Récapitulatif des Formulaires de Contact

| Endpoint | Objectif | Service Type Mapping |
|----------|----------|---------------------|
| `/api/contacts/partners` | Partenariat général | `display`, `content`, `magazine`, `event` |
| `/api/contacts/annonceurs` | Kit média annonceurs | `publicite`→`display`, `partenariat`→`content`, `webtv`→`magazine`, `evenement`→`event` |
| `/api/contacts/editorial` | Couverture éditoriale | `presse`→`content`, `video`→`magazine`, `social`→`display`, `global`→`event` |
| `/api/contacts/partenariat-destination` | Partenariat destinations | `campaign`→`display`, `video`→`magazine`, `edito`→`content` |
| `/api/contacts/demande-devis` | Devis vidéo | Stocké dans `company` (BDD) |
| `/api/contact` | Contact général | `partenariat`→`content`, `publicite`→`display`, `technique`→`event` |

**Note:** Tous les contacts sont stockés dans la table `PartnerContact` avec différents `serviceType`.

---

## 💡 Exemples d'Utilisation

### Exemple 1: Workflow complet de gestion de tags
```javascript
// 1. Connexion
const loginResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@itourisme-nomade.com',
    password: 'Admin123!'
  })
});

const { data: { token } } = await loginResponse.json();

// 2. Récupérer les tags existants
const tagsResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/admin/tags', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data: tags } = await tagsResponse.json();
console.log('Tags existants:', tags);

// 3. Créer un nouveau tag
const createTagResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/admin/tags', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '#TourismeAfrique',
    slug: 'tourisme-afrique'
  })
});

const { data: newTag } = await createTagResponse.json();
console.log('Tag créé:', newTag);

// 4. Modifier un tag
const updateTagResponse = await fetch(`https://itourisme-nomade-api.onrender.com/api/admin/tags/${newTag.id}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '#AfriqueVoyage'
  })
});

const { data: updatedTag } = await updateTagResponse.json();
console.log('Tag modifié:', updatedTag);

// 5. Récupérer les paramètres de taxonomie
const settingsResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/admin/settings/taxonomy', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data: settings } = await settingsResponse.json();
console.log('Paramètres actuels:', settings);

// 6. Modifier les paramètres
const updateSettingsResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/admin/settings/taxonomy', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    maxTags: 10,
    tagsEnabled: true
  })
});

const { data: updatedSettings } = await updateSettingsResponse.json();
console.log('Paramètres sauvegardés:', updatedSettings);
```

---

### Exemple 2: Envoyer une demande de partenariat
```javascript
// Demande de partenariat destination
const partnershipResponse = await fetch('https://itourisme-nomade-api.onrender.com/api/contacts/partenariat-destination', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destinations: 'Sénégal, Maroc, Côte d\'Ivoire',
    collabType: 'campaign',
    officeName: 'Office du Tourisme Dakar',
    firstname: 'Aminata',
    lastname: 'Diop',
    email: 'aminata@tourisme-dakar.sn',
    objectives: 'Promouvoir nos destinations auprès des professionnels français du tourisme'
  })
});

const result = await partnershipResponse.json();
console.log(result);
// {
//   "success": true,
//   "message": "Demande de partenariat destination envoyée...",
//   "data": { "contactId": 4 }
// }
```

---

## 📞 Support & Contact

Pour toute question sur l'API :

- 📧 **Email**: dev@itourisme-nomade.com
- 📚 **Documentation complète**: https://itourisme-nomade-api.onrender.com/api
- 💬 **GitHub Issues**: https://github.com/valam21/itourisme-nomade-backend/issues

---

## 🆕 Changelog

### Version 1.7.0 (Mars 2026)

- ✅ Ajout gestion des Tags
- ✅ Ajout système de Settings/Paramètres
- ✅ Cache système pour Tags et Settings
- ✅ Endpoints Contact: Annonceurs, Éditorial, Partenariat Destination, Devis Vidéo, Contact Général

### Version 1.1.0 (Janvier 2025)

- ✅ Ajout des destinations
- ✅ Newsletter & abonnements magazine
- ✅ Contact partenaires
- ✅ Filtres avancés (vidéos, année)
- ✅ Couleurs dynamiques pour catégories

### Version 1.0.0 (Décembre 2024)

- 🎉 Version initiale
- ✅ Articles & catégories
- ✅ Authentification JWT
- ✅ Upload média (Cloudinary)
- ✅ Statistiques

---

**Dernière mise à jour:** 16 Mars 2026  
**Version API:** 1.7.0