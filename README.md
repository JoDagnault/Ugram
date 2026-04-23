# UGram

Instagram-like social media app built for the GLO-3112 Web Development course.

## Tech Stack

**Frontend** — React 19, TypeScript, Tailwind CSS, Vite  
**Backend** — Node.js, Express 5, TypeScript, Prisma, PostgreSQL  
**Storage** — AWS S3  
**Auth** — JWT, Google OAuth  
**Monitoring** — Sentry, AWS CloudWatch

## Features

- Create and browse posts with image upload and filters
- Search by keyword or hashtag with autocomplete
- Trending hashtags on the home feed
- User profiles and notifications
- Google OAuth login
- REST API with Swagger documentation

## Running Locally

**Prerequisites:** Docker, Node.js 20+, pnpm

1. Create `backend/.env` and `frontend/.env` from the templates below.
2. From the project root:

```bash
./up.sh
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

```bash
./down.sh        # stop
./down.sh -v     # stop and wipe data
```

## Environment Variables

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
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MAX_IMAGE_SIZE_BYTES=10485760
```
