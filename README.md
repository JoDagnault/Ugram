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
- Un fichier `.env` à la racine du projet


## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_PORT=5432
DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database?schema=public
```

Les vraies valeurs à utiliser et mettre dans le fichier `.env` sont à l'intérieur du document dans le lien suivant : https://docs.google.com/document/d/1b3VBW1q2rY5xbbitgMbQq0nhOOXRXNK4Jxo-QLy0vk0/edit?usp=sharing


# 3. Exécution du livrable 1

## Démarrer l'application
Depuis la racine du projet :

```bash
./up.sh
```
ou manuellement :
```bash
docker compose -f docker-compose.yml up -d --build
```

## Arrêter l'application
```bash
./down.sh
```
ou manuellement :
```bash
docker compose -f docker-compose.yml down
```

## Réinitialiser complètement (Database + uploads)
```bash
./down.sh -v
```

## Accès aux services

- Backend : http://localhost:3000
- Frontend : http://localhost:5173

## Comportement du docker-compose
- Applique automatiquement les migrations Prisma
- Exécute le seed
- Démarre le backend après la Database
- Persiste les données PostgreSQL dans un volume Docker (`postgres_data`)
- Persiste les images uploadées dans un volume Docker (`uploads_data`)
