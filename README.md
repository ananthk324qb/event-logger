# Event Logger (Node.js + Fastify)

Demo project for learning Fastify, background jobs, and event logging.

## What This Project Does

- Exposes order APIs (`create`, `get`, `ship`, `cancel`) with JWT-protected routes.
- Writes order data to PostgreSQL.
- Publishes audit events to a BullMQ queue (Redis).
- A separate worker consumes queue jobs and stores events in MongoDB.

This gives a simple event-driven flow where business actions are persisted in Postgres and audit trails are persisted asynchronously in Mongo.

## Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL (`pg`)
- Redis + BullMQ
- MongoDB
- JWT auth (`@fastify/jwt`)

## Project Structure

- `src/app/server.ts` - Fastify app bootstrap, plugin registration, route registration.
- `src/app/plugins/auth.ts` - JWT plugin and `authenticate` pre-handler.
- `src/orders/` - order routes, service, and repository.
- `src/event-engine/` - queue producer and event types.
- `src/workers/event.worker.ts` - queue consumer that stores events in Mongo.
- `src/events/events.route.ts` - endpoint to read events.
- `src/infra/` - DB/queue connection setup.

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- PostgreSQL running locally
- Redis running locally
- MongoDB running locally

## Environment Variables

Configured through `.env`:

- `PORT`
- `JWT_SECRET`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `MONGO_URL`
- `REDIS_HOST`
- `REDIS_PORT`

## Install

```bash
npm install
```

## Run

Start API server:

```bash
npm run api
```

Start event worker (in a separate terminal):

```bash
npm run event-engine
```

## Database Setup

Create `orders` table in PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL,
  updated_at TIMESTAMP NULL
);
```

Create MongoDB database/collection:

- Database: `auditDB`
- Collection: `events`

The worker creates documents on insert, so no manual schema setup is required.

## API Quickstart

### 1) Get JWT token

`POST /login`

Example:

```bash
curl -X POST http://localhost:3000/login
```

Response:

```json
{ "token": "<jwt>" }
```

### 2) Create order

`POST /order` (auth required)

```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 199.99}'
```

### 3) Fetch order

`GET /order/:id` (auth required)

### 4) Ship order

`PATCH /order/:id/ship` (auth required)

### 5) Cancel order

`PATCH /order/:id/cancel` (auth required)

### 6) View events for entity

`GET /events?type=ORDER&id=<orderId>` (auth required)

## Current Limitations (Learning Demo)

- Authentication is mocked (`/login` returns a hard-coded user).
- Request validation is minimal (no schema validation for params/body/query).
- Error handling uses generic errors in several places.
- Event write and order write are not transactionally coupled.
- No automated tests yet.

## Suggested Improvements

1. Add Fastify schemas (JSON schema or Zod) for all routes to validate inputs.
2. Replace `any` usage (`req`, `user`, `authenticate`) with strong TypeScript types.
3. Use explicit HTTP errors (`@fastify/sensible` or custom `ErrorTemplate`) for consistent status codes.
4. Add health/readiness endpoints and graceful shutdown for API + worker.
5. Improve worker reliability:
   - Add dead-letter strategy and monitoring.
   - Decide whether to keep completed jobs for debugging in non-prod.
6. Add role/permission checks for ship/cancel actions (not just JWT presence).
7. Add idempotency key support for order creation.
8. Add tests:
   - Unit tests for order service.
   - Integration tests for routes.
   - Worker test for event persistence.
9. Add containerized local setup (`docker-compose`) for Postgres/Redis/Mongo.
10. Add API docs generation (Fastify Swagger) for easier exploration.

## Notes

- Postman collection is included: `Event logger.postman_collection.json`.
- Run API and worker together to see events flowing into MongoDB.
