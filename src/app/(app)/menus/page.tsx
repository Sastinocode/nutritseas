"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ChefHat, ChevronRight, Trophy } from "lucide-react";
import { MENUS, MENU_INFO, TIMING, MARATON, type NombreMenu } from "@/data/menus";
import { ModoReto } from "./ModoReto";
import { ModoPoraMi } from "./ModoPoraMi";
import { ModoSemana } from "./ModoSemana";

type Vista = "plan" | "timing" | "competicion";

const MENU_CARDS: { nombre: NombreMenu; emoji: string; color: string; bg: string }[] = [
  { nombre: "Día de entreno", emoji: "💪", color: "var(--nt-dark)", bg: "var(--nt-light)" },
  { nombre: "Día de descanso", emoji: "😴", color: "var(--nt-g)", bg: "var(--nt-gbg)" },
  { nombre: "Pérdida de grasa", emoji: "🔥", color: "var(--nt-a)", bg: "var(--nt-abg)" },
  { nombre: "Vegetariano", emoji: "🌱", color: "var(--nt-g)", bg: "var(--nt-gbg)" },
];

type ModoActivo = "reto" | "para-mi" | "semana" | null;

export default function MenusPage() {
  const [modoActivo, setModoActivo] = useState<ModoActivo>(null);
  const [vista, setVista] = useState<Vista>("plan");
  const [menuActivo, setMenuActivo] = useState<NombreMenu>("Día de entreno");

  const comidas = MENUS[menuActivo];
  const totalKcal = comidas.reduce((s, c) => s + c.kcal, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Menús deportivos</h1>
      <p className="text-sm mb-4" style={{ color: "var(--nt-soft)" }}>
        Ejemplos de alimentación adaptados al deporte
      </p>

      {/* Modos interactivos */}
      {modoActivo ? (
        <div className="mb-5">
          <button
            onClick={() => setModoActivo(null)}
            className="flex items-center gap-1 text-sm mb-4"
            style={{ color: "var(--nt-soft)" }}
          >
            ← Volver a ejemplos
          </button>
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--nt-dark)" }}>
            {modoActivo === "reto" ? "Modo Reto" : modoActivo === "para-mi" ? "Para mí" : "Plan semanal"}
          </h2>
          {modoActivo === "reto" ? <ModoReto /> : modoActivo === "para-mi" ? <ModoPoraMi /> : <ModoSemana />}
        </div>
      ) : (
        <>
          {/* Tarjetas de modo */}
          <div className="flex flex-col gap-2 mb-5">
            <button
              onClick={() => setModoActivo("reto")}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left border"
              style={{ background: "var(--nt-abg)", borderColor: "var(--nt-a)" }}
            >
              <Trophy size={20} style={{ color: "var(--nt-a)", flexShrink: 0 }} />
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--nt-a)" }}>Modo Reto</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>Platos de clase · +10 XP</div>
              </div>
            </button>
            <button
              onClick={() => setModoActivo("para-mi")}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📋</span>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--nt-dark)" }}>Para mí</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>Mis alimentos · sin XP</div>
              </div>
            </button>
            <button
              onClick={() => setModoActivo("semana")}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <CalendarDays size={20} style={{ color: "var(--nt-mid)", flexShrink: 0 }} />
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--nt-dark)" }}>Plan semanal</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>7 días · lista de la compra</div>
              </div>
            </button>
          </div>

          {/* Acceso al constructor */}
          <Link
            href="/menus/constructor"
            className="flex items-center justify-between rounded-xl p-4 mb-5"
            style={{ background: "var(--nt-dark)" }}
          >
            <div className="flex items-center gap-3">
              <ChefHat size={22} style={{ color: "#fff" }} />
              <div>
                <div className="font-bold text-sm" style={{ color: "#fff" }}>Constructor de menús</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Diseña y valora un menú diario completo
                </div>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: "rgba(255,255,255,0.65)" }} />
          </Link>

          {/* Selector de vista */}
      <div
        className="flex rounded-xl mb-6 p-1"
        style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
      >
        {(["plan", "timing", "competicion"] as Vista[]).map(v => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              vista === v
                ? { background: "var(--nt-dark)", color: "#fff" }
                : { color: "var(--nt-soft)" }
            }
          >
            {v === "plan" ? "Plan del día" : v === "timing" ? "Timing" : "Competición"}
          </button>
        ))}
      </div>

      {/* PLAN DEL DÍA */}
      {vista === "plan" && (
        <div>
          {/* Selector de menú */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {MENU_CARDS.map(({ nombre, emoji, color, bg }) => (
              <button
                key={nombre}
                onClick={() => setMenuActivo(nombre)}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  background: menuActivo === nombre ? color : bg,
                  border: `2px solid ${menuActivo === nombre ? color : "transparent"}`,
                  color: menuActivo === nombre ? "#fff" : color,
                }}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-xs font-semibold leading-tight">{nombre}</div>
              </button>
            ))}
          </div>

          {/* Info del menú */}
          <div
            className="rounded-xl px-4 py-3 mb-4 text-sm"
            style={{ background: "var(--nt-light)", color: "var(--nt-soft)" }}
          >
            {MENU_INFO[menuActivo]}
          </div>

          {/* Comidas */}
          <div className="space-y-3">
            {comidas.map((comida, i) => (
              <div
                key={i}
                className="rounded-xl p-4 border"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--nt-dark)" }}>
                    {comida.hora}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--nt-light)", color: "var(--nt-mid)" }}
                  >
                    {comida.kcal} kcal
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--nt-ink)" }}>{comida.descripcion}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="rounded-xl p-4 mt-4 flex justify-between items-center"
            style={{ background: "var(--nt-dark)", color: "#fff" }}
          >
            <span className="font-semibold">Total del día</span>
            <span className="text-xl font-bold">{totalKcal} kcal</span>
          </div>

          <p className="text-xs text-center mt-4" style={{ color: "var(--nt-soft)" }}>
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </p>
        </div>
      )}

      {/* TIMING */}
      {vista === "timing" && (
        <div className="space-y-4">
          <p className="text-sm mb-4" style={{ color: "var(--nt-soft)" }}>
            Qué comer antes, durante y después del entrenamiento para optimizar el rendimiento y la recuperación.
          </p>
          {TIMING.map(([momento, objetivo, como, ejemplos], i) => (
            <div
              key={i}
              className="rounded-xl p-4 border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--nt-dark)", color: "#fff" }}
                >
                  {i + 1}
                </div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>{momento}</h3>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--nt-ink)" }}>{objetivo}</p>
              <p className="text-sm mb-2" style={{ color: "var(--nt-soft)" }}>{como}</p>
              <p
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "var(--nt-gbg)", color: "var(--nt-g)" }}
              >
                💡 {ejemplos}
              </p>
            </div>
          ))}
          <p className="text-xs text-center mt-2" style={{ color: "var(--nt-soft)" }}>
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </p>
        </div>
      )}

      {/* COMPETICIÓN */}
      {vista === "competicion" && (
        <div className="space-y-4">
          <p className="text-sm mb-4" style={{ color: "var(--nt-soft)" }}>
            Protocolo de nutrición para el día de carrera o competición larga (maratón, triatlón, ciclismo...).
          </p>
          {MARATON.map(([momento, consejo, ejemplo], i) => (
            <div
              key={i}
              className="rounded-xl p-4 border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {["🌙", "☀️", "🏁", "🏃", "🎯", "🍽️"][i]}
                </span>
                <h3 className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>{momento}</h3>
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--nt-ink)" }}>{consejo}</p>
              <p
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "var(--nt-light)", color: "var(--nt-mid)" }}
              >
                📌 {ejemplo}
              </p>
            </div>
          ))}
          <p className="text-xs text-center mt-2" style={{ color: "var(--nt-soft)" }}>
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </p>
        </div>
      )}
        </>
      )}
    </div>
  );
}
