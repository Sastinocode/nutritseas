# NutriTSEAS – Convenciones del proyecto

App de aula para la UD6 (nutrición y suplementación) de «Valoración de la Condición Física», TSEAS, Colegio El Ope (Archena). Profe: Sebas. Alumnado: adultos (6-7 personas). Uso en móvil, en clase y en casa.

Desplegada en Vercel: `nutritseas.vercel.app`. Supabase proyecto: `ifdjhwprhqwowoepsgxk` (nombre: nutritseas). **Nunca crear otro proyecto Supabase.**

## Stack

- **Next.js** (App Router) · **React** · **TypeScript strict**
- **Tailwind CSS v4** – tokens como variables CSS en `globals.css` (`--nt-*`) y `@theme inline {}`
- **Supabase Auth** con `@supabase/ssr` (`createBrowserClient` / `createServerClient`)
- **Zustand v5** – store local en `src/lib/store.ts`, persiste en `localStorage` (solo perfil físico y progreso de quiz). **No consulta Supabase.**
- **lucide-react** para iconos
- **Vitest + Testing Library** para tests unitarios

## Estructura de rutas

```
/auth                      → Login/registro (email+contraseña)
/(app)/                    → Home: listado de módulos
/(app)/aprende             → Contenido teórico (nutrientes, macros, hidratación)
/(app)/menus               → Menús y timing de entreno
/(app)/menus/constructor   → Constructor de menús personalizado
/(app)/menus/panel-profe   → Gestión de menús (solo profe)
/(app)/suplementos         → Semáforo de evidencia, checklist, detector de bulos
/(app)/retos               → Quiz y juego de mitos
/(app)/calcular            → Calculadora energética (Mifflin-St Jeor)
/(app)/tareas              → Tareas con sistema de entregas
/(app)/clase               → Ranking de la clase (vista clasificación)
/(app)/clase/panel         → Panel del profe (alumnos, entregas, bloqueos)
/(app)/laboratorio         → Laboratorio: alimentos propios + creación de platos (4 pestañas)
/(app)/retos/laboratorio   → Reto del laboratorio: Modo Reto con platos aprobados (mismo componente que /menus)
/(app)/plato               → Mi plato: visualización de plato por sectores + pirámide nutricional (Fase 7)
```

Todas las rutas `/(app)/*` están protegidas por `NavShell` (Server Component): redirige a `/auth` si no hay sesión, muestra pantalla de bloqueo si `estado='bloqueado'`.

## Autenticación y roles

- El registro es libre (email + contraseña). Al registrarse se crea automáticamente una fila en `perfiles` con `rol='alumno'` y `estado='activo'` (trigger en `auth.users`).
- El rol `profe` **solo se asigna manualmente** desde el Dashboard de Supabase (tabla `perfiles`, columna `rol`). Nunca se puede elegir en el registro ni en la app.
- El profe ve el Panel en `/clase/panel` y opciones extra en menús. Los alumnos no.
- Un alumno `bloqueado` ve una pantalla de bloqueo en cuanto carga cualquier ruta `(app)`. No puede interactuar con la app.

## Base de datos (Supabase `ifdjhwprhqwowoepsgxk`)

### Funciones SECURITY DEFINER (evitan recursión en RLS)
- `perfil_rol_actual()` → devuelve el rol del usuario en sesión
- `perfil_estado_actual()` → devuelve el estado del usuario en sesión
- `fn_sumar_xp(p_xp integer)` → suma XP al alumno activo (límite: 1-60 XP por llamada)
- `fn_aprobar_entrega(uuid, integer)` → aprueba entrega y da XP
- `fn_asignar_logro(uuid, uuid)` → asigna logro manual

### Vistas
- `ranking_clase` – solo `SELECT`, solo `authenticated`, filtra `estado='activo' AND rol='alumno'`

### Triggers
- `trg_alta_directa` ON `perfiles` BEFORE INSERT → fija `estado='activo'` y `rol='alumno'`
- `trg_crear_perfil` ON `auth.users` → crea fila en `perfiles` al registrarse

### Migraciones documentadas
- `supabase/migrations/0001_estado_actual.sql` – snapshot del estado de la BD (referencia)
- `supabase/migrations/0002_cerrar_huecos_ranking_y_xp.sql` – refuerzo de ranking y fn_sumar_xp
- `supabase/migrations/0003_laboratorio.sql` – tablas `platos` y `alimentos_propios` con RLS (Fase 6)
- `supabase/migrations/0004_fix_trigger_estado.sql` – permite alumno borrador↔pendiente; solo profe puede aprobar/rechazar

## Colores del sistema (siempre por variable CSS)

| Token | Uso |
|---|---|
| `--nt-dark` | Texto de títulos, sidebar |
| `--nt-mid` | Acento, links activos |
| `--nt-bg` | Fondo de página |
| `--nt-card` | Fondo de tarjetas |
| `--nt-line` | Bordes, divisores |
| `--nt-soft` | Texto secundario |
| `--nt-g / --nt-gbg` | Semáforo verde |
| `--nt-a / --nt-abg` | Semáforo ámbar |
| `--nt-r / --nt-rbg` | Semáforo rojo |

**Nunca** escribir colores hex directos en componentes. Usar siempre `var(--nt-*)`.

## Reglas de seguridad (NO tocar sin consenso)

1. Sin IMC, "peso ideal" ni comparaciones de cuerpos.
2. Menores de 18 → sin déficit calórico, sin dosis de suplementos.
3. Objetivo calórico nunca baja del metabolismo basal (implementado en `nutricion.ts`).
4. Todas las pantallas con cifras llevan el aviso: "Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista."
5. Suplementos "r" (rojo) → siempre "no recomendado", nunca con dosis.
6. Cafeína limitada a 400 mg/día de referencia adulto.
7. Datos de peso/talla/edad: solo en `localStorage`, nunca a servidor externo.

## Convenciones de código

- Componentes de cliente: `"use client"` al inicio del fichero.
- Server Components: usan `createClient()` de `src/lib/supabase/server.ts`.
- Client Components: usan `createClient()` de `src/lib/supabase/client.ts`.
- Funciones puras (lib): sin estado, sin efectos secundarios.
- Tests: junto al fichero que prueban (`*.test.ts`).
- Sin comentarios obvios. Solo comentar WHY si no es evidente.

## Comandos

```
npm run dev      → servidor local
npm test         → Vitest
npm run typecheck → tsc --noEmit
npm run build    → build de producción
```

Antes de cada commit: test + typecheck + build en verde.
