# Proposed Folder Structure (scaffold)

This scaffold demonstrates the recommended structure for the project when modernized.

src/
  server.js                 # entrypoint
  app.js                    # express app setup
  config/
    index.js                # env validation and config providers
  modules/
    auth/
      auth.controller.js
      auth.service.js
      auth.routes.js
      index.js
    users/
    admin/
  db/
    index.js                # database connection helper
    migrations/
    seeds/
  middleware/
    errorHandler.js
    validateEnv.js
  utils/
    logger.js
    validators.js

public/
  css/
    base.css
    components.css
  js/
    main.js
  images/

views/
  components/
    header.ejs
    footer.ejs
  pages/
    index.ejs

scripts/
  migrate.js
  seed.js

configs
  .eslintrc.json
  .prettierrc
  docker/
    Dockerfile
    docker-compose.yml

Notes
- Start by moving `server.js` into `src/server.js` and refactor route registration into `modules/*`.
- Keep legacy `views/` while progressively migrating parts to components.
