"use client";
import { useState, useEffect } from "react";
import { SUPS, BULOS, SUPQ, type Semaforo } from "@/data/suplementos";

type QuizOpc = { o: string; correct: boolean }[];

type Tab = "semaforo" | "bulos" | "quiz";

const SEM_STYLE: Record<Semaforo, { text: string; bg: string; label: string; emoji: string }> = {
  g: { text: "var(--nt-g)", bg: "var(--nt-gbg)", label: "Verde · Eficacia comprobada", emoji: "🟢" },
  a: { text: "var(--nt-a)", bg: "var(--nt-abg)", label: "Ámbar · Posible efecto / según el caso", emoji: "🟡" },
  r: { text: "var(--nt-r)", bg: "var(--nt-rbg)", label: "Rojo · Sin evidencia o desaconsejado", emoji: "🔴" },
};

export default function SuplementosPage() {
  const [tab, setTab] = useState<Tab>("semaforo");

  // Semáforo
  const [expanded, setExpanded] = useState<string | null>(null);

  // Bulos
  const [revelados, setRevelados] = useState<Set<number>>(new Set());

  // Quiz
  const [qIdx, setQIdx] = useState(0);
  const [qResp, setQResp] = useState<number | null>(null);
  const [qScore, setQScore] = useState(0);
  const [qFin, setQFin] = useState(false);
  const [qOpc, setQOpc] = useState<QuizOpc[]>(
    () => SUPQ.map(p => p.o.map((o, i) => ({ o, correct: i === 0 })))
  );

  useEffect(() => {
    setQOpc(prev => prev.map(opts => [...opts].sort(() => Math.random() - 0.5)));
  }, []);

  function toggleBulo(i: number) {
    setRevelados(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  function responder(i: number) {
    if (qResp !== null) return;
    setQResp(i);
    if (qOpc[qIdx][i].correct) setQScore(s => s + 1);
  }

  function siguiente() {
    if (qIdx < SUPQ.length - 1) {
      setQIdx(i => i + 1);
      setQResp(null);
    } else {
      setQFin(true);
    }
  }

  function resetQuiz() {
    setQIdx(0);
    setQResp(null);
    setQScore(0);
    setQFin(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Suplementos</h1>
      <p className="text-sm mb-5" style={{ color: "var(--nt-soft)" }}>
        Semáforo de evidencia, detector de bulos y quiz
      </p>

      {/* Tabs */}
      <div
        className="flex rounded-xl mb-6 p-1"
        style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
      >
        {(["semaforo", "bulos", "quiz"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors"
            style={tab === t ? { background: "var(--nt-dark)", color: "#fff" } : { color: "var(--nt-soft)" }}
          >
            {t === "semaforo" ? "Semáforo" : t === "bulos" ? "Detector bulos" : "Quiz"}
          </button>
        ))}
      </div>

      {/* SEMÁFORO */}
      {tab === "semaforo" && (
        <div className="space-y-6">
          {(["g", "a", "r"] as Semaforo[]).map(l => {
            const c = SEM_STYLE[l];
            const sups = SUPS.filter(s => s.l === l);
            return (
              <div key={l}>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                  style={{ background: c.bg }}
                >
                  <span>{c.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: c.text }}>{c.label}</span>
                </div>
                <div className="space-y-2">
                  {sups.map(sup => (
                    <div
                      key={sup.id}
                      className="rounded-xl border overflow-hidden"
                      style={{ borderColor: "var(--nt-line)" }}
                    >
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                        style={{ background: "var(--nt-card)" }}
                        onClick={() => setExpanded(expanded === sup.id ? null : sup.id)}
                      >
                        <span className="text-sm font-medium" style={{ color: "var(--nt-ink)" }}>
                          {sup.n}
                        </span>
                        <span className="text-xs ml-2 flex-shrink-0" style={{ color: "var(--nt-soft)" }}>
                          {expanded === sup.id ? "▲" : "▼"}
                        </span>
                      </button>

                      {expanded === sup.id && (
                        <div
                          className="px-4 pb-4 pt-2 space-y-2 border-t text-xs"
                          style={{ background: "var(--nt-bg)", borderColor: "var(--nt-line)" }}
                        >
                          <Campo label="Qué hace" value={sup.q} />
                          {l !== "r" && sup.d !== "—" && <Campo label="Dosis" value={sup.d} />}
                          {l !== "r" && sup.w !== "—" && <Campo label="Cuándo" value={sup.w} />}
                          {sup.c !== "—" && <Campo label="Precauciones" value={sup.c} />}
                          {sup.f !== "—" && <Campo label="Alternativa alimentaria" value={sup.f} />}
                          <p className="pt-1 italic" style={{ color: "var(--nt-soft)" }}>💡 {sup.nm}</p>
                          {l === "r" && (
                            <div
                              className="px-3 py-2 rounded-lg mt-1"
                              style={{ background: "var(--nt-rbg)", color: "var(--nt-r)" }}
                            >
                              🚫 No recomendado. Nunca se muestran dosis.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="text-xs text-center mt-4" style={{ color: "var(--nt-soft)" }}>
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </p>
        </div>
      )}

      {/* DETECTOR DE BULOS */}
      {tab === "bulos" && (
        <div className="space-y-3">
          <p className="text-sm mb-4" style={{ color: "var(--nt-soft)" }}>
            Toca cada anuncio para ver si es una señal razonable o una señal de alarma.
          </p>
          {BULOS.map(([texto, veredicto, explicacion], i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden cursor-pointer"
              style={{ borderColor: "var(--nt-line)" }}
              onClick={() => toggleBulo(i)}
            >
              <div className="px-4 py-3" style={{ background: "var(--nt-card)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--nt-ink)" }}>{texto}</p>
                {!revelados.has(i) && (
                  <p className="text-xs mt-1" style={{ color: "var(--nt-soft)" }}>Toca para revelar →</p>
                )}
              </div>
              {revelados.has(i) && (
                <div
                  className="px-4 py-3 border-t"
                  style={{
                    background: veredicto === "V" ? "var(--nt-gbg)" : "var(--nt-rbg)",
                    borderColor: "var(--nt-line)",
                  }}
                >
                  <p
                    className="text-sm font-bold mb-1"
                    style={{ color: veredicto === "V" ? "var(--nt-g)" : "var(--nt-r)" }}
                  >
                    {veredicto === "V" ? "✅ Señal razonable" : "🚫 Señal de alarma"}
                  </p>
                  <p className="text-sm" style={{ color: "var(--nt-ink)" }}>{explicacion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QUIZ */}
      {tab === "quiz" && (
        <div>
          {qFin ? (
            <div className="text-center space-y-4 py-6">
              <div className="text-5xl">🏆</div>
              <div className="text-3xl font-bold" style={{ color: "var(--nt-dark)" }}>
                {qScore} / {SUPQ.length}
              </div>
              <p style={{ color: "var(--nt-soft)" }}>
                {qScore >= 6
                  ? "¡Buen resultado! Dominas los suplementos."
                  : "Repasa el semáforo y vuelve a intentarlo."}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: "var(--nt-dark)" }}
              >
                Repetir quiz
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--nt-soft)" }}>
                <span>Pregunta {qIdx + 1} de {SUPQ.length}</span>
                <span>Aciertos: {qScore}</span>
              </div>
              <div className="h-1.5 rounded-full mb-5" style={{ background: "var(--nt-line)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${(qIdx / SUPQ.length) * 100}%`, background: "var(--nt-dark)" }}
                />
              </div>

              <div
                className="rounded-xl p-4 border mb-4"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <p className="text-base font-medium" style={{ color: "var(--nt-ink)" }}>
                  {SUPQ[qIdx].q}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {qOpc[qIdx].map((op, i) => {
                  let bg = "var(--nt-card)";
                  let border = "var(--nt-line)";
                  let color = "var(--nt-ink)";
                  if (qResp !== null) {
                    if (op.correct) { bg = "var(--nt-gbg)"; border = "var(--nt-g)"; color = "var(--nt-g)"; }
                    else if (i === qResp) { bg = "var(--nt-rbg)"; border = "var(--nt-r)"; color = "var(--nt-r)"; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => responder(i)}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                      style={{ background: bg, borderColor: border, color }}
                    >
                      {op.o}
                    </button>
                  );
                })}
              </div>

              {qResp !== null && (
                <div>
                  <div
                    className="rounded-xl px-4 py-3 mb-4 text-sm"
                    style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}
                  >
                    💡 {SUPQ[qIdx].e}
                  </div>
                  <button
                    onClick={siguiente}
                    className="w-full py-3 rounded-xl font-semibold text-white"
                    style={{ background: "var(--nt-dark)" }}
                  >
                    {qIdx < SUPQ.length - 1 ? "Siguiente →" : "Ver resultado"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold" style={{ color: "var(--nt-soft)" }}>{label}: </span>
      <span style={{ color: "var(--nt-ink)" }}>{value}</span>
    </div>
  );
}
