"use client"
import { useEffect, useState } from "react"
import { Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Plato = {
  id: string
  nombre: string
  descripcion: string | null
  kcal_total: number
  p_total: number
  h_total: number
  g_total: number
}

const XP_MENU = 10

function hoyStr() {
  return new Date().toISOString().slice(0, 10)
}

export function ModoReto() {
  const [platos, setPlatos]       = useState<Plato[]>([])
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set())
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [xpGanado, setXpGanado]   = useState<number | null>(null)
  const [yaEnviado, setYaEnviado] = useState(false)
  const [userId, setUserId]       = useState<string | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      try {
        if (localStorage.getItem(`nt_menu_reto_${user.id}`) === hoyStr()) setYaEnviado(true)
      } catch {}
    })
    sb.from("platos")
      .select("id, nombre, descripcion, kcal_total, p_total, h_total, g_total")
      .eq("estado_aprobacion", "aprobado")
      .order("updated_at", { ascending: false })
      .then(({ data }) => { setPlatos(data ?? []); setLoading(false) })
  }, [])

  function toggle(id: string) {
    setSeleccion(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const seleccionados = platos.filter(p => seleccion.has(p.id))
  const totales = seleccionados.reduce(
    (acc, p) => ({ kcal: acc.kcal + p.kcal_total, p: acc.p + p.p_total, h: acc.h + p.h_total, g: acc.g + p.g_total }),
    { kcal: 0, p: 0, h: 0, g: 0 }
  )

  async function enviar() {
    if (seleccion.size < 2 || yaEnviado || submitting) return
    setSubmitting(true)
    const { error } = await createClient().rpc("fn_sumar_xp", { p_xp: XP_MENU })
    if (!error && userId) {
      try { localStorage.setItem(`nt_menu_reto_${userId}`, hoyStr()) } catch {}
      setYaEnviado(true)
      setXpGanado(XP_MENU)
    }
    setSubmitting(false)
  }

  if (loading) return (
    <p className="text-sm text-center py-6" style={{ color: "var(--nt-soft)" }}>Cargando…</p>
  )

  if (platos.length === 0) return (
    <div className="text-center py-10" style={{ color: "var(--nt-soft)" }}>
      <div className="text-4xl mb-3">🏆</div>
      <p className="text-sm font-medium">Aún no hay platos aprobados</p>
      <p className="text-xs mt-1">El profe aprueba los platos enviados desde el Laboratorio</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="rounded-xl p-4 border" style={{ background: "var(--nt-abg)", borderColor: "var(--nt-a)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={15} style={{ color: "var(--nt-a)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--nt-a)" }}>Modo Reto · +{XP_MENU} XP</span>
        </div>
        <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
          Selecciona al menos 2 platos de la clase para armar tu menú del día.
          Solo puedes enviarlo una vez al día.
        </p>
      </div>

      {/* XP ganado */}
      {xpGanado !== null && (
        <div className="rounded-xl p-5 text-center" style={{ background: "var(--nt-gbg)", border: "1px solid var(--nt-g)" }}>
          <div className="text-3xl mb-1">🏆</div>
          <p className="font-bold" style={{ color: "var(--nt-g)" }}>+{xpGanado} XP ganados</p>
          <p className="text-xs mt-1" style={{ color: "var(--nt-soft)" }}>Vuelve mañana para el siguiente reto</p>
        </div>
      )}

      {/* Ya enviado hoy */}
      {yaEnviado && xpGanado === null && (
        <div className="rounded-xl p-3 text-sm text-center" style={{ background: "var(--nt-bg)", border: "1px solid var(--nt-line)" }}>
          <span style={{ color: "var(--nt-soft)" }}>Ya enviaste tu menú reto hoy · Vuelve mañana</span>
        </div>
      )}

      {/* Totales seleccionados */}
      {seleccion.size > 0 && (
        <div className="rounded-xl p-3 border" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--nt-soft)" }}>
            {seleccion.size} plato{seleccion.size !== 1 ? "s" : ""} seleccionado{seleccion.size !== 1 ? "s" : ""}
          </p>
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
      )}

      {/* Lista de platos aprobados */}
      <div className="space-y-2">
        {platos.map(p => {
          const activo = seleccion.has(p.id)
          return (
            <button
              key={p.id}
              onClick={() => !yaEnviado && toggle(p.id)}
              disabled={yaEnviado}
              className="w-full text-left rounded-xl p-3 border transition-all"
              style={{
                background:   activo ? "var(--nt-dark)" : "var(--nt-card)",
                borderColor:  activo ? "var(--nt-dark)" : "var(--nt-line)",
                opacity: yaEnviado ? 0.7 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-sm font-medium" style={{ color: activo ? "#fff" : "var(--nt-dark)" }}>
                    {p.nombre}
                  </span>
                  {p.descripcion && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: activo ? "rgba(255,255,255,0.65)" : "var(--nt-soft)" }}>
                      {p.descripcion}
                    </p>
                  )}
                </div>
                <span className="text-xs shrink-0" style={{ color: activo ? "rgba(255,255,255,0.75)" : "var(--nt-soft)" }}>
                  {p.kcal_total} kcal
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Botón enviar */}
      {!yaEnviado && (
        <button
          onClick={enviar}
          disabled={seleccion.size < 2 || submitting}
          className="w-full py-3 rounded-xl font-semibold text-white"
          style={{
            background: "var(--nt-mid)",
            opacity: (seleccion.size < 2 || submitting) ? 0.4 : 1,
            minHeight: 48,
          }}
        >
          {submitting
            ? "Enviando…"
            : seleccion.size < 2
              ? `Selecciona ${2 - seleccion.size} plato${seleccion.size === 1 ? "" : "s"} más`
              : `Enviar menú del día · +${XP_MENU} XP`}
        </button>
      )}
    </div>
  )
}
