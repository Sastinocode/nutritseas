import { describe, it, expect } from "vitest";
import { TEST, buildCode, parseCodes, scoreOf, type Bloque } from "./test-clase";

describe("TEST – banco de preguntas", () => {
  it("tiene exactamente 24 preguntas", () => {
    expect(TEST.length).toBe(24);
  });

  it("8 preguntas por bloque (N, S, M)", () => {
    const counts: Record<Bloque, number> = { N: 0, S: 0, M: 0 };
    TEST.forEach((p) => counts[p.b]++);
    expect(counts.N).toBe(8);
    expect(counts.S).toBe(8);
    expect(counts.M).toBe(8);
  });

  it("bloques en orden: primero N, luego S, luego M", () => {
    const bloques = TEST.map((p) => p.b);
    const esperado = [
      ...Array(8).fill("N"),
      ...Array(8).fill("S"),
      ...Array(8).fill("M"),
    ];
    expect(bloques).toEqual(esperado);
  });

  it("exactamente 6 respuestas correctas por letra (A, B, C, D)", () => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    TEST.forEach((p) => counts[p.c]++);
    expect(counts.A).toBe(6);
    expect(counts.B).toBe(6);
    expect(counts.C).toBe(6);
    expect(counts.D).toBe(6);
  });

  it("ninguna letra correcta aparece 3 veces seguidas", () => {
    for (let i = 0; i <= TEST.length - 3; i++) {
      const a = TEST[i].c;
      const b = TEST[i + 1].c;
      const c = TEST[i + 2].c;
      expect(
        a === b && b === c,
        `Letra ${a} aparece 3 veces seguidas en posiciones ${i}, ${i + 1}, ${i + 2}`
      ).toBe(false);
    }
  });

  it("cada pregunta tiene exactamente 4 opciones", () => {
    TEST.forEach((p, i) => {
      expect(p.o.length, `Pregunta ${i} no tiene 4 opciones`).toBe(4);
    });
  });

  it("la respuesta correcta es siempre A, B, C o D", () => {
    TEST.forEach((p, i) => {
      expect(
        ["A", "B", "C", "D"].includes(p.c),
        `Pregunta ${i}: respuesta correcta inválida '${p.c}'`
      ).toBe(true);
    });
  });
});

describe("buildCode", () => {
  it("genera el formato NUTRI1|I|nombre|24letras", () => {
    const ans = Array(24).fill("A");
    const code = buildCode("Ana García", "I", ans);
    expect(code).toBe(`NUTRI1|I|Ana García|${"A".repeat(24)}`);
  });

  it("usa 'sin nombre' cuando el nombre está vacío", () => {
    const ans = Array(24).fill("B");
    expect(buildCode("", "F", ans)).toMatch(/^NUTRI1\|F\|sin nombre\|/);
  });

  it("convierte respuestas vacías en '-'", () => {
    const ans = ["A", "", "C", ...Array(21).fill("")];
    const code = buildCode("Test", "I", ans);
    const parte = code.split("|")[3];
    expect(parte[0]).toBe("A");
    expect(parte[1]).toBe("-");
    expect(parte[2]).toBe("C");
  });

  it("elimina '|' del nombre para no romper el formato", () => {
    const code = buildCode("Na|me", "I", Array(24).fill("A"));
    const partes = code.split("|");
    expect(partes.length).toBe(4);
  });
});

describe("parseCodes", () => {
  it("parsea un código válido (fase I)", () => {
    const ans = TEST.map((p) => p.c).join("");
    const { ok, bad } = parseCodes(`NUTRI1|I|Juan|${ans}`);
    expect(ok.length).toBe(1);
    expect(bad.length).toBe(0);
    expect(ok[0].fase).toBe("I");
    expect(ok[0].name).toBe("Juan");
  });

  it("parsea un código válido (fase F) con guiones", () => {
    const ans = Array(24).fill("-").join("");
    const { ok } = parseCodes(`NUTRI1|F|María|${ans}`);
    expect(ok.length).toBe(1);
    expect(ok[0].fase).toBe("F");
  });

  it("rechaza código con longitud de respuestas incorrecta", () => {
    const { ok, bad } = parseCodes("NUTRI1|I|Juan|ABCD");
    expect(ok.length).toBe(0);
    expect(bad.length).toBe(1);
  });

  it("rechaza código con letras fuera de A-D o '-'", () => {
    const ans = Array(24).fill("X").join("");
    const { ok, bad } = parseCodes(`NUTRI1|I|Juan|${ans}`);
    expect(ok.length).toBe(0);
    expect(bad.length).toBe(1);
  });

  it("parsea múltiples códigos y separa buenos de malos", () => {
    const good = `NUTRI1|I|Ana|${Array(24).fill("A").join("")}`;
    const { ok, bad } = parseCodes(`${good}\nMAL_CODIGO\n${good}`);
    expect(ok.length).toBe(2);
    expect(bad.length).toBe(1);
  });

  it("ignora líneas vacías", () => {
    const { ok, bad } = parseCodes("\n\n");
    expect(ok.length).toBe(0);
    expect(bad.length).toBe(0);
  });
});

describe("scoreOf", () => {
  it("da puntuación máxima con todas las respuestas correctas", () => {
    const perfect = TEST.map((p) => p.c);
    const s = scoreOf(perfect);
    expect(s.N).toBe(8);
    expect(s.S).toBe(8);
    expect(s.M).toBe(8);
    expect(s.T).toBe(24);
  });

  it("da puntuación 0 con todas las respuestas incorrectas", () => {
    const wrong = TEST.map((p) => (p.c === "A" ? "B" : "A"));
    const s = scoreOf(wrong);
    expect(s.T).toBe(0);
  });

  it("cuenta correctamente respuestas '-' (no lo sé) como 0 puntos", () => {
    const noSe = Array(24).fill("-");
    const s = scoreOf(noSe);
    expect(s.T).toBe(0);
  });

  it("suma T = N + S + M", () => {
    const mixed = TEST.map((p, i) => (i % 2 === 0 ? p.c : "-"));
    const s = scoreOf(mixed);
    expect(s.T).toBe(s.N + s.S + s.M);
  });
});
