"use client";
import { useState } from "react";
import Link from "next/link";
import { TEST, buildCode, scoreOf, TBLK, type Bloque } from "@/data/test-clase";
import { ChevronLeft, Copy, Check, GraduationCap, ClipboardList } from "lucide-react";

type Paso = "setup" | "test" | "resultado";

const LETRAS = ["A", "B", "C", "D"] as const;

const BLOQUE_COLOR: Record<Bloque, string> = {
  N: "var(--nt-mid)",
  S: "var(--nt-g)",
  M: "var(--nt-a)",
};

export default function ClasePage() {
  const [paso, setPaso] = useState<Paso>("setup");
  const [nombre, setNombre] = useState("");
  const [fase, setFase] = useState<"I" | "F">("I");
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState<string[]>(() => Array(TEST.length).fill(""));
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const pregunta = TEST[actual];

  function empezar() {
    setRespuestas(Array(TEST.length).fill(""));
    setActual(0);
    setSeleccionada(null);
    setPaso("test");
  }

  function elegir(letra: string) {
    if (seleccionada) return;
    setSeleccionada(letra);
    const nuevas = [...respuestas];
    nuevas[actual] = letra;
    setRespuestas(nuevas);
    setTimeout(() => {
      setSeleccionada(null);
      if (actual < TEST.length - 1) {
        setActual((a) => a + 1);
      } else {
        setPaso("resultado");
      }
    }, 450);
  }

  const codigo =
    paso === "resultado"
      ? buildCode(nombre.trim() || "Alumno", fase, respuestas)
      : "";
  const puntos = paso === "resultado" ? scoreOf(respuestas) : null;

  function copiar() {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  // ── Setup ────────────────────────────────────────────────
  if (paso === "setup") {
    return (
      <div className="min-h-screen" style={{ background: "var(--nt-bg)" }}>
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14"
          style={{ background: "var(--nt-card)", borderBottom: "1px solid var(--nt-line)" }}
        >
          <Link href="/" className="p-1 -ml-1" style={{ color: "var(--nt-soft)" }}>
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GraduationCap size={18} style={{ color: "var(--nt-mid)" }} />
            <span className="font-bold text-sm" style={{ color: "var(--nt-dark)" }}>
              Test NutriTSEAS
            </span>
          </div>
          <Link
            href="/clase/panel"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0"
            style={{ background: "var(--nt-bg)", border: "1px solid var(--nt-line)", color: "var(--nt-soft)" }}
          >
            <ClipboardList size={13} />
            Panel profe
          </Link>
        </div>

        <div className="max-w-lg mx-auto px-4 py-7 space-y-6">
          <div className="text-center space-y-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "var(--nt-light)" }}
            >
              <GraduationCap size={28} style={{ color: "var(--nt-mid)" }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
              Test de conocimientos
            </h1>
            <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
              24 preguntas · Nutrición · Suplementación · Mitos
            </p>
          </div>

          <div
            className="rounded-xl border p-4 space-y-4"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            <div>
              <label
                className="text-xs font-semibold block mb-1.5"
                style={{ color: "var(--nt-dark)" }}
              >
                Tu nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Escribe tu nombre y apellido"
                className="w-full px-3 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  background: "var(--nt-bg)",
                  border: "1px solid var(--nt-line)",
                  color: "var(--nt-dark)",
                }}
                maxLength={60}
              />
            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-1.5"
                style={{ color: "var(--nt-dark)" }}
              >
                Momento del test
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["I", "Inicio del tema"],
                    ["F", "Final del tema"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setFase(v)}
                    className="py-2.5 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      background: fase === v ? "var(--nt-dark)" : "var(--nt-bg)",
                      color: fase === v ? "#fff" : "var(--nt-soft)",
                      border: `1px solid ${fase === v ? "var(--nt-dark)" : "var(--nt-line)"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={empezar}
            disabled={!nombre.trim()}
            className="w-full py-3.5 text-sm font-semibold rounded-xl"
            style={{
              background: nombre.trim() ? "var(--nt-dark)" : "var(--nt-line)",
              color: nombre.trim() ? "#fff" : "var(--nt-soft)",
            }}
          >
            Empezar el test
          </button>

          <p className="text-xs text-center" style={{ color: "var(--nt-soft)" }}>
            Al terminar obtendrás un código para entregar a tu profesor.
          </p>
        </div>
      </div>
    );
  }

  // ── Test ─────────────────────────────────────────────────
  if (paso === "test") {
    const pct = ((actual + 1) / TEST.length) * 100;
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--nt-bg)" }}>
        {/* Cabecera con barra de progreso */}
        <div
          className="sticky top-0 z-30 px-4 pt-3 pb-2"
          style={{ background: "var(--nt-card)", borderBottom: "1px solid var(--nt-line)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold"
              style={{ color: BLOQUE_COLOR[pregunta.b] }}
            >
              {TBLK[pregunta.b]}
            </span>
            <span className="text-xs" style={{ color: "var(--nt-soft)" }}>
              {actual + 1} / {TEST.length}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--nt-line)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: BLOQUE_COLOR[pregunta.b] }}
            />
          </div>
        </div>

        {/* Pregunta y opciones */}
        <div className="flex-1 px-4 py-5 space-y-5 max-w-lg mx-auto w-full">
          <p
            className="text-base font-medium leading-relaxed"
            style={{ color: "var(--nt-dark)", whiteSpace: "pre-line" }}
          >
            {pregunta.q}
          </p>

          <div className="space-y-2.5">
            {pregunta.o.map((opcion, i) => {
              const letra = LETRAS[i];
              const sel = seleccionada === letra;
              return (
                <button
                  key={letra}
                  onClick={() => elegir(letra)}
                  disabled={!!seleccionada}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: sel ? "var(--nt-dark)" : "var(--nt-card)",
                    color: sel ? "#fff" : "var(--nt-dark)",
                    border: `1px solid ${sel ? "var(--nt-dark)" : "var(--nt-line)"}`,
                    opacity: seleccionada && !sel ? 0.45 : 1,
                  }}
                >
                  <span
                    className="font-semibold mr-2"
                    style={{ color: sel ? "#fff" : BLOQUE_COLOR[pregunta.b] }}
                  >
                    {letra}.
                  </span>
                  {opcion}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Resultado ────────────────────────────────────────────
  const bloques: Bloque[] = ["N", "S", "M"];

  return (
    <div className="min-h-screen" style={{ background: "var(--nt-bg)" }}>
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14"
        style={{ background: "var(--nt-card)", borderBottom: "1px solid var(--nt-line)" }}
      >
        <button
          onClick={() => setPaso("setup")}
          className="p-1 -ml-1"
          style={{ color: "var(--nt-soft)" }}
        >
          <ChevronLeft size={22} />
        </button>
        <span className="font-bold text-sm" style={{ color: "var(--nt-dark)" }}>
          Resultado
        </span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Puntuación total */}
        <div
          className="rounded-xl border p-5 text-center"
          style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--nt-soft)" }}>
            {nombre || "Alumno"}
          </p>
          <div className="text-4xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>
            {puntos!.T} / {TEST.length}
          </div>
          <p className="text-xs" style={{ color: "var(--nt-soft)" }}>respuestas correctas</p>
        </div>

        {/* Por bloque */}
        <div className="grid grid-cols-3 gap-3">
          {bloques.map((b) => (
            <div
              key={b}
              className="rounded-xl border p-3 text-center"
              style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
            >
              <div className="text-xl font-bold" style={{ color: BLOQUE_COLOR[b] }}>
                {puntos![b]} / 8
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>
                {TBLK[b]}
              </div>
            </div>
          ))}
        </div>

        {/* Código de entrega */}
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
        >
          <p className="text-xs font-semibold" style={{ color: "var(--nt-dark)" }}>
            Código de entrega al profe
          </p>
          <textarea
            readOnly
            value={codigo}
            rows={2}
            className="w-full text-xs rounded-lg p-2 font-mono resize-none outline-none"
            style={{
              background: "var(--nt-bg)",
              border: "1px solid var(--nt-line)",
              color: "var(--nt-dark)",
            }}
          />
          <button
            onClick={copiar}
            className="w-full py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            style={{ background: copiado ? "var(--nt-g)" : "var(--nt-dark)", color: "#fff" }}
          >
            {copiado ? (
              <>
                <Check size={14} /> Copiado
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar código
              </>
            )}
          </button>
          <p className="text-xs" style={{ color: "var(--nt-soft)" }}>
            Envía este código a tu profesor por WhatsApp, email o como te indique.
          </p>
        </div>

        <button
          onClick={empezar}
          className="w-full py-2.5 text-sm rounded-xl"
          style={{
            background: "var(--nt-bg)",
            border: "1px solid var(--nt-line)",
            color: "var(--nt-soft)",
          }}
        >
          Repetir el test
        </button>
      </div>
    </div>
  );
}
