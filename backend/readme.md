# Campus Service Request Management API

## Setup

```bash
cd backend
copy .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Set a real database URL and a long, random `JWT_SECRET` in `.env` before starting. The seed creates the five starter departments and an administrator; change the seed password immediately if using the default.

## Run with Docker Compose

From the repository root, create the backend environment file and set a real JWT secret:

```powershell
Copy-Item backend/.env.example backend/.env
# Edit backend/.env and replace JWT_SECRET before continuing.
docker compose up --build
```

Compose starts PostgreSQL and the API at `http://localhost:5000`, runs pending migrations automatically, and preserves database data in the `postgres_data` Docker volume. The API connects to the Compose database using the hostname `db`; do not change it to `localhost` in the Compose configuration.

Run the initial seed once the services are up:

```powershell
docker compose exec backend npm run db:seed
```

Useful lifecycle commands:

```powershell
docker compose down                 # Stop containers; keep database data
docker compose down -v              # Stop containers and delete database data
docker compose logs -f backend      # Follow API logs
```

To generate a later schema migration and apply it through Compose:

```powershell
docker compose exec backend npm run db:generate
docker compose exec backend npm run db:migrate
```

## Statistics API

Authenticated administrators and staff can use `/api/stats/overview`, `/by-service`,
`/trend`, `/staff-performance`, and `/dashboard`; `/by-department` is administrator
only. Staff statistics are always restricted to the staff member's department (or own
row for staff performance), regardless of a supplied `departmentId`. Dashboard replies
include `X-Cache: MISS` on the first request and `X-Cache: HIT` for an equivalent request
within 30 seconds.

The statistics-index migration is already included. Apply it in Docker Compose:

```powershell
docker compose exec backend npm run db:migrate
```

For a future schema change, generate then apply its migration with
`docker compose exec backend npm run db:generate` followed by
`docker compose exec backend npm run db:migrate`.

Statistics checks:

- As admin, compare `/api/stats/overview` total with the corresponding filtered request list total; call `/api/stats/dashboard` twice and verify `MISS`, then `HIT`.
- As staff, pass another department ID to overview and verify only the staff department is counted. As a student, every stats endpoint returns 403.
- Confirm `/by-department` includes an unused department, `/by-department` as staff returns 403, and `trend?interval=week` includes empty buckets. A range producing more than 366 buckets and an invalid date both return 400.
- Choose two completed requests that took 2 and 4 hours: their average resolution time must be 3.0 hours. An empty date range returns `avgResolutionHours: null`.

## Authentication endpoints

An importable request collection with automated status and response checks is available at `postman/Campus-Service-API.postman_collection.json`. Import it into Postman, ensure the API and seeded database are running, then run the requests in numerical order.

All successful responses use `{ "success": true, "data": ... }`. Login and registration return a token and set an httpOnly `token` cookie. Use either that cookie or `Authorization: Bearer <token>` on protected routes.

```bash
# Register a student (department is one of CSE, AIML, AIDS, CSBS, CSDS, ECE, EEE, MECH, AUTOMOBILE, AERONAUTICAL, or MARINE)
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"studentName":"Asha Patel","usn":"CS2026001","department":"CSE","currentYear":2,"email":"asha@example.com","mobileNumber":"9876543210","password":"Campus123","confirmPassword":"Campus123"}'

# Log in
curl -i -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"emailOrRollNo":"CS2026001","password":"Campus123"}'

# Current user (replace TOKEN)
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer TOKEN"

# Change password
curl -X POST http://localhost:5000/api/auth/change-password -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"currentPassword":"Campus123","newPassword":"Campus456"}'

# Logout
curl -X POST http://localhost:5000/api/auth/logout -H "Authorization: Bearer TOKEN"

# Admin: create staff/admin (replace ADMIN_TOKEN)
curl -X POST http://localhost:5000/api/admin/users -H "Authorization: Bearer ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name":"CSE Staff","email":"cse.staff@example.com","password":"Staff1234","role":"staff","department":"CSE"}'
```

## Manual test checklist

- Register a student, log in, then call `/me` using its bearer token and cookie.
- Try a repeated email and repeated roll number; each must return 409.
- Try an unknown email and a bad password; both must return the same 401 message.
- Verify weak passwords, missing fields, and invalid email return 400.
- Set a user's `is_active` to false in the database; login and `/me` must return 403.
- Change password, confirm the old password no longer works, and log in with the new one.
- Use a student token on `/api/admin/users` (403), then an admin token to create staff; use a nonexistent department (400).
- Make more than 10 login/register attempts in 15 minutes from one IP and verify a 429 response.
- As an admin, assign a pending request, then reassign it; verify the request history records the staff names and `reassignCount` increments.
- Attempt to reassign to the same staff member and to a completed request; both return 409. Attempt a staff member from a different department without moving the department; it returns 400.
- Move a request to another department with a staff member from that department; verify the assignment and history note.
- As staff, open `/api/staff/queue?sort=dueAt`; verify only that staff member’s requests appear, ordering works, and a past due date has `isOverdue: true`.
- As a student, verify `/api/staff/queue` returns 403, then compare `/api/requests/mine/summary` counts to the filtered/unfiltered request list.
- Verify `/api/requests/mine/summary` returns the summary response rather than a request-code validation error.

## Login request flow

`POST /api/auth/login` first passes the rate limiter and Zod validation. The controller only forwards the validated body to the service. The service loads the user with Drizzle, compares the bcrypt hash, checks the active flag, and creates a JWT containing only `id` and `role`. The controller then puts that JWT in an httpOnly cookie and returns it in the standard success response. Any thrown `AppError` reaches the central error handler, which formats a safe error response.
