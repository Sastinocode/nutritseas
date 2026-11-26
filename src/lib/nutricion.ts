/**
 * Motor de cálculo nutricional – funciones puras.
 * Fórmula Mifflin-St Jeor y derivados.
 *
 * IMPORTANTE: Estos cálculos son orientativos para adultos sanos.
 * No sustituyen el consejo de un médico o dietista-nutricionista.
 */

export type Sexo = "hombre" | "mujer";

export interface PerfilBasico {
  peso: number;    // kg
  talla: number;   // cm
  edad: number;    // años
  sexo: Sexo;
  actividad: number; // factor PAL (ver FACTORES_ACTIVIDAD)
}

export const FACTORES_ACTIVIDAD = [
  { label: "Sedentario (sin ejercicio)", value: 1.2 },
  { label: "Ligero (1-3 días/semana)", value: 1.375 },
  { label: "Moderado (3-5 días/semana)", value: 1.55 },
  { label: "Activo (6-7 días/semana)", value: 1.725 },
  { label: "Muy activo (2 entrenamientos/día)", value: 1.9 }
] as const;

/** Metabolismo basal: Mifflin-St Jeor */
export function calcularMB(p: PerfilBasico): number {
  const base = 10 * p.peso + 6.25 * p.talla - 5 * p.edad;
  return p.sexo === "hombre" ? base + 5 : base - 161;
}

/** Gasto energético total (GET = MB × PAL) */
export function calcularGET(p: PerfilBasico): number {
  return Math.round(calcularMB(p) * p.actividad);
}

export interface ObjetivoCaloricoResult {
  kcal: number;
  mb: number;
  get: number;
  aviso?: string;
}

/**
 * Calcula el objetivo calórico según la meta.
 *
 * Reglas de seguridad:
 * - El objetivo nunca baja del MB.
 * - El déficit se limita a 300-500 kcal/día.
 * - Menores de 18: sin déficit calórico.
 */
export function calcularObjetivo(
  p: PerfilBasico,
  meta: "mantenimiento" | "deficit" | "superavit"
): ObjetivoCaloricoResult {
  const mb = Math.round(calcularMB(p));
  const get = Math.round(calcularGET(p));
  let kcal = get;
  let aviso: string | undefined;

  if (p.edad < 18 && meta === "deficit") {
    aviso = "Menor de 18 años: no se recomienda déficit calórico. Consulta con un médico o dietista.";
    meta = "mantenimiento";
  }

  if (meta === "deficit") {
    const deficit = Math.min(500, Math.max(300, Math.round(get * 0.15)));
    kcal = Math.max(mb, get - deficit);
    if (kcal === mb) {
      aviso = "El objetivo no puede bajar del metabolismo basal. Se muestra el MB como mínimo.";
    }
  } else if (meta === "superavit") {
    kcal = get + 300;
  }

  return { kcal, mb, get, aviso };
}

export interface Macros {
  h: number;  // g hidratos
  p: number;  // g proteína
  g: number;  // g grasa
}

/** Distribución de macros en gramos a partir de kcal y ratios % */
export function calcularMacros(
  kcal: number,
  peso: number,
  objetivo: "mantenimiento" | "deficit" | "superavit"
): Macros {
  let protGkg: number;
  if (objetivo === "deficit") protGkg = 2.0;
  else if (objetivo === "superavit") protGkg = 1.8;
  else protGkg = 1.6;

  const p = Math.round(peso * protGkg);
  const pKcal = p * 4;
  const remaining = kcal - pKcal;

  // H: 50 % restante / G: 30 % restante (aproximado)
  const h = Math.round((remaining * 0.6) / 4);
  const g = Math.round((remaining * 0.4) / 9);

  return { h, p, g };
}

/** Rango proteína por kg según objetivo */
export function rangoProteina(objetivo: "mantenimiento" | "deficit" | "superavit"): [number, number] {
  if (objetivo === "deficit") return [1.8, 2.2];
  if (objetivo === "superavit") return [1.6, 2.0];
  return [1.4, 1.8];
}

export interface CoherenciaResult {
  ok: boolean;
  /** kcal calculadas a partir de los macros (4·p + 4·h + 9·g) */
  kcalCalculada: number;
  /** desviación relativa respecto a kcalCalculada (0–1) */
  desviacion: number;
}

/**
 * Comprueba que las kcal declaradas de un alimento sean coherentes
 * con sus macros usando los factores Atwater (4·P + 4·H + 9·G) ± 15 %.
 *
 * Alimentos con ≤ 50 kcal se marcan siempre como ok porque los errores
 * de redondeo a esa escala serían desproporcionados.
 *
 * @param kcal  kcal declaradas (por 100 g)
 * @param p     proteínas en g
 * @param h     hidratos en g
 * @param g     grasas en g
 */
export function coherenciaEnergetica(
  kcal: number,
  p: number,
  h: number,
  g: number,
): CoherenciaResult {
  const kcalCalculada = 4 * p + 4 * h + 9 * g;
  if (kcal <= 50) {
    return { ok: true, kcalCalculada, desviacion: 0 };
  }
  const desviacion = kcalCalculada > 0
    ? Math.abs(kcal - kcalCalculada) / kcalCalculada
    : 1;
  return { ok: desviacion <= 0.15, kcalCalculada, desviacion };
}
