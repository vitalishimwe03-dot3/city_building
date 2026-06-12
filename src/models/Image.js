const pool = require('../db');

const INSERT_FIELDS = ['section', 'filename', 'original_name', 'path', 'alt_text', 'file_size', 'mime_type', 'uploaded_by'];
const UPDATE_FIELDS = ['alt_text', 'section', 'is_active', 'sort_order'];

const Image = {
  async create(data) {
    const fields = INSERT_FIELDS.filter(f => data[f] !== undefined);
    const values = fields.map(f => data[f]);
    const placeholders = fields.map(() => '?').join(', ');
    const cols = fields.join(', ');
    const result = await pool.query(`INSERT INTO site_images (${cols}) VALUES (${placeholders})`, values);
    return { id: result[0]?.insertId || result?.insertId, ...data };
  },

  async findAll(opts = {}) {
    let sql = 'SELECT si.*, au.full_name AS uploaded_by_name FROM site_images si LEFT JOIN admin_users au ON si.uploaded_by = au.id';
    const conditions = [];
    const params = [];
    if (opts.section) { conditions.push('si.section = ?'); params.push(opts.section); }
    if (opts.is_active !== undefined) { conditions.push('si.is_active = ?'); params.push(opts.is_active ? 1 : 0); }
    if (opts.search) { conditions.push('(si.original_name LIKE ? OR si.alt_text LIKE ?)'); params.push(`%${opts.search}%`, `%${opts.search}%`); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY si.sort_order ASC, si.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return rows || [];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT si.*, au.full_name AS uploaded_by_name FROM site_images si LEFT JOIN admin_users au ON si.uploaded_by = au.id WHERE si.id = ?', [id]);
    return rows?.[0] || null;
  },

  async update(id, data) {
    const fields = UPDATE_FIELDS.filter(f => data[f] !== undefined);
    if (!fields.length) return;
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f]);
    values.push(id);
    await pool.query(`UPDATE site_images SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  },

  async delete(id) {
    await pool.query('DELETE FROM site_images WHERE id = ?', [id]);
  },

  async getSections() {
    const [rows] = await pool.query('SELECT DISTINCT section FROM site_images ORDER BY section');
    return rows?.map(r => r.section) || [];
  }
};

module.exports = Image;
