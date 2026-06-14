const crypto = require('crypto');

function requireSiteUser(req, res, next) {
  if (!req.session || !req.session.siteUser) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

function requireAdminApi(req, res, next) {
  if (!req.session || !req.session.adminUser) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  next();
}

module.exports = { requireSiteUser, requireAdminApi };
