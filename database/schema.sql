-- ============================================
-- CERBERUS - Sistema de Control de Acceso
-- Script de creación de base de datos
-- PostgreSQL (Supabase)
-- ============================================

-- 1. Tabla de Propiedades
CREATE TABLE propiedades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_unidad VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla de Usuarios (entidad base)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    correo VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('superadmin', 'administrativo', 'vigilante', 'residente'))
);

-- 3. Tabla de Residentes (extensión de Usuarios)
CREATE TABLE residentes (
    usuario_id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    propiedad_id UUID NOT NULL REFERENCES propiedades(id) ON DELETE RESTRICT,
    telefono_contacto VARCHAR(20)
);

-- 4. Tabla de Vigilantes (extensión de Usuarios)
CREATE TABLE vigilantes (
    usuario_id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    turno VARCHAR(50) NOT NULL
);

-- 5. Tabla de Visitantes
CREATE TABLE visitantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL
);

-- 6. Tabla de Visitas (tabla transaccional central)
CREATE TABLE visitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    residente_id UUID NOT NULL REFERENCES residentes(usuario_id) ON DELETE RESTRICT,
    visitante_id UUID NOT NULL REFERENCES visitantes(id) ON DELETE RESTRICT,
    vigilante_id UUID REFERENCES vigilantes(usuario_id) ON DELETE SET NULL,
    fecha_esperada DATE NOT NULL,
    tipo_visita VARCHAR(20) NOT NULL CHECK (tipo_visita IN ('social', 'delivery', 'mantenimiento', 'transporte')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'ingresado', 'cancelado')),
    codigo_pin VARCHAR(10) NOT NULL UNIQUE,
    placa_vehiculo VARCHAR(20),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_hora_ingreso TIMESTAMP WITH TIME ZONE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_visitas_residente ON visitas(residente_id);
CREATE INDEX idx_visitas_estado ON visitas(estado);
CREATE INDEX idx_visitas_fecha ON visitas(fecha_esperada);
CREATE INDEX idx_visitas_pin ON visitas(codigo_pin);
