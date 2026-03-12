# Livrable 1
# ugram-h2026-team-01

# 1. Architecture du projet (Livrable 0)

## Frontend

- **Framework** : React
- **Langage** : TypeScript
- **Mise en forme** : Tailwind CSS
- **Outil de build et de bundling** : Vite

## Backend

- **Environnement d’exécution** : Node.js
- **Langage** : TypeScript
- **Framework** : Express (API REST)
- **ORM** : Prisma
- **Système de gestion de base de données** : PostgreSQL


## Qualité et analyse du code

Afin d’assurer une qualité de code constante, les outils suivants sont utilisés :

- **Linting** : ESLint ;
- **Formatage** : Prettier ;
- **Hooks Git (pré-commit)** :
    - Husky ;
    - lint-staged.
- **Analyse de couverture de code** : Codecov.


## Intégration et déploiement continus (CI/CD)

- **Outil de CI/CD** : GitHub Actions.


## Déploiement

- **Plateforme de déploiement** : AWS.


## Monitoring et observabilité

- **Outil de monitoring et de suivi des erreurs** : Sentry.


## Infrastructure et outils complémentaires

- **Conteneurisation** : Docker ;
- **Gestionnaire de paquets** : pnpm.

---

# 2. Prérequis

- Docker
- Un fichier `backend/.env`
- Un fichier `frontend/.env`


## Variables d'environnement

Créer et utiliser les fichiers suivants :

```env
# backend/.env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_PORT=5432
DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database?schema=public
PORT=3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
MAX_IMAGE_SIZE_BYTES=10485760
```

```env
# frontend/.env
VITE_API_URL=http://localhost:3000
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAX_IMAGE_SIZE_BYTES=10485760
```

Les vraies valeurs à utiliser sont dans le document suivant : https://docs.google.com/document/d/1b3VBW1q2rY5xbbitgMbQq0nhOOXRXNK4Jxo-QLy0vk0/edit?usp=sharing


# 3. Exécution du livrable 1

## Démarrer l'application
Depuis la racine du projet :

```bash
./up.sh
```
ou manuellement :
```bash
docker compose --env-file backend/.env -f docker-compose.yml up -d --build
```

## Arrêter l'application
```bash
./down.sh
```
ou manuellement :
```bash
docker compose --env-file backend/.env -f docker-compose.yml down
```

## Réinitialiser complètement (Database + uploads)
```bash
./down.sh -v
```
ou manuellement :
```bash
docker compose --env-file backend/.env -f docker-compose.yml down -v
```

## Accès aux services

### Localement
- Backend : http://localhost:3000
- Frontend : http://localhost:5173

### aws
- Backend: https://d3lo2207kh86xk.cloudfront.net
- Frontend: https://d17rheqqdzq8va.cloudfront.net

## Comportement du docker-compose
- Applique automatiquement les migrations Prisma
- Exécute le seed
- Démarre le backend après la base de données, les migrations et le seed
- Persiste les données PostgreSQL dans un volume Docker (`postgres_data`)
- Persiste les images uploadées dans un volume Docker (`uploads_data`)
