const fs = require('fs');
const path = require('path');
const pool = require('../db');

function findDbDir() {
  var candidates = [
    path.join(__dirname, '..', '..', 'db'),
    path.join(process.cwd(), '..', 'db'),
    path.join(process.cwd(), 'db'),
    path.join(__dirname, '..', '..', '..', 'db')
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  return candidates[0];
}

function runSqlFile(filename) {
  return new Promise((resolve, reject) => {
    try {
      var dbPath = findDbDir();
      var sql = fs.readFileSync(path.join(dbPath, filename), 'utf8');
      // Split by semicolon but preserve the statement structure
      const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
      
      for (const stmt of statements) {
        try {
          const db = pool.getDb();
          if (!db) {
            throw new Error('Database not initialized');
          }
          db.run(stmt);
        } catch (err) {
          err.message = `Failed to execute SQL: ${err.message}\nStatement:\n${stmt}`;
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
    const db = pool.getDb();
    if (db) {
      const data = db.export();
      const buffer = Buffer.from(data);
      const fs = require('fs');
      const path = require('path');
      fs.writeFileSync(path.join(__dirname, '..', '..', 'city_building.db'), buffer);
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
