-- =============================================================
-- NutriTSEAS – estado real de la BD en Supabase
-- Proyecto: ifdjhwprhqwowoepsgxk (nutritseas)
-- Fecha: 2026-11-26
-- =============================================================
-- Este archivo documenta el esquema vigente. No se aplica como
-- migración (ya está en prod). Sirve como referencia y punto de
-- partida para migraciones futuras.

-- ─── TABLAS ──────────────────────────────────────────────────

-- perfiles: un fila por usuario de auth.users
-- columnas: id, clase_id, nombre, rol, estado, nacimiento(*), xp, nivel, racha, created_at
-- (*) nacimiento es nullable y no se usa actualmente en la app

-- clases: agrupaciones de alumnos
-- entregas: trabajos que el alumno envía al profe
-- intentos_juego: registros de intentos en los juegos/quiz
-- juegos: definición de juegos disponibles
-- logros: catálogo de logros/insignias
-- logros_alumno: logros conseguidos por cada alumno
-- tareas: tareas activas de clase

-- ─── FUNCIONES (SECURITY DEFINER) ────────────────────────────

-- perfil_rol_actual()      → devuelve rol del usuario en sesión (sin recursión en RLS)
-- perfil_estado_actual()   → devuelve estado del usuario en sesión (sin recursión)
-- _alta_directa()          → trigger: fija estado='activo', rol='alumno' al crear perfil
-- _crear_perfil_nuevo_usuario() → trigger en auth.users: crea fila en perfiles al registrarse
-- fn_sumar_xp(p_alumno_id, p_cantidad) → suma XP y actualiza nivel/racha
-- fn_aprobar_entrega(p_id, p_comentario) → aprueba entrega y da XP
-- fn_asignar_logro(p_alumno_id, p_logro_id) → asigna logro manual

-- ─── TRIGGERS ────────────────────────────────────────────────

-- trg_alta_directa  ON perfiles INSERT → _alta_directa()
-- (trg_asignar_profe eliminado en 2026-11-26 – era obsoleto)

-- ─── VISTAS ──────────────────────────────────────────────────

-- ranking_clase (SECURITY DEFINER, solo authenticated)
--   → SELECT id, nombre, xp, nivel, racha FROM perfiles WHERE estado='activo'
--   Reemplaza la política todos_ven_ranking (que exponía datos a anon)

-- ─── POLÍTICAS RLS ACTIVAS ───────────────────────────────────
-- (limpiezas aplicadas 2026-11-26: eliminadas duplicadas con EXISTS-recursivo)

-- perfiles:
--   leer_propio          SELECT – solo el propio
--   profe_lee_todos      SELECT – profe ve todos
--   crear_propio_perfil  INSERT – rol=alumno, estado=activo|pendiente
--   alumno_actualiza_propio UPDATE – solo campos propios, no cambia estado/rol
--   profe_gestiona_alumnos  UPDATE – profe puede cambiar estado de alumnos

-- entregas:
--   alumno_sus_entregas  SELECT – propias
--   alumno_crea_entrega  INSERT – propio + estado=activo
--   alumno_edita_pendiente UPDATE – propias en estado=pendiente + estado=activo
--   profe_ve_entregas    SELECT – profe ve todas
--   profe_revisa_entrega UPDATE – profe puede revisar

-- intentos_juego:
--   alumno_registra_intento INSERT – propio + estado=activo
--   todos_ven_intentos   SELECT – alumno y profe

-- (el resto de tablas tienen políticas análogas documentadas en pg_policies)
