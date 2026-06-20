// Admin authentication middleware - enforces admin-only access
function isAdminAuthenticated(req, res, next) {
  if (!req.session || !req.session.userId || !req.session.adminUser) {
    return res.status(403).redirect('/login');
  }
  
  // Verify the user is actually an admin
  const adminUser = req.session.adminUser;
  if (!adminUser.role || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin' && adminUser.role !== 'superadmin')) {
    console.warn(`Unauthorized admin access attempt from user: ${adminUser.username} (role: ${adminUser.role})`);
    return res.status(403).render('error', {
      title: 'Access Denied',
      message: 'You do not have permission to access this area. Admin access required.'
    });
  }
  
  next();
}

function setAdminLocals(req, res, next) {
  res.locals.adminUser = req.session?.adminUser || null;
  res.locals.isAdminAuthenticated = !!(req.session?.adminUser && (req.session.adminUser.role === 'admin' || req.session.adminUser.role === 'super_admin' || req.session.adminUser.role === 'superadmin'));
  res.locals.isAuthenticated = !!(req.session?.userId || req.session?.siteUser);
  res.locals.siteUser = req.session?.siteUser || null;
  next();
}

module.exports = {
  isAdminAuthenticated,
  setAdminLocals,
};
