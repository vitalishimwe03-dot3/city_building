-- Admin user seed (password: mugisha@3000@P)
-- The password hash below is for "mugisha@3000@P" using bcrypt
INSERT OR REPLACE INTO admin_users (username, email, password_hash, full_name, role, is_active)
VALUES ('CityB', 'mugishapatrick3000@gmail.com', '$2b$10$4m8dq8AacXAWnRkbwUulSO3l/f8POM21.jRAEM39DiT2ZFW32hmh2', 'System Administrator', 'super_admin', true);
