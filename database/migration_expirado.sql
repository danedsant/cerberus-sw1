-- Migración: Agregar estado 'expirado' a visitas
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar el CHECK constraint anterior
ALTER TABLE visitas DROP CONSTRAINT IF EXISTS visitas_estado_check;

-- 2. Crear nuevo CHECK constraint con 'expirado'
ALTER TABLE visitas ADD CONSTRAINT visitas_estado_check 
    CHECK (estado IN ('pendiente', 'ingresado', 'cancelado', 'expirado'));

-- 3. Marcar como expiradas las visitas pendientes cuya fecha ya pasó
UPDATE visitas 
SET estado = 'expirado' 
WHERE estado = 'pendiente' 
AND fecha_esperada < CURRENT_DATE;
