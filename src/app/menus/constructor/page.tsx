"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ALIMENTOS, GRUPOS, type Alimento } from "@/data/alimentos";
import { PERFILES, type Perfil } from "@/data/perfiles";
import { calcNutri, type MenuItem, type NutriTotal } from "@/lib/constructor";
import { ChevronLeft, X, Search, Plus, Minus, ChefHat, ChevronDown } from "lucide-react";

const MICROS_REF: { key: keyof NutriTotal; label: string; unit: string; ref: number }[] = [
  { key: "fe",  label: "Hierro",   unit: "mg", ref: 14 },
  { key: "ca",  label: "Calcio",   unit: "mg", ref: 800 },
  { key: "vd",  label: "Vit. D",   unit: "μg", ref: 5 },
  { key: "b12", label: "Vit. B12", unit: "μg", ref: 2.5 },
];

type ItemComida = { alimento: Alimento; gramos: number };
type Slot = { nombre: string; emoji: string; items: ItemComida[] };

const SLOTS_5: Array<[string, string]> = [
  ["Desayuno", "🌅"],
  ["Media mañana", "🍎"],
  ["Comida", "🍽️"],
  ["Merienda / Pre-entreno", "⚡"],
  ["Cena", "🌙"],
];
const SLOTS_4: Array<[string, string]> = [
  ["Desayuno", "🌅"],
  ["Comida", "🍽️"],
  ["Merienda", "⚡"],
  ["Cena", "🌙"],
];

function getSlots(n: number): Array<[string, string]> {
  return (n <= 4 ? SLOTS_4 : SLOTS_5).slice(0, n);
}

function conflicta(a: Alimento, restricciones: string[]): boolean {
  for (const r of restricciones) {
    if (r === "vegetariano" && (a.grupo === "Carnes" || a.grupo === "Pescados y mariscos")) return true;
    if (r === "sin lactosa" && a.grupo === "Huevos y lácteos" && a.id !== "huevo") return true;
  }
  return false;
}

function KcalRing({ kcal, objetivo }: { kcal: number; objetivo: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(kcal / objetivo, 1.4);
  const dash = pct * circ;
  const color = pct > 1.1 ? "var(--nt-r)" : pct >= 0.8 ? "var(--nt-g)" : "var(--nt-a)";
  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="var(--nt-line)" strokeWidth="10" />
        {kcal > 0 && (
          <circle
            cx="56" cy="56" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 56 56)"
            style={{ transition: "stroke-dasharray 0.4s ease, stroke 0.4s ease" }}
          />
        )}
      </svg>
      <div className="absolute text-center leading-tight">
        <div className="text-lg font-bold" style={{ color: "var(--nt-dark)" }}>{Math.round(kcal)}</div>
        <div className="text-[11px]" style={{ color: "var(--nt-soft)" }}>/ {objetivo} kcal</div>
      </div>
    </div>
  );
}

export default function ConstructorPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotActivo, setSlotActivo] = useState(0);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");
  const [detalle, setDetalle] = useState(false);

  function seleccionarPerfil(p: Perfil) {
    setSlots(getSlots(p.comidas).map(([nombre, emoji]) => ({ nombre, emoji, items: [] })));
    setPerfil(p);
    setSlotActivo(0);
  }

  const todosLosItems: MenuItem[] = useMemo(
    () => slots.flatMap(s => s.items.map(i => ({ alimento: i.alimento, gramos: i.gramos }))),
    [slots],
  );
  const total = useMemo(() => calcNutri(todosLosItems), [todosLosItems]);

  const alimentosFiltrados = useMemo(() => ALIMENTOS.filter(a => {
    if (grupoFiltro && a.grupo !== grupoFiltro) return false;
    if (busqueda) return a.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return true;
  }), [busqueda, grupoFiltro]);

  function addAlimento(a: Alimento) {
    setSlots(prev => prev.map((s, i) => {
      if (i !== slotActivo) return s;
      const idx = s.items.findIndex(it => it.alimento.id === a.id);
      if (idx >= 0) {
        const newItems = [...s.items];
        newItems[idx] = { ...newItems[idx], gramos: newItems[idx].gramos + a.porcion };
        return { ...s, items: newItems };
      }
      return { ...s, items: [...s.items, { alimento: a, gramos: a.porcion }] };
    }));
  }

  function changeGramos(si: number, ii: number, delta: number) {
    setSlots(prev => prev.map((s, i) => {
      if (i !== si) return s;
      const newItems = [...s.items];
      const newGramos = Math.max(0, newItems[ii].gramos + delta);
      if (newGramos === 0) return { ...s, items: newItems.filter((_, j) => j !== ii) };
      newItems[ii] = { ...newItems[ii], gramos: newGramos };
      return { ...s, items: newItems };
    }));
  }

  function removeItem(si: number, ii: number) {
    setSlots(prev => prev.map((s, i) =>
      i !== si ? s : { ...s, items: s.items.filter((_, j) => j !== ii) }
    ));
  }

  // ─── SELECTOR DE PERFIL ──────────────────────────────────────
  if (!perfil) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/menus" className="p-1 rounded-lg" style={{ color: "var(--nt-soft)" }}>
            <ChevronLeft size={20} />
          </Link>
          <ChefHat size={22} style={{ color: "var(--nt-mid)" }} />
          <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>Constructor de menús</h1>
        </div>
        <p className="text-sm mb-5 ml-9" style={{ color: "var(--nt-soft)" }}>
          Elige un perfil para empezar el reto
        </p>

        <div className="space-y-3">
          {PERFILES.map(p => (
            <button
              key={p.id}
              onClick={() => seleccionarPerfil(p)}
              className="w-full text-left rounded-xl p-4 border transition-colors"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>{p.nombre}</div>
                  <div className="text-xs mb-1" style={{ color: "var(--nt-mid)" }}>{p.titulo}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--nt-soft)" }}>{p.contexto}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-bold" style={{ color: "var(--nt-dark)" }}>{p.kcal_objetivo} kcal</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>{p.comidas} comidas/día</div>
                  {p.restricciones.length > 0 && (
                    <span
                      className="inline-block text-xs mt-1 px-2 py-0.5 rounded-full"
                      style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}
                    >
                      {p.restricciones.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "var(--nt-soft)" }}>
          Orientativo, para adultos sanos. No sustituye a un dietista-nutricionista.
        </p>
      </div>
    );
  }

  // ─── CONSTRUCTOR ─────────────────────────────────────────────
  const pMin = perfil.proteina_g_kg[0] * perfil.peso_kg;
  const pMax = perfil.proteina_g_kg[1] * perfil.peso_kg;
  const hidratosRef = (perfil.kcal_objetivo * 0.5) / 4;

  return (
    <div className="max-w-2xl mx-auto pb-44">
      {/* Cabecera fija */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-2"
        style={{ background: "var(--nt-bg)", borderBottom: "1px solid var(--nt-line)" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={() => setPerfil(null)}
            className="p-1 rounded-lg flex-shrink-0"
            style={{ color: "var(--nt-soft)" }}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: "var(--nt-dark)" }}>{perfil.nombre}</div>
            <div className="text-xs truncate" style={{ color: "var(--nt-soft)" }}>{perfil.titulo}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs font-bold" style={{ color: "var(--nt-dark)" }}>{perfil.kcal_objetivo} kcal</div>
            <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
              prot {perfil.proteina_g_kg[0]}–{perfil.proteina_g_kg[1]} g/kg
            </div>
          </div>
        </div>
        <div
          className="text-xs rounded-lg px-3 py-1.5 ml-8"
          style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}
        >
          🎯 {perfil.tarea}
        </div>
      </div>

      {/* Comidas del día */}
      <div className="px-4 pt-4 space-y-3">
        {slots.map((s, si) => {
          const kcalSlot = s.items.reduce((acc, it) => acc + (it.alimento.kcal * it.gramos) / 100, 0);
          const isActive = slotActivo === si && selectorAbierto;
          return (
            <div
              key={si}
              className="rounded-xl border overflow-hidden"
              style={{
                background: "var(--nt-card)",
                borderColor: isActive ? "var(--nt-mid)" : "var(--nt-line)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() => { setSlotActivo(si); setSelectorAbierto(true); setBusqueda(""); setGrupoFiltro(""); }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <span className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>{s.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  {kcalSlot > 0 && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--nt-light)", color: "var(--nt-mid)" }}
                    >
                      {Math.round(kcalSlot)} kcal
                    </span>
                  )}
                  <span
                    className="text-xs rounded-lg px-2 py-1 font-medium"
                    style={{ background: "var(--nt-dark)", color: "#fff" }}
                  >
                    + añadir
                  </span>
                </div>
              </button>

              {s.items.length > 0 && (
                <div className="border-t px-4 py-2 space-y-2" style={{ borderColor: "var(--nt-line)" }}>
                  {s.items.map((it, ii) => {
                    const conflict = conflicta(it.alimento, perfil.restricciones);
                    return (
                      <div key={ii} className="flex items-center gap-2">
                        <span className="text-base w-7 text-center flex-shrink-0">{it.alimento.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-xs font-medium truncate"
                            style={{ color: conflict ? "var(--nt-r)" : "var(--nt-dark)" }}
                          >
                            {it.alimento.nombre}{conflict ? " ⚠️" : ""}
                          </div>
                          <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                            {it.gramos} g · {Math.round(it.alimento.kcal * it.gramos / 100)} kcal
                            · P {(it.alimento.p * it.gramos / 100).toFixed(1)} g
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => changeGramos(si, ii, -it.alimento.porcion)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "var(--nt-light)", color: "var(--nt-dark)" }}
                          >
                            <Minus size={11} />
                          </button>
                          <button
                            onClick={() => changeGramos(si, ii, it.alimento.porcion)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "var(--nt-light)", color: "var(--nt-dark)" }}
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            onClick={() => removeItem(si, ii)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Botón detalle */}
        <button
          onClick={() => setDetalle(d => !d)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-xl"
          style={{ background: "var(--nt-card)", color: "var(--nt-mid)", border: "1px solid var(--nt-line)" }}
        >
          <ChevronDown
            size={14}
            style={{ transform: detalle ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
          {detalle ? "Ocultar detalle" : "Ver micronutrientes y reparto"}
        </button>

        {detalle && (
          <div className="rounded-xl border p-4 space-y-5" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
            {/* Reparto de kcal por comida */}
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>Reparto de kcal por comida</div>
              <div className="space-y-2">
                {slots.map((s, si) => {
                  const kcalSlot = s.items.reduce((acc, it) => acc + (it.alimento.kcal * it.gramos) / 100, 0);
                  const pct = perfil.kcal_objetivo > 0 ? Math.min(1, kcalSlot / perfil.kcal_objetivo) : 0;
                  return (
                    <div key={si}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--nt-soft)" }}>{s.emoji} {s.nombre}</span>
                        <span style={{ color: "var(--nt-dark)" }}>
                          {Math.round(kcalSlot)} kcal · {(pct * 100).toFixed(0)} %
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct * 100}%`, background: "var(--nt-mid)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micronutrientes clave */}
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>Micronutrientes clave</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {MICROS_REF.map(({ key, label, unit, ref }) => {
                  const val = total[key] as number;
                  const pct = Math.min(1, val / ref);
                  const luz = pct >= 0.75 ? "var(--nt-g)" : pct >= 0.4 ? "var(--nt-a)" : "var(--nt-r)";
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--nt-soft)" }}>{label}</span>
                        <span style={{ color: "var(--nt-dark)" }}>
                          {val.toFixed(1)}/{ref} {unit}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct * 100}%`, background: luz }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs mt-3" style={{ color: "var(--nt-soft)" }}>
                Ref. adulto (NRV UE). Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-center pb-2" style={{ color: "var(--nt-soft)" }}>
          Orientativo. No sustituye a un dietista-nutricionista.
        </p>
      </div>

      {/* Panel fijo: anillo kcal + barras de macros */}
      <div
        className="fixed bottom-[60px] left-0 right-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{
          background: "var(--nt-card)",
          borderTop: "1px solid var(--nt-line)",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.07)",
        }}
      >
        <KcalRing kcal={total.kcal} objetivo={perfil.kcal_objetivo} />

        <div className="flex-1 space-y-1.5 min-w-0">
          {/* Proteína */}
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span style={{ color: "var(--nt-soft)" }}>Proteína</span>
              <span style={{ color: "var(--nt-dark)" }}>
                {total.p.toFixed(1)} / {pMin.toFixed(0)}–{pMax.toFixed(0)} g
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (total.p / pMax) * 100)}%`,
                  background: total.p >= pMin ? "var(--nt-g)" : "var(--nt-a)",
                }}
              />
            </div>
          </div>

          {/* Hidratos */}
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span style={{ color: "var(--nt-soft)" }}>Hidratos</span>
              <span style={{ color: "var(--nt-dark)" }}>{total.c.toFixed(0)} g</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (total.c / hidratosRef) * 100)}%`,
                  background: "var(--nt-carb)",
                }}
              />
            </div>
          </div>

          {/* Fibra */}
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span style={{ color: "var(--nt-soft)" }}>Fibra</span>
              <span style={{ color: "var(--nt-dark)" }}>
                {total.fib.toFixed(1)} / {perfil.fibra_min_g} g
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (total.fib / perfil.fibra_min_g) * 100)}%`,
                  background: total.fib >= perfil.fibra_min_g ? "var(--nt-g)" : "var(--nt-a)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet: selector de alimentos */}
      {selectorAbierto && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setSelectorAbierto(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col rounded-t-2xl"
            style={{ background: "var(--nt-bg)", maxHeight: "78vh" }}
          >
            {/* Cabecera del sheet */}
            <div
              className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--nt-line)" }}
            >
              <div>
                <div className="font-bold text-sm" style={{ color: "var(--nt-dark)" }}>
                  {slots[slotActivo]?.emoji} {slots[slotActivo]?.nombre}
                </div>
                <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                  Toca para añadir (una porción)
                </div>
              </div>
              <button onClick={() => setSelectorAbierto(false)} className="p-1" style={{ color: "var(--nt-soft)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Buscador */}
            <div className="px-4 pt-2 pb-1 flex-shrink-0">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
              >
                <Search size={15} style={{ color: "var(--nt-soft)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Buscar alimento..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{ color: "var(--nt-dark)" }}
                  autoFocus
                />
                {busqueda && (
                  <button onClick={() => setBusqueda("")} style={{ color: "var(--nt-soft)" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filtros por grupo */}
            <div
              className="flex gap-2 px-4 pb-2 overflow-x-auto flex-shrink-0"
              style={{ scrollbarWidth: "none" }}
            >
              {(["", ...GRUPOS] as string[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGrupoFiltro(g)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap"
                  style={grupoFiltro === g
                    ? { background: "var(--nt-dark)", color: "#fff" }
                    : { background: "var(--nt-card)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
                  }
                >
                  {g === "" ? "Todos" : g}
                </button>
              ))}
            </div>

            {/* Lista de alimentos */}
            <div className="overflow-y-auto flex-1 px-4 pb-6">
              {alimentosFiltrados.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: "var(--nt-soft)" }}>
                  Sin resultados para &quot;{busqueda}&quot;
                </p>
              ) : (
                <div className="space-y-1">
                  {alimentosFiltrados.map(a => {
                    const conflict = conflicta(a, perfil.restricciones);
                    return (
                      <button
                        key={a.id}
                        onClick={() => addAlimento(a)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
                        style={{ background: conflict ? "var(--nt-rbg)" : "var(--nt-card)" }}
                      >
                        <span className="text-xl w-8 text-center flex-shrink-0">{a.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-medium truncate"
                            style={{ color: conflict ? "var(--nt-r)" : "var(--nt-dark)" }}
                          >
                            {a.nombre}{conflict ? " ⚠️" : ""}
                          </div>
                          <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                            {a.kcal} kcal/100 g · porción {a.porcion} {a.unidad}
                          </div>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--nt-mid)" }}>+</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
