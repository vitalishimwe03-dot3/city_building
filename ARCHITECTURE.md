# Architecture Overview — City Building (Modernized)

This document describes a proposed modular architecture for the project to improve maintainability, scalability, and developer experience.

High level goals
- Modular services: separate concerns (web, auth, db, email, jobs)
- Clear folder layout with single responsibility for each module
- Reusable UI components and a small design system
- Testable code with unit/integration tests and CI
- Secure defaults: validate env, sanitize input, rate-limiting, CSP headers

Suggested Technology Choices
- Node.js 18+ with Express (or consider NestJS for larger apps)
- EJS for simple server-rendered pages; consider migrating select views to React for complex interactions
- SQLite for local development; Postgres for production
- `knex` or `sequelize` as DB-layer (or keep simple raw queries with a repository layer)
- `bcrypt` for password hashing, `helmet` and `express-rate-limit` for security
- `jest` + `supertest` for tests
- `eslint` + `prettier` for code quality

Proposed Folder Structure

- src/
  - server.js                # app bootstrap
  - config/                  # configuration & env validation
    - index.js
    - schema.js
  - modules/                 # all domain modules (auth, users, admin, courses)
    - auth/
      - auth.controller.js
      - auth.service.js
      - auth.routes.js
      - auth.test.js
    - users/
    - admin/
  - db/
    - index.js               # connection and query helpers
    - migrations/
    - seeds/
  - middleware/
    - errorHandler.js
    - validateEnv.js
    - rateLimiter.js
  - views/                   # ejs templates (migrate to components/ where possible)
  - public/
    - css/
    - js/
    - images/

Why this helps
- Teams can work on modules independently.
- Tests live next to modules for easier maintenance.
- Clear separation of config, infra, domain logic, and presentation.

Migration plan (high-level)
1. Create `src/` and move existing server and route wiring into `src/server.js`.
2. Add `src/config` with env validation (use `joi` or `envalid`).
3. Create `src/db/index.js` and move DB init logic.
4. Break `routes/` into `modules/*` routers and services.
5. Add tests and CI pipeline.

Security checklist (initial)
- Validate and fail-fast when env vars missing.
- Use `helmet` to set secure HTTP headers.
- Rate limit login and sensitive endpoints.
- Use parameterized queries or an ORM to avoid injection.
- Do not log secrets.

Performance checklist (initial)
- Serve static assets with caching headers.
- Use compression middleware for responses.
- Add basic server timing logs for endpoints.

Next actions you can ask me to run now
- Start moving `server.js` into `src/` and add `src/config/index.js` (I can do this now).
- Create `Dockerfile` + `docker-compose.yml` scaffolding.
- Add `eslint`/`prettier` configs and a basic GitHub Actions workflow.

