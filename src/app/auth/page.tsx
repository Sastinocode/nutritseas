"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Modo = "login" | "registro"

export default function AuthPage() {
  const [modo, setModo] = useState<Modo>("login")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mensajeOk, setMensajeOk] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    })
    if (error) {
      setError("Correo o contraseña incorrectos.")
    } else {
      router.push("/")
      router.refresh()
    }
    setCargando(false)
  }

  async function handleRegistro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const nombre = (form.get("nombre") as string).trim()
    const email = form.get("email") as string
    const password = form.get("password") as string
    const supabase = createClient()

    // El perfil (alumno, activo) lo crea un trigger de Supabase al registrarse.
    const { data, error: errAuth } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    })
    if (errAuth) {
      setError(
        errAuth.message.includes("already registered")
          ? "Ese correo ya tiene cuenta. Inicia sesión."
          : errAuth.message
      )
      setCargando(false)
      return
    }

    if (data.session && data.user) {
      await supabase
        .from("perfiles")
        .upsert({ id: data.user.id, nombre }, { onConflict: "id", ignoreDuplicates: true })
      router.push("/")
      router.refresh()
    } else {
      // 2b. Email confirmation activo → mostrar mensaje
      setMensajeOk(
        "¡Listo! Revisa tu correo y confirma tu cuenta. Después vuelve aquí a iniciar sesión."
      )
    }
    setCargando(false)
  }

  if (mensajeOk) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--nt-bg)" }}
      >
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="text-5xl">📧</div>
          <p
            className="text-base font-medium"
            style={{ color: "var(--nt-dark)" }}
          >
            {mensajeOk}
          </p>
          <button
            onClick={() => {
              setMensajeOk(null)
              setModo("login")
            }}
            className="text-sm underline"
            style={{ color: "var(--nt-mid)" }}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--nt-bg)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-sm p-8 space-y-6"
        style={{
          background: "var(--nt-card)",
          border: "1px solid var(--nt-line)",
        }}
      >
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="text-4xl">🥗</div>
          <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
            NutriTSEAS
          </h1>
          <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
            Nutrición deportiva · Ciclo TSEAS
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-lg overflow-hidden text-sm font-medium"
          style={{ border: "1px solid var(--nt-line)" }}
        >
          {(["login", "registro"] as Modo[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setModo(m)
                setError(null)
              }}
              className="flex-1 py-2 transition-colors"
              style={
                modo === m
                  ? { background: "var(--nt-mid)", color: "#fff" }
                  : { color: "var(--nt-mid)" }
              }
            >
              {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-sm rounded-lg p-3"
            style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
          >
            {error}
          </p>
        )}

        {modo === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Campo label="Correo electrónico" name="email" type="email" />
            <Campo label="Contraseña" name="password" type="password" />
            <BtnSubmit cargando={cargando} label="Entrar" />
          </form>
        ) : (
          <form onSubmit={handleRegistro} className="space-y-4">
            <Campo label="Tu nombre completo" name="nombre" type="text" />
            <Campo label="Correo electrónico" name="email" type="email" />
            <Campo
              label="Contraseña (mín. 6 caracteres)"
              name="password"
              type="password"
              minLength={6}
            />
            <BtnSubmit cargando={cargando} label="Crear cuenta" />
          </form>
        )}

        <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
          Solo tu nombre y tu progreso se guardan en la clase. Tus datos de peso, talla o edad se quedan en tu móvil.
        </p>
      </div>
    </div>
  )
}

function Campo({
  label,
  name,
  type,
  minLength,
  maxLength,
  required = true,
}: {
  label: string
  name: string
  type: string
  minLength?: number
  maxLength?: number
  required?: boolean
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium" style={{ color: "var(--nt-dark)" }}>
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-1"
        style={{
          background: "var(--nt-bg)",
          border: "1px solid var(--nt-line)",
          color: "var(--nt-dark)",
        }}
      />
    </label>
  )
}

function BtnSubmit({
  cargando,
  label,
}: {
  cargando: boolean
  label: string
}) {
  return (
    <button
      type="submit"
      disabled={cargando}
      className="w-full py-2 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50"
      style={{ background: "var(--nt-mid)", color: "#fff" }}
    >
      {cargando ? "Cargando…" : label}
    </button>
  )
}
