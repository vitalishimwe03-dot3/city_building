# Contributing

Thanks for contributing! This file describes short, practical rules for working on this repository.

Developer setup
- Node.js 18+ recommended.
- Install dependencies: `npm install`.
- Run dev server: `npm run dev`.

Branching
- Use feature branches named `feat/<short-desc>` or `fix/<short-desc>`.
- Open PRs against `main` with a description and testing notes.

Code style
- Run `npm run lint` before committing.
- Use existing ESLint/Prettier configuration (or add them if missing).

Testing
- Add unit tests next to the module in `src/modules/<module>/`.
- Run tests with `npm test`.

Commits & PRs
- Keep commits small and focused.
- Provide a summary and testing instructions in PRs.

Security
- Do not commit secrets or credentials. Use `.env` for local overrides and `env` in CI.

If you'd like, I can add `eslint`, `prettier`, and a GitHub Actions workflow next. Say "Add lint + CI" to proceed.
