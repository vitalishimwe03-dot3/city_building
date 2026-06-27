-- Admin user seed (password: mugisha@3000@P)
-- The password hash below is for "mugisha@3000@P" using bcrypt
INSERT OR REPLACE INTO admin_users (username, email, password_hash, full_name, role, is_active)
VALUES ('CityB', 'mugishapatrick3000@gmail.com', '$2b$10$79iaqEWlPJVRUnbciydNWOObYiQTCukZi.yXL7gN/1TiLEIq/l99i', 'System Administrator', 'super_admin', true);
