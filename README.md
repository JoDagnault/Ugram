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

## Développement

Depuis la racine du projet :

- démarrer l'environnement :

```bash
./up.sh
# ou manuellement :
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

- arrêter l'environnement :

```bash
./down.sh
# ou manuellement :
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Comportement :

- utilise une base de données éphémère (`tmpfs`)
- applique automatiquement les migrations Prisma (`migrate`)
- exécute automatiquement le seed (`seed`)
- démarre le backend après le succès de `migrate` et `seed`

## Accès aux services

- Backend : http://localhost:3000
- Frontend : http://localhost:5173

## Vraies valeurs du .env
Elles sont à l'intérieur du document dans le lien suivant : https://docs.google.com/document/d/1b3VBW1q2rY5xbbitgMbQq0nhOOXRXNK4Jxo-QLy0vk0/edit?usp=sharing