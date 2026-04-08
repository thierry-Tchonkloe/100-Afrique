# 🚀 Guide d'Installation Rapide - iTourisme Nomade Backend

Ce guide vous permettra d'installer et de configurer le backend iTourisme Nomade en **moins de 10 minutes**.

---

## ⚡ Installation en 5 Étapes

### 1️⃣ Installation des Dépendances
```bash
npm install
```

**Dépendances principales installées :**

| Package | Description |
|---------|-------------|
| `express` | Framework web Node.js |
| `@prisma/client` | Client Prisma ORM |
| `bcrypt` | Hachage sécurisé des mots de passe |
| `jsonwebtoken` | Authentification JWT |
| `zod` | Validation TypeScript-first |
| `cloudinary` | Upload et gestion d'images |
| `cors` | Cross-Origin Resource Sharing |
| `helmet` | Sécurité des headers HTTP |
| `express-rate-limit` | Protection contre les attaques |
| `multer` | Upload de fichiers multipart |
| `winston` | Logging structuré |
| `dotenv` | Gestion des variables d'environnement |

**Dépendances de développement :**

| Package | Description |
|---------|-------------|
| `typescript` | Support TypeScript |
| `prisma` | CLI Prisma ORM |
| `ts-node-dev` | Hot reload pour développement |
| `@types/*` | Définitions de types TypeScript |

---

### 2️⃣ Configuration de l'Environnement
```bash
# Copier le fichier exemple
cp .env.example .env
```

**Éditer le fichier `.env` avec vos valeurs :**
```env
# =====================================
# ENVIRONNEMENT
# =====================================
NODE_ENV=development
PORT=5000

# =====================================
# 🗄️ BASE DE DONNÉES POSTGRESQL
# =====================================
DATABASE_URL="postgresql://postgres:password@localhost:5432/itourisme_nomade?schema=public"

# =====================================
# 🔐 JWT (JSON WEB TOKEN)
# =====================================
JWT_SECRET="GÉNÉRER_UNE_CLÉ_SÉCURISÉE_ICI_MIN_32_CARACTÈRES"
JWT_EXPIRES_IN="7d"

# =====================================
# ☁️ CLOUDINARY (Upload d'images)
# =====================================
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# =====================================
# 🌐 CORS (Cross-Origin)
# =====================================
# URLs autorisées (séparées par des virgules)
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# =====================================
# 🛡️ RATE LIMITING
# =====================================
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes en millisecondes
RATE_LIMIT_MAX_REQUESTS=100        # 100 requêtes max par fenêtre

# =====================================
# 📄 PAGINATION
# =====================================
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=50
```

---

### 📝 Configuration Détaillée

#### 💡 Générer JWT_SECRET
```bash
# Option 1 : Avec Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2 : Avec OpenSSL
openssl rand -hex 64

# Option 3 : En ligne
# https://generate-secret.vercel.app/64
```

**Résultat :** Une chaîne aléatoire de 128 caractères hexadécimaux.

---

#### ☁️ Obtenir vos Credentials Cloudinary

1. **Créer un compte** sur [cloudinary.com](https://cloudinary.com) (gratuit, 25 GB)
2. **Se connecter** au Dashboard
3. **Copier les credentials** :
   - **Cloud Name** : affiché en haut à gauche
   - **API Key** : dans "Account Details"
   - **API Secret** : cliquer sur "Reveal" pour l'afficher

![Cloudinary Dashboard](https://res.cloudinary.com/demo/image/upload/cloudinary_logo.png)

**Exemple de configuration :**
```env
CLOUDINARY_CLOUD_NAME="dp2xmvkq1"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
```

---

### 3️⃣ Configuration de PostgreSQL

#### Option A : PostgreSQL Local

##### macOS (avec Homebrew)
```bash
# Installer PostgreSQL
brew install postgresql@14

# Démarrer PostgreSQL
brew services start postgresql@14

# Créer la base de données
psql postgres
CREATE DATABASE itourisme_nomade;
\q
```

##### Ubuntu/Debian
```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql
CREATE DATABASE itourisme_nomade;
\q
```

##### Windows

1. **Télécharger** l'installeur depuis [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. **Installer** PostgreSQL (noter le mot de passe de l'utilisateur `postgres`)
3. **Ouvrir** pgAdmin ou psql
4. **Créer la base** :
```sql
CREATE DATABASE itourisme_nomade;
```

##### Modifier l'URL de Connexion
```env
# Format
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Exemple local
DATABASE_URL="postgresql://postgres:monmotdepasse@localhost:5432/itourisme_nomade?schema=public"
```

---

#### Option B : PostgreSQL avec Docker
```bash
# Démarrer un conteneur PostgreSQL
docker run --name itourisme-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=itourisme_nomade \
  -p 5432:5432 \
  -v itourisme-db:/var/lib/postgresql/data \
  -d postgres:14

# Vérifier que le conteneur tourne
docker ps

# Se connecter au conteneur
docker exec -it itourisme-postgres psql -U postgres -d itourisme_nomade
```

**Arrêter/Démarrer le conteneur :**
```bash
# Arrêter
docker stop itourisme-postgres

# Démarrer
docker start itourisme-postgres

# Supprimer (⚠️ perte de données)
docker rm -f itourisme-postgres
```

---

### 4️⃣ Initialisation de Prisma
```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les tables dans la base de données
npx prisma migrate dev

# 3. Peupler avec des données de test (RECOMMANDÉ)
npm run seed
```

---

#### ✅ Données Créées par le Seed

| Type | Quantité | Détails |
|------|----------|---------|
| **Utilisateurs** | 2 | Super Admin + Éditeur |
| **Catégories** | 6 | Actualités, Reportages Salons, Interviews, Destinations, Analyses, Magazine |
| **Destinations** | 6 | Sénégal, Côte d'Ivoire, Maroc, Kenya, Tanzanie, Cap-Vert |
| **Articles** | 23 | 3 Hero, 6 Actualités, 4 Vidéos, 3 Magazines, 4 Salons, 3 autres |
| **Newsletter** | 3 | Abonnés de test |

**Comptes créés :**

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@itourisme-nomade.com` | `Admin123!` | SUPER_ADMIN |
| `editor@itourisme-nomade.com` | `Admin123!` | EDITOR |

---

### 5️⃣ Démarrage du Serveur
```bash
# Mode développement (avec hot-reload)
npm run dev
```

**Console attendue :**
```
[INFO] 10:00:00 ts-node-dev ver. 2.0.0
[dotenv@17.3.1] injecting env (16) from .env
✅ Configuration validée avec succès
✅ [2024-03-06T10:00:00.000Z] SUCCESS: 🚀 Serveur démarré sur le port 5000
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 📡 Environnement: development
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 🌍 URL: http://localhost:5000
ℹ️  [2024-03-06T10:00:00.000Z] INFO: 📚 Documentation: http://localhost:5000/api
```

**✅ Le serveur tourne sur :** `http://localhost:5000`

---

## 🎯 Vérification de l'Installation

### Test 1 : Health Check
```bash
curl http://localhost:5000/api/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "API iTourisme Nomade fonctionne correctement",
  "timestamp": "2024-03-06T10:00:00.000Z"
}
```

---

### Test 2 : Connexion Admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@itourisme-nomade.com",
    "password": "Admin123!"
  }'
```

**Réponse attendue :**
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

**💡 Copier le token** pour les tests suivants.

---

### Test 3 : Récupérer les Articles
```bash
curl http://localhost:5000/api/mag/articles?featured=true&pageSize=3
```

**Réponse attendue :** 3 articles featured avec pagination.

---

### Test 4 : Upload d'une Image
```bash
# Remplacer <TOKEN> par le token reçu lors de la connexion
curl -X POST http://localhost:5000/api/admin/media/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "image=@/chemin/vers/votre/image.jpg" \
  -F "altText=Test image"
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Image uploadée avec succès",
  "data": {
    "id": 1,
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "itourisme-nomade/abc123",
    "filename": "image.jpg",
    "altText": "Test image",
    "size": 524288,
    "mimeType": "image/jpeg"
  }
}
```

---

### Test 5 : Destinations Featured
```bash
curl "http://localhost:5000/api/destinations/featured?limit=3"
```

**Réponse attendue :** 3 destinations featured.

---

## 📦 Commandes Utiles

### Développement
```bash
npm run dev                  # Démarrage avec hot-reload
npm run build                # Compilation TypeScript → dist/
npm start                    # Démarrage en production (nécessite build)
```

### Base de Données
```bash
npx prisma generate          # Générer le client Prisma
npx prisma migrate dev       # Créer/appliquer une migration
npx prisma studio            # Interface visuelle (http://localhost:5555)
npm run seed                 # Peupler la BDD avec données de test
npx prisma migrate reset     # ⚠️ RÉINITIALISER (supprime TOUTES les données)
npx prisma db push           # Synchroniser sans migration (dev uniquement)
```

### Scripts Personnalisés
```bash
npx ts-node scripts/update-colors.ts    # Mettre à jour les couleurs des catégories
```

---

## 🐛 Résolution de Problèmes

### ❌ Erreur : "DATABASE_URL is not defined"

**Cause :** Fichier `.env` manquant ou variable non définie.

**Solutions :**
```bash
# Vérifier que le fichier .env existe
ls -la .env

# Vérifier le contenu
cat .env | grep DATABASE_URL

# Recréer le fichier si nécessaire
cp .env.example .env
```

---

### ❌ Erreur : "Cannot connect to database"

**Causes possibles :**
1. PostgreSQL n'est pas démarré
2. Mauvais credentials dans `DATABASE_URL`
3. Port 5432 occupé ou bloqué

**Solutions :**
```bash
# Vérifier que PostgreSQL tourne
# macOS/Linux
pg_isready

# Voir l'état du service
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Vérifier le port
lsof -i :5432              # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Tester la connexion manuellement
psql postgresql://postgres:password@localhost:5432/itourisme_nomade
```

---

### ❌ Erreur : "Cloudinary credentials invalid"

**Solutions :**

1. **Vérifier les credentials** sur [cloudinary.com/console](https://cloudinary.com/console)
2. **S'assurer qu'il n'y a pas d'espaces** dans les valeurs
3. **Vérifier les guillemets** dans `.env` (ne pas en mettre)
```env
# ❌ INCORRECT
CLOUDINARY_CLOUD_NAME="dp2xmvkq1"

# ✅ CORRECT
CLOUDINARY_CLOUD_NAME=dp2xmvkq1
```

4. **Redémarrer le serveur** après modification du `.env`

---

### ❌ Erreur : "Port 5000 already in use"

**Solutions :**

#### Option 1 : Changer le port
```env
# Dans .env
PORT=3001
```

#### Option 2 : Tuer le processus
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Windows CMD
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### ❌ Erreur : "Prisma Client did not initialize yet"

**Solution :**
```bash
# Régénérer le client Prisma
npx prisma generate --force

# Redémarrer le serveur
npm run dev
```

---

### ❌ Erreur : "EPERM: operation not permitted" (Windows)

**Cause :** Processus Node.js encore actif.

**Solution :**
```bash
# Tuer tous les processus Node.js
taskkill /F /IM node.exe

# Supprimer le dossier node_modules/.prisma
rmdir /s /q node_modules\.prisma

# Régénérer
npx prisma generate

# Redémarrer
npm run dev
```

---

## 🔥 Mode Développement Avancé

### Avec Prisma Studio (Interface Graphique)
```bash
# Terminal 1 : Serveur backend
npm run dev

# Terminal 2 : Prisma Studio
npx prisma studio
```

Ouvrir **`http://localhost:5555`** pour voir et éditer la base de données visuellement.

![Prisma Studio](https://www.prisma.io/docs/static/83e2d5c44e04b8b993e6cbbc11ee5fe6/b23e6/prisma-studio.png)

---

### Avec Logs Détaillés

Dans `.env`, activer :
```env
NODE_ENV=development
```

Les logs incluront alors :
- 🐛 **DEBUG** - Requêtes SQL détaillées
- ℹ️ **INFO** - Informations générales
- ✅ **SUCCESS** - Opérations réussies
- ⚠️ **WARN** - Avertissements
- ❌ **ERROR** - Erreurs avec stack trace

---

### Watcher de Fichiers

`ts-node-dev` redémarre automatiquement le serveur à chaque modification de fichier `.ts`.

**Pour désactiver le redémarrage automatique :**
```bash
# Dans package.json, modifier le script dev
"dev": "ts-node-dev --no-notify --respawn --transpile-only src/app.ts"
```

---

## 📚 Prochaines Étapes

### 1. 📖 Lire la Documentation API

Consultez **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** pour :
- Liste complète des endpoints
- Exemples de requêtes
- Formats de réponse
- Codes d'erreur

---

### 2. 🧪 Tester avec Postman/Insomnia

**Importer la collection :**
```bash
# Récupérer la collection Postman (TODO)
curl http://localhost:5000/api/postman-collection > itourisme-nomade.postman_collection.json
```

**Tests recommandés :**
1. ✅ Connexion admin
2. ✅ Créer un article
3. ✅ Upload d'une image
4. ✅ Inscription newsletter
5. ✅ Récupérer les destinations

---

### 3. 🌐 Intégrer avec le Frontend

**Configuration du frontend Next.js :**
```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
```

**Variables d'environnement frontend :**
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 4. 🎨 Personnaliser le Backend

**Ajout d'un nouveau modèle :**

1. Modifier `prisma/schema.prisma`
2. Créer la migration : `npx prisma migrate dev --name add_my_model`
3. Générer le client : `npx prisma generate`
4. Créer service, contrôleur, routes

---

## 🎉 Installation Réussie !

Votre backend **iTourisme Nomade** est maintenant **opérationnel** ! 🚀

---

### 🔗 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| **API** | `http://localhost:5000/api` | Endpoint racine |
| **Health Check** | `http://localhost:5000/api/health` | Vérification du serveur |
| **Documentation** | `http://localhost:5000/api` | Liste des endpoints |
| **Prisma Studio** | `http://localhost:5555` | Interface BDD visuelle |

---

### 🔑 Identifiants de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@itourisme-nomade.com` | `Admin123!` | SUPER_ADMIN |
| `editor@itourisme-nomade.com` | `Admin123!` | EDITOR |

---

### 📊 Statistiques du Seed

Après le seed, votre base contient :

- 👤 **2 utilisateurs** (admin + editor)
- 📁 **6 catégories** avec couleurs
- 🌍 **6 destinations** (Afrique principalement)
- 📰 **23 articles** (dont 7 featured)
- 📧 **3 abonnés newsletter**

---

## 📞 Support & Aide

Si vous rencontrez des difficultés :

1. 📚 **Consultez** [README.md](./README.md) et [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. 🔍 **Recherchez** dans les [GitHub Issues](https://github.com/itourisme-nomade/backend/issues)
3. 💬 **Ouvrez** une nouvelle issue si nécessaire
4. 📧 **Contactez** dev@itourisme-nomade.com

---

## ✅ Checklist d'Installation

- [ ] Node.js >= 18.x installé
- [ ] PostgreSQL >= 14.x installé et démarré
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré
- [ ] JWT_SECRET généré
- [ ] Credentials Cloudinary ajoutés
- [ ] Base de données créée
- [ ] Migrations exécutées (`npx prisma migrate dev`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Seed exécuté (`npm run seed`)
- [ ] Serveur démarré (`npm run dev`)
- [ ] Health check réussi
- [ ] Connexion admin testée
- [ ] Upload d'image testé
- [ ] Frontend configuré (si applicable)

---

**Dernière mise à jour :** 6 mars 2026  
**Version :** 1.1.0  
**Status :** ✅ Installation Validée






<!-- # 🚀 Guide d'Installation Rapide - iTourisme Nomade Backend

## ⚡ Installation en 5 étapes

### 1️⃣ Installation des dépendances

```bash
npm install
```

**Dépendances principales installées :**
- express - Framework web
- @prisma/client - Client Prisma ORM
- bcrypt - Hachage des mots de passe
- jsonwebtoken - Authentification JWT
- zod - Validation des données
- cloudinary - Upload d'images
- cors, helmet - Sécurité
- slugify - Génération de slugs
- node-cache - Cache en mémoire
- multer - Upload de fichiers

**Dépendances de développement :**
- typescript - Support TypeScript
- prisma - CLI Prisma
- ts-node-dev - Hot reload
- @types/* - Types TypeScript

---

### 2️⃣ Configuration de l'environnement

```bash
# Copier le fichier exemple
cp .env.example .env
```

**Éditer le fichier .env avec vos valeurs :**

```env
# 🗄️ BASE DE DONNÉES
DATABASE_URL="postgresql://postgres:password@localhost:5432/itourisme_nomade?schema=public"

# 🔐 JWT
JWT_SECRET="GÉNÉRER_UNE_CLÉ_SÉCURISÉE_ICI"
JWT_EXPIRES_IN="7d"

# ☁️ CLOUDINARY
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# 🌐 CORS
CORS_ORIGIN="http://localhost:3000"
```

**💡 Astuce pour générer JWT_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**💡 Obtenir vos credentials Cloudinary :**
1. Créer un compte sur https://cloudinary.com (gratuit)
2. Aller dans Dashboard → Settings
3. Copier Cloud Name, API Key, API Secret

---

### 3️⃣ Configuration de PostgreSQL

**Option A : PostgreSQL local**

```bash
# Installer PostgreSQL
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/

# Créer la base de données
psql postgres
CREATE DATABASE itourisme_nomade;
\q
```

**Option B : PostgreSQL avec Docker**

```bash
docker run --name itourisme-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=itourisme_nomade \
  -p 5432:5432 \
  -d postgres:14
```

---

### 4️⃣ Initialisation de Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables dans la base de données
npm run prisma:migrate

# Peupler avec des données de test (optionnel mais recommandé)
npm run prisma:seed
```

**✅ Données créées par le seed :**
- Super Admin : `admin@itourisme-nomade.com` / `Admin123!`
- 4 catégories Magazine : Actualités, Guides, Culture, Aventure
- 5 destinations : Paris, Tokyo, New York, Bali, Marrakech
- 1 article exemple publié

---

### 5️⃣ Démarrage du serveur

```bash
# Mode développement (avec hot-reload)
npm run dev
```

**✅ Le serveur démarre sur :** `http://localhost:5000`

**Test rapide :**
```bash
curl http://localhost:5000/api/health
```

---

## 🎯 Vérification de l'installation

### Test 1 : Connexion admin

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@itourisme-nomade.com",
    "password": "Admin123!"
  }'
```

**Réponse attendue :** Vous recevez un `token` JWT

### Test 2 : Récupérer les articles

```bash
curl http://localhost:5000/api/mag/articles
```

**Réponse attendue :** Liste des articles (dont l'article de bienvenue)

### Test 3 : Upload d'une image

```bash
# Remplacer <TOKEN> par le token reçu lors de la connexion
curl -X POST http://localhost:5000/api/admin/media/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "image=@/chemin/vers/votre/image.jpg" \
  -F "altText=Test image"
```

---

## 📦 Commandes Utiles

```bash
# Développement
npm run dev                  # Démarrage avec hot-reload

# Production
npm run build               # Compilation TypeScript
npm start                   # Démarrage en production

# Base de données
npm run prisma:generate     # Générer le client Prisma
npm run prisma:migrate      # Créer/appliquer les migrations
npm run prisma:studio       # Interface visuelle Prisma
npm run prisma:seed         # Peupler la BDD

# Réinitialiser complètement la BDD (⚠️ DANGER)
npx prisma migrate reset    # Supprime TOUTES les données
```

---

## 🐛 Résolution de Problèmes

### ❌ Erreur : "DATABASE_URL is not defined"

**Solution :**
```bash
# Vérifier que le fichier .env existe
ls -la .env

# Vérifier que DATABASE_URL est défini
cat .env | grep DATABASE_URL
```

### ❌ Erreur : "Cannot connect to database"

**Solutions :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans DATABASE_URL
3. Vérifier que le port 5432 n'est pas occupé

```bash
# Vérifier que PostgreSQL tourne
# macOS/Linux
pg_isready

# Vérifier le port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows
```

### ❌ Erreur : "Cloudinary credentials invalid"

**Solution :**
1. Vérifier les credentials sur cloudinary.com/console
2. S'assurer qu'il n'y a pas d'espaces dans les valeurs
3. Redémarrer le serveur après modification du .env

### ❌ Erreur : "Port 5000 already in use"

**Solution :**
```bash
# Changer le port dans .env
PORT=3001

# Ou tuer le processus sur le port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🔥 Mode Développement Avancé

### Avec Prisma Studio (interface visuelle)

```bash
# Terminal 1 : Serveur
npm run dev

# Terminal 2 : Prisma Studio
npm run prisma:studio
```

Ouvrir `http://localhost:5555` pour voir et éditer la BDD visuellement.

### Avec logs détaillés

Dans `.env`, activer :
```env
NODE_ENV=development
```

---

## 📚 Prochaines Étapes

1. ✅ **Lire la documentation API** : `API_DOCUMENTATION.md`
2. ✅ **Tester avec Postman** : Importer la collection (voir doc)
3. ✅ **Intégrer avec le frontend** : Utiliser les endpoints publics
4. ✅ **Personnaliser** : Adapter les modèles à vos besoins

---

## 🎉 Installation Réussie !

Votre backend iTourisme Nomade est prêt à l'emploi !

**URLs importantes :**
- API : `http://localhost:5000/api`
- Health Check : `http://localhost:5000/api/health`
- Prisma Studio : `http://localhost:5555`

**Identifiants de test :**
- Email : `admin@itourisme-nomade.com`
- Password : `Admin123!`

---

**📞 Support :** Consultez README.md ou API_DOCUMENTATION.md pour plus d'informations. -->