"use client"

import { useState } from "react"
import { ALIMENTOS } from "@/data/alimentos"
import type { Alimento } from "@/data/alimentos"
import {
  calcularSectores,
  calcularMacros,
  generarFeedback,
  TIPO_DIA_LABELS,
  type TipoDia,
  type ItemPlato,
  type SectorKey,
  type Sector,
} from "@/lib/plato"

// ─── helpers ────────────────────────────────────────────────────────────────

function arcPath(
  cx: number, cy: number, r: number,
  startDeg: number, endDeg: number,
): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180
  if (endDeg - startDeg >= 359.9) {
    const top = cy - r
    return `M${cx},${top} A${r},${r} 0 1 1 ${(cx - 0.01).toFixed(2)},${top} Z`
  }
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`
}

const SECTOR_FILL: Record<SectorKey, string> = {
  verduras_fruta:      "var(--nt-g)",
  proteina:            "var(--nt-a)",
  cereales_tuberculos: "var(--nt-mid)",
  grasa_saludable:     "var(--nt-r)",
}

const GRUPOS_CLASIFICADOS = [
  "Verduras", "Frutas",
  "Carnes", "Pescados y mariscos", "Huevos y lácteos", "Legumbres",
  "Cereales y tubérculos",
  "Frutos secos y semillas", "Grasas y aceites",
]

const TIPOS_DIA: TipoDia[] = ["descanso", "entreno", "entreno_exigente", "competicion"]

let _uid = 0
const uid = () => String(++_uid)

// ─── SVG plate ──────────────────────────────────────────────────────────────

function PlatoSVG({
  sectores,
  totalGramos,
}: {
  sectores: Sector[]
  totalGramos: number
}) {
  const cx = 100, cy = 100, r = 82, rHole = 26

  // Build recommended sectors (always shown as guide)
  const recArcs: { key: SectorKey; start: number; end: number }[] = []
  let angle = 0
  for (const s of sectores) {
    const sweep = s.recomendado * 360
    recArcs.push({ key: s.key, start: angle, end: angle + sweep })
    angle += sweep
  }

  // Build actual sectors (shown when food is added)
  const actArcs: { key: SectorKey; start: number; end: number }[] = []
  if (totalGramos > 0) {
    angle = 0
    for (const s of sectores) {
      if (s.actual > 0) {
        const sweep = s.actual * 360
        actArcs.push({ key: s.key, start: angle, end: angle + sweep })
        angle += sweep
      }
    }
  }

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto" aria-label="Plato visual">
      {/* Plate shadow */}
      <circle cx={cx} cy={cy} r={r + 7} fill="var(--nt-line)" opacity="0.4" />
      {/* Plate base */}
      <circle cx={cx} cy={cy} r={r + 5} fill="var(--nt-card)" />

      {/* Recommended sectors (guide, low opacity) */}
      {recArcs.map(s => (
        <path
          key={`rec-${s.key}`}
          d={arcPath(cx, cy, r, s.start, s.end)}
          fill={SECTOR_FILL[s.key]}
          opacity={totalGramos > 0 ? 0.1 : 0.3}
        />
      ))}

      {/* Actual sectors */}
      {actArcs.map(s => (
        <path
          key={`act-${s.key}`}
          d={arcPath(cx, cy, r, s.start, s.end)}
          fill={SECTOR_FILL[s.key]}
          opacity={0.85}
        />
      ))}

      {/* Dividers along recommended boundaries */}
      {recArcs.map(s => {
        const toRad = (d: number) => ((d - 90) * Math.PI) / 180
        const x = cx + r * Math.cos(toRad(s.start))
        const y = cy + r * Math.sin(toRad(s.start))
        return (
          <line
            key={`div-${s.key}`}
            x1={cx} y1={cy} x2={x.toFixed(2)} y2={y.toFixed(2)}
            stroke="var(--nt-card)" strokeWidth="1.5"
          />
        )
      })}

      {/* Inner hole */}
      <circle cx={cx} cy={cy} r={rHole} fill="var(--nt-card)" />

      {/* Center label */}
      {totalGramos === 0 ? (
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="var(--nt-soft)">
          añade alimentos
        </text>
      ) : (
        <>
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--nt-dark)">
            {Math.round(totalGramos)}g
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="var(--nt-soft)">
            total
          </text>
        </>
      )}
    </svg>
  )
}

// ─── Pyramid view ───────────────────────────────────────────────────────────

function PiramiSVG({ sectores }: { sectores: Sector[] }) {
  // Fixed order: biggest recommended at bottom
  const order: SectorKey[] = [
    "verduras_fruta", "cereales_tuberculos", "proteina", "grasa_saludable",
  ]

  return (
    <div className="space-y-2 py-2 max-w-xs mx-auto w-full">
      {order.map((key, idx) => {
        const s = sectores.find(x => x.key === key)!
        const recPct = Math.round(s.recomendado * 100)
        const actPct = Math.round(s.actual * 100)
        // Pyramid: wider at bottom → scale bar width by position
        const maxWidth = 100 - idx * 12 // 100%, 88%, 76%, 64%
        const barWidth = `${maxWidth}%`

        return (
          <div key={key} style={{ width: barWidth, margin: "0 auto" }}>
            <div className="flex justify-between text-xs mb-0.5" style={{ color: "var(--nt-soft)" }}>
              <span>{s.label}</span>
              <span>
                {actPct > 0 ? `${actPct}% · ` : ""}{recPct}% rec.
              </span>
            </div>
            <div className="relative h-7 rounded overflow-hidden" style={{ background: "var(--nt-line)" }}>
              {/* Recommended fill (muted) */}
              <div
                className="absolute inset-y-0 left-0 rounded"
                style={{
                  width: "100%",
                  background: SECTOR_FILL[key],
                  opacity: 0.2,
                }}
              />
              {/* Actual fill */}
              {actPct > 0 && (
                <div
                  className="absolute inset-y-0 left-0 rounded transition-all duration-300"
                  style={{
                    width: `${Math.min((actPct / recPct) * 100, 100)}%`,
                    background: SECTOR_FILL[key],
                    opacity: 0.85,
                  }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Macro donut ────────────────────────────────────────────────────────────

function MacroDonut({ macros }: { macros: ReturnType<typeof calcularMacros> }) {
  const { kcal, p, c, g, fib, na } = macros
  if (kcal === 0) return null

  const kcalP = p * 4
  const kcalC = c * 4
  const kcalG = g * 9
  const totalKcal = kcalP + kcalC + kcalG || 1

  const pPct = (kcalP / totalKcal) * 100
  const cPct = (kcalC / totalKcal) * 100

  const r = 35
  const circ = 2 * Math.PI * r
  const pDash = (pPct / 100) * circ
  const cDash = (cPct / 100) * circ
  const gDash = circ - pDash - cDash

  // Start at 12 o'clock = offset -circumference/4
  const startOffset = -(circ / 4)
  const pOff = startOffset
  const cOff = startOffset - pDash
  const gOff = startOffset - pDash - cDash

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--nt-line)" strokeWidth="13" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="var(--nt-a)" strokeWidth="13"
          strokeDasharray={`${pDash.toFixed(2)} ${(circ - pDash).toFixed(2)}`}
          strokeDashoffset={pOff.toFixed(2)}
        />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="var(--nt-mid)" strokeWidth="13"
          strokeDasharray={`${cDash.toFixed(2)} ${(circ - cDash).toFixed(2)}`}
          strokeDashoffset={cOff.toFixed(2)}
        />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="var(--nt-r)" strokeWidth="13"
          strokeDasharray={`${gDash.toFixed(2)} ${(circ - gDash).toFixed(2)}`}
          strokeDashoffset={gOff.toFixed(2)}
        />
        <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--nt-dark)">
          {Math.round(kcal)}
        </text>
        <text x="50" y="58" textAnchor="middle" fontSize="8" fill="var(--nt-soft)">kcal</text>
      </svg>

      <div className="text-sm space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nt-a)" }} />
          <span style={{ color: "var(--nt-dark)" }}>Prot.: <strong>{p.toFixed(1)} g</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nt-mid)" }} />
          <span style={{ color: "var(--nt-dark)" }}>Hidr.: <strong>{c.toFixed(1)} g</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nt-r)" }} />
          <span style={{ color: "var(--nt-dark)" }}>Gras.: <strong>{g.toFixed(1)} g</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nt-g)" }} />
          <span style={{ color: "var(--nt-dark)" }}>Fibra: <strong>{fib.toFixed(1)} g</strong></span>
        </div>
        {na > 0 && (
          <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
            Sodio: {Math.round(na)} mg
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PlatoPage() {
  const [tipoDia, setTipoDia] = useState<TipoDia>("entreno")
  const [vista, setVista] = useState<"plato" | "piramide">("plato")
  const [items, setItems] = useState<ItemPlato[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [grupoFiltro, setGrupoFiltro] = useState<string | null>(null)

  const sectores = calcularSectores(items, tipoDia)
  const macros = calcularMacros(items)
  const feedback = generarFeedback(sectores)
  const totalGramos = items.reduce((s, i) => s + i.gramos, 0)

  function addAlimento(a: Alimento) {
    setItems(prev => [
      ...prev,
      {
        id: `${a.id}-${uid()}`,
        nombre: a.nombre,
        emoji: a.emoji,
        grupo: a.grupo,
        gramos: a.porcion,
        kcal: a.kcal,
        p: a.p,
        c: a.c,
        g: a.g,
        fib: a.fib,
        na: a.na,
      },
    ])
  }

  function updateGramos(id: string, gramos: number) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, gramos } : i)))
  }

  const alimentosFiltrados = ALIMENTOS.filter(a => {
    const inGroup = grupoFiltro
      ? a.grupo === grupoFiltro
      : GRUPOS_CLASIFICADOS.includes(a.grupo)
    const matches =
      busqueda === "" ||
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.emoji.includes(busqueda)
    return inGroup && matches
  })

  return (
    <main className="max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Title */}
      <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
        🍽 Mi plato
      </h1>

      {/* Day type pills */}
      <div className="flex flex-wrap gap-2">
        {TIPOS_DIA.map(t => (
          <button
            key={t}
            onClick={() => setTipoDia(t)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: tipoDia === t ? "var(--nt-mid)" : "var(--nt-card)",
              color: tipoDia === t ? "#fff" : "var(--nt-soft)",
              border: `1px solid ${tipoDia === t ? "var(--nt-mid)" : "var(--nt-line)"}`,
            }}
          >
            {TIPO_DIA_LABELS[t]}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div
        className="flex gap-1 p-1 rounded-lg w-fit"
        style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
      >
        {(["plato", "piramide"] as const).map(v => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              background: vista === v ? "var(--nt-mid)" : "transparent",
              color: vista === v ? "#fff" : "var(--nt-soft)",
            }}
          >
            {v === "plato" ? "🍽 Plato" : "📊 Pirámide"}
          </button>
        ))}
      </div>

      {/* Visualization card */}
      <div
        className="p-4 rounded-xl"
        style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
      >
        {vista === "plato" ? (
          <PlatoSVG sectores={sectores} totalGramos={totalGramos} />
        ) : (
          <PiramiSVG sectores={sectores} />
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
          {sectores.map(s => (
            <div
              key={s.key}
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--nt-soft)" }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: SECTOR_FILL[s.key] }}
              />
              {s.label}
              <span className="ml-0.5">
                ({Math.round(s.recomendado * 100)}% rec.
                {totalGramos > 0 ? ` · ${Math.round(s.actual * 100)}% real` : ""})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Macros */}
      {macros.kcal > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
        >
          <MacroDonut macros={macros} />
        </div>
      )}

      {/* Feedback messages */}
      {feedback.length > 0 && (
        <div className="space-y-2">
          {feedback.map((msg, i) => (
            <div
              key={i}
              className="flex gap-2 p-3 rounded-lg text-sm"
              style={{ background: "var(--nt-abg)", color: "var(--nt-dark)" }}
            >
              <span>💬</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Items list */}
      {items.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--nt-line)" }}
        >
          <div
            className="px-3 py-2.5 text-sm font-semibold"
            style={{
              background: "var(--nt-card)",
              color: "var(--nt-dark)",
              borderBottom: "1px solid var(--nt-line)",
            }}
          >
            Alimentos en el plato
          </div>

          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-2.5"
              style={{
                background: "var(--nt-card)",
                borderTop: idx > 0 ? "1px solid var(--nt-line)" : "none",
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--nt-dark)" }}>
                  {item.nombre}
                </p>
                <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                  {item.grupo}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={item.gramos}
                  onChange={e => {
                    const v = parseInt(e.target.value)
                    if (!isNaN(v) && v > 0) updateGramos(item.id, v)
                  }}
                  className="w-16 px-1.5 py-1 rounded text-sm text-right"
                  style={{
                    background: "var(--nt-bg)",
                    border: "1px solid var(--nt-line)",
                    color: "var(--nt-dark)",
                  }}
                />
                <span className="text-xs" style={{ color: "var(--nt-soft)" }}>g</span>
              </div>
              <button
                onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                className="p-1 rounded"
                style={{ color: "var(--nt-soft)" }}
                aria-label={`Eliminar ${item.nombre}`}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => setItems([])}
            className="w-full py-2 text-xs"
            style={{
              color: "var(--nt-soft)",
              background: "var(--nt-card)",
              borderTop: "1px solid var(--nt-line)",
            }}
          >
            Vaciar plato
          </button>
        </div>
      )}

      {/* Food picker */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--nt-line)" }}
      >
        <div
          className="p-3"
          style={{
            background: "var(--nt-card)",
            borderBottom: "1px solid var(--nt-line)",
          }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>
            Añadir alimento
          </p>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--nt-bg)",
              border: "1px solid var(--nt-line)",
              color: "var(--nt-dark)",
            }}
          />
        </div>

        {/* Group filter chips */}
        <div
          className="flex gap-1.5 flex-wrap p-3"
          style={{
            background: "var(--nt-card)",
            borderBottom: "1px solid var(--nt-line)",
          }}
        >
          <button
            onClick={() => setGrupoFiltro(null)}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: grupoFiltro === null ? "var(--nt-mid)" : "var(--nt-bg)",
              color: grupoFiltro === null ? "#fff" : "var(--nt-soft)",
              border: "1px solid var(--nt-line)",
            }}
          >
            Todos
          </button>
          {GRUPOS_CLASIFICADOS.map(g => (
            <button
              key={g}
              onClick={() => setGrupoFiltro(prev => (prev === g ? null : g))}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: grupoFiltro === g ? "var(--nt-mid)" : "var(--nt-bg)",
                color: grupoFiltro === g ? "#fff" : "var(--nt-soft)",
                border: "1px solid var(--nt-line)",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Food list */}
        <div className="max-h-52 overflow-y-auto" style={{ background: "var(--nt-bg)" }}>
          {alimentosFiltrados.length === 0 ? (
            <p
              className="p-4 text-sm text-center"
              style={{ color: "var(--nt-soft)" }}
            >
              Sin resultados
            </p>
          ) : (
            alimentosFiltrados.map((a, idx) => (
              <button
                key={a.id}
                onClick={() => addAlimento(a)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-opacity hover:opacity-70"
                style={{
                  background: "var(--nt-bg)",
                  borderTop: idx > 0 ? "1px solid var(--nt-line)" : "none",
                }}
              >
                <span className="text-lg">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--nt-dark)" }}>
                    {a.nombre}
                  </p>
                  <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                    {a.kcal} kcal/100 g · {a.porcion} g por defecto
                  </p>
                </div>
                <span
                  className="text-xs font-medium shrink-0"
                  style={{ color: "var(--nt-mid)" }}
                >
                  + añadir
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center px-2" style={{ color: "var(--nt-soft)" }}>
        Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
      </p>
    </main>
  )
}
