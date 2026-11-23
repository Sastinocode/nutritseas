import { describe, it, expect } from "vitest";
import { calcularMB, calcularGET, calcularObjetivo } from "./nutricion";

const hombre75 = { peso: 75, talla: 178, edad: 22, sexo: "hombre" as const, actividad: 1.55 };

describe("calcularMB", () => {
  it("hombre 75 kg 178 cm 22 años → ≈ 1758", () => {
    expect(calcularMB(hombre75)).toBeCloseTo(1757.5, 0);
  });

  it("mujer 60 kg 165 cm 30 años", () => {
    const mujer = { peso: 60, talla: 165, edad: 30, sexo: "mujer" as const, actividad: 1.375 };
    expect(calcularMB(mujer)).toBeCloseTo(1399, 0);
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
