# Backend UGram

## Prérequis

- Docker

## Variables d'environnement

Créer et utiliser le fichier `.env` à la racine du dépôt :

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_PORT=5432
DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database?schema=public
```

## Exécution en développement

Depuis la racine du dépôt :

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

- La base PostgreSQL est éphémère (`tmpfs`).
- `migrate` s'exécute automatiquement : `pnpm prisma:migrate:deploy`.
- `seed` s'exécute automatiquement : `pnpm prisma:seed:deploy`.
- Le backend démarre seulement après le succès de `migrate` et `seed`.

## Créer une migration Prisma après un changement de schéma

Depuis la racine du dépôt, après une modification de `backend/prisma/schema.prisma` :

```bash
./new-migration.sh <nom_migration>
```

La migration est créée dans `backend/prisma/migrations` et peut ensuite être commitée avec le changement de schéma.
