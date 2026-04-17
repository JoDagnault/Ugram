# ugram-h2026-team-01 - Livrable 3

##  Application déployée
Frontend : **https://d17rheqqdzq8va.cloudfront.net**  
Backend : **https://d3lo2207kh86xk.cloudfront.net**

## Fonctionnalités avancées implémentées
### (5) L'usager doit pouvoir rechercher par mot clé ou description avec autocomplétion
Dans la page "Search", l'autocomplétion proposera des résultats de hashtags ou de descriptions contenant les 
caractères déjà entrés.

### (5) L'usager doit pouvoir consulter les mots-clés les plus populaires
Une section "Trending" apparaît sur la page d'accueil, à côté du fil d'actualité.  Elle liste les 10 hashtags les plus populaires.
L'usager peut cliquer sur un des hashtags de la liste pour filtrer le fil d'actualité et voir uniquement les posts avec ce hashtag.

### (5) L'usager doit pouvoir appliquer des filtres sur ses photos lors du téléversement
Lors de la création d'un post, l'usager peut choisir d'appliquer un filtre sur sa photo.

## Stratégie de monitoring

**Frontend — Sentry**  
Sentry est intégré au frontend pour capturer les erreurs JavaScript en temps réel et tracer les performances des pages.

**Infrastructure — AWS CloudWatch**  
Les métriques par défaut d'Elastic Beanstalk (EC2) et RDS sont collectées automatiquement : utilisation CPU, connexions à la base de données, espace disque libre et mémoire disponible. Des alarmes simples sont configurées sur le CPU et les `StatusCheckFailed` pour alerter en cas de problème.

## Preuve du logging, du monitoring et des métriques de performance au sein de l'application  à l'intérieur de ce document: 
https://docs.google.com/document/d/1b3VBW1q2rY5xbbitgMbQq0nhOOXRXNK4Jxo-QLy0vk0/edit?usp=sharing



# Pour travailler en local ou sur Docker

## Prérequis
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

# Exécution

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

- Backend : http://localhost:3000
- Frontend : http://localhost:5173


## Comportement du docker-compose
- Applique automatiquement les migrations Prisma
- Exécute le seed
- Démarre le backend après la base de données, les migrations et le seed
- Persiste les données PostgreSQL dans un volume Docker (`postgres_data`)
- Persiste les images uploadées dans un volume Docker (`uploads_data`)
