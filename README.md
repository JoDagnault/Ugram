# ugram-h2026-team-01

# 1. Technologies utilisées

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

---

## Qualité et analyse du code

Afin d’assurer une qualité de code constante, les outils suivants sont utilisés :

- **Linting** : ESLint ;
- **Formatage** : Prettier ;
- **Hooks Git (pré-commit)** :
    - Husky ;
    - lint-staged.
- **Analyse de couverture de code** : Codecov.

---

## Intégration et déploiement continus (CI/CD)

- **Outil de CI/CD** : GitHub Actions.

---

## Déploiement

- **Plateforme de déploiement** : AWS.

---

## Monitoring et observabilité

- **Outil de monitoring et de suivi des erreurs** : Sentry.

---

## Infrastructure et outils complémentaires

- **Conteneurisation** : Docker ;
- **Gestionnaire de paquets** : pnpm.

---

# 2. Exécution

## Prérequis 
- Docker

## Lancer l'application
Depuis la racine du projet :
```bash
docker compose up --build
```

## Accès aux services
- Backend : http://localhost:3000
- Frontend : http://localhost:5173