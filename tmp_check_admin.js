const pool = require('./src/db');
(async () => {
  try {
    await pool.initialize();
    const [rows] = await pool.query('SELECT id, username, email, role, is_active, created_at FROM admin_users');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
  }
})();
