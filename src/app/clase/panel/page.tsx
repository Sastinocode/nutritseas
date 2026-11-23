"use client";
import { useState } from "react";
import Link from "next/link";
import { parseCodes, scoreOf, TEST, TBLK, type Bloque } from "@/data/test-clase";
import { ChevronLeft, ClipboardList, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FilaTest {
  nombre: string;
  fase: "I" | "F";
  N: number;
  S: number;
  M: number;
  T: number;
}

interface Par {
  nombre: string;
  I: { N: number; S: number; M: number; T: number };
  F: { N: number; S: number; M: number; T: number };
}

const BLOQUE_COLOR: Record<Bloque, string> = {
  N: "var(--nt-mid)",
  S: "var(--nt-g)",
  M: "var(--nt-a)",
};

const BLOQUES: Bloque[] = ["N", "S", "M"];

function Delta({ val }: { val: number }) {
  const color = val > 0 ? "var(--nt-g)" : val < 0 ? "var(--nt-r)" : "var(--nt-soft)";
  const Icon = val > 0 ? TrendingUp : val < 0 ? TrendingDown : Minus;
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold" style={{ color }}>
      <Icon size={11} />
      {val > 0 ? `+${val}` : val}
    </span>
  );
}

export default function PanelTestPage() {
  const [codigosRaw, setCodigosRaw] = useState("");
  const [filas, setFilas] = useState<FilaTest[]>([]);
  const [errores, setErrores] = useState<string[]>([]);

  function analizar() {
    const { ok, bad } = parseCodes(codigosRaw);
    setErrores(bad);
    setFilas(ok.map((p) => ({ nombre: p.name, fase: p.fase, ...scoreOf(p.ans) })));
  }

  // Agrupar por nombre normalizado; si hay duplicado de fase, gana el último
  const byNombre = new Map<string, { I?: FilaTest; F?: FilaTest }>();
  for (const f of filas) {
    const key = f.nombre.trim().toLowerCase();
    const entry = byNombre.get(key) ?? {};
    entry[f.fase] = f;
    byNombre.set(key, entry);
  }

  const pares: Par[] = [];
  const solos: FilaTest[] = [];
  for (const entry of byNombre.values()) {
    if (entry.I && entry.F) {
      pares.push({ nombre: entry.F.nombre, I: entry.I, F: entry.F });
    } else {
      if (entry.I) solos.push(entry.I);
      if (entry.F) solos.push(entry.F);
    }
  }
  // Ordenar por mejora descendente
  pares.sort((a, b) => (b.F.T - b.I.T) - (a.F.T - a.I.T));

  // Medias separadas I / F cuando hay pares
  const mediasI = pares.length > 0 ? {
    N: (pares.reduce((s, p) => s + p.I.N, 0) / pares.length).toFixed(1),
    S: (pares.reduce((s, p) => s + p.I.S, 0) / pares.length).toFixed(1),
    M: (pares.reduce((s, p) => s + p.I.M, 0) / pares.length).toFixed(1),
    T: (pares.reduce((s, p) => s + p.I.T, 0) / pares.length).toFixed(1),
  } : null;
  const mediasF = pares.length > 0 ? {
    N: (pares.reduce((s, p) => s + p.F.N, 0) / pares.length).toFixed(1),
    S: (pares.reduce((s, p) => s + p.F.S, 0) / pares.length).toFixed(1),
    M: (pares.reduce((s, p) => s + p.F.M, 0) / pares.length).toFixed(1),
    T: (pares.reduce((s, p) => s + p.F.T, 0) / pares.length).toFixed(1),
  } : null;

  // Medias planas para los solos
  const mediasSolos = solos.length > 0 ? {
    N: (solos.reduce((s, f) => s + f.N, 0) / solos.length).toFixed(1),
    S: (solos.reduce((s, f) => s + f.S, 0) / solos.length).toFixed(1),
    M: (solos.reduce((s, f) => s + f.M, 0) / solos.length).toFixed(1),
    T: (solos.reduce((s, f) => s + f.T, 0) / solos.length).toFixed(1),
  } : null;

  function descargarCSV() {
    const cabecera = "Nombre,Fase,N (Nutrición),S (Suplementación),M (Mitos),Total\n";
    const filas_csv = filas
      .map((f) =>
        [f.nombre, f.fase === "I" ? "Inicio" : "Final", f.N, f.S, f.M, f.T]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([cabecera + filas_csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--nt-bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14"
        style={{ background: "var(--nt-card)", borderBottom: "1px solid var(--nt-line)" }}
      >
        <Link href="/clase" className="p-1 -ml-1" style={{ color: "var(--nt-soft)" }}>
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ClipboardList size={18} style={{ color: "var(--nt-mid)" }} />
          <span className="font-bold text-sm" style={{ color: "var(--nt-dark)" }}>
            Resultados del test
          </span>
        </div>
        {filas.length > 0 && (
          <button
            onClick={descargarCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0"
            style={{ background: "var(--nt-dark)", color: "#fff" }}
          >
            <Download size={13} />
            CSV
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Área de pegado */}
        <div className="space-y-3">
          <label className="text-sm font-semibold block" style={{ color: "var(--nt-dark)" }}>
            Pega aquí los códigos de los alumnos (uno por línea)
          </label>
          <textarea
            value={codigosRaw}
            onChange={(e) => setCodigosRaw(e.target.value)}
            rows={6}
            placeholder={"NUTRI1|I|Ana García|DABCBDCABBCDABDABCDBCAD\nNUTRI1|F|Ana García|..."}
            className="w-full text-xs rounded-xl p-3 outline-none resize-none font-mono"
            style={{
              background: "var(--nt-card)",
              border: "1px solid var(--nt-line)",
              color: "var(--nt-dark)",
            }}
          />
          <button
            onClick={analizar}
            disabled={!codigosRaw.trim()}
            className="w-full py-3 text-sm font-semibold rounded-xl"
            style={{
              background: codigosRaw.trim() ? "var(--nt-dark)" : "var(--nt-line)",
              color: codigosRaw.trim() ? "#fff" : "var(--nt-soft)",
            }}
          >
            Ver resultados
          </button>
        </div>

        {/* Errores */}
        {errores.length > 0 && (
          <div
            className="rounded-xl p-3 space-y-1"
            style={{ background: "var(--nt-rbg)", border: "1px solid var(--nt-r)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--nt-r)" }}>
              {errores.length} línea{errores.length !== 1 ? "s" : ""} con formato incorrecto (ignoradas):
            </p>
            {errores.map((e, i) => (
              <p key={i} className="text-xs font-mono truncate" style={{ color: "var(--nt-soft)" }}>
                {e}
              </p>
            ))}
          </div>
        )}

        {/* ── Comparativa I → F ── */}
        {pares.length > 0 && (
          <div className="space-y-3">
            {/* Resumen de mejora de clase */}
            {mediasI && mediasF && (
              <div
                className="rounded-xl border p-4 space-y-3"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "var(--nt-dark)" }}>
                  Media de clase — {pares.length} alumno{pares.length !== 1 ? "s" : ""} con I+F
                </p>
                {/* Total */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold" style={{ color: "var(--nt-soft)" }}>
                      {mediasI.T}
                    </div>
                    <div className="text-xs" style={{ color: "var(--nt-soft)" }}>Inicio / {TEST.length}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-lg" style={{ color: "var(--nt-line)" }}>→</div>
                    <Delta val={parseFloat((parseFloat(mediasF.T) - parseFloat(mediasI.T)).toFixed(1))} />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
                      {mediasF.T}
                    </div>
                    <div className="text-xs" style={{ color: "var(--nt-soft)" }}>Final / {TEST.length}</div>
                  </div>
                </div>
                {/* Por bloque */}
                <div className="space-y-2 pt-1" style={{ borderTop: "1px solid var(--nt-line)" }}>
                  {BLOQUES.map((b) => {
                    const dI = parseFloat(mediasI[b]);
                    const dF = parseFloat(mediasF[b]);
                    const delta = parseFloat((dF - dI).toFixed(1));
                    return (
                      <div key={b}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: BLOQUE_COLOR[b] }}>{TBLK[b]}</span>
                          <span style={{ color: "var(--nt-soft)" }}>
                            {dI} → {dF} /8 &nbsp; <Delta val={delta} />
                          </span>
                        </div>
                        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nt-line)" }}>
                          <div
                            className="absolute h-full rounded-full opacity-40"
                            style={{ width: `${(dI / 8) * 100}%`, background: BLOQUE_COLOR[b] }}
                          />
                          <div
                            className="absolute h-full rounded-full"
                            style={{ width: `${(dF / 8) * 100}%`, background: BLOQUE_COLOR[b] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tarjetas individuales */}
            <p className="text-xs font-semibold" style={{ color: "var(--nt-dark)" }}>
              Por alumno — Inicio → Final
            </p>
            {pares.map((par, i) => {
              const delta = par.F.T - par.I.T;
              return (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden"
                  style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
                >
                  {/* Fila nombre + total */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: "1px solid var(--nt-line)" }}
                  >
                    <div className="flex-1 font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>
                      {par.nombre}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: "var(--nt-soft)" }}>
                        {par.I.T}
                      </span>
                      <span style={{ color: "var(--nt-line)" }}>→</span>
                      <span className="text-sm font-bold" style={{ color: "var(--nt-dark)" }}>
                        {par.F.T}
                      </span>
                      <span className="text-xs" style={{ color: "var(--nt-soft)" }}>/ {TEST.length}</span>
                      <Delta val={delta} />
                    </div>
                  </div>
                  {/* Bloques */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-3">
                    {BLOQUES.map((b) => {
                      const d = par.F[b] - par.I[b];
                      return (
                        <div key={b} className="text-center">
                          <div className="text-xs mb-0.5 font-medium" style={{ color: BLOQUE_COLOR[b] }}>
                            {TBLK[b]}
                          </div>
                          <div className="text-sm" style={{ color: "var(--nt-soft)" }}>
                            {par.I[b]} → {par.F[b]}
                            <span className="text-xs"> /8</span>
                          </div>
                          <Delta val={d} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Alumnos sin par ── */}
        {solos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold" style={{ color: "var(--nt-soft)" }}>
              Sin comparativa — {solos.length} resultado{solos.length !== 1 ? "s" : ""}
            </p>
            {/* Media de solos */}
            {mediasSolos && (
              <div
                className="rounded-xl border p-3"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <div className="grid grid-cols-4 gap-2">
                  {([...BLOQUES, "T"] as const).map((k) => (
                    <div key={k} className="rounded-lg p-2 text-center" style={{ background: "var(--nt-bg)" }}>
                      <div className="text-base font-bold" style={{ color: "var(--nt-dark)" }}>
                        {mediasSolos[k as keyof typeof mediasSolos]}
                      </div>
                      <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                        {k === "T" ? `/${TEST.length}` : "/8"}
                      </div>
                      <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                        {k === "T" ? "Total" : k}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {solos.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>
                      {f.nombre}
                    </div>
                    <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                      {f.fase === "I" ? "Inicio" : "Final"} · N:{f.N}/8 · S:{f.S}/8 · M:{f.M}/8
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>{f.T}</div>
                    <div className="text-xs" style={{ color: "var(--nt-soft)" }}>/ {TEST.length}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filas.length === 0 && codigosRaw.trim() === "" && (
          <p className="text-xs text-center py-8" style={{ color: "var(--nt-soft)" }}>
            Pega los códigos que te envíen los alumnos y pulsa «Ver resultados».<br />
            <span className="mt-1 block">Si pegas códigos de Inicio y Final del mismo alumno, verás la comparativa automáticamente.</span>
          </p>
        )}
      </div>
    </div>
  );
}
