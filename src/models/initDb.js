const fs = require('fs');
const path = require('path');
const pool = require('../db');

var projectRoot = path.resolve(__dirname, '..', '..');
var dbDir = path.join(projectRoot, 'db');
var dbFile = process.env.DB_PATH || path.join(projectRoot, 'city_building.db');

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

async function init() {
  try {
    await pool.initialize();
    await runSqlFile('schema.sql');
    await runSqlFile('seed.sql');
    await runSqlFile('admin-seed.sql');
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
