"use client";
import { useState } from "react";
import Link from "next/link";
import { parseCodes, scoreOf, TEST, TBLK, type Bloque } from "@/data/test-clase";
import { ChevronLeft, ClipboardList, Download } from "lucide-react";

interface FilaTest {
  nombre: string;
  fase: "I" | "F";
  N: number;
  S: number;
  M: number;
  T: number;
}

export default function PanelTestPage() {
  const [codigosRaw, setCodigosRaw] = useState("");
  const [filas, setFilas] = useState<FilaTest[]>([]);
  const [errores, setErrores] = useState<string[]>([]);

  function analizar() {
    const { ok, bad } = parseCodes(codigosRaw);
    setErrores(bad);
    setFilas(
      ok.map((p) => ({
        nombre: p.name,
        fase: p.fase,
        ...scoreOf(p.ans),
      }))
    );
  }

  function descargarCSV() {
    const cabecera = "Nombre,Fase,N (Nutrición),S (Suplementación),M (Mitos),Total\n";
    const filas_csv = filas
      .map((f) =>
        [
          f.nombre,
          f.fase === "I" ? "Inicio" : "Final",
          f.N,
          f.S,
          f.M,
          f.T,
        ]
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

  const bloques: Bloque[] = ["N", "S", "M"];

  const medias =
    filas.length > 0
      ? {
          N: (filas.reduce((s, f) => s + f.N, 0) / filas.length).toFixed(1),
          S: (filas.reduce((s, f) => s + f.S, 0) / filas.length).toFixed(1),
          M: (filas.reduce((s, f) => s + f.M, 0) / filas.length).toFixed(1),
          T: (filas.reduce((s, f) => s + f.T, 0) / filas.length).toFixed(1),
        }
      : null;

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
            placeholder={
              "NUTRI1|I|Ana García|DABCBDCABBCDABDABCDBCAD\nNUTRI1|I|Luis Pérez|..."
            }
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

        {/* Errores de formato */}
        {errores.length > 0 && (
          <div
            className="rounded-xl p-3 space-y-1"
            style={{ background: "var(--nt-rbg)", border: "1px solid var(--nt-r)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--nt-r)" }}>
              {errores.length} línea{errores.length !== 1 ? "s" : ""} con formato incorrecto
              (ignoradas):
            </p>
            {errores.map((e, i) => (
              <p key={i} className="text-xs font-mono truncate" style={{ color: "var(--nt-soft)" }}>
                {e}
              </p>
            ))}
          </div>
        )}

        {/* Resumen de clase */}
        {medias && (
          <div
            className="rounded-xl border p-4 space-y-4"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--nt-dark)" }}>
              Media de clase — {filas.length} alumno{filas.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {([...bloques, "T"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-lg p-2 text-center"
                  style={{ background: "var(--nt-bg)" }}
                >
                  <div className="text-lg font-bold" style={{ color: "var(--nt-dark)" }}>
                    {medias[k as keyof typeof medias]}
                  </div>
                  <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                    {k === "T" ? `/ ${TEST.length}` : "/ 8"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--nt-soft)" }}>
                    {k === "T" ? "Total" : k}
                  </div>
                </div>
              ))}
            </div>
            {/* Barras por bloque */}
            <div className="space-y-2">
              {bloques.map((b) => (
                <div key={b}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--nt-soft)" }}>{TBLK[b]}</span>
                    <span style={{ color: "var(--nt-dark)" }}>{medias[b]} / 8</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--nt-line)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(parseFloat(medias[b]) / 8) * 100}%`,
                        background: "var(--nt-mid)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de alumnos */}
        {filas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border overflow-hidden"
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
                <div className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
                  {f.T}
                </div>
                <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                  / {TEST.length}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filas.length === 0 && codigosRaw.trim() === "" && (
          <p className="text-xs text-center py-8" style={{ color: "var(--nt-soft)" }}>
            Pega los códigos que te envíen los alumnos y pulsa «Ver resultados».
          </p>
        )}
      </div>
    </div>
  );
}
