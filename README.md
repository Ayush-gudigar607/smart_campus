# CampusConnect

CampusConnect is a smart campus service-request platform that helps students report issues, staff manage their queues, and administrators monitor service delivery. It includes a cross-platform Expo application and a secure REST API backed by PostgreSQL.

## Highlights

- Student registration, authentication, and profile management
- Service requests with priority, assignment, SLA due dates, status history, and cancellation
- Role-based workflows for students, staff, and administrators
- Department and service catalog management
- Staff queue management, reassignment, overdue detection, and escalation support
- Notifications, dashboard statistics, and performance reporting
- Real-time foundations with Socket.IO and email delivery support through SMTP/Mailpit
- Docker Compose environment for PostgreSQL, the API, and local email testing

## Technology

| Area | Stack |
| --- | --- |
| Mobile client | Expo SDK 54, React Native, Expo Router |
| API | Node.js, Express 5, Socket.IO |
| Database | PostgreSQL 16, Drizzle ORM |
| Validation & security | Zod, JWT, bcrypt, Helmet, CORS |
| Local infrastructure | Docker Compose, Mailpit |
| Testing | Node.js test runner |

## Project structure

```text
smart_campus/
├── frontend/                 # Expo / React Native application
├── backend/                  # Express API, Drizzle schema, migrations, and tests
├── postman/                  # Importable API collection
├── docker-compose.yml        # PostgreSQL, API, and Mailpit services
└── LICENSE
```

## Quick start with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+ (needed for the Expo app and optional local development)

### 1. Configure the API

Copy the backend environment template and set a strong JWT secret before running the stack.

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` and replace `JWT_SECRET` with a random value of at least 32 characters. Do not commit this file.

### 2. Start services

```powershell
docker compose up --build
```

This starts PostgreSQL on port `5433`, the API on port `5000`, and Mailpit on port `8025`. Database migrations run automatically when the API container starts.

### 3. Seed demo data

In a second terminal, run:

```powershell
docker compose exec backend npm run db:seed
```

The seed includes departments, services, sample users, and dashboard data. Change the default seed credentials before using any environment beyond local development.

### 4. Run the mobile app

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run start
```

For a physical device, set `EXPO_PUBLIC_API_URL` in `frontend/.env` to your computer's LAN IPv4 address, for example `http://192.168.1.20:5000`. Android emulators can use `http://10.0.2.2:5000`.

Use `npm run android`, `npm run ios`, or `npm run web` to open a platform directly. If a phone cannot connect over the local network, use `npm run start:tunnel`.

## Local API development

If you prefer to run the API outside Docker, first start a PostgreSQL instance and update `DATABASE_URL` in `backend/.env`, then run:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The health endpoint is available at [http://localhost:5000/health](http://localhost:5000/health).

## Useful commands

| Command | Description |
| --- | --- |
| `cd backend; npm test` | Run API tests |
| `cd backend; npm run db:generate` | Generate a Drizzle migration after schema changes |
| `cd backend; npm run db:migrate` | Apply pending migrations |
| `cd backend; npm run db:studio` | Open Drizzle Studio |
| `docker compose logs -f backend` | Follow API container logs |
| `docker compose down` | Stop containers while preserving database data |

## API and testing resources

- API base URL: `http://localhost:5000/api`
- Health check: `GET /health`
- Postman collection: [`postman/Campus-Service-API.postman_collection.json`](postman/Campus-Service-API.postman_collection.json)
- Backend documentation: [`backend/readme.md`](backend/readme.md)
- Frontend documentation: [`frontend/readme.md`](frontend/readme.md)

The API uses JWT authentication. Successful login and registration responses provide a token and set an httpOnly cookie; protected endpoints also accept `Authorization: Bearer <token>`.

## Environment variables

Use the provided templates as the source of truth:

- [`backend/.env.example`](backend/.env.example) — database connection, JWT, CORS, SMTP, jobs, and optional AI settings
- [`frontend/.env.example`](frontend/.env.example) — API URL used by the Expo client

Never commit `.env` files, production secrets, or real user data.

## License

Distributed under the [MIT License](LICENSE).
