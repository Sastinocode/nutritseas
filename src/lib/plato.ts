import platoData from "@/data/plato-proporciones.json"

export type TipoDia = "descanso" | "entreno" | "entreno_exigente" | "competicion"
export type SectorKey = "verduras_fruta" | "proteina" | "cereales_tuberculos" | "grasa_saludable"

export interface Sector {
  key: SectorKey
  label: string
  recomendado: number
  actual: number
  gramos: number
}

export interface ItemPlato {
  id: string
  nombre: string
  emoji: string
  grupo: string
  gramos: number
  kcal: number
  p: number
  c: number
  g: number
  fib: number
  na: number
}

export interface MacrosTotales {
  kcal: number
  p: number
  c: number
  g: number
  fib: number
  na: number
}

export const SECTOR_GRUPOS: Record<SectorKey, string[]> = {
  verduras_fruta:       ["Verduras", "Frutas"],
  proteina:             ["Carnes", "Pescados y mariscos", "Huevos y lácteos", "Legumbres"],
  cereales_tuberculos:  ["Cereales y tubérculos"],
  grasa_saludable:      ["Frutos secos y semillas", "Grasas y aceites"],
}

export const SECTOR_LABELS: Record<SectorKey, string> = {
  verduras_fruta:      "Verduras y fruta",
  proteina:            "Proteína",
  cereales_tuberculos: "Cereales",
  grasa_saludable:     "Grasa sana",
}

export const TIPO_DIA_LABELS: Record<TipoDia, string> = {
  descanso:         "Descanso",
  entreno:          "Entreno",
  entreno_exigente: "Entreno exigente",
  competicion:      "Competición",
}

export function grupoToSector(grupo: string): SectorKey | null {
  for (const [key, grupos] of Object.entries(SECTOR_GRUPOS)) {
    if (grupos.includes(grupo)) return key as SectorKey
  }
  return null
}

export function calcularSectores(items: ItemPlato[], tipoDia: TipoDia): Sector[] {
  const propData = (platoData.tipos_dia as Record<TipoDia, Record<SectorKey, number>>)[tipoDia]
  const totalGramos = items.reduce((s, i) => s + i.gramos, 0)

  const sectorGramos: Record<SectorKey, number> = {
    verduras_fruta: 0,
    proteina: 0,
    cereales_tuberculos: 0,
    grasa_saludable: 0,
  }

  for (const item of items) {
    const sector = grupoToSector(item.grupo)
    if (sector) sectorGramos[sector] += item.gramos
  }

  const KEYS: SectorKey[] = ["verduras_fruta", "proteina", "cereales_tuberculos", "grasa_saludable"]
  return KEYS.map(key => ({
    key,
    label: SECTOR_LABELS[key],
    recomendado: propData[key],
    actual: totalGramos > 0 ? sectorGramos[key] / totalGramos : 0,
    gramos: sectorGramos[key],
  }))
}

export function calcularMacros(items: ItemPlato[]): MacrosTotales {
  if (items.length === 0) return { kcal: 0, p: 0, c: 0, g: 0, fib: 0, na: 0 }
  return items.reduce(
    (acc, item) => {
      const f = item.gramos / 100
      return {
        kcal: acc.kcal + item.kcal * f,
        p:    acc.p    + item.p    * f,
        c:    acc.c    + item.c    * f,
        g:    acc.g    + item.g    * f,
        fib:  acc.fib  + item.fib  * f,
        na:   acc.na   + item.na   * f,
      }
    },
    { kcal: 0, p: 0, c: 0, g: 0, fib: 0, na: 0 },
  )
}

const TOLERANCIA = 0.08

export function generarFeedback(sectores: Sector[]): string[] {
  const totalGramos = sectores.reduce((s, sec) => s + sec.gramos, 0)
  if (totalGramos === 0) return []

  const fb = platoData.feedback as Record<string, string>
  const msgs: string[] = []
  for (const s of sectores) {
    const diff = s.actual - s.recomendado
    if (diff < -TOLERANCIA) msgs.push(fb[`${s.key}_bajo`] ?? `Añade más ${s.label.toLowerCase()}`)
    else if (diff > TOLERANCIA) msgs.push(fb[`${s.key}_alto`] ?? `Modera la cantidad de ${s.label.toLowerCase()}`)
  }
  return msgs
}
