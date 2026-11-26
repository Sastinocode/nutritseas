"use client";
import { useState } from "react";

type Tab = "energia" | "nutricion" | "suplementos" | "mitos";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "energia", label: "Energía", emoji: "⚡" },
  { id: "nutricion", label: "Nutrición", emoji: "🥗" },
  { id: "suplementos", label: "Suplementos", emoji: "💊" },
  { id: "mitos", label: "Mitos", emoji: "🔍" },
];

const VIAS = [
  {
    nombre: "Anaeróbica aláctica (ATP-PCr)",
    duracion: "0 – 10 s",
    intensidad: "Máxima",
    ejemplo: "Sprint, levantamiento olímpico",
    color: "var(--nt-r)",
    bg: "var(--nt-rbg)",
  },
  {
    nombre: "Anaeróbica láctica (glucólisis)",
    duracion: "10 s – 2 min",
    intensidad: "Alta",
    ejemplo: "400 m, natación 100 m",
    color: "var(--nt-a)",
    bg: "var(--nt-abg)",
  },
  {
    nombre: "Aeróbica oxidativa",
    duracion: "> 2 min",
    intensidad: "Moderada",
    ejemplo: "Ciclismo, maratón, fútbol",
    color: "var(--nt-g)",
    bg: "var(--nt-gbg)",
  },
];

const MACROS = [
  {
    nombre: "Carbohidratos",
    kcal: "4 kcal/g",
    rol: "Combustible principal para esfuerzos de intensidad moderada a alta.",
    detalle: "Se almacenan como glucógeno muscular y hepático. Fuente de glucosa de acción rápida.",
    recomendacion: [
      { nivel: "Actividad ligera", cantidad: "3–5 g/kg" },
      { nivel: "Moderada", cantidad: "5–7 g/kg" },
      { nivel: "Intensa", cantidad: "7–10 g/kg" },
      { nivel: "Ultra-resistencia", cantidad: "10–12 g/kg" },
    ],
    fuentes: "Arroz, pasta, pan, patata, avena, fruta, legumbres.",
    color: "var(--nt-carb, #E67E22)",
    bg: "var(--nt-abg)",
  },
  {
    nombre: "Proteínas",
    kcal: "4 kcal/g",
    rol: "Recuperación y construcción muscular.",
    detalle: "Reparan tejidos dañados, estimulan la síntesis proteica y apoyan el sistema inmune.",
    recomendacion: [
      { nivel: "Mantenimiento / rendimiento", cantidad: "1,4–1,6 g/kg" },
      { nivel: "Hipertrofia muscular intensa", cantidad: "1,8–2,2 g/kg" },
    ],
    fuentes: "Carnes magras, pescado, huevos, lácteos, legumbres, frutos secos.",
    color: "var(--nt-prot, #8E44AD)",
    bg: "var(--nt-light)",
  },
  {
    nombre: "Grasas",
    kcal: "9 kcal/g",
    rol: "Energía de larga duración y funciones hormonales.",
    detalle: "Reserva energética para esfuerzos prolongados de baja intensidad. Facilitan la absorción de vitaminas A, D, E y K.",
    recomendacion: [
      { nivel: "Porcentaje calórico diario", cantidad: "20–35 %" },
    ],
    fuentes: "Aceite de oliva, aguacate, frutos secos, pescado azul, semillas.",
    color: "var(--nt-fat, #2E7D32)",
    bg: "var(--nt-gbg)",
  },
];

const SUPLEMENTOS = [
  {
    semaforo: "verde",
    nombre: "Creatina monohidrato",
    descripcion: "El suplemento más estudiado para fuerza y potencia.",
    dosis: "3–5 g/día continuo",
    momento: "Cualquier hora; independiente del entrenamiento",
    para: "Fuerza, potencia, deportes de equipo",
  },
  {
    semaforo: "verde",
    nombre: "Cafeína",
    descripcion: "Mejora alerta, concentración y retrasa la percepción de fatiga.",
    dosis: "3–6 mg/kg (máx. 400 mg/día referencia adulto)",
    momento: "60 min antes del ejercicio",
    para: "Resistencia y fuerza; evitar en sensibles",
  },
  {
    semaforo: "verde",
    nombre: "Proteína whey",
    descripcion: "Rápida absorción para recuperación post-entreno. Es un alimento concentrado, no un producto mágico.",
    dosis: "20–40 g por toma",
    momento: "Ventana post-entreno (0–2 h después)",
    para: "Todos los perfiles, especialmente fuerza e hipertrofia",
  },
  {
    semaforo: "verde",
    nombre: "Bebidas deportivas / electrolitos",
    descripcion: "Reponen sodio, potasio y carbohidratos en sesiones largas.",
    dosis: "Según indicaciones del producto",
    momento: "Durante ejercicio > 60 min",
    para: "Deportes de resistencia, calor extremo",
  },
  {
    semaforo: "ambar",
    nombre: "BCAAs (Leucina, Isoleucina, Valina)",
    descripcion: "Posible efecto antiproteolítico; con dieta proteica completa los beneficios adicionales son limitados.",
    dosis: null,
    momento: "Antes o durante el entreno",
    para: "Ayuno, dietas hipocalóricas estrictas",
  },
  {
    semaforo: "ambar",
    nombre: "Beta-alanina",
    descripcion: "Aumenta carnosina muscular; tampona el ácido láctico. Puede causar hormigueo (parestesia) inofensivo.",
    dosis: "4–6 g/día repartidos en tomas",
    momento: "2–4 semanas para efectos acumulativos",
    para: "Esfuerzos de 1–4 min: natación, remo, ciclismo en pista",
  },
  {
    semaforo: "rojo",
    nombre: "Glutamina",
    descripcion: "No recomendado. No hay evidencia de beneficio en deportistas con dieta equilibrada.",
    dosis: null,
    momento: null,
    para: null,
  },
  {
    semaforo: "rojo",
    nombre: "L-carnitina",
    descripcion: "No recomendado. La evidencia científica no respalda su uso para quemar grasa ni mejorar el rendimiento.",
    dosis: null,
    momento: null,
    para: null,
  },
  {
    semaforo: "rojo",
    nombre: "Vitaminas en exceso (megadosis)",
    descripcion: "No recomendado. Las megadosis no mejoran el rendimiento y pueden ser perjudiciales.",
    dosis: null,
    momento: null,
    para: null,
  },
];

const MITOS = [
  {
    mito: "La proteína engorda",
    realidad: "Lo que engorda es el exceso de calorías. 1 g de proteína aporta 4 kcal, igual que los carbohidratos.",
  },
  {
    mito: "Más proteína = más músculo",
    realidad: "El músculo se construye con entrenamiento, descanso y un aporte adecuado. El exceso de proteína no suma músculo.",
  },
  {
    mito: "La creatina retiene líquidos de forma perjudicial",
    realidad: "No hay evidencia científica de retención de agua significativa ni perjudicial con el uso habitual de creatina.",
  },
  {
    mito: "La cafeína deshidrata",
    realidad: "En dosis adecuadas (3–6 mg/kg) puede mejorar el rendimiento sin provocar deshidratación.",
  },
  {
    mito: "Los suplementos son un atajo",
    realidad: "Son complementos, no sustitutos de una dieta equilibrada y un entrenamiento constante. La base siempre es la alimentación.",
  },
  {
    mito: "Hay que comer justo antes de entrenar para tener energía",
    realidad: "Lo más importante es el estado nutricional global del día, no la comida de los últimos minutos.",
  },
];

function SemaforoIcon({ color }: { color: string }) {
  const styles: Record<string, { dot: string; label: string; labelColor: string; borderColor: string }> = {
    verde: { dot: "var(--nt-g)", label: "Evidencia sólida", labelColor: "var(--nt-g)", borderColor: "var(--nt-g)" },
    ambar: { dot: "var(--nt-a)", label: "Evidencia limitada", labelColor: "var(--nt-a)", borderColor: "var(--nt-a)" },
    rojo: { dot: "var(--nt-r)", label: "No recomendado", labelColor: "var(--nt-r)", borderColor: "var(--nt-r)" },
  };
  const s = styles[color];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
      style={{ color: s.labelColor, borderColor: s.borderColor, background: "transparent" }}
    >
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
}

export default function AprendePage() {
  const [tab, setTab] = useState<Tab>("energia");
  const [openMacro, setOpenMacro] = useState<number | null>(null);
  const [openSup, setOpenSup] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>
        Aprende
      </h1>
      <p className="text-sm mb-5" style={{ color: "var(--nt-soft)" }}>
        Temario UD 6 · Nutrición, energía y suplementación deportiva
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

      {/* ── TAB ENERGÍA ── */}
      {tab === "energia" && (
        <div className="space-y-5">
          {/* Intro */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            <h2 className="font-bold text-base mb-2" style={{ color: "var(--nt-dark)" }}>Metabolismo Energético</h2>
            <p className="text-sm" style={{ color: "var(--nt-ink)" }}>
              El cuerpo obtiene energía a partir de los nutrientes mediante la síntesis de <strong>ATP</strong> (adenosín trifosfato), la «moneda energética» de las células. La vía utilizada depende de la duración e intensidad del esfuerzo.
            </p>
          </div>

          {/* Vías energéticas */}
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
            Vías de obtención de energía
          </h3>
          {VIAS.map((v, i) => (
            <div
              key={i}
              className="rounded-xl p-4 border"
              style={{ background: v.bg, borderColor: v.color }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm" style={{ color: "var(--nt-ink)" }}>{v.nombre}</h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: v.color, color: "#fff" }}
                >
                  {v.intensidad}
                </span>
              </div>
              <div className="flex gap-4 text-xs" style={{ color: "var(--nt-soft)" }}>
                <span>⏱ {v.duracion}</span>
                <span>🏃 {v.ejemplo}</span>
              </div>
            </div>
          ))}

          {/* Concepto clave */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-light)", borderColor: "var(--nt-line)" }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "var(--nt-dark)" }}>Principio clave</p>
            <p className="text-sm" style={{ color: "var(--nt-ink)" }}>
              Las tres vías trabajan de forma simultánea y complementaria. Según la intensidad predomina una u otra, pero nunca actúan de forma aislada.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB NUTRICIÓN ── */}
      {tab === "nutricion" && (
        <div className="space-y-5">
          <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
            La nutrición deportiva se apoya en tres macronutrientes, una correcta hidratación y un balance energético adecuado al objetivo.
          </p>

          {/* Macronutrientes */}
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
            Macronutrientes
          </h3>
          {MACROS.map((m, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--nt-line)" }}>
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                style={{ background: "var(--nt-card)" }}
                onClick={() => setOpenMacro(openMacro === i ? null : i)}
              >
                <div>
                  <span className="font-semibold text-base" style={{ color: "var(--nt-ink)" }}>{m.nombre}</span>
                  <span
                    className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: m.bg, color: m.color }}
                  >
                    {m.kcal}
                  </span>
                </div>
                <span style={{ color: "var(--nt-soft)" }}>{openMacro === i ? "▲" : "▼"}</span>
              </button>
              {openMacro === i && (
                <div className="p-4 border-t space-y-3" style={{ borderColor: "var(--nt-line)", background: "var(--nt-bg)" }}>
                  <p className="text-sm" style={{ color: "var(--nt-ink)" }}>{m.rol}</p>
                  <p className="text-sm" style={{ color: "var(--nt-soft)" }}>{m.detalle}</p>
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>Recomendación diaria</p>
                    <div className="space-y-1">
                      {m.recomendacion.map((r, j) => (
                        <div key={j} className="flex items-center justify-between text-xs rounded px-2 py-1" style={{ background: "var(--nt-card)" }}>
                          <span style={{ color: "var(--nt-soft)" }}>{r.nivel}</span>
                          <span className="font-bold" style={{ color: m.color }}>{r.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                    <span className="font-medium">Fuentes: </span>{m.fuentes}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Hidratación */}
          <h3 className="text-sm font-semibold uppercase tracking-wide mt-2" style={{ color: "var(--nt-soft)" }}>
            Hidratación
          </h3>
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-gbg)", borderColor: "var(--nt-g)" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--nt-g)" }}>La hidratación es clave</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { valor: "2 %", texto: "deshidratación reduce el rendimiento" },
                { valor: "60 min", texto: "→ añadir bebida con electrolitos" },
                { valor: "3 fases", texto: "antes, durante y después" },
              ].map((d, i) => (
                <div key={i} className="rounded-lg p-2 text-center" style={{ background: "var(--nt-card)" }}>
                  <p className="text-base font-bold" style={{ color: "var(--nt-g)" }}>{d.valor}</p>
                  <p className="text-xs" style={{ color: "var(--nt-soft)" }}>{d.texto}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { momento: "Antes", cantidad: "5–7 ml/kg (2–3 h antes)", icono: "⏰" },
                { momento: "Durante", cantidad: "150–350 ml cada 15–20 min", icono: "🏃" },
                { momento: "Después", cantidad: "1,5 L por cada kg perdido", icono: "✅" },
              ].map(h => (
                <div key={h.momento} className="flex items-center gap-3">
                  <span className="text-lg">{h.icono}</span>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--nt-ink)" }}>{h.momento}: </span>
                    <span className="text-sm" style={{ color: "var(--nt-soft)" }}>{h.cantidad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance energético */}
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
            Balance energético
          </h3>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--nt-line)" }}>
            {[
              { tipo: "Negativo", relacion: "Ingesta < Gasto", efecto: "Pérdida de peso / definición", cuando: "Mejorar relación potencia/peso", color: "var(--nt-r)", bg: "var(--nt-rbg)" },
              { tipo: "Equilibrado", relacion: "Ingesta = Gasto", efecto: "Mantenimiento del peso", cuando: "Rendimiento constante y salud óptima", color: "var(--nt-g)", bg: "var(--nt-gbg)" },
              { tipo: "Positivo", relacion: "Ingesta > Gasto", efecto: "Ganancia de masa muscular", cuando: "Hipertrofia e incremento de fuerza", color: "var(--nt-dark)", bg: "var(--nt-light)" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 border-b last:border-0"
                style={{ borderColor: "var(--nt-line)", background: "var(--nt-card)" }}
              >
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5"
                  style={{ background: b.bg, color: b.color }}
                >
                  {b.tipo}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--nt-ink)" }}>{b.efecto}</p>
                  <p className="text-xs" style={{ color: "var(--nt-soft)" }}>{b.cuando}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
            Un desequilibrio prolongado puede provocar fatiga, bajo rendimiento y lesiones.
          </p>
        </div>
      )}

      {/* ── TAB SUPLEMENTOS ── */}
      {tab === "suplementos" && (
        <div className="space-y-4">
          {/* Principios */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-light)", borderColor: "var(--nt-line)" }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--nt-dark)" }}>
              Suplementación deportiva: complemento, no sustituto
            </p>
            <p className="text-sm mb-3" style={{ color: "var(--nt-ink)" }}>
              El TSEAS informa y orienta; no prescribe suplementación. La base siempre es alimentación, descanso y entrenamiento planificado.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Base alimentaria sólida",
                "Evidencia científica demostrada",
                "Individualización por deportista",
                "Productos certificados y legales",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--nt-soft)" }}>
                  <span style={{ color: "var(--nt-g)" }}>✓</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Semáforo leyenda */}
          <div className="flex flex-wrap gap-3">
            {["verde", "ambar", "rojo"].map(s => (
              <SemaforoIcon key={s} color={s} />
            ))}
          </div>

          {/* Lista de suplementos */}
          {SUPLEMENTOS.map((s, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--nt-line)" }}>
              <button
                className="w-full flex items-start justify-between gap-3 p-4 text-left"
                style={{ background: "var(--nt-card)" }}
                onClick={() => setOpenSup(openSup === i ? null : i)}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--nt-ink)" }}>{s.nombre}</p>
                  <SemaforoIcon color={s.semaforo} />
                </div>
                <span className="mt-1 flex-shrink-0" style={{ color: "var(--nt-soft)" }}>{openSup === i ? "▲" : "▼"}</span>
              </button>
              {openSup === i && (
                <div
                  className="p-4 border-t space-y-2"
                  style={{ borderColor: "var(--nt-line)", background: "var(--nt-bg)" }}
                >
                  <p className="text-sm" style={{ color: "var(--nt-ink)" }}>{s.descripcion}</p>
                  {s.dosis && (
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      <span className="font-medium">Dosis: </span>{s.dosis}
                    </p>
                  )}
                  {s.momento && (
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      <span className="font-medium">Momento: </span>{s.momento}
                    </p>
                  )}
                  {s.para && (
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      <span className="font-medium">Deportistas indicados: </span>{s.para}
                    </p>
                  )}
                  {s.semaforo === "rojo" && (
                    <p
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
                    >
                      ⛔ No recomendado por el TSEAS
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB MITOS ── */}
      {tab === "mitos" && (
        <div className="space-y-4">
          <p className="text-sm mb-2" style={{ color: "var(--nt-soft)" }}>
            Creencias erróneas muy extendidas sobre nutrición y suplementación deportiva. Como TSEAS, puedes informar con evidencia.
          </p>
          {MITOS.map((m, i) => (
            <div
              key={i}
              className="rounded-xl p-4 border"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">❌</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--nt-r)" }}>
                    «{m.mito}»
                  </p>
                </div>
              </div>
              <div
                className="mt-3 flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "var(--nt-gbg)" }}
              >
                <span className="text-xl flex-shrink-0">✅</span>
                <p className="text-sm" style={{ color: "var(--nt-ink)" }}>{m.realidad}</p>
              </div>
            </div>
          ))}
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
