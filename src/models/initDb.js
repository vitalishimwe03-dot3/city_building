const fs = require('fs');
const path = require('path');
const pool = require('../db');

var projectRoot = path.resolve(__dirname, '..', '..');
var dbDir = path.join(projectRoot, 'db');
var dbFile = (function() {
  var configured = process.env.DB_PATH;
  if (configured) {
    try {
      fs.mkdirSync(path.dirname(configured), { recursive: true });
      return configured;
    } catch (_) {
      console.warn('DB_PATH directory not writable, falling back to project root');
    }
  }
  return path.join(projectRoot, 'city_building.db');
})();

function runSqlFile(filename) {
  return new Promise(function(resolve, reject) {
    try {
      var sql = fs.readFileSync(path.join(dbDir, filename), 'utf8');
      var statements = sql.split(';').map(function(s) { return s.trim(); }).filter(Boolean);
      for (var i = 0; i < statements.length; i++) {
        try {
          var db = pool.getDb();
          if (!db) throw new Error('Database not initialized');
          db.run(statements[i]);
        } catch (err) {
          err.message = 'Failed to execute SQL: ' + err.message + '\nStatement:\n' + statements[i];
          throw err;
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function runMigrations() {
  var db = pool.getDb();
  if (!db) return;
  var migrations = [
    "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE",
    "ALTER TABLE users ADD COLUMN avatar VARCHAR(512)",
    "ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false"
  ];
  for (var i = 0; i < migrations.length; i++) {
    try {
      db.run(migrations[i]);
      console.log('Migration applied: ' + migrations[i]);
    } catch (e) {
      // Column already exists or migration not needed
    }
  }
}

async function init() {
  try {
    await pool.initialize();
    await runSqlFile('schema.sql');
    await runSqlFile('seed.sql');
    await runSqlFile('admin-seed.sql');
    await runMigrations();
    try { await runSqlFile('migration_005.sql'); } catch (_) {}
    var db = pool.getDb();
    if (db) {
      var data = db.export();
      var buffer = Buffer.from(data);
      try { fs.mkdirSync(path.dirname(dbFile), { recursive: true }); } catch (_) {}
      fs.writeFileSync(dbFile, buffer);
    }
    console.log('Database schema ensured and seeded.');
  } catch (err) {
    throw err;
  }
}

if (require.main === module) {
  init()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Failed to init DB', err);
      process.exit(1);
    });
}

module.exports = { init };
