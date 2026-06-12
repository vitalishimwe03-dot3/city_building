const pool = require('../db');

const INSERT_FIELDS = ['title', 'description', 'image_id', 'image_path', 'link_url', 'btn_text', 'animation', 'display_order', 'is_active', 'auto_play', 'transition_speed'];
const UPDATE_FIELDS = ['title', 'description', 'image_id', 'image_path', 'link_url', 'btn_text', 'animation', 'display_order', 'is_active', 'auto_play', 'transition_speed'];

const Slide = {
  async create(data) {
    const fields = INSERT_FIELDS.filter(f => data[f] !== undefined);
    const values = fields.map(f => data[f]);
    const placeholders = fields.map(() => '?').join(', ');
    const cols = fields.join(', ');
    const result = await pool.query(`INSERT INTO hero_slides (${cols}) VALUES (${placeholders})`, values);
    return { id: result[0]?.insertId || result?.insertId, ...data };
  },

  async findAll(opts = {}) {
    let sql = 'SELECT hs.*, si.path AS image_path_resolved, si.alt_text AS image_alt FROM hero_slides hs LEFT JOIN site_images si ON hs.image_id = si.id';
    const conditions = [];
    const params = [];
    if (opts.is_active !== undefined) { conditions.push('hs.is_active = ?'); params.push(opts.is_active ? 1 : 0); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY hs.display_order ASC, hs.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return rows || [];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT hs.*, si.path AS image_path_resolved, si.alt_text AS image_alt FROM hero_slides hs LEFT JOIN site_images si ON hs.image_id = si.id WHERE hs.id = ?', [id]);
    return rows?.[0] || null;
  },

  async update(id, data) {
    const fields = UPDATE_FIELDS.filter(f => data[f] !== undefined);
    if (!fields.length) return;
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f]);
    values.push(id);
    await pool.query(`UPDATE hero_slides SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  },

  async delete(id) {
    await pool.query('DELETE FROM hero_slides WHERE id = ?', [id]);
  },

  async reorder(ids) {
    for (let i = 0; i < ids.length; i++) {
      await pool.query('UPDATE hero_slides SET display_order = ? WHERE id = ?', [i, ids[i]]);
    }
  }
};

module.exports = Slide;
