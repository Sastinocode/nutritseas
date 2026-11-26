"use client";
import { useState } from "react";
import {
  calcularObjetivo,
  calcularMacros,
  FACTORES_ACTIVIDAD,
  type Sexo,
} from "@/lib/nutricion";

type Meta = "mantenimiento" | "deficit" | "superavit";

interface Resultado {
  mb: number;
  get: number;
  kcal: number;
  prot: number;
  hidr: number;
  gras: number;
  aviso?: string;
}

const META_INFO: Record<Meta, { label: string; emoji: string; desc: string }> = {
  mantenimiento: { label: "Mantenimiento", emoji: "⚖️", desc: "Mantener el peso actual" },
  deficit: { label: "Pérdida de grasa", emoji: "🔥", desc: "Déficit moderado (300-500 kcal)" },
  superavit: { label: "Ganancia muscular", emoji: "💪", desc: "Superávit de 300 kcal" },
};

export default function CalcularPage() {
  const [sexo, setSexo] = useState<Sexo>("hombre");
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [edad, setEdad] = useState("");
  const [actividad, setActividad] = useState<number>(FACTORES_ACTIVIDAD[2].value);
  const [meta, setMeta] = useState<Meta>("mantenimiento");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  function calcular() {
    const p = parseFloat(peso);
    const t = parseFloat(talla);
    const e = parseInt(edad);
    if (!p || !t || !e || p < 30 || p > 300 || t < 100 || t > 250 || e < 10 || e > 100) return;

    const perfil = { peso: p, talla: t, edad: e, sexo, actividad };
    const obj = calcularObjetivo(perfil, meta);
    const macros = calcularMacros(obj.kcal, p, meta);

    setResultado({
      mb: obj.mb,
      get: obj.get,
      kcal: obj.kcal,
      prot: macros.p,
      hidr: macros.h,
      gras: macros.g,
      aviso: obj.aviso,
    });
  }

  const inputStyle = {
    background: "var(--nt-bg)",
    border: "1px solid var(--nt-line)",
    color: "var(--nt-ink)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "1rem",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Calculadora</h1>
      <p className="text-sm mb-6" style={{ color: "var(--nt-soft)" }}>
        Estima tu gasto energético y distribución de macros
      </p>

      {/* Formulario */}
      <div
        className="rounded-xl p-5 border mb-5 space-y-5"
        style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
      >
        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--nt-ink)" }}>Sexo</label>
          <div className="flex gap-3">
            {(["hombre", "mujer"] as Sexo[]).map(s => (
              <button
                key={s}
                onClick={() => setSexo(s)}
                className="flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors"
                style={
                  sexo === s
                    ? { background: "var(--nt-dark)", color: "#fff" }
                    : { background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
                }
              >
                {s === "hombre" ? "👨 Hombre" : "👩 Mujer"}
              </button>
            ))}
          </div>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--nt-soft)" }}>Peso (kg)</label>
            <input
              type="number"
              min={30} max={300}
              placeholder="70"
              value={peso}
              onChange={e => setPeso(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--nt-soft)" }}>Talla (cm)</label>
            <input
              type="number"
              min={100} max={250}
              placeholder="175"
              value={talla}
              onChange={e => setTalla(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--nt-soft)" }}>Edad</label>
            <input
              type="number"
              min={10} max={100}
              placeholder="25"
              value={edad}
              onChange={e => setEdad(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Actividad */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--nt-ink)" }}>Nivel de actividad</label>
          <select
            value={actividad}
            onChange={e => setActividad(parseFloat(e.target.value))}
            style={inputStyle}
          >
            {FACTORES_ACTIVIDAD.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Meta */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--nt-ink)" }}>Objetivo</label>
          <div className="space-y-2">
            {(Object.entries(META_INFO) as [Meta, typeof META_INFO[Meta]][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setMeta(k)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                style={
                  meta === k
                    ? { background: "var(--nt-dark)", color: "#fff" }
                    : { background: "var(--nt-bg)", border: "1px solid var(--nt-line)", color: "var(--nt-ink)" }
                }
              >
                <span className="text-xl">{v.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{v.label}</div>
                  <div className="text-xs opacity-70">{v.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={calcular}
          className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
          style={{ background: "var(--nt-dark)" }}
        >
          Calcular
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-4">
          {resultado.aviso && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "var(--nt-abg)", color: "var(--nt-a)", border: "1px solid var(--nt-a)" }}
            >
              ⚠️ {resultado.aviso}
            </div>
          )}

          {/* Tarjetas energía */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Metabolismo basal", value: resultado.mb, sub: "MB (en reposo)" },
              { label: "Gasto total", value: resultado.get, sub: "GET con actividad" },
              { label: "Objetivo", value: resultado.kcal, sub: META_INFO[meta].label },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center border"
                style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
              >
                <div className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>{value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: "var(--nt-ink)" }}>kcal</div>
                <div className="text-xs mt-1" style={{ color: "var(--nt-soft)" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Macros */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
          >
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--nt-ink)" }}>Distribución de macros</h3>
            <div className="space-y-3">
              {[
                { label: "Proteínas", g: resultado.prot, color: "var(--nt-prot)", kcal: resultado.prot * 4 },
                { label: "Hidratos", g: resultado.hidr, color: "var(--nt-carb)", kcal: resultado.hidr * 4 },
                { label: "Grasas", g: resultado.gras, color: "var(--nt-fat)", kcal: resultado.gras * 9 },
              ].map(({ label, g, color, kcal }) => {
                const pct = Math.round((kcal / resultado.kcal) * 100);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium" style={{ color: "var(--nt-ink)" }}>{label}</span>
                      <span style={{ color: "var(--nt-soft)" }}>{g} g · {pct} %</span>
                    </div>
                    <div className="h-3 rounded-full" style={{ background: "var(--nt-line)" }}>
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-center px-2" style={{ color: "var(--nt-soft)" }}>
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </p>
        </div>
      )}
    </div>
  );
}
