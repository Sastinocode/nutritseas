import { describe, it, expect } from "vitest"
import {
  calcularSectores,
  calcularMacros,
  generarFeedback,
  grupoToSector,
  type ItemPlato,
  type TipoDia,
} from "./plato"

function item(overrides: Partial<ItemPlato> & { id: string; grupo: string; gramos: number }): ItemPlato {
  return {
    nombre: "Test",
    emoji: "🍎",
    kcal: 50,
    p: 5,
    c: 10,
    g: 1,
    fib: 2,
    na: 5,
    ...overrides,
  }
}

describe("grupoToSector", () => {
  it("Verduras → verduras_fruta", () => expect(grupoToSector("Verduras")).toBe("verduras_fruta"))
  it("Frutas → verduras_fruta", () => expect(grupoToSector("Frutas")).toBe("verduras_fruta"))
  it("Carnes → proteina", () => expect(grupoToSector("Carnes")).toBe("proteina"))
  it("Pescados y mariscos → proteina", () => expect(grupoToSector("Pescados y mariscos")).toBe("proteina"))
  it("Huevos y lácteos → proteina", () => expect(grupoToSector("Huevos y lácteos")).toBe("proteina"))
  it("Legumbres → proteina", () => expect(grupoToSector("Legumbres")).toBe("proteina"))
  it("Cereales y tubérculos → cereales_tuberculos", () =>
    expect(grupoToSector("Cereales y tubérculos")).toBe("cereales_tuberculos"))
  it("Frutos secos y semillas → grasa_saludable", () =>
    expect(grupoToSector("Frutos secos y semillas")).toBe("grasa_saludable"))
  it("Grasas y aceites → grasa_saludable", () =>
    expect(grupoToSector("Grasas y aceites")).toBe("grasa_saludable"))
  it("Suplementos → null", () => expect(grupoToSector("Suplementos")).toBeNull())
  it("Bebidas → null", () => expect(grupoToSector("Bebidas")).toBeNull())
  it("Otros → null", () => expect(grupoToSector("Otros")).toBeNull())
})

describe("calcularSectores — estructura", () => {
  it("devuelve siempre 4 sectores", () => {
    expect(calcularSectores([], "descanso")).toHaveLength(4)
  })

  it("sin items: actual=0 y gramos=0 en todos los sectores", () => {
    for (const s of calcularSectores([], "entreno")) {
      expect(s.actual).toBe(0)
      expect(s.gramos).toBe(0)
    }
  })
})

describe("calcularSectores — proporciones recomendadas suman 1", () => {
  const tipos: TipoDia[] = ["descanso", "entreno", "entreno_exigente", "competicion"]
  for (const tipo of tipos) {
    it(`${tipo}: suma recomendado ≈ 1.0`, () => {
      const total = calcularSectores([], tipo).reduce((s, sec) => s + sec.recomendado, 0)
      expect(total).toBeCloseTo(1.0, 10)
    })
  }
})

describe("calcularSectores — asignación de gramos", () => {
  it("Verduras va a verduras_fruta", () => {
    const s = calcularSectores([item({ id: "v", grupo: "Verduras", gramos: 200 })], "descanso")
    const vf = s.find(x => x.key === "verduras_fruta")!
    expect(vf.gramos).toBe(200)
    expect(vf.actual).toBeCloseTo(1.0)
  })

  it("Bebidas no cuenta en ningún sector", () => {
    const items = [
      item({ id: "b", grupo: "Bebidas", gramos: 300 }),
      item({ id: "v", grupo: "Verduras", gramos: 100 }),
    ]
    const total = calcularSectores(items, "descanso").reduce((s, sec) => s + sec.gramos, 0)
    expect(total).toBe(100)
  })

  it("proporciones reales suman 1 cuando hay alimentos en todos los grupos", () => {
    const items = [
      item({ id: "v", grupo: "Verduras",             gramos: 200 }),
      item({ id: "p", grupo: "Carnes",                gramos: 100 }),
      item({ id: "c", grupo: "Cereales y tubérculos", gramos: 150 }),
      item({ id: "g", grupo: "Grasas y aceites",      gramos: 50  }),
    ]
    const total = calcularSectores(items, "entreno").reduce((s, sec) => s + sec.actual, 0)
    expect(total).toBeCloseTo(1.0, 10)
  })
})

describe("calcularMacros", () => {
  it("array vacío → todo cero", () => {
    const m = calcularMacros([])
    expect(m.kcal).toBe(0)
    expect(m.na).toBe(0)
  })

  it("escala por gramos", () => {
    const m = calcularMacros([item({ id: "a", grupo: "Verduras", gramos: 200, kcal: 100, p: 10, c: 20, g: 5, fib: 3, na: 50 })])
    expect(m.kcal).toBeCloseTo(200)
    expect(m.p).toBeCloseTo(20)
    expect(m.na).toBeCloseTo(100)
  })

  it("suma varios items", () => {
    const items = [
      item({ id: "a", grupo: "Verduras", gramos: 100, kcal: 100, p: 10, c: 10, g: 5, fib: 1, na: 10 }),
      item({ id: "b", grupo: "Carnes",   gramos: 100, kcal: 200, p: 20, c: 5,  g: 10, fib: 0, na: 20 }),
    ]
    const m = calcularMacros(items)
    expect(m.kcal).toBeCloseTo(300)
    expect(m.p).toBeCloseTo(30)
  })
})

describe("generarFeedback", () => {
  it("sin items → array vacío", () => {
    expect(generarFeedback(calcularSectores([], "descanso"))).toEqual([])
  })

  it("solo proteína → sugiere añadir verdura", () => {
    const s = calcularSectores([item({ id: "p", grupo: "Carnes", gramos: 300 })], "descanso")
    const fb = generarFeedback(s)
    expect(fb.some(m => m.toLowerCase().includes("verdura"))).toBe(true)
  })

  it("sin feedback cuando el plato coincide con la recomendación (descanso)", () => {
    // descanso: verduras=40%, proteína=25%, cereales=25%, grasa=10%
    const items = [
      item({ id: "v", grupo: "Verduras",             gramos: 400 }),
      item({ id: "p", grupo: "Carnes",                gramos: 250 }),
      item({ id: "c", grupo: "Cereales y tubérculos", gramos: 250 }),
      item({ id: "g", grupo: "Grasas y aceites",      gramos: 100 }),
    ]
    expect(generarFeedback(calcularSectores(items, "descanso"))).toEqual([])
  })
})
