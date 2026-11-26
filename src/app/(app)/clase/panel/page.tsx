"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const supabase = createClient()

type Alumno = {
  id: string
  nombre: string
  xp: number
  nivel: number
  racha: number
  estado: string
}

type EntregaPendiente = {
  id: string
  contenido: string | null
  estado: string
  created_at: string
  alumno_id: string
  alumno_nombre: string
  tarea_id: string
  tarea_titulo: string
  tarea_xp: number
}

type LogroDisponible = {
  id: string
  nombre: string
  icono: string
  manual: boolean
}

function BarraXP({ xp, nivel }: { xp: number; nivel: number }) {
  const xpEnNivel = xp % 100
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "var(--nt-soft)" }}>
        <span>Nv. {nivel}</span>
        <span>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${xpEnNivel}%`, background: "var(--nt-mid)" }}
        />
      </div>
    </div>
  )
}

export default function PanelPage() {
  const router = useRouter()

  const [verificando, setVerificando] = useState(true)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [entregas, setEntregas] = useState<EntregaPendiente[]>([])
  const [logros, setLogros] = useState<LogroDisponible[]>([])
  const [procesando, setProcesando] = useState<string | null>(null)
  const [logrosAlumnos, setLogrosAlumnos] = useState<Map<string, string[]>>(new Map())

  const cargar = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace("/auth"); return }

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single()

    if (!perfil || perfil.rol !== "profe") {
      router.replace("/")
      return
    }

    setVerificando(false)

    // Cargar alumnos ordenados por XP
    const { data: alumnosData } = await supabase
      .from("perfiles")
      .select("id, nombre, xp, nivel, racha, estado")
      .neq("rol", "profe")
      .order("xp", { ascending: false })

    setAlumnos(alumnosData ?? [])

    // Cargar logros de cada alumno
    if (alumnosData && alumnosData.length > 0) {
      const alumnoIds = alumnosData.map((a) => a.id)
      const { data: logrosAlumnosData } = await supabase
        .from("logros_alumno")
        .select("alumno_id, logros(nombre)")
        .in("alumno_id", alumnoIds)

      const mapa = new Map<string, string[]>()
      for (const la of logrosAlumnosData ?? []) {
        const nombres = mapa.get(la.alumno_id) ?? []
        if (la.logros && typeof la.logros === "object" && "nombre" in la.logros) {
          nombres.push((la.logros as { nombre: string }).nombre)
        }
        mapa.set(la.alumno_id, nombres)
      }
      setLogrosAlumnos(mapa)
    }

    // Cargar entregas pendientes con info de alumno y tarea
    const { data: entregasData } = await supabase
      .from("entregas")
      .select("id, contenido, estado, created_at, alumno_id, tarea_id, perfiles(nombre), tareas(titulo, xp_recompensa)")
      .eq("estado", "enviada")
      .order("created_at", { ascending: true })

    setEntregas(
      (entregasData ?? []).map((e) => ({
        id: e.id,
        contenido: e.contenido,
        estado: e.estado,
        created_at: e.created_at,
        alumno_id: e.alumno_id,
        alumno_nombre: (e.perfiles as unknown as { nombre: string } | null)?.nombre ?? "Desconocido",
        tarea_id: e.tarea_id,
        tarea_titulo: (e.tareas as unknown as { titulo: string } | null)?.titulo ?? "Sin título",
        tarea_xp: (e.tareas as unknown as { xp_recompensa: number } | null)?.xp_recompensa ?? 0,
      }))
    )

    // Cargar logros manuales disponibles
    const { data: logrosData } = await supabase
      .from("logros")
      .select("id, nombre, icono, manual")
      .eq("manual", true)

    setLogros(logrosData ?? [])
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  async function cambiarBloqueo(alumnoId: string, bloquear: boolean) {
    setProcesando(alumnoId)
    await supabase
      .from("perfiles")
      .update({ estado: bloquear ? "bloqueado" : "activo" })
      .eq("id", alumnoId)
    await cargar()
    setProcesando(null)
  }

  async function aprobarEntrega(entregaId: string, xp: number) {
    setProcesando(entregaId)
    await supabase.rpc("fn_aprobar_entrega", { p_entrega_id: entregaId, p_xp: xp })
    await cargar()
    setProcesando(null)
  }

  async function rechazarEntrega(entregaId: string) {
    setProcesando(entregaId)
    await supabase.from("entregas").update({ estado: "rechazada" }).eq("id", entregaId)
    await cargar()
    setProcesando(null)
  }

  async function asignarLogro(alumnoId: string, logroId: string) {
    await supabase.rpc("fn_asignar_logro", { p_alumno_id: alumnoId, p_logro_id: logroId })
    await cargar()
  }

  if (verificando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm" style={{ color: "var(--nt-soft)" }}>Verificando acceso…</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-3xl mx-auto pb-safe space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
          Panel del profesor
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
          {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} · {entregas.length} entrega{entregas.length !== 1 ? "s" : ""} pendiente{entregas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Entregas pendientes */}
      {entregas.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-3" style={{ color: "var(--nt-dark)" }}>
            📋 Entregas por revisar
          </h2>
          <div className="space-y-3">
            {entregas.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl p-4 space-y-3"
                style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--nt-dark)" }}>
                      {e.alumno_nombre}
                    </p>
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      {e.tarea_titulo} · +{e.tarea_xp} XP
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: "var(--nt-soft)" }}>
                    {new Date(e.created_at).toLocaleDateString("es-ES")}
                  </span>
                </div>

                {e.contenido && (
                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{ background: "var(--nt-bg)", color: "var(--nt-dark)" }}
                  >
                    {e.contenido}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => aprobarEntrega(e.id, e.tarea_xp)}
                    disabled={procesando === e.id}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                    style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={() => rechazarEntrega(e.id)}
                    disabled={procesando === e.id}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                    style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ranking de alumnos */}
      <section>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--nt-dark)" }}>
          🏅 Progreso de alumnos
        </h2>
        <div className="space-y-3">
          {alumnos.map((a, idx) => (
            <div
              key={a.id}
              className="rounded-2xl p-4"
              style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full shrink-0"
                  style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--nt-dark)" }}>
                    {a.nombre}
                  </p>
                  {logrosAlumnos.get(a.id)?.slice(0, 3).map((n, i) => (
                    <span key={i} className="text-xs mr-1" style={{ color: "var(--nt-soft)" }}>
                      {n}
                    </span>
                  ))}
                </div>
                {a.racha > 0 && (
                  <span className="text-xs" style={{ color: "var(--nt-a)" }}>🔥{a.racha}</span>
                )}
                <button
                  onClick={() => cambiarBloqueo(a.id, a.estado !== "bloqueado")}
                  disabled={procesando === a.id}
                  className="text-xs px-2 py-1 rounded-full disabled:opacity-50"
                  style={
                    a.estado === "bloqueado"
                      ? { background: "var(--nt-rbg)", color: "var(--nt-r)", border: "1px solid var(--nt-line)" }
                      : { background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
                  }
                  title={a.estado === "bloqueado" ? "Devolverle el acceso" : "Quitarle el acceso a la app"}
                >
                  {a.estado === "bloqueado" ? "🔓 Desbloquear" : "🚫 Bloquear"}
                </button>
              </div>
              <BarraXP xp={a.xp} nivel={a.nivel} />

              {/* Logros manuales */}
              {logros.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {logros.map((l) => {
                    const yaLoTiene = logrosAlumnos.get(a.id)?.includes(l.nombre)
                    return (
                      <button
                        key={l.id}
                        onClick={() => !yaLoTiene && asignarLogro(a.id, l.id)}
                        disabled={yaLoTiene}
                        className="text-xs px-2 py-1 rounded-full disabled:opacity-40"
                        style={{
                          background: yaLoTiene ? "var(--nt-gbg)" : "var(--nt-bg)",
                          color: yaLoTiene ? "var(--nt-g)" : "var(--nt-soft)",
                          border: "1px solid var(--nt-line)",
                        }}
                        title={yaLoTiene ? "Ya tiene este logro" : `Dar logro: ${l.nombre}`}
                      >
                        {l.icono} {l.nombre}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {alumnos.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--nt-soft)" }}>
              No hay alumnos registrados aún.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
