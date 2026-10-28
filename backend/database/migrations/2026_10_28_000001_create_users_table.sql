-- =============================================================================
-- Migración SQL: Tabla de Usuarios y Control de Acceso Basado en Roles (RBAC)
-- Proyecto: SentinelCommerce
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Seed Inicial (Administrador Principal y Cuenta Cliente de Prueba)
INSERT INTO users (id, name, email, password_hash, role)
VALUES
    ('usr-admin-01', 'Tadeo (SuperAdmin)', 'admin@sentinel.com', '$2y$12$SentinelAdminHash99281726354', 'admin'),
    ('usr-client-01', 'Cliente Verificado', 'cliente@sentinel.com', '$2y$12$SentinelClientHash1122334455', 'client')
ON CONFLICT (email) DO NOTHING;
