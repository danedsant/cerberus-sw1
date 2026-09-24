-- ============================================
-- CERBERUS - Datos de Prueba (Seed SQL)
-- Script de inserción de usuarios y datos iniciales
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- Habilitar la extensión pgcrypto si no está activa
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --------------------------------------------
-- 1. PROPIEDADES DE PRUEBA
-- --------------------------------------------
INSERT INTO propiedades (id, numero_unidad) VALUES
    ('p1111111-1111-1111-1111-111111111111', 'A-101'),
    ('p2222222-2222-2222-2222-222222222222', 'B-202'),
    ('p3333333-3333-3333-3333-333333333333', 'C-303'),
    ('p4444444-4444-4444-4444-444444444444', 'D-404')
ON CONFLICT (numero_unidad) DO NOTHING;


-- --------------------------------------------
-- 2. USUARIOS EN AUTH.USERS Y PUBLIC.USUARIOS
-- Contraseña común para todos: 123456
-- --------------------------------------------

-- A. USUARIO ADMINISTRATIVO
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'u1111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'admin@cerberus.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Carlos","apellido":"Mendoza"}',
    NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, correo, nombre, apellido, cedula, rol, telefono) VALUES
    ('u1111111-1111-1111-1111-111111111111', 'admin@cerberus.com', 'Carlos', 'Mendoza', 'V-10203040', 'administrativo', '0414-1112233')
ON CONFLICT (id) DO NOTHING;


-- B. USUARIO VIGILANTE
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'u2222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'vigilante@cerberus.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Ramón","apellido":"Pérez"}',
    NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, correo, nombre, apellido, cedula, rol, telefono) VALUES
    ('u2222222-2222-2222-2222-222222222222', 'vigilante@cerberus.com', 'Ramón', 'Pérez', 'V-15304050', 'vigilante', '0424-2223344')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vigilantes (usuario_id, turno) VALUES
    ('u2222222-2222-2222-2222-222222222222', 'Diurno (06:00 - 18:00)')
ON CONFLICT (usuario_id) DO NOTHING;


-- C. USUARIO RESIDENTE 1 (Asignado a A-101)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'u3333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'residente@cerberus.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"María","apellido":"Delgado"}',
    NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, correo, nombre, apellido, cedula, rol, telefono) VALUES
    ('u3333333-3333-3333-3333-333333333333', 'residente@cerberus.com', 'María', 'Delgado', 'V-18405060', 'residente', '0412-3334455')
ON CONFLICT (id) DO NOTHING;

INSERT INTO residentes (usuario_id, propiedad_id, codigo_pin_personal, qr_token) VALUES
    ('u3333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', '4321', 'qr-residente-maria-101')
ON CONFLICT (usuario_id) DO NOTHING;


-- D. USUARIO RESIDENTE 2 (Asignado a B-202)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'u4444444-4444-4444-4444-444444444444',
    'authenticated', 'authenticated',
    'residente2@cerberus.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Alejandro","apellido":"Gómez"}',
    NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, correo, nombre, apellido, cedula, rol, telefono) VALUES
    ('u4444444-4444-4444-4444-444444444444', 'residente2@cerberus.com', 'Alejandro', 'Gómez', 'V-19506070', 'residente', '0416-4445566')
ON CONFLICT (id) DO NOTHING;

INSERT INTO residentes (usuario_id, propiedad_id, codigo_pin_personal, qr_token) VALUES
    ('u4444444-4444-4444-4444-444444444444', 'p2222222-2222-2222-2222-222222222222', '8765', 'qr-residente-ale-202')
ON CONFLICT (usuario_id) DO NOTHING;


-- --------------------------------------------
-- 3. VISITANTES DE PRUEBA
-- --------------------------------------------
INSERT INTO visitantes (id, cedula, nombre, apellido) VALUES
    ('v1111111-1111-1111-1111-111111111111', 'V-22111222', 'Juan', 'Rodríguez'),
    ('v2222222-2222-2222-2222-222222222222', 'V-23333444', 'Ana', 'Silva'),
    ('v3333333-3333-3333-3333-333333333333', 'V-24555666', 'Roberto', 'Blanco')
ON CONFLICT (cedula) DO NOTHING;


-- --------------------------------------------
-- 4. VISITAS DE PRUEBA (Pendiente, Ingresado, Expirado)
-- --------------------------------------------
INSERT INTO visitas (id, residente_id, visitante_id, vigilante_id, fecha_esperada, tipo_visita, estado, codigo_pin, placa_vehiculo, fecha_creacion, fecha_hora_ingreso) VALUES
    -- Visita Pendiente para hoy (María autoriza a Juan)
    ('s1111111-1111-1111-1111-111111111111', 'u3333333-3333-3333-3333-333333333333', 'v1111111-1111-1111-1111-111111111111', NULL, CURRENT_DATE, 'social', 'pendiente', '789012', 'AB123CD', NOW(), NULL),
    -- Visita Ingresada hoy (Alejandro autorizó a Ana)
    ('s2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'v2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', CURRENT_DATE, 'delivery', 'ingresado', '345678', 'DELIV-01', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
    -- Visita Expirada de ayer (María autorizó a Roberto)
    ('s3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'v3333333-3333-3333-3333-333333333333', NULL, CURRENT_DATE - INTERVAL '1 day', 'mantenimiento', 'expirado', '901234', 'MANT-99', NOW() - INTERVAL '1 day', NULL)
ON CONFLICT (codigo_pin) DO NOTHING;


-- --------------------------------------------
-- 5. INGRESOS DE RESIDENTES DE PRUEBA
-- --------------------------------------------
INSERT INTO ingresos_residentes (id, residente_id, vigilante_id, fecha_hora) VALUES
    ('i1111111-1111-1111-1111-111111111111', 'u3333333-3333-3333-3333-333333333333', 'u2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;
