"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

type Tarea = {
  id: string
  titulo: string
  descripcion: string | null
  tipo: string
  xp_recompensa: number
  fecha_limite: string | null
}

type Entrega = {
  id: string
  tarea_id: string
  estado: "pendiente" | "enviada" | "aprobada" | "rechazada"
  contenido: string | null
}

type TareaConEntrega = Tarea & { entrega: Entrega | null }

const ESTADO_ETIQUETA: Record<string, { label: string; color: string; bg: string }> = {
  enviada: { label: "Enviada · En revisión", color: "var(--nt-a)", bg: "var(--nt-abg)" },
  aprobada: { label: "Aprobada ✓", color: "var(--nt-g)", bg: "var(--nt-gbg)" },
  rechazada: { label: "Rechazada", color: "var(--nt-r)", bg: "var(--nt-rbg)" },
}

function FormularioEntrega({
  tarea,
  onEnviada,
}: {
  tarea: Tarea
  onEnviada: () => void
}) {
  const [contenido, setContenido] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!contenido.trim()) return
    setCargando(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("No autenticado."); setCargando(false); return }

    const { error: err } = await supabase.from("entregas").insert({
      tarea_id: tarea.id,
      alumno_id: user.id,
      contenido: contenido.trim(),
      estado: "enviada",
    })

    if (err) {
      setError("Error al enviar: " + err.message)
    } else {
      onEnviada()
    }
    setCargando(false)
  }

  return (
    <form onSubmit={enviar} className="mt-4 space-y-3">
      <label className="block">
        <span className="text-xs font-medium" style={{ color: "var(--nt-soft)" }}>
          Tu respuesta
        </span>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={4}
          required
          placeholder="Escribe tu respuesta aquí…"
          className="w-full mt-1 rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={{
            background: "var(--nt-bg)",
            border: "1px solid var(--nt-line)",
            color: "var(--nt-dark)",
          }}
        />
      </label>
      {error && (
        <p className="text-xs" style={{ color: "var(--nt-r)" }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={cargando || !contenido.trim()}
        className="w-full py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
        style={{ background: "var(--nt-mid)", color: "#fff" }}
      >
        {cargando ? "Enviando…" : "Enviar tarea"}
      </button>
    </form>
  )
}

function TarjetaTarea({
  tarea,
  entrega,
  onActualizar,
}: {
  tarea: Tarea
  entrega: Entrega | null
  onActualizar: () => void
}) {
  const [abierta, setAbierta] = useState(false)
  const badge = entrega ? ESTADO_ETIQUETA[entrega.estado] : null

  const hoy = new Date()
  const limite = tarea.fecha_limite ? new Date(tarea.fecha_limite) : null
  const vencida = limite ? limite < hoy : false

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
    >
      <button
        onClick={() => setAbierta((p) => !p)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold" style={{ color: "var(--nt-dark)" }}>
                {tarea.titulo}
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
              >
                +{tarea.xp_recompensa} XP
              </span>
            </div>
            {badge && (
              <span
                className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            )}
            {!entrega && (
              <span
                className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
              >
                Sin entregar
              </span>
            )}
          </div>
          <span className="text-lg shrink-0">{abierta ? "▲" : "▼"}</span>
        </div>
      </button>

      {abierta && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "var(--nt-line)" }}>
          {tarea.descripcion && (
            <p className="text-sm pt-3" style={{ color: "var(--nt-soft)" }}>
              {tarea.descripcion}
            </p>
          )}
          {limite && (
            <p
              className="text-xs"
              style={{ color: vencida ? "var(--nt-r)" : "var(--nt-soft)" }}
            >
              {vencida ? "⚠️ Plazo vencido" : `📅 Hasta: ${limite.toLocaleDateString("es-ES")}`}
            </p>
          )}

          {entrega?.estado === "aprobada" && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}
            >
              ✅ Aprobada · +{tarea.xp_recompensa} XP ganado
            </div>
          )}

          {entrega?.estado === "rechazada" && (
            <div className="space-y-2">
              <div
                className="rounded-xl p-3 text-sm"
                style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
              >
                ❌ Rechazada. Puedes volver a enviarla.
              </div>
              <FormularioEntrega tarea={tarea} onEnviada={onActualizar} />
            </div>
          )}

          {!entrega && !vencida && (
            <FormularioEntrega tarea={tarea} onEnviada={onActualizar} />
          )}

          {!entrega && vencida && (
            <p className="text-sm" style={{ color: "var(--nt-r)" }}>
              El plazo de entrega ha finalizado.
            </p>
          )}

          {entrega?.estado === "enviada" && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}
            >
              ⏳ Tu entrega está pendiente de revisión.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TareasPage() {
  const [tareas, setTareas] = useState<TareaConEntrega[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }

    const [{ data: tareasData }, { data: entregasData }] = await Promise.all([
      supabase.from("tareas").select("*").eq("activa", true).order("created_at"),
      supabase.from("entregas").select("*").eq("alumno_id", user.id),
    ])

    const entregasPorTarea = new Map((entregasData ?? []).map((e) => [e.tarea_id, e]))

    setTareas(
      (tareasData ?? []).map((t) => ({
        ...t,
        entrega: entregasPorTarea.get(t.id) ?? null,
      }))
    )
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const pendientes = tareas.filter((t) => !t.entrega || t.entrega.estado === "rechazada")
  const enviadas = tareas.filter((t) => t.entrega?.estado === "enviada")
  const aprobadas = tareas.filter((t) => t.entrega?.estado === "aprobada")

  return (
    <div className="p-4 max-w-2xl mx-auto pb-safe">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
          Tareas
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
          {tareas.length} tarea{tareas.length !== 1 ? "s" : ""} activa{tareas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {cargando ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--nt-soft)" }}>
          Cargando tareas…
        </div>
      ) : tareas.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
            No hay tareas activas de momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendientes.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--nt-soft)" }}>
                Por entregar ({pendientes.length})
              </h2>
              <div className="space-y-3">
                {pendientes.map((t) => (
                  <TarjetaTarea key={t.id} tarea={t} entrega={t.entrega} onActualizar={cargar} />
                ))}
              </div>
            </section>
          )}

          {enviadas.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--nt-soft)" }}>
                En revisión ({enviadas.length})
              </h2>
              <div className="space-y-3">
                {enviadas.map((t) => (
                  <TarjetaTarea key={t.id} tarea={t} entrega={t.entrega} onActualizar={cargar} />
                ))}
              </div>
            </section>
          )}

          {aprobadas.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--nt-soft)" }}>
                Aprobadas ({aprobadas.length})
              </h2>
              <div className="space-y-3">
                {aprobadas.map((t) => (
                  <TarjetaTarea key={t.id} tarea={t} entrega={t.entrega} onActualizar={cargar} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
