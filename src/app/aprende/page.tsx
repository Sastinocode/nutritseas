"use client";
import { useState } from "react";
import { GRUPOS, MICROS, PROT_FOODS } from "@/data/nutrientes";

type Tab = "macros" | "micros" | "agua" | "proteinas";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "macros", label: "Macronutrientes", emoji: "🍚" },
  { id: "micros", label: "Micronutrientes", emoji: "🧪" },
  { id: "agua", label: "Agua y fibra", emoji: "💧" },
  { id: "proteinas", label: "Alimentos proteicos", emoji: "🥩" },
];

export default function AprendePage() {
  const [tab, setTab] = useState<Tab>("macros");

  const macro = GRUPOS.find(g => g.id === "macro")!;
  const micro = GRUPOS.find(g => g.id === "micro")!;
  const agua = GRUPOS.find(g => g.id === "agua")!;
  const fibra = GRUPOS.find(g => g.id === "fibra")!;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>
        Aprende nutrición
      </h1>
      <p className="text-sm mb-5" style={{ color: "var(--nt-soft)" }}>
        Bases científicas de la alimentación del deportista
      </p>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={
              tab === t.id
                ? { background: "var(--nt-dark)", color: "#fff" }
                : { background: "var(--nt-card)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
            }
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* MACROS */}
      {tab === "macros" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
            Los macronutrientes son los que aportan energía. Se miden en gramos.
          </p>
          {macro.items.map(([nombre, kcal, funcion, fuentes]) => (
            <div
              key={nombre}
              className="rounded-xl p-4 border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base" style={{ color: "var(--nt-ink)" }}>{nombre}</h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--nt-light)", color: "var(--nt-dark)" }}
                >
                  {kcal}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--nt-ink)" }}>{funcion}</p>
              <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                <span className="font-medium">Fuentes: </span>{fuentes}
              </p>
            </div>
          ))}

          {/* Alcohol */}
          {(() => {
            const alc = GRUPOS.find(g => g.id === "alcohol")!;
            return (
              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base" style={{ color: "var(--nt-ink)" }}>Alcohol</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}>
                    7 kcal/g – No esencial
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--nt-ink)" }}>
                  {alc.items[0][2]}
                </p>
              </div>
            );
          })()}

          {/* Plato visual */}
          <div
            className="rounded-xl p-4 border mt-2"
            style={{ background: "var(--nt-light)", borderColor: "var(--nt-line)" }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: "var(--nt-dark)" }}>
              Distribución orientativa en el deportista
            </p>
            <div className="space-y-2">
              {[
                { label: "Hidratos de carbono", pct: 50, color: "var(--nt-carb)" },
                { label: "Proteínas", pct: 20, color: "var(--nt-prot)" },
                { label: "Grasas", pct: 30, color: "var(--nt-fat)" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "var(--nt-soft)" }}>
                    <span>{label}</span><span>{pct} %</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--nt-line)" }}>
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--nt-soft)" }}>
              Referencia para actividad moderada. Puede variar según objetivo y deporte.
            </p>
          </div>
        </div>
      )}

      {/* MICROS */}
      {tab === "micros" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
            Se necesitan en cantidades pequeñas pero son indispensables. No aportan energía pero regulan todo el metabolismo.
          </p>
          {MICROS.map(m => (
            <div
              key={m.nombre}
              className="rounded-xl p-4 border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <h3 className="font-semibold text-base mb-1" style={{ color: "var(--nt-dark)" }}>{m.nombre}</h3>
              <p className="text-sm mb-2" style={{ color: "var(--nt-ink)" }}>{m.funcion}</p>
              <p className="text-xs mb-1" style={{ color: "var(--nt-soft)" }}>
                <span className="font-medium">Fuentes: </span>{m.fuentes}
              </p>
              {m.notas && (
                <p
                  className="text-xs mt-2 px-2 py-1 rounded-lg"
                  style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}
                >
                  ⚠ {m.notas}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AGUA Y FIBRA */}
      {tab === "agua" && (
        <div className="space-y-4">
          {[agua, fibra].map(grupo => (
            <div key={grupo.id}>
              <div
                className="rounded-xl p-4 border mb-4"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--nt-dark)" }}>{grupo.n}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--nt-soft)" }}>{grupo.s}</p>
                {grupo.items.map(([nombre, , funcion, fuentes]) => (
                  <div key={nombre}>
                    <p className="text-sm mb-2" style={{ color: "var(--nt-ink)" }}>{funcion}</p>
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      <span className="font-medium">Fuentes: </span>{fuentes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Guía de hidratación */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-gbg)", borderColor: "var(--nt-g)" }}
          >
            <h3 className="font-semibold mb-3" style={{ color: "var(--nt-g)" }}>Guía de hidratación deportiva</h3>
            <div className="space-y-2">
              {[
                { momento: "Antes", cantidad: "5-7 ml/kg (2-3 h antes)", icono: "⏰" },
                { momento: "Durante", cantidad: "150-350 ml cada 15-20 min", icono: "🏃" },
                { momento: "Después", cantidad: "1,5 L por cada kg perdido", icono: "✅" },
              ].map(h => (
                <div key={h.momento} className="flex items-center gap-3">
                  <span className="text-xl">{h.icono}</span>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--nt-ink)" }}>{h.momento}: </span>
                    <span className="text-sm" style={{ color: "var(--nt-soft)" }}>{h.cantidad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROTEÍNAS */}
      {tab === "proteinas" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
            Contenido en proteína de raciones habituales. Referencia para llegar a tu objetivo diario.
          </p>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--nt-line)" }}
          >
            {PROT_FOODS.map(([alimento, gramos], i) => (
              <div
                key={alimento}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: i % 2 === 0 ? "var(--nt-card)" : "var(--nt-bg)",
                  borderBottom: i < PROT_FOODS.length - 1 ? "1px solid var(--nt-line)" : "none",
                }}
              >
                <span className="text-sm" style={{ color: "var(--nt-ink)" }}>{alimento}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.round((gramos / 30) * 60)}px`,
                      background: "var(--nt-prot)",
                      minWidth: "8px",
                    }}
                  />
                  <span className="text-sm font-bold w-12 text-right" style={{ color: "var(--nt-prot)" }}>
                    {gramos} g
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-light)", borderColor: "var(--nt-line)" }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "var(--nt-dark)" }}>Recomendación para deportistas</p>
            <p className="text-sm" style={{ color: "var(--nt-ink)" }}>
              Entre <strong>1,4 y 2,2 g de proteína por kg de peso corporal</strong> al día, según el tipo y la intensidad del entrenamiento.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p
        className="text-xs text-center mt-8 px-2"
        style={{ color: "var(--nt-soft)" }}
      >
        Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
      </p>
    </div>
  );
}
