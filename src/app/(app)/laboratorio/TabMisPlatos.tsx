"use client"
import { useEffect, useState } from "react"
import { Trash2, Send, Undo2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Plato = {
  id: string
  nombre: string
  descripcion: string | null
  kcal_total: number
  p_total: number
  h_total: number
  g_total: number
  modo: "personal" | "reto"
  estado_aprobacion: "borrador" | "pendiente" | "aprobado" | "rechazado"
}

const ESTADO_LABEL: Record<string, string> = {
  borrador:  "Borrador",
  pendiente: "Enviado",
  aprobado:  "Aprobado",
  rechazado: "Rechazado",
}

const ESTADO_COLOR: Record<string, { bg: string; color: string }> = {
  borrador:  { bg: "var(--nt-bg)",  color: "var(--nt-soft)" },
  pendiente: { bg: "var(--nt-abg)", color: "var(--nt-a)"    },
  aprobado:  { bg: "var(--nt-gbg)", color: "var(--nt-g)"    },
  rechazado: { bg: "var(--nt-rbg)", color: "var(--nt-r)"    },
}

export function TabMisPlatos() {
  const [platos, setPlatos]   = useState<Plato[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await createClient()
      .from("platos")
      .select("id, nombre, descripcion, kcal_total, p_total, h_total, g_total, modo, estado_aprobacion")
      .order("created_at", { ascending: false })
    setPlatos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function enviarAReto(id: string) {
    await createClient()
      .from("platos")
      .update({ modo: "reto", estado_aprobacion: "pendiente" })
      .eq("id", id)
    await load()
  }

  async function retirar(id: string) {
    await createClient()
      .from("platos")
      .update({ modo: "personal", estado_aprobacion: "borrador" })
      .eq("id", id)
    await load()
  }

  async function del(id: string) {
    await createClient().from("platos").delete().eq("id", id)
    setPlatos(p => p.filter(x => x.id !== id))
  }

  if (loading) return (
    <p className="text-sm text-center py-6" style={{ color: "var(--nt-soft)" }}>Cargando…</p>
  )
  if (platos.length === 0) return (
    <p className="text-sm text-center py-6" style={{ color: "var(--nt-soft)" }}>
      Aún no has creado ningún plato
    </p>
  )

  return (
    <div className="space-y-3">
      {platos.map(p => {
        const c = ESTADO_COLOR[p.estado_aprobacion] ?? ESTADO_COLOR.borrador
        return (
          <div
            key={p.id}
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            <div className="flex items-start gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm" style={{ color: "var(--nt-dark)" }}>
                  {p.nombre}
                </span>
                {p.descripcion && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--nt-soft)" }}>
                    {p.descripcion}
                  </p>
                )}
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                style={{ background: c.bg, color: c.color }}
              >
                {ESTADO_LABEL[p.estado_aprobacion]}
              </span>
            </div>

            <div className="text-xs mb-3" style={{ color: "var(--nt-soft)" }}>
              {p.kcal_total} kcal · P {p.p_total} g · H {p.h_total} g · G {p.g_total} g
            </div>

            <div className="flex gap-2 flex-wrap">
              {p.estado_aprobacion === "borrador" && (
                <button
                  onClick={() => enviarAReto(p.id)}
                  className="flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium"
                  style={{ background: "var(--nt-mid)", color: "#fff", minHeight: 36 }}
                >
                  <Send size={12} /> Enviar a reto
                </button>
              )}
              {p.estado_aprobacion === "pendiente" && (
                <button
                  onClick={() => retirar(p.id)}
                  className="flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium"
                  style={{ background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)", minHeight: 36 }}
                >
                  <Undo2 size={12} /> Retirar
                </button>
              )}
              {p.estado_aprobacion !== "aprobado" && (
                <button
                  onClick={() => del(p.id)}
                  className="flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium"
                  style={{ background: "var(--nt-rbg)", color: "var(--nt-r)", minHeight: 36 }}
                >
                  <Trash2 size={12} /> Borrar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
