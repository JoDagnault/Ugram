# Backend UGram

## Prérequis

- Docker

## Variables d'environnement

Créer et utiliser le fichier `backend/.env` :

```env
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

Le frontend utilise son propre fichier `frontend/.env` pour les variables `VITE_*`.

## Exécution locale

Depuis la racine du dépôt :

```bash
./up.sh
# ou manuellement :
docker compose --env-file backend/.env -f docker-compose.yml up -d --build
```

```bash
./down.sh
# ou manuellement :
docker compose --env-file backend/.env -f docker-compose.yml down
```

Comportement :

- `migrate` s'exécute automatiquement : `pnpm prisma:migrate:deploy`.
- `seed` s'exécute automatiquement : `pnpm prisma:seed:deploy`.
- Le backend démarre seulement après le succès de `migrate` et `seed`.
- Les données PostgreSQL sont persistées dans le volume Docker `postgres_data`.
- Les images uploadées sont persistées dans le volume Docker `uploads_data`.
- pour repartir de zéro (supprime DB + images) : `./down.sh -v`
- commande manuelle équivalente : `docker compose --env-file backend/.env -f docker-compose.yml down -v`

## Documentation Swagger

Une fois le backend démarré, la documentation Swagger est accessible à `http://localhost:3000/api-docs`.

## Créer une migration Prisma après un changement de schéma

Depuis la racine du dépôt, après une modification de `backend/prisma/schema.prisma` :

```bash
./new-migration.sh <nom_migration>
```

La migration est créée dans `backend/prisma/migrations` et peut ensuite être commitée avec le changement de schéma.
