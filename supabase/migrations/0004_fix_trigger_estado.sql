-- Migración 0004: corrige fn_platos_protect_estado
-- Permite a cualquier usuario autenticado hacer borrador→pendiente (enviar a reto)
-- y pendiente→borrador (retirar envío). Solo el profe puede poner aprobado/rechazado.

CREATE OR REPLACE FUNCTION fn_platos_protect_estado()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.estado_aprobacion IS DISTINCT FROM NEW.estado_aprobacion THEN
    -- Transiciones permitidas sin ser profe:
    --   borrador → pendiente  (alumno envía a revisión)
    --   pendiente → borrador  (alumno retira el envío)
    IF NOT (
      (OLD.estado_aprobacion = 'borrador'  AND NEW.estado_aprobacion = 'pendiente') OR
      (OLD.estado_aprobacion = 'pendiente' AND NEW.estado_aprobacion = 'borrador')
    ) THEN
      IF perfil_rol_actual() != 'profe' THEN
        RAISE EXCEPTION 'Solo el profe puede cambiar el estado de aprobacion a este valor';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
