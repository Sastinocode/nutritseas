"use client"
import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type AlimentoOpc = {
  id: string; nombre: string
  kcal: number; p: number; h: number; g: number
}

type Ingrediente = {
  nombre: string; cantidad_g: number
  kcal_100: number; p_100: number; h_100: number; g_100: number
}

function macros(ing: Ingrediente) {
  const f = ing.cantidad_g / 100
  return {
    kcal: Math.round(ing.kcal_100 * f * 10) / 10,
    p:    Math.round(ing.p_100   * f * 10) / 10,
    h:    Math.round(ing.h_100   * f * 10) / 10,
    g:    Math.round(ing.g_100   * f * 10) / 10,
  }
}

const inputSt = {
  background: "var(--nt-bg)",
  border: "1px solid var(--nt-line)",
  color: "var(--nt-dark)",
  borderRadius: "0.75rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
}

export function TabCrearPlato() {
  const [alimentos, setAlimentos]       = useState<AlimentoOpc[]>([])
  const [nombre, setNombre]             = useState("")
  const [descripcion, setDescripcion]   = useState("")
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [selId, setSelId]               = useState("")
  const [cantidad, setCantidad]         = useState("")
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)

  useEffect(() => {
    createClient()
      .from("alimentos_propios")
      .select("id, nombre, kcal, p, h, g")
      .order("nombre")
      .then(({ data }) => setAlimentos(data ?? []))
  }, [])

  function addIngrediente() {
    const alim = alimentos.find(a => a.id === selId)
    const cant = parseFloat(cantidad)
    if (!alim || isNaN(cant) || cant <= 0) return
    setIngredientes(prev => [
      ...prev,
      { nombre: alim.nombre, cantidad_g: cant, kcal_100: alim.kcal, p_100: alim.p, h_100: alim.h, g_100: alim.g },
    ])
    setCantidad("")
  }

  const totales = ingredientes.reduce(
    (acc, ing) => { const m = macros(ing); return { kcal: acc.kcal + m.kcal, p: acc.p + m.p, h: acc.h + m.h, g: acc.g + m.g } },
    { kcal: 0, p: 0, h: 0, g: 0 }
  )

  async function guardar() {
    if (!nombre.trim() || ingredientes.length === 0) return
    setSaving(true)
    await createClient().from("platos").insert({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      ingredientes,
      kcal_total: Math.round(totales.kcal),
      p_total:    Math.round(totales.p * 10) / 10,
      h_total:    Math.round(totales.h * 10) / 10,
      g_total:    Math.round(totales.g * 10) / 10,
      modo: "personal",
      estado_aprobacion: "borrador",
    })
    setNombre(""); setDescripcion(""); setIngredientes([])
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4">
      {alimentos.length === 0 && (
        <div className="rounded-xl p-4 text-sm" style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}>
          Primero añade alimentos en la pestaña «Mis alimentos»
        </div>
      )}

      <div className="rounded-xl p-4 border space-y-3" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
        <h3 className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>Nombre del plato</h3>
        <input
          placeholder="Ej. Arroz con pollo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ ...inputSt, width: "100%" }}
        />
        <input
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          style={{ ...inputSt, width: "100%" }}
        />
      </div>

      {alimentos.length > 0 && (
        <div className="rounded-xl p-4 border space-y-3" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>Añadir ingrediente</h3>
          <select
            value={selId}
            onChange={e => setSelId(e.target.value)}
            style={{ ...inputSt, width: "100%" }}
          >
            <option value="">Selecciona un alimento…</option>
            {alimentos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          <div className="flex gap-2">
            <input
              type="number" min={1} step="1" placeholder="Gramos"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              style={{ ...inputSt, flex: 1 }}
            />
            <button
              onClick={addIngrediente}
              className="px-4 rounded-xl text-sm font-medium text-white shrink-0"
              style={{ background: "var(--nt-mid)", minHeight: 44 }}
            >
              Añadir
            </button>
          </div>

          {ingredientes.length > 0 && (
            <div className="space-y-1 pt-1">
              {ingredientes.map((ing, i) => {
                const m = macros(ing)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs py-1">
                    <span className="flex-1 font-medium" style={{ color: "var(--nt-dark)" }}>
                      {ing.nombre}
                      <span className="font-normal ml-1" style={{ color: "var(--nt-soft)" }}>
                        ({ing.cantidad_g} g)
                      </span>
                    </span>
                    <span style={{ color: "var(--nt-soft)" }}>{m.kcal} kcal</span>
                    <button
                      onClick={() => setIngredientes(prev => prev.filter((_, j) => j !== i))}
                      style={{ color: "var(--nt-soft)", padding: 6, minHeight: 36, display: "flex", alignItems: "center" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}

              <div
                className="grid grid-cols-4 gap-1 pt-2 mt-1 text-xs text-center border-t"
                style={{ borderColor: "var(--nt-line)" }}
              >
                {[
                  { l: "Kcal", v: Math.round(totales.kcal) },
                  { l: "P",    v: `${Math.round(totales.p * 10) / 10} g` },
                  { l: "H",    v: `${Math.round(totales.h * 10) / 10} g` },
                  { l: "G",    v: `${Math.round(totales.g * 10) / 10} g` },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div className="font-bold" style={{ color: "var(--nt-dark)" }}>{v}</div>
                    <div style={{ color: "var(--nt-soft)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {saved && (
        <div className="rounded-xl p-3 text-sm text-center" style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}>
          Plato guardado correctamente
        </div>
      )}

      <button
        onClick={guardar}
        disabled={saving || !nombre.trim() || ingredientes.length === 0}
        className="w-full py-3 rounded-xl font-semibold text-white"
        style={{
          background: "var(--nt-dark)",
          opacity: (saving || !nombre.trim() || ingredientes.length === 0) ? 0.4 : 1,
          minHeight: 48,
        }}
      >
        {saving ? "Guardando…" : "Guardar plato"}
      </button>
    </div>
  )
}
