# Modern Redesign Plan — City Building

Goal: Redesign the project to modern software engineering standards, improve UI/UX, refactor backend for modularity and scalability, add tests, CI, containerization, and deployment docs.

Phases

1. Review & Audit
- Static code audit (JS linting, dependency check)
- Identify critical runtime issues (SMTP creds, missing assets)
- Map current routes, models, and views

2. Design System
- Create a small design system (colors, spacing, typography tokens)
- Build a reusable component library (header, footer, nav, buttons, forms)
- Use semantic HTML and accessibility-first markup

3. Frontend Refactor
- Migrate EJS partials into component-like includes
- Consolidate CSS into `src/styles` using modern organization (variables, utility classes)
- Adopt a minimal utility-first approach or CSS variables with modular files

4. Backend Refactor
- Convert `routes/` into modular routers with clear separation
- Move DB access to `src/db/` and introduce repository layer
- Improve error handling and centralize logging
- Add environment validation for secrets

5. Tests & CI
- Add unit tests for critical logic (auth, db init)
- Add basic integration tests for routes (smoke tests)
- Add GitHub Actions workflow for lint/test/build

6. DevOps
- Add `Dockerfile` and `docker-compose` for local dev
- Provide deployment instructions (Heroku/VPS/Container Registry)

7. Security & Performance
- Sanitize inputs, use prepared statements/ORM
- Harden headers, CSP, rate-limiting suggestions
- Use caching for static assets and set proper cache headers

8. Documentation
- README with modern setup, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `CHANGELOG.md`

Next actionable steps I will take now (if you confirm):
- Run a lightweight static audit of files (search for TODOs, large files, duplicate CSS selectors).
- Add initial scaffolding files: `ARCHITECTURE.md`, `CONTRIBUTING.md`, `README_MODERN.md`.
- Create a `scaffold/` directory with proposed folder structure example.

Respond with "Go ahead" to let me modify the repository now and implement the initial scaffolding, or say which parts you'd like me to do first.
