import { describe, it, expect } from "vitest";
import { calcularMB, calcularGET, calcularObjetivo, coherenciaEnergetica } from "./nutricion";

const hombre75 = { peso: 75, talla: 178, edad: 22, sexo: "hombre" as const, actividad: 1.55 };

describe("calcularMB", () => {
  it("hombre 75 kg 178 cm 22 años → ≈ 1758", () => {
    expect(calcularMB(hombre75)).toBeCloseTo(1757.5, 0);
  });

  it("mujer 60 kg 165 cm 30 años", () => {
    const mujer = { peso: 60, talla: 165, edad: 30, sexo: "mujer" as const, actividad: 1.375 };
    expect(calcularMB(mujer)).toBeCloseTo(1320, 0);
  });
});

describe("calcularGET", () => {
  it("aplica factor actividad correctamente", () => {
    const mb = calcularMB(hombre75);
    expect(calcularGET(hombre75)).toBe(Math.round(mb * 1.55));
  });
});

describe("calcularObjetivo – reglas de seguridad", () => {
  it("déficit nunca baja del MB", () => {
    // Persona con MB muy alto artificialmente (actividad baja)
    const p = { ...hombre75, actividad: 1.2 };
    const res = calcularObjetivo(p, "deficit");
    expect(res.kcal).toBeGreaterThanOrEqual(res.mb);
  });

  it("menores de 18 no tienen déficit", () => {
    const menor = { ...hombre75, edad: 17 };
    const res = calcularObjetivo(menor, "deficit");
    expect(res.kcal).toBe(res.get);
    expect(res.aviso).toBeTruthy();
  });

  it("superávit añade 300 kcal sobre GET", () => {
    const res = calcularObjetivo(hombre75, "superavit");
    expect(res.kcal).toBe(res.get + 300);
  });
});

describe("coherenciaEnergetica", () => {
  it("alimento típico con macros coherentes → ok", () => {
    // pollo a la plancha: ~165 kcal, 31g p, 0g h, 3.6g g
    // calculado: 4·31 + 4·0 + 9·3.6 = 124 + 0 + 32.4 = 156.4 → desv ≈5% < 15%
    const r = coherenciaEnergetica(165, 31, 0, 3.6);
    expect(r.ok).toBe(true);
    expect(r.desviacion).toBeLessThan(0.15);
  });

  it("alimento con macros muy incoherentes → no ok", () => {
    // kcal declaradas muy alejadas: 300 kcal pero macros que suman ~90
    const r = coherenciaEnergetica(300, 10, 5, 5);
    // calculado: 40+20+45 = 105 → desv = |300-105|/105 ≈ 1.86 > 0.15
    expect(r.ok).toBe(false);
    expect(r.desviacion).toBeGreaterThan(0.15);
  });

  it("alimento de ≤ 50 kcal siempre es ok (no se valida)", () => {
    // lechuga: 15 kcal, 1.4g p, 2.2g h, 0.2g g → calculado ≈ 15.4
    const r = coherenciaEnergetica(15, 1.4, 2.2, 0.2);
    expect(r.ok).toBe(true);
    expect(r.desviacion).toBe(0);
  });

  it("alimento de justo 50 kcal también se salta", () => {
    const r = coherenciaEnergetica(50, 0, 0, 100);
    // macros absurdos pero kcal=50 → skip
    expect(r.ok).toBe(true);
  });

  it("devuelve la kcalCalculada correcta", () => {
    // 20g p, 50g h, 10g g → 4·20 + 4·50 + 9·10 = 80+200+90 = 370
    const r = coherenciaEnergetica(360, 20, 50, 10);
    expect(r.kcalCalculada).toBe(370);
  });

  it("desviación del 14% exacto pasa (en el límite)", () => {
    // calculado = 100, declarado = 114 → desv = 14/100 = 0.14 ≤ 0.15
    // macros que sumen ~100 kcal: p=10(40kcal) + h=15(60kcal) = 100
    const r = coherenciaEnergetica(114, 10, 15, 0);
    expect(r.ok).toBe(true);
  });

  it("desviación del 16% exacto no pasa", () => {
    // calculado = 100, declarado = 116 → desv = 16/100 = 0.16 > 0.15
    const r = coherenciaEnergetica(116, 10, 15, 0);
    expect(r.ok).toBe(false);
  });
});
