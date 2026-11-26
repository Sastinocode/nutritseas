import Link from "next/link";
import { BookOpen, UtensilsCrossed, FlaskConical, Trophy, GraduationCap, Calculator } from "lucide-react";

const MODULOS = [
  {
    href: "/aprende",
    emoji: "📚",
    Icon: BookOpen,
    titulo: "Aprende",
    descripcion: "Nutrientes, macros, micros e hidratación. La base que necesitas."
  },
  {
    href: "/menus",
    emoji: "🍽️",
    Icon: UtensilsCrossed,
    titulo: "Menús y timing",
    descripcion: "Platos de ejemplo, timing de entreno y guía para competición."
  },
  {
    href: "/suplementos",
    emoji: "💊",
    Icon: FlaskConical,
    titulo: "Suplementos",
    descripcion: "Semáforo de evidencia, checklist y detector de bulos."
  },
  {
    href: "/retos",
    emoji: "🏆",
    Icon: Trophy,
    titulo: "Retos y quiz",
    descripcion: "Pon a prueba lo aprendido con 15 preguntas y el juego de mitos."
  },
  {
    href: "/calcular",
    emoji: "🧮",
    Icon: Calculator,
    titulo: "Calcula",
    descripcion: "Tu gasto energético y macros con la fórmula Mifflin-St Jeor."
  },
  {
    href: "/clase",
    emoji: "🎓",
    Icon: GraduationCap,
    titulo: "Clase",
    descripcion: "Modo profesor: presentaciones y recursos para el aula."
  }
];

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Hero */}
      <div
        className="rounded-2xl px-5 py-6 mb-6"
        style={{
          background: "linear-gradient(135deg, var(--nt-dark), var(--nt-mid))",
          color: "#fff"
        }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase opacity-75 mb-1">
          TSEAS 26/27 · UD6
        </p>
        <h1 className="text-2xl font-bold leading-tight mb-1">Come bien, rinde más</h1>
        <p className="text-sm opacity-80">
          Nutrición deportiva y suplementación para el ciclo TSEAS.
        </p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODULOS.map(({ href, emoji, titulo, descripcion }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border p-4 flex flex-col gap-1 transition-colors hover:border-[var(--nt-mid)]"
            style={{
              background: "var(--nt-card)",
              borderColor: "var(--nt-line)"
            }}
          >
            <span className="text-2xl">{emoji}</span>
            <strong style={{ color: "var(--nt-dark)" }}>{titulo}</strong>
            <span className="text-sm" style={{ color: "var(--nt-soft)" }}>{descripcion}</span>
          </Link>
        ))}
      </div>

      {/* Aviso */}
      <p
        className="text-xs mt-6 text-center"
        style={{ color: "var(--nt-soft)" }}
      >
        Orientativo para adultos sanos. No sustituye a un médico o dietista-nutricionista.
        Los datos que introduces quedan solo en tu dispositivo.
      </p>
    </div>
  );
}
