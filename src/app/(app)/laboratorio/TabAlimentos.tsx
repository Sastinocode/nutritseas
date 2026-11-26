"use client"
import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { coherenciaEnergetica } from "@/lib/nutricion"

type AlimentoPropio = {
  id: string
  nombre: string
  kcal: number
  p: number
  h: number
  g: number
  coherencia_ok: boolean
}

const EMPTY = { nombre: "", kcal: "", p: "", h: "", g: "" }

const inputSt = {
  background: "var(--nt-bg)",
  border: "1px solid var(--nt-line)",
  color: "var(--nt-dark)",
  borderRadius: "0.75rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
}

export function TabAlimentos() {
  const [alimentos, setAlimentos] = useState<AlimentoPropio[]>([])
  const [form, setForm]           = useState(EMPTY)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  async function load() {
    const sb = createClient()
    const { data } = await sb
      .from("alimentos_propios")
      .select("id, nombre, kcal, p, h, g, coherencia_ok")
      .order("created_at", { ascending: false })
    setAlimentos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function add() {
    const { nombre } = form
    if (!nombre.trim()) return
    const kcal = parseFloat(form.kcal)
    const p    = parseFloat(form.p)
    const h    = parseFloat(form.h)
    const g    = parseFloat(form.g)
    if ([kcal, p, h, g].some(isNaN)) return
    const { ok: coherencia_ok } = coherenciaEnergetica(kcal, p, h, g)
    setSaving(true)
    await createClient()
      .from("alimentos_propios")
      .insert({ nombre: nombre.trim(), kcal, p, h, g, coherencia_ok })
    setForm(EMPTY)
    await load()
    setSaving(false)
  }

  async function del(id: string) {
    await createClient().from("alimentos_propios").delete().eq("id", id)
    setAlimentos(a => a.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Formulario */}
      <div
        className="rounded-xl p-4 border space-y-3"
        style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
      >
        <h3 className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>
          Añadir alimento (valores por 100 g)
        </h3>
        <input
          placeholder="Nombre del alimento"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          style={{ ...inputSt, width: "100%" }}
        />
        <div className="grid grid-cols-4 gap-2">
          {(["kcal", "p", "h", "g"] as const).map(field => (
            <div key={field}>
              <div className="text-xs mb-1" style={{ color: "var(--nt-soft)" }}>
                {field === "kcal" ? "kcal" : field === "p" ? "Prot g" : field === "h" ? "Hid g" : "Gras g"}
              </div>
              <input
                type="number" min={0} step="0.1" placeholder="0"
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                style={inputSt}
              />
            </div>
          ))}
        </div>
        <button
          onClick={add}
          disabled={saving}
          className="w-full py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "var(--nt-dark)", opacity: saving ? 0.5 : 1, minHeight: 44 }}
        >
          {saving ? "Guardando…" : "Añadir alimento"}
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--nt-soft)" }}>Cargando…</p>
      ) : alimentos.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--nt-soft)" }}>
          Aún no tienes alimentos propios
        </p>
      ) : (
        <div className="space-y-2">
          {alimentos.map(a => (
            <div
              key={a.id}
              className="rounded-xl p-3 border flex items-center gap-3"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: "var(--nt-dark)" }}>
                    {a.nombre}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                    style={a.coherencia_ok
                      ? { background: "var(--nt-gbg)", color: "var(--nt-g)" }
                      : { background: "var(--nt-abg)", color: "var(--nt-a)" }
                    }
                  >
                    {a.coherencia_ok ? "OK" : "Rev."}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>
                  {a.kcal} kcal · P {a.p} g · H {a.h} g · G {a.g} g
                </div>
              </div>
              <button
                onClick={() => del(a.id)}
                style={{ color: "var(--nt-soft)", minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
