import { describe, it, expect } from "vitest";
import { ALIMENTOS } from "./alimentos";
import { PERFILES } from "./perfiles";
import {
  calcNutri,
  bmrFromPerfil,
  semaforo,
  buildMenuCode,
  parseMenuCodes,
} from "@/lib/constructor";

// ─── ALIMENTOS ──────────────────────────────────────────────────────────────

describe("ALIMENTOS", () => {
  it("tiene exactamente 65 alimentos", () => {
    expect(ALIMENTOS).toHaveLength(65);
  });

  it("todos tienen los campos requeridos con valores válidos", () => {
    for (const a of ALIMENTOS) {
      expect(a.id, `${a.id} sin id`).toBeTruthy();
      expect(a.nombre, `${a.id} sin nombre`).toBeTruthy();
      expect(a.grupo, `${a.id} sin grupo`).toBeTruthy();
      expect(a.porcion, `${a.id} porcion <= 0`).toBeGreaterThan(0);
      expect(typeof a.kcal).toBe("number");
      expect(typeof a.p).toBe("number");
      expect(typeof a.c).toBe("number");
      expect(typeof a.g).toBe("number");
    }
  });

  it("ningún id está duplicado", () => {
    const ids = ALIMENTOS.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("solo whey tiene solo_adultos: true", () => {
    const adultos = ALIMENTOS.filter((a) => a.solo_adultos === true);
    expect(adultos).toHaveLength(1);
    expect(adultos[0].id).toBe("whey");
  });

  it("4P + 4H + 9G coherente con las kcal declaradas (± 30 %)", () => {
    for (const a of ALIMENTOS) {
      if (a.kcal === 0) continue;
      const estimado = 4 * a.p + 4 * a.c + 9 * a.g;
      const diferencia = Math.abs(a.kcal - estimado) / a.kcal;
      expect(diferencia, `${a.id}: kcal=${a.kcal} estimado=${estimado.toFixed(1)}`).toBeLessThanOrEqual(0.30);
    }
  });
});

// ─── PERFILES ───────────────────────────────────────────────────────────────

describe("PERFILES", () => {
  it("tiene exactamente 8 perfiles", () => {
    expect(PERFILES).toHaveLength(8);
  });

  it("ningún id está duplicado", () => {
    const ids = PERFILES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("kcal_objetivo >= bmr para todos", () => {
    for (const p of PERFILES) {
      expect(p.kcal_objetivo, `${p.id}: kcal_objetivo < bmr`).toBeGreaterThanOrEqual(p.bmr);
    }
  });

  it("comidas es un número positivo", () => {
    for (const p of PERFILES) {
      expect(p.comidas).toBeGreaterThan(0);
    }
  });
});

// ─── bmrFromPerfil ───────────────────────────────────────────────────────────

describe("bmrFromPerfil", () => {
  it("Marcos H 82kg 180cm 28y → 1810", () => {
    const marcos = PERFILES.find((p) => p.id === "marcos")!;
    expect(bmrFromPerfil(marcos)).toBe(1810);
  });

  it("Carmen M 78kg 162cm 52y → 1371.5 ≈ 1372", () => {
    const carmen = PERFILES.find((p) => p.id === "carmen")!;
    expect(Math.round(bmrFromPerfil(carmen))).toBe(1372);
  });

  it("coincide con el campo bmr de cada perfil (±1 por redondeo)", () => {
    for (const p of PERFILES) {
      const diff = Math.abs(bmrFromPerfil(p) - p.bmr);
      expect(diff, `${p.id}: diff=${diff}`).toBeLessThanOrEqual(1);
    }
  });
});

// ─── calcNutri ───────────────────────────────────────────────────────────────

describe("calcNutri", () => {
  const arroz = ALIMENTOS.find((a) => a.id === "arroz-blanco")!;

  it("lista vacía → todo cero", () => {
    const t = calcNutri([]);
    expect(t.kcal).toBe(0);
    expect(t.p).toBe(0);
    expect(t.fib).toBe(0);
  });

  it("100g de arroz blanco → valores directos del catálogo", () => {
    const t = calcNutri([{ alimento: arroz, gramos: 100 }]);
    expect(t.kcal).toBeCloseTo(arroz.kcal, 5);
    expect(t.p).toBeCloseTo(arroz.p, 5);
    expect(t.c).toBeCloseTo(arroz.c, 5);
  });

  it("200g → doble que 100g", () => {
    const t100 = calcNutri([{ alimento: arroz, gramos: 100 }]);
    const t200 = calcNutri([{ alimento: arroz, gramos: 200 }]);
    expect(t200.kcal).toBeCloseTo(t100.kcal * 2, 5);
    expect(t200.p).toBeCloseTo(t100.p * 2, 5);
  });

  it("dos alimentos → suma correcta de kcal", () => {
    const salmon = ALIMENTOS.find((a) => a.id === "salmon")!;
    const t = calcNutri([
      { alimento: arroz, gramos: 100 },
      { alimento: salmon, gramos: 100 },
    ]);
    expect(t.kcal).toBeCloseTo(arroz.kcal + salmon.kcal, 5);
    expect(t.p).toBeCloseTo(arroz.p + salmon.p, 5);
  });
});

// ─── semaforo ────────────────────────────────────────────────────────────────

const marcos = PERFILES.find((p) => p.id === "marcos")!;
const adil = PERFILES.find((p) => p.id === "adil")!;

function makeItems(calories: number): ReturnType<typeof calcNutri> {
  return {
    kcal: calories,
    p: marcos.proteina_g_kg[0] * marcos.peso_kg + 5,
    c: 350,
    g: (calories * 0.27) / 9,
    fib: 32,
    azuc: 50,
    sat: 10,
    fe: 15,
    ca: 1000,
    mg: 300,
    k: 3500,
    na: 2000,
    vc: 80,
    vd: 10,
    b12: 3,
  };
}

describe("semaforo – energía", () => {
  it("dentro del ±10% → verde", () => {
    const total = makeItems(marcos.kcal_objetivo);
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.energia.luz).toBe("verde");
  });

  it("entre ±10% y ±20% → ámbar", () => {
    const total = makeItems(Math.round(marcos.kcal_objetivo * 0.85));
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.energia.luz).toBe("ambar");
  });

  it("más del ±20% → rojo", () => {
    const total = makeItems(Math.round(marcos.kcal_objetivo * 0.5));
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.energia.luz).toBe("rojo");
  });
});

describe("semaforo – proteína", () => {
  it("dentro del rango → verde", () => {
    const pOk = (marcos.proteina_g_kg[0] + marcos.proteina_g_kg[1]) / 2 * marcos.peso_kg;
    const total = { ...makeItems(marcos.kcal_objetivo), p: pOk };
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.proteina.luz).toBe("verde");
  });

  it("fuera del rango → rojo", () => {
    const total = { ...makeItems(marcos.kcal_objetivo), p: 10 };
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.proteina.luz).toBe("rojo");
  });
});

describe("semaforo – fibra", () => {
  it("fibra suficiente → verde", () => {
    const total = { ...makeItems(marcos.kcal_objetivo), fib: 35 };
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.fibra.luz).toBe("verde");
  });

  it("fibra insuficiente → rojo", () => {
    const total = { ...makeItems(marcos.kcal_objetivo), fib: 5 };
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.fibra.luz).toBe("rojo");
  });
});

describe("semaforo – restricciones", () => {
  it("vegetariano sin carne → verde", () => {
    const tofu = ALIMENTOS.find((a) => a.id === "tofu")!;
    const items = [{ alimento: tofu, gramos: 150 }];
    const total = calcNutri(items);
    const r = semaforo(items, total, adil, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.restricciones.luz).toBe("verde");
  });

  it("vegetariano con pollo → rojo", () => {
    const pollo = ALIMENTOS.find((a) => a.id === "pollo")!;
    const items = [{ alimento: pollo, gramos: 150 }];
    const total = calcNutri(items);
    const r = semaforo(items, total, adil, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.restricciones.luz).toBe("rojo");
  });

  it("vegetariano puede comer huevo", () => {
    const huevo = ALIMENTOS.find((a) => a.id === "huevo")!;
    const items = [{ alimento: huevo, gramos: 120 }];
    const total = calcNutri(items);
    const r = semaforo(items, total, adil, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.restricciones.luz).toBe("verde");
  });

  it("sin lactosa con leche → rojo", () => {
    const sofia = PERFILES.find((p) => p.id === "sofia")!;
    const leche = ALIMENTOS.find((a) => a.id === "leche")!;
    const items = [{ alimento: leche, gramos: 250 }];
    const total = calcNutri(items);
    const r = semaforo(items, total, sofia, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.restricciones.luz).toBe("rojo");
  });

  it("sin lactosa puede comer leche de soja", () => {
    const sofia = PERFILES.find((p) => p.id === "sofia")!;
    const lecheSoja = ALIMENTOS.find((a) => a.id === "leche-soja")!;
    const items = [{ alimento: lecheSoja, gramos: 250 }];
    const total = calcNutri(items);
    const r = semaforo(items, total, sofia, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.restricciones.luz).toBe("verde");
  });
});

describe("semaforo – justificación", () => {
  const total = makeItems(marcos.kcal_objetivo);

  it("texto largo (≥80 chars) → verde", () => {
    const r = semaforo([], total, marcos, "Justificación larga y detallada que supera claramente los 80 caracteres necesarios para ser verde");
    expect(r.justificacion.luz).toBe("verde");
  });

  it("texto corto (20-79 chars) → ámbar", () => {
    const r = semaforo([], total, marcos, "Justificación breve ok");
    expect(r.justificacion.luz).toBe("ambar");
  });

  it("texto vacío → rojo", () => {
    const r = semaforo([], total, marcos, "");
    expect(r.justificacion.luz).toBe("rojo");
  });
});

// ─── buildMenuCode / parseMenuCodes ──────────────────────────────────────────

describe("buildMenuCode + parseMenuCodes", () => {
  it("construye el código con el formato MENU1|...", () => {
    const code = buildMenuCode("Ana García", "marcos", "2026-11-23", [
      { alimentoId: "arroz-blanco", gramos: 150 },
      { alimentoId: "pollo", gramos: 120 },
    ], "Menú equilibrado pre-entrenamiento");
    expect(code).toBe("MENU1|Ana García|marcos|2026-11-23|arroz-blanco:150,pollo:120|Menú equilibrado pre-entrenamiento");
  });

  it("ida y vuelta: buildMenuCode → parseMenuCodes", () => {
    const original = {
      nombre: "Pepe Ruiz",
      perfilId: "laura",
      fecha: "2026-11-23",
      items: [{ alimentoId: "salmon", gramos: 150 }, { alimentoId: "patata", gramos: 200 }],
      justificacion: "Menú rico en omega-3",
    };
    const code = buildMenuCode(original.nombre, original.perfilId, original.fecha, original.items, original.justificacion);
    const { ok, bad } = parseMenuCodes(code);
    expect(bad).toHaveLength(0);
    expect(ok).toHaveLength(1);
    expect(ok[0]).toEqual(original);
  });

  it("parsea múltiples líneas correctamente", () => {
    const lines = [
      "MENU1|Ana|marcos|2026-11-23|arroz-blanco:150|nota",
      "MENU1|Bea|laura|2026-11-24|salmon:120|otra nota",
    ].join("\n");
    const { ok, bad } = parseMenuCodes(lines);
    expect(ok).toHaveLength(2);
    expect(bad).toHaveLength(0);
  });

  it("líneas inválidas van a bad", () => {
    const { ok, bad } = parseMenuCodes("esto no es un código\nMENU1|solo|tres|partes");
    expect(ok).toHaveLength(0);
    expect(bad).toHaveLength(2);
  });

  it("la justificación puede contener pipes", () => {
    const code = buildMenuCode("Juan", "marcos", "2026-11-23", [{ alimentoId: "pollo", gramos: 150 }], "parte1|parte2|parte3");
    const { ok } = parseMenuCodes(code);
    expect(ok[0].justificacion).toBe("parte1|parte2|parte3");
  });

  it("línea vacía se ignora sin añadirse a bad", () => {
    const { ok, bad } = parseMenuCodes("\n\nMENU1|Ana|marcos|2026-11-23|arroz-blanco:150|nota\n\n");
    expect(ok).toHaveLength(1);
    expect(bad).toHaveLength(0);
  });
});
