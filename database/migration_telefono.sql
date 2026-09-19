-- Migración: Consolidar teléfono en tabla usuarios
-- Fecha: 2026-09-19

-- Agregar campo teléfono a todos los usuarios
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);

-- Eliminar campo redundante de residentes
ALTER TABLE residentes DROP COLUMN telefono_contacto;
