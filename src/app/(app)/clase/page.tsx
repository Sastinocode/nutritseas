import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

type LogroAlumno = {
  logros: { icono: string; nombre: string } | null
}

type PerfilRanking = {
  id: string
  nombre: string
  xp: number
  nivel: number
  racha: number
  rol: string
  logros_alumno: LogroAlumno[]
}

function BarraXP({ xp, max }: { xp: number; max: number }) {
  const pct = max > 0 ? Math.round((xp / max) * 100) : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: "var(--nt-mid)" }}
      />
    </div>
  )
}

function MedallaPos({ pos }: { pos: number }) {
  if (pos === 1) return <span className="text-xl">🥇</span>
  if (pos === 2) return <span className="text-xl">🥈</span>
  if (pos === 3) return <span className="text-xl">🥉</span>
  return (
    <span
      className="text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full"
      style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
    >
      {pos}
    </span>
  )
}

export default async function ClasePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth")

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single()

  const esProfe = perfil?.rol === "profe"

  const { data: ranking } = await supabase
    .from("perfiles")
    .select("id, nombre, xp, nivel, racha, rol, logros_alumno(logros(icono, nombre))")
    .eq("estado", "activo")
    .order("xp", { ascending: false })
    .limit(50)

  const lista = (ranking ?? []) as unknown as PerfilRanking[]
  const maxXP = lista[0]?.xp ?? 1

  return (
    <div className="p-4 max-w-2xl mx-auto pb-safe">
      {esProfe && (
        <Link
          href="/clase/panel"
          className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: "var(--nt-abg)",
            border: "1px solid var(--nt-a)",
            color: "var(--nt-dark)",
          }}
        >
          <span>🎓 Vista del profesor</span>
          <span style={{ color: "var(--nt-mid)" }}>Panel de resultados →</span>
        </Link>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
          Clasificación
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
          Ranking de la clase · {lista.length} alumnos
        </p>
      </div>

      {/* Podio top 3 */}
      {lista.length >= 3 && (
        <div className="flex gap-3 mb-6">
          {[lista[1], lista[0], lista[2]].map((p, i) => {
            const posReal = i === 0 ? 2 : i === 1 ? 1 : 3
            const esYo = p.id === user.id
            return (
              <div
                key={p.id}
                className="flex-1 rounded-2xl p-4 text-center flex flex-col items-center gap-1"
                style={{
                  background: esYo ? "var(--nt-abg)" : "var(--nt-card)",
                  border: `1px solid ${esYo ? "var(--nt-a)" : "var(--nt-line)"}`,
                  marginTop: posReal === 1 ? 0 : 20,
                }}
              >
                <span className="text-2xl">{posReal === 1 ? "🥇" : posReal === 2 ? "🥈" : "🥉"}</span>
                <p className="text-xs font-bold truncate w-full" style={{ color: "var(--nt-dark)" }}>
                  {p.nombre.split(" ")[0]}
                </p>
                <p className="text-sm font-black" style={{ color: "var(--nt-mid)" }}>
                  {p.xp} XP
                </p>
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {p.logros_alumno.slice(0, 3).map((la, j) =>
                    la.logros ? (
                      <span key={j} title={la.logros.nombre} className="text-sm">
                        {la.logros.icono}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lista completa */}
      <div className="space-y-2">
        {lista.map((perfil, idx) => {
          const pos = idx + 1
          const esYo = perfil.id === user.id
          return (
            <div
              key={perfil.id}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: esYo ? "var(--nt-abg)" : "var(--nt-card)",
                border: `1px solid ${esYo ? "var(--nt-a)" : "var(--nt-line)"}`,
              }}
            >
              <MedallaPos pos={pos} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--nt-dark)" }}>
                    {perfil.nombre}
                    {esYo && (
                      <span className="ml-1 text-xs font-normal" style={{ color: "var(--nt-a)" }}>
                        (tú)
                      </span>
                    )}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
                  >
                    Nv. {perfil.nivel}
                  </span>
                  {perfil.racha > 0 && (
                    <span className="text-xs shrink-0" style={{ color: "var(--nt-a)" }}>
                      🔥{perfil.racha}
                    </span>
                  )}
                </div>
                <BarraXP xp={perfil.xp} max={maxXP} />
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-0.5">
                    {perfil.logros_alumno.slice(0, 5).map((la, j) =>
                      la.logros ? (
                        <span key={j} title={la.logros.nombre} className="text-sm">
                          {la.logros.icono}
                        </span>
                      ) : null
                    )}
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--nt-mid)" }}>
                    {perfil.xp} XP
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {lista.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--nt-soft)" }}>
            Aún no hay alumnos registrados.
          </p>
        )}
      </div>
    </div>
  )
}
