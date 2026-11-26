"use client"
import { useState, useRef, useEffect } from "react"
import { UserCircle } from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"

export function UserMenu({ nombre }: { nombre: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [open])

  return (
    <div ref={ref} className="lg:hidden fixed top-3 right-3 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de usuario"
        style={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--nt-card)",
          border: "1px solid var(--nt-line)",
          borderRadius: "50%",
          color: "var(--nt-dark)",
        }}
      >
        <UserCircle size={22} strokeWidth={1.7} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl p-3 flex flex-col gap-2"
          style={{
            background: "var(--nt-card)",
            border: "1px solid var(--nt-line)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          {nombre && (
            <p
              className="text-sm font-semibold truncate px-1"
              style={{ color: "var(--nt-dark)" }}
            >
              {nombre}
            </p>
          )}
          <div className="h-px" style={{ background: "var(--nt-line)" }} />
          <SignOutButton />
        </div>
      )}
    </div>
  )
}
