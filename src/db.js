const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

var dbPath = (function() {
  var dir = path.resolve(__dirname, '..');
  var configured = process.env.DB_PATH;
  if (configured) {
    try {
      var parent = path.dirname(configured);
      if (parent) fs.mkdirSync(parent, { recursive: true });
      return configured;
    } catch (_) {
      console.warn('DB_PATH directory not writable, falling back to project root');
    }
  }
  return path.join(dir, 'city_building.db');
})();
let db = null;
let SQL = null;

async function initializeDb() {
  SQL = await initSqlJs();
  try {
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  } catch (err) {
    db = new SQL.Database();
  }
  db.run('PRAGMA foreign_keys = ON');
}

function saveDb() {
  if (db) {
    var data = db.export();
    var buffer = Buffer.from(data);
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    } catch (_) {}
    fs.writeFileSync(dbPath, buffer);
  }
}

const pool = {
  query: async function(sql, params = []) {
    if (!db) throw new Error('Database not initialized');
    const trimmedSQL = sql.trim().toUpperCase();
    const isSelect = trimmedSQL.startsWith('SELECT') || trimmedSQL.startsWith('PRAGMA') || trimmedSQL.startsWith('WITH');
    try {
      if (isSelect) {
        let rows = [];
        if (params && params.length > 0) {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
        } else {
          const results = db.exec(sql);
          if (results.length > 0) {
            const r = results[0];
            rows = r.values.map(row => {
              const obj = {};
              r.columns.forEach((col, i) => { obj[col] = row[i]; });
              return obj;
            });
          }
        }
        return [rows];
      } else {
        db.run(sql, params);
        saveDb();
        const result = { affectedRows: db.getRowsModified() };
        if (trimmedSQL.startsWith('INSERT')) {
          const execResult = db.exec("SELECT last_insert_rowid() as id");
          if (execResult.length > 0 && execResult[0].values.length > 0) {
            result.insertId = execResult[0].values[0][0];
          }
        }
        return [result];
      }
    } catch (err) {
      throw err;
    }
  },
  getDb: function() {
    return db;
  },
  initialize: initializeDb
};

module.exports = pool;
