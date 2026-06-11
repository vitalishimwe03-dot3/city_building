# Modernization README

This file outlines the step-by-step modernization plan and how to run the project in the new layout.

Quickstart (after migration)

1. Install dependencies

```bash
npm install
```

2. Configure environment (copy `.env.example` to `.env` and fill values)

3. Run migrations & seeds

```bash
npm run migrate
npm run seed
```

4. Start in dev

```bash
npm run dev
```

Suggested first development tasks
- Move `server.js` into `src/` and create `src/app.js`.
- Create `src/config/index.js` to validate env.
- Add `src/db/index.js` to centralize DB connection.
- Split `routes/` into `src/modules/*` with controllers and services.

If you want, I can start with the `src/` scaffolding and move `server.js` now — say "move server" to proceed.
