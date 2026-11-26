"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Alimento = {
  id: string; nombre: string
  kcal: number; p: number; h: number; g: number
}
type Item = { alimento: Alimento; gramos: number }

function macros(a: Alimento, gramos: number) {
  const f = gramos / 100
  return {
    kcal: Math.round(a.kcal * f * 10) / 10,
    p:    Math.round(a.p   * f * 10) / 10,
    h:    Math.round(a.h   * f * 10) / 10,
    g:    Math.round(a.g   * f * 10) / 10,
  }
}

const numInput = {
  background: "var(--nt-bg)",
  border: "1px solid var(--nt-line)",
  color: "var(--nt-dark)",
  borderRadius: "0.5rem",
  padding: "0.25rem 0.5rem",
  fontSize: "0.75rem",
  width: "4.5rem",
  textAlign: "right" as const,
}

export function ModoPoraMi() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [items, setItems]         = useState<Item[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    createClient()
      .from("alimentos_propios")
      .select("id, nombre, kcal, p, h, g")
      .order("nombre")
      .then(({ data }) => { setAlimentos(data ?? []); setLoading(false) })
  }, [])

  function add(a: Alimento) {
    if (items.some(i => i.alimento.id === a.id)) return
    setItems(prev => [...prev, { alimento: a, gramos: 100 }])
  }

  const totales = items.reduce((acc, { alimento, gramos }) => {
    const m = macros(alimento, gramos)
    return { kcal: acc.kcal + m.kcal, p: acc.p + m.p, h: acc.h + m.h, g: acc.g + m.g }
  }, { kcal: 0, p: 0, h: 0, g: 0 })

  if (loading) return (
    <p className="text-sm text-center py-6" style={{ color: "var(--nt-soft)" }}>Cargando…</p>
  )

  if (alimentos.length === 0) return (
    <div className="rounded-xl p-5 text-center" style={{ background: "var(--nt-abg)" }}>
      <p className="text-sm font-medium" style={{ color: "var(--nt-a)" }}>Aún no tienes alimentos propios</p>
      <p className="text-xs mt-2" style={{ color: "var(--nt-soft)" }}>
        Ve al Laboratorio → Mis alimentos y añade los tuyos
      </p>
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
        Planifica tu propio menú sin XP ni nota. Usa los alimentos de tu Laboratorio.
      </p>

      {/* Selector de alimentos */}
      <div className="rounded-xl p-3 border" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--nt-soft)" }}>Tus alimentos</p>
        <div className="flex flex-wrap gap-2">
          {alimentos.map(a => {
            const yaEsta = items.some(i => i.alimento.id === a.id)
            return (
              <button
                key={a.id}
                onClick={() => add(a)}
                disabled={yaEsta}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={yaEsta
                  ? { background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
                  : { background: "var(--nt-dark)", color: "#fff" }
                }
              >
                {a.nombre}
              </button>
            )
          })}
        </div>
      </div>

      {/* Plan compuesto */}
      {items.length > 0 && (
        <>
          <div className="space-y-2">
            {items.map(({ alimento, gramos }) => {
              const m = macros(alimento, gramos)
              return (
                <div
                  key={alimento.id}
                  className="rounded-xl p-3 border flex items-center gap-2"
                  style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--nt-dark)" }}>
                      {alimento.nombre}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>
                      {m.kcal} kcal · P {m.p}g · H {m.h}g · G {m.g}g
                    </div>
                  </div>
                  <input
                    type="number" min={1} max={2000} step={10}
                    value={gramos}
                    onChange={e => setItems(prev =>
                      prev.map(i => i.alimento.id === alimento.id ? { ...i, gramos: Number(e.target.value) } : i)
                    )}
                    style={numInput}
                  />
                  <span className="text-xs" style={{ color: "var(--nt-soft)" }}>g</span>
                  <button
                    onClick={() => setItems(prev => prev.filter(i => i.alimento.id !== alimento.id))}
                    style={{ color: "var(--nt-soft)", padding: "6px", minHeight: 36, display: "flex", alignItems: "center", fontSize: "0.75rem" }}
                    aria-label="Quitar"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {/* Totales */}
          <div className="rounded-xl p-3 border" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--nt-soft)" }}>Total del plan</p>
            <div className="grid grid-cols-4 gap-1 text-xs text-center">
              {[
                { l: "Kcal", v: Math.round(totales.kcal) },
                { l: "P",    v: `${Math.round(totales.p * 10) / 10}g` },
                { l: "H",    v: `${Math.round(totales.h * 10) / 10}g` },
                { l: "G",    v: `${Math.round(totales.g * 10) / 10}g` },
              ].map(({ l, v }) => (
                <div key={l}>
                  <div className="font-bold" style={{ color: "var(--nt-dark)" }}>{v}</div>
                  <div style={{ color: "var(--nt-soft)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setItems([])}
            className="w-full py-2 rounded-xl text-sm"
            style={{ background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }}
          >
            Reiniciar
          </button>
        </>
      )}

      <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
        Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
      </p>
    </div>
  )
}
