"use client";
import { useState, useEffect } from "react";
import { MITOS, type Veredicto } from "@/data/mitos";
import { QUIZ } from "@/data/quiz";

type QuizOpc = { o: string; correct: boolean }[];

type Tab = "mitos" | "quiz";

export default function RetosPage() {
  const [tab, setTab] = useState<Tab>("mitos");

  // Mitos game
  const [mIdx, setMIdx] = useState(0);
  const [mResp, setMResp] = useState<Veredicto | null>(null);
  const [mScore, setMScore] = useState(0);
  const [mFin, setMFin] = useState(false);

  // Quiz general
  const [qIdx, setQIdx] = useState(0);
  const [qResp, setQResp] = useState<number | null>(null);
  const [qScore, setQScore] = useState(0);
  const [qFin, setQFin] = useState(false);
  const [qOpc, setQOpc] = useState<QuizOpc[]>(
    () => QUIZ.map(p => p.o.map((o, i) => ({ o, correct: i === 0 })))
  );

  useEffect(() => {
    setQOpc(prev => prev.map(opts => [...opts].sort(() => Math.random() - 0.5)));
  }, []);

  function responderMito(v: Veredicto) {
    if (mResp !== null) return;
    setMResp(v);
    if (v === MITOS[mIdx][1]) setMScore(s => s + 1);
  }

  function siguienteMito() {
    if (mIdx < MITOS.length - 1) {
      setMIdx(i => i + 1);
      setMResp(null);
    } else {
      setMFin(true);
    }
  }

  function resetMitos() {
    setMIdx(0);
    setMResp(null);
    setMScore(0);
    setMFin(false);
  }

  function responderQuiz(i: number) {
    if (qResp !== null) return;
    setQResp(i);
    if (qOpc[qIdx][i].correct) setQScore(s => s + 1);
  }

  function siguienteQuiz() {
    if (qIdx < QUIZ.length - 1) {
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

  const mito = MITOS[mIdx];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Quiz y retos</h1>
      <p className="text-sm mb-5" style={{ color: "var(--nt-soft)" }}>
        Pon a prueba lo que sabes sobre nutrición deportiva
      </p>

      {/* Tabs */}
      <div
        className="flex rounded-xl mb-6 p-1"
        style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
      >
        {([["mitos", "🧠 Mitos V/F"], ["quiz", "❓ Quiz general"]] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={tab === t ? { background: "var(--nt-dark)", color: "#fff" } : { color: "var(--nt-soft)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* MITOS */}
      {tab === "mitos" && (
        <div>
          {mFin ? (
            <div className="text-center space-y-4 py-6">
              <div className="text-5xl">🧠</div>
              <div className="text-3xl font-bold" style={{ color: "var(--nt-dark)" }}>
                {mScore} / {MITOS.length}
              </div>
              <p style={{ color: "var(--nt-soft)" }}>
                {mScore >= 13
                  ? "¡Excelente! Tienes muy claro qué es mito y qué no."
                  : mScore >= 9
                  ? "Buen resultado. Repasa los conceptos que fallaste."
                  : "Vuelve a repasar la sección Aprende."}
              </p>
              <button
                onClick={resetMitos}
                className="px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: "var(--nt-dark)" }}
              >
                Repetir
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--nt-soft)" }}>
                <span>Mito {mIdx + 1} de {MITOS.length}</span>
                <span>Aciertos: {mScore}</span>
              </div>
              <div className="h-1.5 rounded-full mb-5" style={{ background: "var(--nt-line)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${(mIdx / MITOS.length) * 100}%`, background: "var(--nt-dark)" }}
                />
              </div>

              {/* Tarjeta del mito */}
              <div
                className="rounded-xl p-5 border mb-5 min-h-24 flex items-center"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <p className="text-base font-medium leading-relaxed" style={{ color: "var(--nt-ink)" }}>
                  {mito[0]}
                </p>
              </div>

              {/* Botones de respuesta / resultado */}
              {mResp === null ? (
                <div>
                  <p className="text-xs text-center mb-3" style={{ color: "var(--nt-soft)" }}>
                    ¿Es totalmente falso o hay matices?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => responderMito("F")}
                      className="py-4 rounded-xl font-semibold text-white text-sm"
                      style={{ background: "var(--nt-r)" }}
                    >
                      🚫 Falso
                    </button>
                    <button
                      onClick={() => responderMito("D")}
                      className="py-4 rounded-xl font-semibold text-sm border-2"
                      style={{
                        background: "var(--nt-abg)",
                        color: "var(--nt-a)",
                        borderColor: "var(--nt-a)",
                      }}
                    >
                      ⚠️ Matizable
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="rounded-xl px-4 py-3 mb-3"
                    style={{
                      background: mResp === mito[1] ? "var(--nt-gbg)" : "var(--nt-rbg)",
                    }}
                  >
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ color: mResp === mito[1] ? "var(--nt-g)" : "var(--nt-r)" }}
                    >
                      {mResp === mito[1] ? "✅ ¡Correcto!" : "❌ No exactamente"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--nt-ink)" }}>
                      Veredicto correcto:{" "}
                      <strong>{mito[1] === "F" ? "Falso" : "Matizable"}</strong>
                    </p>
                  </div>
                  <div
                    className="rounded-xl px-4 py-3 mb-4 text-sm"
                    style={{ background: "var(--nt-abg)", color: "var(--nt-a)" }}
                  >
                    💡 {mito[2]}
                  </div>
                  <button
                    onClick={siguienteMito}
                    className="w-full py-3 rounded-xl font-semibold text-white"
                    style={{ background: "var(--nt-dark)" }}
                  >
                    {mIdx < MITOS.length - 1 ? "Siguiente →" : "Ver resultado"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* QUIZ GENERAL */}
      {tab === "quiz" && (
        <div>
          {qFin ? (
            <div className="text-center space-y-4 py-6">
              <div className="text-5xl">🏆</div>
              <div className="text-3xl font-bold" style={{ color: "var(--nt-dark)" }}>
                {qScore} / {QUIZ.length}
              </div>
              <p style={{ color: "var(--nt-soft)" }}>
                {qScore >= 12
                  ? "¡Sobresaliente! Dominas la nutrición deportiva."
                  : qScore >= 8
                  ? "Buen resultado. Repasa los conceptos que fallaste."
                  : "Vuelve a repasar la sección Aprende y los menús."}
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
                <span>Pregunta {qIdx + 1} de {QUIZ.length}</span>
                <span>Aciertos: {qScore}</span>
              </div>
              <div className="h-1.5 rounded-full mb-5" style={{ background: "var(--nt-line)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${(qIdx / QUIZ.length) * 100}%`, background: "var(--nt-dark)" }}
                />
              </div>

              <div
                className="rounded-xl p-4 border mb-4"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <p className="text-base font-medium" style={{ color: "var(--nt-ink)" }}>
                  {QUIZ[qIdx].q}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {qOpc[qIdx].map((op, i) => {
                  let bg = "var(--nt-card)";
                  let border = "var(--nt-line)";
                  let color = "var(--nt-ink)";
                  if (qResp !== null) {
                    if (op.correct) {
                      bg = "var(--nt-gbg)";
                      border = "var(--nt-g)";
                      color = "var(--nt-g)";
                    } else if (i === qResp) {
                      bg = "var(--nt-rbg)";
                      border = "var(--nt-r)";
                      color = "var(--nt-r)";
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => responderQuiz(i)}
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
                    💡 {QUIZ[qIdx].e}
                  </div>
                  <button
                    onClick={siguienteQuiz}
                    className="w-full py-3 rounded-xl font-semibold text-white"
                    style={{ background: "var(--nt-dark)" }}
                  >
                    {qIdx < QUIZ.length - 1 ? "Siguiente →" : "Ver resultado"}
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
