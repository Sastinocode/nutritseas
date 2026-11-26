-- Migración 0003: laboratorio – alimentos propios y platos con aprobación
-- Reglas RLS: usar perfil_rol_actual() y perfil_estado_actual(), nunca subconsultas a perfiles.

-- ─────────────────────────────────────────────────────────────
-- 1. Tabla alimentos_propios
-- ─────────────────────────────────────────────────────────────
CREATE TABLE alimentos_propios (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creado_por    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre        text NOT NULL,
  -- valores por 100 g
  kcal          numeric(7,2) NOT NULL CHECK (kcal >= 0),
  p             numeric(6,2) NOT NULL CHECK (p >= 0),
  h             numeric(6,2) NOT NULL CHECK (h >= 0),
  g             numeric(6,2) NOT NULL CHECK (g >= 0),
  coherencia_ok boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alimentos_propios ENABLE ROW LEVEL SECURITY;

-- Solo ve/edita/borra sus propios alimentos
CREATE POLICY "alimentos_propios_select" ON alimentos_propios
  FOR SELECT TO authenticated
  USING (creado_por = auth.uid());

CREATE POLICY "alimentos_propios_insert" ON alimentos_propios
  FOR INSERT TO authenticated
  WITH CHECK (
    creado_por = auth.uid()
    AND perfil_estado_actual() = 'activo'
  );

CREATE POLICY "alimentos_propios_update" ON alimentos_propios
  FOR UPDATE TO authenticated
  USING  (creado_por = auth.uid() AND perfil_estado_actual() = 'activo')
  WITH CHECK (creado_por = auth.uid());

CREATE POLICY "alimentos_propios_delete" ON alimentos_propios
  FOR DELETE TO authenticated
  USING (creado_por = auth.uid() AND perfil_estado_actual() = 'activo');

-- ─────────────────────────────────────────────────────────────
-- 2. Tabla platos
-- ─────────────────────────────────────────────────────────────
CREATE TABLE platos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creado_por        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre            text NOT NULL,
  descripcion       text,
  -- Ingredientes: [{nombre, cantidad_g, kcal, p, h, g}]
  ingredientes      jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Macros totales (calculados al guardar, por el cliente)
  kcal_total        numeric(8,2) NOT NULL DEFAULT 0,
  p_total           numeric(6,2) NOT NULL DEFAULT 0,
  h_total           numeric(6,2) NOT NULL DEFAULT 0,
  g_total           numeric(6,2) NOT NULL DEFAULT 0,
  -- 'personal' (solo para mí) | 'reto' (enviado a la clase)
  modo              text NOT NULL DEFAULT 'personal'
    CHECK (modo IN ('personal', 'reto')),
  -- 'borrador' | 'pendiente' | 'aprobado' | 'rechazado'
  estado_aprobacion text NOT NULL DEFAULT 'borrador'
    CHECK (estado_aprobacion IN ('borrador', 'pendiente', 'aprobado', 'rechazado')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platos ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 3. Trigger updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_platos_updated_at
  BEFORE UPDATE ON platos
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 4. Trigger: solo el profe puede cambiar estado_aprobacion
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_platos_protect_estado()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.estado_aprobacion IS DISTINCT FROM NEW.estado_aprobacion THEN
    IF perfil_rol_actual() != 'profe' THEN
      RAISE EXCEPTION 'Solo el profe puede cambiar el estado de aprobacion';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_platos_protect_estado
  BEFORE UPDATE ON platos
  FOR EACH ROW EXECUTE FUNCTION fn_platos_protect_estado();

-- ─────────────────────────────────────────────────────────────
-- 5. RLS platos
-- ─────────────────────────────────────────────────────────────

-- SELECT: alumno ve lo suyo + los aprobados; profe ve todo
CREATE POLICY "platos_select" ON platos
  FOR SELECT TO authenticated
  USING (
    creado_por = auth.uid()
    OR estado_aprobacion = 'aprobado'
    OR perfil_rol_actual() = 'profe'
  );

-- INSERT: usuario activo, solo filas propias
CREATE POLICY "platos_insert" ON platos
  FOR INSERT TO authenticated
  WITH CHECK (
    creado_por = auth.uid()
    AND perfil_estado_actual() = 'activo'
  );

-- UPDATE: alumno edita lo suyo (el trigger bloquea cambio de estado_aprobacion);
--         profe puede editar cualquiera (para aprobar/rechazar)
CREATE POLICY "platos_update" ON platos
  FOR UPDATE TO authenticated
  USING (
    (creado_por = auth.uid() AND perfil_estado_actual() = 'activo')
    OR perfil_rol_actual() = 'profe'
  )
  WITH CHECK (
    creado_por = auth.uid()
    OR perfil_rol_actual() = 'profe'
  );

-- DELETE: solo el dueño puede borrar, y solo si no está aprobado
CREATE POLICY "platos_delete" ON platos
  FOR DELETE TO authenticated
  USING (
    creado_por = auth.uid()
    AND perfil_estado_actual() = 'activo'
    AND estado_aprobacion != 'aprobado'
  );
