"use client";
import { useState } from "react";
import Link from "next/link";
import { ALIMENTOS } from "@/data/alimentos";
import { PERFILES } from "@/data/perfiles";
import { calcNutri, semaforo, parseMenuCodes, type SemaforoResult } from "@/lib/constructor";
import { ChevronLeft, ClipboardList, Download, ChevronDown } from "lucide-react";

type Luz = "verde" | "ambar" | "rojo";

interface FilaAnalisis {
  nombre: string;
  perfilId: string;
  perfilNombre: string;
  fecha: string;
  kcal: number;
  proteina: number;
  fibra: number;
  justificacion: string;
  semaforo: SemaforoResult | null;
  raw: string;
}

const LUZ_COLORS: Record<Luz, { fg: string; bg: string }> = {
  verde: { fg: "var(--nt-g)", bg: "var(--nt-gbg)" },
  ambar: { fg: "var(--nt-a)", bg: "var(--nt-abg)" },
  rojo:  { fg: "var(--nt-r)", bg: "var(--nt-rbg)" },
};

const CRITERIO_LABELS: Record<string, string> = {
  energia: "Energía", proteina: "Proteína", macros: "Grasas",
  fibra: "Fibra", restricciones: "Restricciones", justificacion: "Justificación",
};

export default function PanelProfePage() {
  const [codigosRaw, setCodigosRaw] = useState("");
  const [filas, setFilas] = useState<FilaAnalisis[]>([]);
  const [errores, setErrores] = useState<string[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);

  function analizar() {
    const { ok, bad } = parseMenuCodes(codigosRaw);
    setErrores(bad);

    const resultado: FilaAnalisis[] = ok.map(parsed => {
      const perfil = PERFILES.find(p => p.id === parsed.perfilId);
      const items = parsed.items
        .map(it => {
          const alimento = ALIMENTOS.find(a => a.id === it.alimentoId);
          return alimento ? { alimento, gramos: it.gramos } : null;
        })
        .filter(Boolean) as { alimento: (typeof ALIMENTOS)[0]; gramos: number }[];

      const total = calcNutri(items);
      const sem = perfil ? semaforo(items, total, perfil, parsed.justificacion) : null;

      return {
        nombre: parsed.nombre,
        perfilId: parsed.perfilId,
        perfilNombre: perfil?.titulo ?? (parsed.perfilId === "para-mi" ? "Perfil personal" : parsed.perfilId),
        fecha: parsed.fecha,
        kcal: Math.round(total.kcal),
        proteina: parseFloat(total.p.toFixed(1)),
        fibra: parseFloat(total.fib.toFixed(1)),
        justificacion: parsed.justificacion,
        semaforo: sem,
        raw: parsed.nombre,
      };
    });

    setFilas(resultado);
  }

  function descargarCSV() {
    const cabecera = "Nombre,Perfil,Fecha,kcal,Proteína(g),Fibra(g),Energía,Proteína,Grasas,Fibra,Restricciones,Justificación\n";
    const filas_csv = filas.map(f => {
      const s = f.semaforo;
      return [
        f.nombre, f.perfilNombre, f.fecha, f.kcal, f.proteina, f.fibra,
        s?.energia.luz ?? "-", s?.proteina.luz ?? "-", s?.macros.luz ?? "-",
        s?.fibra.luz ?? "-", s?.restricciones.luz ?? "-", s?.justificacion.luz ?? "-",
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
    }).join("\n");

    const blob = new Blob([cabecera + filas_csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `menus-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resumenGlobal() {
    if (filas.length === 0) return null;
    const criterios = ["energia", "proteina", "macros", "fibra", "restricciones", "justificacion"] as const;
    return criterios.map(k => {
      const counts = { verde: 0, ambar: 0, rojo: 0, na: 0 };
      filas.forEach(f => {
        const luz = f.semaforo?.[k]?.luz;
        if (luz) counts[luz]++;
        else counts.na++;
      });
      return { k, ...counts };
    });
  }

  const resumen = resumenGlobal();

  return (
    <div className="min-h-screen" style={{ background: "var(--nt-bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14"
        style={{ background: "var(--nt-card)", borderBottom: "1px solid var(--nt-line)" }}
      >
        <Link href="/menus" className="p-1 -ml-1" style={{ color: "var(--nt-soft)" }}>
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <ClipboardList size={18} style={{ color: "var(--nt-mid)" }} />
          <span className="font-bold text-sm" style={{ color: "var(--nt-dark)" }}>Panel del profe</span>
        </div>
        {filas.length > 0 && (
          <button
            onClick={descargarCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg"
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
            onChange={e => setCodigosRaw(e.target.value)}
            rows={6}
            placeholder={"MENU1|Ana García|laura|2026-11-23|pollo:150,...|Elegí este menú porque...\nMENU1|Luis Pérez|marcos|2026-11-23|..."}
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
            Analizar menús
          </button>
        </div>

        {/* Errores de formato */}
        {errores.length > 0 && (
          <div className="rounded-xl p-3 space-y-1" style={{ background: "var(--nt-rbg)", border: "1px solid var(--nt-r)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--nt-r)" }}>
              {errores.length} línea{errores.length > 1 ? "s" : ""} con formato incorrecto (ignoradas):
            </p>
            {errores.map((e, i) => (
              <p key={i} className="text-xs font-mono truncate" style={{ color: "var(--nt-soft)" }}>{e}</p>
            ))}
          </div>
        )}

        {/* Resumen global */}
        {resumen && filas.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--nt-dark)" }}>
              Resumen clase — {filas.length} menú{filas.length > 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              {resumen.map(({ k, verde, ambar, rojo, na }) => {
                const total = filas.length;
                return (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--nt-soft)" }}>{CRITERIO_LABELS[k]}</span>
                      <span style={{ color: "var(--nt-dark)" }}>
                        {verde}V · {ambar}A · {rojo}R{na > 0 ? ` · ${na}N/A` : ""}
                      </span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      {verde > 0 && (
                        <div style={{ flex: verde / total, background: "var(--nt-g)" }} />
                      )}
                      {ambar > 0 && (
                        <div style={{ flex: ambar / total, background: "var(--nt-a)" }} />
                      )}
                      {rojo > 0 && (
                        <div style={{ flex: rojo / total, background: "var(--nt-r)" }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filas por alumno */}
        {filas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            {/* Cabecera de fila */}
            <button
              className="w-full text-left px-4 py-3 flex items-center gap-3"
              onClick={() => setExpandido(expandido === i ? null : i)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: "var(--nt-dark)" }}>{f.nombre}</div>
                <div className="text-xs" style={{ color: "var(--nt-soft)" }}>
                  {f.perfilNombre} · {f.fecha} · {f.kcal} kcal · {f.proteina} g prot · {f.fibra} g fibra
                </div>
              </div>
              {/* Mini semáforo */}
              {f.semaforo && (
                <div className="flex gap-1 flex-shrink-0">
                  {(["energia", "proteina", "fibra", "restricciones"] as const).map(k => {
                    const luz = f.semaforo![k].luz as Luz;
                    return (
                      <div
                        key={k}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: LUZ_COLORS[luz].fg }}
                        title={`${CRITERIO_LABELS[k]}: ${luz}`}
                      />
                    );
                  })}
                </div>
              )}
              <ChevronDown
                size={15}
                style={{
                  color: "var(--nt-soft)",
                  transform: expandido === i ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              />
            </button>

            {/* Detalle expandido */}
            {expandido === i && (
              <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--nt-line)" }}>
                {/* Semáforo detalle */}
                {f.semaforo ? (
                  <div className="space-y-2 pt-3">
                    {(["energia", "proteina", "macros", "fibra", "restricciones", "justificacion"] as const).map(k => {
                      const r = f.semaforo![k];
                      const luz = r.luz as Luz;
                      const { fg, bg } = LUZ_COLORS[luz];
                      return (
                        <div key={k} className="rounded-lg px-3 py-2" style={{ background: bg }}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: fg }} />
                            <span className="text-xs font-semibold" style={{ color: fg }}>{CRITERIO_LABELS[k]}</span>
                          </div>
                          <p className="text-xs pl-4" style={{ color: "var(--nt-dark)" }}>{r.mensaje}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs pt-3" style={{ color: "var(--nt-soft)" }}>
                    Perfil personal — no se puede calcular el semáforo sin los datos del alumno.
                  </p>
                )}

                {/* Justificación del alumno */}
                {f.justificacion && (
                  <div className="rounded-lg p-3" style={{ background: "var(--nt-bg)", border: "1px solid var(--nt-line)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--nt-dark)" }}>Justificación del alumno</p>
                    <p className="text-xs" style={{ color: "var(--nt-soft)" }}>{f.justificacion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filas.length === 0 && codigosRaw.trim() === "" && (
          <p className="text-xs text-center py-8" style={{ color: "var(--nt-soft)" }}>
            Pega los códigos que te envíen los alumnos y pulsa «Analizar menús».
          </p>
        )}

        <p className="text-xs text-center pb-4" style={{ color: "var(--nt-soft)" }}>
          Orientativo. No sustituye a un dietista-nutricionista.
        </p>
      </div>
    </div>
  );
}
