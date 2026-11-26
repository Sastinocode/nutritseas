"use client"
import { useEffect, useState } from "react"
import { CalendarDays, ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Alimento = { id: string; nombre: string; kcal: number; p: number; h: number; g: number }
type ItemDia = { id: string; gramos: number }
type PlanSemana = ItemDia[][]

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const PLAN_VACIO: PlanSemana = Array(7).fill(null).map(() => [])

function macros(a: Alimento, gramos: number) {
  const f = gramos / 100
  return {
    kcal: Math.round(a.kcal * f * 10) / 10,
    p:    Math.round(a.p   * f * 10) / 10,
    h:    Math.round(a.h   * f * 10) / 10,
    g:    Math.round(a.g   * f * 10) / 10,
  }
}

const numInput: React.CSSProperties = {
  background: "var(--nt-bg)",
  border: "1px solid var(--nt-line)",
  color: "var(--nt-dark)",
  borderRadius: "0.5rem",
  padding: "0.25rem 0.5rem",
  fontSize: "0.75rem",
  width: "4.5rem",
  textAlign: "right",
}

export function ModoSemana() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [plan, setPlan]           = useState<PlanSemana>(PLAN_VACIO)
  const [diaActivo, setDiaActivo] = useState<number | null>(null)
  const [vista, setVista]         = useState<"semana" | "compra">("semana")
  const [loading, setLoading]     = useState(true)
  const [userId, setUserId]       = useState<string | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      try {
        const stored = localStorage.getItem(`nt_plan_semana_${user.id}`)
        if (stored) setPlan(JSON.parse(stored))
      } catch {}
    })
    sb.from("alimentos_propios")
      .select("id, nombre, kcal, p, h, g")
      .order("nombre")
      .then(({ data }) => { setAlimentos(data ?? []); setLoading(false) })
  }, [])

  function savePlan(next: PlanSemana) {
    setPlan(next)
    if (userId) {
      try { localStorage.setItem(`nt_plan_semana_${userId}`, JSON.stringify(next)) } catch {}
    }
  }

  function addAlimento(dia: number, a: Alimento) {
    if (plan[dia].some(i => i.id === a.id)) return
    savePlan(plan.map((d, i) => i === dia ? [...d, { id: a.id, gramos: 100 }] : d))
  }

  function removeAlimento(dia: number, id: string) {
    savePlan(plan.map((d, i) => i === dia ? d.filter(it => it.id !== id) : d))
  }

  function setGramos(dia: number, id: string, gramos: number) {
    savePlan(plan.map((d, i) => i === dia ? d.map(it => it.id === id ? { ...it, gramos } : it) : d))
  }

  function kcalDia(dia: number) {
    return plan[dia].reduce((s, { id, gramos }) => {
      const a = alimentos.find(al => al.id === id)
      return a ? s + macros(a, gramos).kcal : s
    }, 0)
  }

  const listaCompra = (() => {
    const totals: Record<string, { alimento: Alimento; gramos: number }> = {}
    plan.forEach(dia =>
      dia.forEach(({ id, gramos }) => {
        const a = alimentos.find(al => al.id === id)
        if (!a) return
        totals[id] ? (totals[id].gramos += gramos) : (totals[id] = { alimento: a, gramos })
      })
    )
    return Object.values(totals).sort((a, b) => a.alimento.nombre.localeCompare(b.alimento.nombre))
  })()

  const hayPlan = plan.some(d => d.length > 0)

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
      {/* Tabs */}
      <div className="flex rounded-xl p-1" style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}>
        {([
          { key: "semana" as const,  label: "Plan semanal",       Icon: CalendarDays },
          { key: "compra" as const,  label: "Lista de la compra", Icon: ShoppingCart },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setVista(key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
            style={vista === key
              ? { background: "var(--nt-dark)", color: "#fff" }
              : { color: "var(--nt-soft)" }
            }
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── SEMANA ── */}
      {vista === "semana" && (
        <div className="space-y-2">
          {DIAS.map((dia, idx) => {
            const kcal  = Math.round(kcalDia(idx))
            const isOpen = diaActivo === idx
            const items  = plan[idx]
            return (
              <div key={idx} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--nt-line)" }}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3"
                  style={{ background: isOpen ? "var(--nt-dark)" : "var(--nt-card)" }}
                  onClick={() => setDiaActivo(isOpen ? null : idx)}
                >
                  <span className="text-sm font-semibold"
                    style={{ color: isOpen ? "#fff" : "var(--nt-dark)" }}>
                    {dia}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs"
                      style={{ color: isOpen ? "rgba(255,255,255,0.7)" : "var(--nt-soft)" }}>
                      {items.length > 0 ? `${items.length} alim. · ${kcal} kcal` : "vacío"}
                    </span>
                    <span style={{ color: isOpen ? "#fff" : "var(--nt-soft)", fontSize: "0.6rem" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="p-3 space-y-3" style={{ background: "var(--nt-bg)" }}>
                    <div>
                      <p className="text-xs font-medium mb-2" style={{ color: "var(--nt-soft)" }}>Añadir alimento</p>
                      <div className="flex flex-wrap gap-2">
                        {alimentos.map(a => {
                          const yaEsta = items.some(i => i.id === a.id)
                          return (
                            <button key={a.id} onClick={() => addAlimento(idx, a)} disabled={yaEsta}
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

                    {items.length > 0 && (
                      <div className="space-y-2">
                        {items.map(({ id, gramos }) => {
                          const a = alimentos.find(al => al.id === id)
                          if (!a) return null
                          const m = macros(a, gramos)
                          return (
                            <div key={id} className="flex items-center gap-2 rounded-xl p-2.5 border"
                              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate" style={{ color: "var(--nt-dark)" }}>
                                  {a.nombre}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>
                                  {m.kcal} kcal · P {m.p}g · H {m.h}g · G {m.g}g
                                </div>
                              </div>
                              <input
                                type="number" min={1} max={2000} step={10}
                                value={gramos}
                                onChange={e => setGramos(idx, id, Number(e.target.value))}
                                style={numInput}
                              />
                              <span className="text-xs" style={{ color: "var(--nt-soft)" }}>g</span>
                              <button onClick={() => removeAlimento(idx, id)} aria-label="Quitar"
                                style={{ color: "var(--nt-soft)", padding: "6px", display: "flex", alignItems: "center", fontSize: "0.75rem" }}>
                                ✕
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Totales semanales */}
          {hayPlan && (() => {
            const tot = plan.reduce((acc, dia) => {
              dia.forEach(({ id, gramos }) => {
                const a = alimentos.find(al => al.id === id)
                if (!a) return
                const m = macros(a, gramos)
                acc.kcal += m.kcal; acc.p += m.p; acc.h += m.h; acc.g += m.g
              })
              return acc
            }, { kcal: 0, p: 0, h: 0, g: 0 })
            return (
              <div className="rounded-xl p-3 mt-1" style={{ background: "var(--nt-dark)" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>Total semanal</p>
                <div className="grid grid-cols-4 gap-1 text-xs text-center">
                  {[
                    { l: "Kcal", v: Math.round(tot.kcal) },
                    { l: "P",    v: `${Math.round(tot.p  * 10) / 10}g` },
                    { l: "H",    v: `${Math.round(tot.h  * 10) / 10}g` },
                    { l: "G",    v: `${Math.round(tot.g  * 10) / 10}g` },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div className="font-bold" style={{ color: "#fff" }}>{v}</div>
                      <div style={{ color: "rgba(255,255,255,0.65)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {hayPlan && (
            <button onClick={() => savePlan(PLAN_VACIO)}
              className="w-full py-2 rounded-xl text-sm"
              style={{ background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }}>
              Reiniciar semana
            </button>
          )}
        </div>
      )}

      {/* ── LISTA DE LA COMPRA ── */}
      {vista === "compra" && (
        <div className="space-y-3">
          {listaCompra.length === 0 ? (
            <div className="rounded-xl p-5 text-center" style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}>
              <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
                Planifica tu semana primero para ver la lista de la compra
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
                {listaCompra.length} alimento{listaCompra.length !== 1 ? "s" : ""} para toda la semana
              </p>
              <div className="space-y-2">
                {listaCompra.map(({ alimento, gramos }) => (
                  <div key={alimento.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3 border"
                    style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--nt-dark)" }}>{alimento.nombre}</span>
                    <span className="text-sm font-bold" style={{ color: "var(--nt-mid)" }}>{Math.round(gramos)} g</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
        Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
      </p>
    </div>
  )
}
