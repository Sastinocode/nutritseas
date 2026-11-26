import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { UserMenu } from "./UserMenu"
import { SignOutButton } from "@/components/auth/SignOutButton"

export async function NavShell() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  let { data: perfil, error } = await supabase
    .from("perfiles")
    .select("estado, rol, nombre")
    .eq("id", user.id)
    .maybeSingle()

  // Red de seguridad: normalmente el trigger de Supabase ya ha creado el perfil al registrarse.
  if (!perfil && !error) {
    const nombre =
      (user.user_metadata?.nombre as string | undefined)?.trim() ||
      (user.email ?? "alumno").split("@")[0]
    await supabase
      .from("perfiles")
      .upsert({ id: user.id, nombre }, { onConflict: "id", ignoreDuplicates: true })
    ;({ data: perfil, error } = await supabase
      .from("perfiles")
      .select("estado, rol, nombre")
      .eq("id", user.id)
      .maybeSingle())
  }

  if (error || !perfil) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-8"
        style={{ background: "var(--nt-bg)" }}
      >
        <div className="text-5xl">⚠️</div>
        <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
          No hemos podido cargar tu perfil
        </h1>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: "var(--nt-mid)" }}
        >
          Recarga la página. Si sigue pasando, avisa a tu profesor.
          {error ? ` (${error.message})` : ""}
        </p>
        <SignOutButton />
      </div>
    )
  }

  const esProfe = perfil.rol === "profe"

  if (perfil.estado === "bloqueado") {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-8"
        style={{ background: "var(--nt-bg)" }}
      >
        <div className="text-5xl">🚫</div>
        <h1 className="text-xl font-bold" style={{ color: "var(--nt-r)" }}>
          Cuenta bloqueada
        </h1>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: "var(--nt-mid)" }}
        >
          Tu cuenta ha sido bloqueada. Contacta con tu profesor.
        </p>
        <SignOutButton />
      </div>
    )
  }

  const nombre = perfil.nombre ?? ""

  return (
    <>
      <Sidebar esProfe={esProfe} nombre={nombre} />
      <BottomNav esProfe={esProfe} />
      <UserMenu nombre={nombre} />
    </>
  )
}
