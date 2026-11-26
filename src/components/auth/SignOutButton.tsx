"use client"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm underline"
      style={{ color: "var(--nt-mid)" }}
    >
      Cerrar sesión
    </button>
  )
}
