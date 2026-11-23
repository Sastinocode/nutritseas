import { calcularMB } from "@/lib/nutricion";
import type { Alimento } from "@/data/alimentos";
import type { Perfil } from "@/data/perfiles";

export interface NutriTotal {
  kcal: number;
  p: number;
  c: number;
  g: number;
  fib: number;
  azuc: number;
  sat: number;
  fe: number;
  ca: number;
  mg: number;
  k: number;
  na: number;
  vc: number;
  vd: number;
  b12: number;
}

export interface MenuItem {
  alimento: Alimento;
  gramos: number;
}

export function calcNutri(items: MenuItem[]): NutriTotal {
  const zero: NutriTotal = { kcal: 0, p: 0, c: 0, g: 0, fib: 0, azuc: 0, sat: 0, fe: 0, ca: 0, mg: 0, k: 0, na: 0, vc: 0, vd: 0, b12: 0 };
  return items.reduce((acc, { alimento: a, gramos }) => {
    const f = gramos / 100;
    return {
      kcal: acc.kcal + a.kcal * f,
      p: acc.p + a.p * f,
      c: acc.c + a.c * f,
      g: acc.g + a.g * f,
      fib: acc.fib + a.fib * f,
      azuc: acc.azuc + a.azuc * f,
      sat: acc.sat + a.sat * f,
      fe: acc.fe + a.fe * f,
      ca: acc.ca + a.ca * f,
      mg: acc.mg + a.mg * f,
      k: acc.k + a.k * f,
      na: acc.na + a.na * f,
      vc: acc.vc + a.vc * f,
      vd: acc.vd + a.vd * f,
      b12: acc.b12 + a.b12 * f,
    };
  }, zero);
}

export function bmrFromPerfil(perfil: Perfil): number {
  return calcularMB({
    peso: perfil.peso_kg,
    talla: perfil.altura_cm,
    edad: perfil.edad,
    sexo: perfil.sexo === "H" ? "hombre" : "mujer",
    actividad: 1,
  });
}

export type Luz = "verde" | "ambar" | "rojo";

export interface CriterioResult {
  luz: Luz;
  mensaje: string;
}

export interface SemaforoResult {
  energia: CriterioResult;
  proteina: CriterioResult;
  macros: CriterioResult;
  fibra: CriterioResult;
  restricciones: CriterioResult;
  justificacion: CriterioResult;
}

function conflicta(alimento: Alimento, restriccion: string): boolean {
  if (restriccion === "vegetariano") {
    return alimento.grupo === "Carnes" || alimento.grupo === "Pescados y mariscos";
  }
  if (restriccion === "sin lactosa") {
    return alimento.grupo === "Huevos y lácteos" && alimento.id !== "huevo";
  }
  return false;
}

export function semaforo(
  items: MenuItem[],
  total: NutriTotal,
  perfil: Perfil,
  justificacion: string,
): SemaforoResult {
  const tope = perfil.kcal_objetivo;

  // Criterio 1: Energía (±20% del objetivo)
  const pctEnergia = total.kcal / tope;
  let energia: CriterioResult;
  if (pctEnergia >= 0.9 && pctEnergia <= 1.1) {
    energia = { luz: "verde", mensaje: `${Math.round(total.kcal)} kcal (objetivo ${tope} kcal)` };
  } else if (pctEnergia >= 0.8 && pctEnergia <= 1.2) {
    energia = { luz: "ambar", mensaje: `${Math.round(total.kcal)} kcal, algo alejado del objetivo de ${tope} kcal` };
  } else {
    energia = { luz: "rojo", mensaje: `${Math.round(total.kcal)} kcal, muy alejado del objetivo de ${tope} kcal` };
  }

  // Criterio 2: Proteína (dentro del rango g/kg)
  const pMin = perfil.proteina_g_kg[0] * perfil.peso_kg;
  const pMax = perfil.proteina_g_kg[1] * perfil.peso_kg;
  let proteina: CriterioResult;
  if (total.p >= pMin && total.p <= pMax) {
    proteina = { luz: "verde", mensaje: `${total.p.toFixed(1)} g proteína (rango ${pMin.toFixed(0)}-${pMax.toFixed(0)} g)` };
  } else if (total.p >= pMin * 0.85 && total.p <= pMax * 1.15) {
    proteina = { luz: "ambar", mensaje: `${total.p.toFixed(1)} g proteína, ligeramente fuera del rango ${pMin.toFixed(0)}-${pMax.toFixed(0)} g` };
  } else {
    proteina = { luz: "rojo", mensaje: `${total.p.toFixed(1)} g proteína, fuera del rango ${pMin.toFixed(0)}-${pMax.toFixed(0)} g` };
  }

  // Criterio 3: Macros (grasas entre 20-35% de la energía)
  const grasaPct = (total.g * 9 / total.kcal) * 100;
  const [gMin, gMax] = perfil.grasa_pct;
  let macros: CriterioResult;
  if (total.kcal === 0) {
    macros = { luz: "rojo", mensaje: "Sin datos de energía" };
  } else if (grasaPct >= gMin && grasaPct <= gMax) {
    macros = { luz: "verde", mensaje: `Grasas: ${grasaPct.toFixed(0)}% de la energía (objetivo ${gMin}-${gMax}%)` };
  } else if (Math.abs(grasaPct - gMin) <= 5 || Math.abs(grasaPct - gMax) <= 5) {
    macros = { luz: "ambar", mensaje: `Grasas: ${grasaPct.toFixed(0)}% de la energía, ligeramente fuera del rango ${gMin}-${gMax}%` };
  } else {
    macros = { luz: "rojo", mensaje: `Grasas: ${grasaPct.toFixed(0)}% de la energía, fuera del rango ${gMin}-${gMax}%` };
  }

  // Criterio 4: Fibra (≥ fibra_min_g)
  let fibra: CriterioResult;
  if (total.fib >= perfil.fibra_min_g) {
    fibra = { luz: "verde", mensaje: `${total.fib.toFixed(1)} g de fibra (mínimo ${perfil.fibra_min_g} g)` };
  } else if (total.fib >= perfil.fibra_min_g * 0.75) {
    fibra = { luz: "ambar", mensaje: `${total.fib.toFixed(1)} g de fibra, por debajo del mínimo de ${perfil.fibra_min_g} g` };
  } else {
    fibra = { luz: "rojo", mensaje: `${total.fib.toFixed(1)} g de fibra, muy por debajo del mínimo de ${perfil.fibra_min_g} g` };
  }

  // Criterio 5: Restricciones alimentarias
  const conflictos = items
    .flatMap(({ alimento }) =>
      perfil.restricciones
        .filter((r) => conflicta(alimento, r))
        .map((r) => `${alimento.nombre} (${r})`),
    );
  let restricciones: CriterioResult;
  if (conflictos.length === 0) {
    restricciones = { luz: "verde", mensaje: "Respeta todas las restricciones alimentarias" };
  } else {
    restricciones = { luz: "rojo", mensaje: `Alimentos no permitidos: ${conflictos.join(", ")}` };
  }

  // Criterio 6: Justificación (mínimo 20 caracteres)
  let justificacionResult: CriterioResult;
  const jLen = justificacion.trim().length;
  if (jLen >= 80) {
    justificacionResult = { luz: "verde", mensaje: "Justificación detallada" };
  } else if (jLen >= 20) {
    justificacionResult = { luz: "ambar", mensaje: "Justificación breve, podría ser más completa" };
  } else {
    justificacionResult = { luz: "rojo", mensaje: "Falta justificación o es demasiado corta" };
  }

  return {
    energia,
    proteina,
    macros,
    fibra,
    restricciones,
    justificacion: justificacionResult,
  };
}

export interface ParsedMenuCode {
  nombre: string;
  perfilId: string;
  fecha: string;
  items: { alimentoId: string; gramos: number }[];
  justificacion: string;
}

export function buildMenuCode(
  nombre: string,
  perfilId: string,
  fecha: string,
  items: { alimentoId: string; gramos: number }[],
  justificacion: string,
): string {
  const itemsStr = items.map((i) => `${i.alimentoId}:${i.gramos}`).join(",");
  return `MENU1|${nombre}|${perfilId}|${fecha}|${itemsStr}|${justificacion}`;
}

export function parseMenuCodes(text: string): { ok: ParsedMenuCode[]; bad: string[] } {
  const ok: ParsedMenuCode[] = [];
  const bad: string[] = [];

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!trimmed.startsWith("MENU1|")) {
      bad.push(trimmed);
      continue;
    }

    const parts = trimmed.split("|");
    if (parts.length < 6) {
      bad.push(trimmed);
      continue;
    }

    const [, nombre, perfilId, fecha, itemsStr, ...justParts] = parts;
    const justificacion = justParts.join("|");

    if (!nombre || !perfilId || !fecha || !itemsStr) {
      bad.push(trimmed);
      continue;
    }

    const itemTokens = itemsStr.split(",").filter(Boolean);
    const items: { alimentoId: string; gramos: number }[] = [];
    let valid = true;

    for (const token of itemTokens) {
      const colonIdx = token.indexOf(":");
      if (colonIdx === -1) { valid = false; break; }
      const alimentoId = token.slice(0, colonIdx);
      const gramos = Number(token.slice(colonIdx + 1));
      if (!alimentoId || isNaN(gramos) || gramos <= 0) { valid = false; break; }
      items.push({ alimentoId, gramos });
    }

    if (!valid || items.length === 0) {
      bad.push(trimmed);
      continue;
    }

    ok.push({ nombre, perfilId, fecha, items, justificacion });
  }

  return { ok, bad };
}
