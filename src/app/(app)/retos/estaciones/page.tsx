"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import retoData from "@/data/reto-estaciones.json"

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatusBars {
  energia: number
  hidratacion: number
  potencia: number
  mental: number
  recuperacion: number
}

interface Efecto {
  energia?: number
  hidratacion?: number
  potencia?: number
  mental?: number
  recuperacion?: number
}

interface Opcion {
  emoji: string
  nombre: string
  razon: string
  efecto: Efecto
  puntos: number // 0, 5 o 10
}

type TipoEstacion = "resistencia" | "fuerza"
type GameState = "intro" | "feeding" | "result" | "finished"

interface StationResult {
  nombre: string
  opcion: Opcion
  puntos: number
}

// ─── Datos del juego ─────────────────────────────────────────────────────────

const TIPOS_ESTACION: TipoEstacion[] = [
  "resistencia", // s1 Remo ergómetro
  "fuerza",      // s2 Farmer carry
  "fuerza",      // s3 Sentadillas con saco
  "resistencia", // s4 Spiderman walk
  "fuerza",      // s5 Press con mancuernas
  "resistencia", // s6 Burpees
  "fuerza",      // s7 Remo con kettlebell
  "resistencia", // s8 Carrera final
]

const OPCIONES_RESISTENCIA: Opcion[] = [
  {
    emoji: "🍌",
    nombre: "Plátano + agua",
    razon: "Hidratos de absorción rápida e hidratación perfecta: lo ideal para la resistencia.",
    efecto: { energia: 15, hidratacion: 20 },
    puntos: 10,
  },
  {
    emoji: "🥪",
    nombre: "Bocadillo de pavo",
    razon: "Buena proteína, pero la digestión es más lenta y puede pesar en carrera.",
    efecto: { energia: 8, potencia: 8 },
    puntos: 5,
  },
  {
    emoji: "🍟",
    nombre: "Patatas fritas",
    razon: "Grasas saturadas y exceso de sodio: dificultan la digestión y deshidratan.",
    efecto: { energia: 3, hidratacion: -12, mental: -5 },
    puntos: 0,
  },
]

const OPCIONES_FUERZA: Opcion[] = [
  {
    emoji: "🍚",
    nombre: "Arroz con pollo",
    razon: "Proteína completa + hidratos de calidad: la combinación ideal para la fuerza.",
    efecto: { energia: 12, potencia: 20, recuperacion: 8 },
    puntos: 10,
  },
  {
    emoji: "🥚",
    nombre: "Huevos y tostada",
    razon: "Proteína completa y energía sostenida, aunque la absorción es un poco más lenta.",
    efecto: { energia: 10, potencia: 12, recuperacion: 5 },
    puntos: 5,
  },
  {
    emoji: "🥤",
    nombre: "Refresco azucarado",
    razon: "Pico de azúcar seguido de bajada brusca: lo peor para mantener la fuerza.",
    efecto: { energia: 5, hidratacion: -15, mental: -10 },
    puntos: 0,
  },
]

// Desgaste fisiológico de cada estación (se aplica tras el efecto de la comida)
const DESGASTE: Record<TipoEstacion, Efecto> = {
  resistencia: { energia: -20, hidratacion: -18, mental: -8 },
  fuerza: { energia: -15, potencia: -15, recuperacion: -10 },
}

const BARRA_INFO: { key: keyof StatusBars; label: string; emoji: string }[] = [
  { key: "energia",      label: "Energía",      emoji: "⚡" },
  { key: "hidratacion",  label: "Hidratación",  emoji: "💧" },
  { key: "potencia",     label: "Potencia",     emoji: "💪" },
  { key: "mental",       label: "Mental",       emoji: "🧠" },
  { key: "recuperacion", label: "Recuperación", emoji: "❤️" },
]

const STATUS_INICIAL: StatusBars = {
  energia: 70,
  hidratacion: 70,
  potencia: 70,
  mental: 70,
  recuperacion: 70,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number) {
  return Math.max(0, Math.min(100, v))
}

function aplicarEfecto(bars: StatusBars, efecto: Efecto): StatusBars {
  return {
    energia:      clamp(bars.energia      + (efecto.energia      ?? 0)),
    hidratacion:  clamp(bars.hidratacion  + (efecto.hidratacion  ?? 0)),
    potencia:     clamp(bars.potencia     + (efecto.potencia     ?? 0)),
    mental:       clamp(bars.mental       + (efecto.mental       ?? 0)),
    recuperacion: clamp(bars.recuperacion + (efecto.recuperacion ?? 0)),
  }
}

function promedioBarras(bars: StatusBars): number {
  return (bars.energia + bars.hidratacion + bars.potencia + bars.mental + bars.recuperacion) / 5
}

// ─── Deportista SVG ───────────────────────────────────────────────────────────

function Deportista({ nivel }: { nivel: "bien" | "cansado" | "agotado" }) {
  const faceColor =
    nivel === "bien" ? "var(--nt-g)" : nivel === "cansado" ? "var(--nt-a)" : "var(--nt-r)"

  return (
    <svg viewBox="0 0 80 120" className="w-20 h-28 mx-auto" aria-hidden="true">
      {/* Head */}
      <circle cx="40" cy="20" r="14" fill={faceColor} opacity="0.9" />
      {/* Eyes */}
      {nivel === "agotado" ? (
        <>
          <line x1="34" y1="15" x2="38" y2="18" stroke="var(--nt-dark)" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="15" x2="42" y2="18" stroke="var(--nt-dark)" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="36" cy="17" r="2" fill="var(--nt-dark)" />
          <circle cx="44" cy="17" r="2" fill="var(--nt-dark)" />
        </>
      )}
      {/* Mouth */}
      {nivel === "bien" && (
        <path d="M33,22 Q40,28 47,22" stroke="var(--nt-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {nivel === "cansado" && (
        <path d="M34,24 Q40,22 46,24" stroke="var(--nt-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {nivel === "agotado" && (
        <path d="M33,26 Q40,20 47,26" stroke="var(--nt-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Body */}
      <line x1="40" y1="34" x2="40" y2="75" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
      {/* Arms: arriba (bien), horizontal (cansado), caídos (agotado) */}
      {nivel === "bien" ? (
        <>
          <line x1="40" y1="45" x2="20" y2="35" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="45" x2="60" y2="35" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : nivel === "cansado" ? (
        <>
          <line x1="40" y1="45" x2="22" y2="52" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="45" x2="58" y2="52" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="40" y1="45" x2="24" y2="62" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="45" x2="56" y2="62" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <line x1="40" y1="75" x2="28" y2="108" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="75" x2="52" y2="108" stroke="var(--nt-dark)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Barras de estado ─────────────────────────────────────────────────────────

function BarrasEstado({ bars }: { bars: StatusBars }) {
  return (
    <div className="space-y-1.5">
      {BARRA_INFO.map(({ key, label, emoji }) => {
        const val = bars[key]
        const color = val > 60 ? "var(--nt-g)" : val > 30 ? "var(--nt-a)" : "var(--nt-r)"
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm w-5 text-center">{emoji}</span>
            <span className="text-xs w-20 shrink-0" style={{ color: "var(--nt-soft)" }}>{label}</span>
            <div className="flex-1 h-2 rounded-full" style={{ background: "var(--nt-line)" }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${val}%`, background: color }}
              />
            </div>
            <span className="text-xs w-7 text-right tabular-nums" style={{ color: "var(--nt-soft)" }}>
              {val}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Barra de progreso ────────────────────────────────────────────────────────

function BarraProgreso({ actual, total }: { actual: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full"
          style={{ background: i < actual ? "var(--nt-mid)" : "var(--nt-line)" }}
        />
      ))}
    </div>
  )
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EstacionesPage() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [stationIdx, setStationIdx] = useState(0)
  const [bars, setBars] = useState<StatusBars>(STATUS_INICIAL)
  const [results, setResults] = useState<StationResult[]>([])
  const [lastOpcion, setLastOpcion] = useState<Opcion | null>(null)
  const [xpGanado, setXpGanado] = useState(0)
  const [enviandoXP, setEnviandoXP] = useState(false)

  const totalEstaciones = retoData.estaciones.length
  const estacion = retoData.estaciones[stationIdx]
  const tipoEstacion = TIPOS_ESTACION[stationIdx]
  const opciones = tipoEstacion === "resistencia" ? OPCIONES_RESISTENCIA : OPCIONES_FUERZA
  const promedio = promedioBarras(bars)
  const nivelDeportista: "bien" | "cansado" | "agotado" =
    promedio >= 65 ? "bien" : promedio >= 40 ? "cansado" : "agotado"

  function reiniciar() {
    setGameState("intro")
    setStationIdx(0)
    setBars(STATUS_INICIAL)
    setResults([])
    setLastOpcion(null)
    setXpGanado(0)
  }

  function elegirComida(opcion: Opcion) {
    const barsConComida = aplicarEfecto(bars, opcion.efecto)
    const barsFinal = aplicarEfecto(barsConComida, DESGASTE[tipoEstacion])
    setBars(barsFinal)
    setLastOpcion(opcion)
    setResults(prev => [...prev, { nombre: estacion.nombre, opcion, puntos: opcion.puntos }])
    setGameState("result")
  }

  async function siguiente(currentResults: StationResult[]) {
    if (stationIdx < totalEstaciones - 1) {
      setStationIdx(s => s + 1)
      setGameState("feeding")
    } else {
      const totalPuntos = currentResults.reduce((s, r) => s + r.puntos, 0)
      // 10 base + hasta 50 según rendimiento; máximo 60 (límite servidor)
      const xp = Math.max(10, Math.round(10 + (totalPuntos / (totalEstaciones * 10)) * 50))
      setXpGanado(xp)
      setGameState("finished")

      setEnviandoXP(true)
      try {
        const supabase = createClient()
        await supabase.rpc("fn_sumar_xp", { p_xp: xp })
      } finally {
        setEnviandoXP(false)
      }
    }
  }

  // ── Intro ─────────────────────────────────────────────────────────────────

  if (gameState === "intro") {
    return (
      <main className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
            🏃 Reto de las 8 estaciones
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
            Elige bien qué comer antes de cada estación para que tu deportista rinda al máximo
          </p>
        </div>

        <div className="space-y-2">
          {retoData.estaciones.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
            >
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--nt-mid)", color: "#fff" }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--nt-dark)" }}>{e.nombre}</p>
                <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                  {e.valor} {e.unidad} ·{" "}
                  {TIPOS_ESTACION[i] === "resistencia" ? "Resistencia" : "Fuerza"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-3 text-sm"
          style={{ background: "var(--nt-abg)", color: "var(--nt-dark)" }}
        >
          💡 Gana hasta <strong>60 XP</strong> eligiendo los alimentos correctos para cada estación
        </div>

        <button
          onClick={() => setGameState("feeding")}
          className="w-full py-3.5 rounded-xl font-bold text-sm"
          style={{ background: "var(--nt-mid)", color: "#fff" }}
        >
          ¡Empezar el reto! 🚀
        </button>

        <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
          Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
        </p>
      </main>
    )
  }

  // ── Feeding ───────────────────────────────────────────────────────────────

  if (gameState === "feeding") {
    return (
      <main className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <BarraProgreso actual={stationIdx} total={totalEstaciones} />

        <div
          className="rounded-xl p-4"
          style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
                Estación {stationIdx + 1} de {totalEstaciones}
              </p>
              <h2 className="text-lg font-bold mt-0.5" style={{ color: "var(--nt-dark)" }}>
                {estacion.nombre}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--nt-soft)" }}>
                {estacion.descripcion}
              </p>
              <span
                className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: tipoEstacion === "resistencia" ? "var(--nt-gbg)" : "var(--nt-abg)",
                  color: tipoEstacion === "resistencia" ? "var(--nt-g)" : "var(--nt-a)",
                }}
              >
                {tipoEstacion === "resistencia" ? "🫀 Resistencia" : "🏋️ Fuerza"}
              </span>
            </div>
            <Deportista nivel={nivelDeportista} />
          </div>
        </div>

        <div
          className="rounded-xl p-3"
          style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--nt-soft)" }}>
            Estado del deportista
          </p>
          <BarrasEstado bars={bars} />
        </div>

        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>
            ¿Qué le das de comer?
          </p>
          <div className="space-y-2">
            {opciones.map((op, i) => (
              <button
                key={i}
                onClick={() => elegirComida(op)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-opacity active:opacity-70"
                style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
              >
                <span className="text-2xl">{op.emoji}</span>
                <span className="text-sm font-medium" style={{ color: "var(--nt-dark)" }}>
                  {op.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ── Result ────────────────────────────────────────────────────────────────

  if (gameState === "result" && lastOpcion) {
    const esIdeal = lastOpcion.puntos === 10
    const esMediocre = lastOpcion.puntos === 5
    const resultColor = esIdeal ? "var(--nt-g)" : esMediocre ? "var(--nt-a)" : "var(--nt-r)"
    const resultBg = esIdeal ? "var(--nt-gbg)" : esMediocre ? "var(--nt-abg)" : "var(--nt-rbg)"
    const resultMsg = esIdeal ? "¡Elección perfecta!" : esMediocre ? "Podría mejorar" : "Mala elección"
    const resultEmoji = esIdeal ? "✅" : esMediocre ? "⚠️" : "❌"
    const esUltima = stationIdx === totalEstaciones - 1

    // Snapshot of results with this station already included
    const currentResults = results

    return (
      <main className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <BarraProgreso actual={stationIdx + 1} total={totalEstaciones} />

        <div
          className="rounded-xl p-4 text-center"
          style={{ background: resultBg, border: `1px solid ${resultColor}` }}
        >
          <Deportista nivel={nivelDeportista} />
          <p className="text-lg font-bold mt-2" style={{ color: resultColor }}>
            {resultEmoji} {resultMsg}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--nt-dark)" }}>
            Elegiste: <strong>{lastOpcion.emoji} {lastOpcion.nombre}</strong>
          </p>
        </div>

        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--nt-dark)" }}>¿Por qué?</p>
          <p style={{ color: "var(--nt-soft)" }}>{lastOpcion.razon}</p>
        </div>

        <div
          className="rounded-xl p-3"
          style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--nt-soft)" }}>
            Estado tras la estación
          </p>
          <BarrasEstado bars={bars} />
        </div>

        <button
          onClick={() => siguiente(currentResults)}
          className="w-full py-3.5 rounded-xl font-bold text-sm"
          style={{ background: "var(--nt-mid)", color: "#fff" }}
        >
          {esUltima ? "Ver resultado final 🏆" : "Siguiente estación →"}
        </button>
      </main>
    )
  }

  // ── Finished ──────────────────────────────────────────────────────────────

  const perfectas = results.filter(r => r.opcion.puntos === 10).length

  return (
    <main className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-5">
      <div className="text-center space-y-2 pt-4">
        <div className="text-5xl">
          {perfectas === 8 ? "🏆" : perfectas >= 5 ? "🥇" : perfectas >= 3 ? "🥈" : "🥉"}
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
          {perfectas === 8
            ? "¡Deportista perfecto!"
            : perfectas >= 5
              ? "¡Muy buena nutrición!"
              : perfectas >= 3
                ? "Nutrición mejorable"
                : "A practicar más"}
        </h2>
        <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
          {perfectas} de {results.length} elecciones ideales
        </p>
      </div>

      <div
        className="rounded-2xl p-5 text-center"
        style={{ background: "var(--nt-abg)", border: "1px solid var(--nt-a)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
          XP ganado
        </p>
        <p className="text-4xl font-black mt-1" style={{ color: "var(--nt-mid)" }}>
          {enviandoXP ? "…" : `+${xpGanado}`}
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--nt-line)" }}
      >
        <div
          className="px-3 py-2 text-xs font-semibold"
          style={{
            background: "var(--nt-card)",
            color: "var(--nt-soft)",
            borderBottom: "1px solid var(--nt-line)",
          }}
        >
          Resumen de estaciones
        </div>
        {results.map((r, i) => {
          const color =
            r.opcion.puntos === 10
              ? "var(--nt-g)"
              : r.opcion.puntos === 5
                ? "var(--nt-a)"
                : "var(--nt-r)"
          return (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2.5"
              style={{
                background: "var(--nt-card)",
                borderTop: i > 0 ? "1px solid var(--nt-line)" : "none",
              }}
            >
              <span className="text-xs font-bold w-4 shrink-0" style={{ color: "var(--nt-soft)" }}>
                {i + 1}
              </span>
              <span className="flex-1 text-xs truncate" style={{ color: "var(--nt-dark)" }}>
                {r.nombre}
              </span>
              <span className="text-sm shrink-0">{r.opcion.emoji}</span>
              <span className="text-xs shrink-0 font-medium" style={{ color }}>
                {r.opcion.puntos === 10 ? "✓ Ideal" : r.opcion.puntos === 5 ? "~ Regular" : "✗ Mejorar"}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
        Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
      </p>

      <button
        onClick={reiniciar}
        className="w-full py-3.5 rounded-xl font-bold text-sm"
        style={{ background: "var(--nt-mid)", color: "#fff" }}
      >
        Volver a intentarlo
      </button>
    </main>
  )
}
