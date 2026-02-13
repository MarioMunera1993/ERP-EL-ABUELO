-- Reset del usuario admin con una contraseña hasheada correctamente
-- El hash es de BCrypt para "admin123"

UPDATE users 
SET password = '$2a$10$NxqBCEf.DlrJNPpCLhvPVuEhGDYYpJHKPVfVf7K1CjdYPwjHt6WOK'
WHERE username = 'admin';

-- Si el usuario no existe, lo creamos
-- INSERT INTO users (username, password, full_name, email, role_id, is_active, created_at, updated_at) 
-- VALUES ('admin', '$2a$10$NxqBCEf.DlrJNPpCLhvPVuEhGDYYpJHKPVfVf7K1CjdYPwjHt6WOK', 'Administrador', 'admin@example.com', 1, true, NOW(), NOW());
