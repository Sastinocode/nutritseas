"use client"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useNutriStore } from "@/lib/store"

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()
  const resetAll = useNutriStore((s) => s.resetAll)

  async function handleSignOut() {
    resetAll()
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-sm font-medium"
      style={{
        minHeight: 44,
        color: "var(--nt-r)",
        background: "var(--nt-rbg)",
        borderRadius: 10,
        border: "none",
      }}
    >
      Cerrar sesión
    </button>
  )
}
