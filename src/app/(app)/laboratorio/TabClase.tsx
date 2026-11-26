"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type PlatoAprobado = {
  id: string
  nombre: string
  descripcion: string | null
  kcal_total: number
  p_total: number
  h_total: number
  g_total: number
}

export function TabClase() {
  const [platos, setPlatos]   = useState<PlatoAprobado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from("platos")
      .select("id, nombre, descripcion, kcal_total, p_total, h_total, g_total")
      .eq("estado_aprobacion", "aprobado")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setPlatos(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <p className="text-sm text-center py-6" style={{ color: "var(--nt-soft)" }}>Cargando…</p>
  )

  if (platos.length === 0) return (
    <div className="text-center py-10" style={{ color: "var(--nt-soft)" }}>
      <div className="text-4xl mb-3">🍽️</div>
      <p className="text-sm font-medium">Aún no hay platos aprobados</p>
      <p className="text-xs mt-1">El profe aprueba los platos enviados a reto</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {platos.map(p => (
        <div
          key={p.id}
          className="rounded-xl p-4 border"
          style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm" style={{ color: "var(--nt-dark)" }}>{p.nombre}</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}
            >
              Aprobado
            </span>
          </div>
          {p.descripcion && (
            <p className="text-xs mb-1" style={{ color: "var(--nt-soft)" }}>{p.descripcion}</p>
          )}
          <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
            {p.kcal_total} kcal · P {p.p_total} g · H {p.h_total} g · G {p.g_total} g
          </div>
        </div>
      ))}
    </div>
  )
}
