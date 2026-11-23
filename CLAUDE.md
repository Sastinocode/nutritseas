# NutriTSEAS – Convenciones del proyecto

## Stack
- **Next.js 16** (App Router) · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** – tokens en `globals.css` como variables CSS (`--nt-*`) y `@theme inline {}`
- **Zustand v5** – store en `src/lib/store.ts`, persistido en `localStorage`
- **lucide-react** para iconos
- **Vitest + Testing Library** para tests unitarios

## Estructura de carpetas
```
src/
  app/           # Next.js App Router (layout + páginas)
  components/
    nav/         # BottomNav (móvil) + Sidebar (escritorio)
  data/          # Datos estáticos tipados, extraídos del HTML prototipo
  lib/
    nutricion.ts # Funciones puras: MB, GET, macros (Mifflin-St Jeor)
    store.ts     # Zustand: perfil + progreso del alumno
```

## Colores del sistema (siempre por variable CSS)
| Token | Uso |
|-------|-----|
| `--nt-dark` | Texto de títulos, sidebar |
| `--nt-mid` | Acento, links activos |
| `--nt-bg` | Fondo de página |
| `--nt-card` | Fondo de tarjetas |
| `--nt-line` | Bordes, divisores |
| `--nt-g / --nt-gbg` | Semáforo verde |
| `--nt-a / --nt-abg` | Semáforo ámbar |
| `--nt-r / --nt-rbg` | Semáforo rojo |

**Nunca** escribir colores hex directos en componentes. Usar siempre `var(--nt-*)`.

## Reglas de seguridad (NO tocar sin consenso)
1. Sin IMC, "peso ideal" ni comparaciones de cuerpos.
2. Menores de 18 años → sin déficit calórico, sin dosis de suplementos.
3. Objetivo calórico nunca baja del metabolismo basal (implementado en `nutricion.ts`).
4. Todas las pantallas con cifras llevan el aviso: "Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista."
5. Suplementos "r" (rojo) → siempre "no recomendado", nunca con dosis.
6. Cafeína limitada a 400 mg/día de referencia adulto.
7. Datos de peso/talla/edad: solo en `localStorage`, nunca a servidor externo.

## Convenciones de código
- Componentes de cliente: `"use client"` al inicio del fichero.
- Funciones puras (lib): sin estado, sin efectos secundarios.
- Datos: en `src/data/`, con tipos TypeScript explícitos.
- Tests: junto al fichero que prueban (`*.test.ts`).
- Sin comentarios obvios. Solo comentar WHY si no es evidente.

## Fases del proyecto
- **Fase 0** ✅ Shell (layout, nav, datos, tipos, build verde)
- **Fase 1** Contenido interactivo (macros, micros, menús, calculadora)
- **Fase 2** Suplementos (semáforo, checklist, detector de bulos)
- **Fase 3** Quiz y retos (mitos, preguntas, progreso)
- **Fase 4** Calculadora avanzada + plato del deportista visual
- **Fase 5** PWA (Serwist)
- **Fase 6** Modo clase con Supabase (opcional)
