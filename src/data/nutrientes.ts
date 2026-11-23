export interface GrupoNutriente {
  id: string;
  n: string;
  c: string;
  s: string;
  items: [string, string, string, string][];
}

export const GRUPOS: GrupoNutriente[] = [
  {
    id: "macro", n: "Macronutrientes", c: "#E64A19", s: "Se necesitan en gramos",
    items: [
      ["Hidratos de carbono", "4 kcal/g", "Combustible principal; único usado por el sistema nervioso central en condiciones normales.", "Arroz, pasta, pan, patata, fruta, legumbres"],
      ["Proteínas", "4 kcal/g", "Estructura, enzimas, hormonas, transporte y defensa.", "Huevo, pollo, pescado, lácteos, legumbres, tofu"],
      ["Grasas", "9 kcal/g", "Reserva de energía, protección, hormonas y vitaminas A, D, E, K.", "Aceite de oliva, frutos secos, pescado azul, aguacate"]
    ]
  },
  {
    id: "micro", n: "Micronutrientes", c: "#1E88E5", s: "Se necesitan en mg o µg",
    items: [
      ["Vitaminas", "No aportan energía", "Regulan reacciones químicas (cofactores). Hidrosolubles (B y C) y liposolubles (A, D, E, K).", "Cítricos (C), huevo (B12), pescado azul (D), verduras (A, K)"],
      ["Minerales", "No aportan energía", "Huesos, contracción muscular, transmisión nerviosa, transporte de oxígeno.", "Lácteos (calcio), legumbres (hierro), plátano (potasio)"]
    ]
  },
  {
    id: "agua", n: "Agua", c: "#00ACC1", s: "El medio de todo",
    items: [
      ["Agua", "No aporta energía", "Transporte de nutrientes, termorregulación (sudor) y medio de todas las reacciones. Entre el 60 y el 65 % del cuerpo.", "Agua, infusiones, caldos, fruta y verdura"]
    ]
  },
  {
    id: "fibra", n: "Fibra", c: "#43A047", s: "Otros componentes",
    items: [
      ["Fibra", "Muy poca energía", "Salud intestinal, saciedad y control de la glucemia. Referencia: 25-30 g/día.", "Integrales, legumbres, fruta con piel, verdura"]
    ]
  },
  {
    id: "alcohol", n: "Alcohol", c: "#757575", s: "No esencial",
    items: [
      ["Alcohol", "7 kcal/g", "No es un nutriente esencial y no aporta nada útil al rendimiento.", "Cerveza, vino, destilados"]
    ]
  }
];

/** [nombre, g de proteína] */
export const PROT_FOODS: [string, number][] = [
  ["Huevo L (1)", 7],
  ["Pechuga de pollo (100 g)", 23],
  ["Atún al natural (1 lata)", 22],
  ["Merluza (150 g)", 26],
  ["Yogur griego (1)", 9],
  ["Queso fresco batido 0 % (100 g)", 8],
  ["Leche (200 ml)", 6.5],
  ["Lentejas cocidas (200 g)", 15],
  ["Tofu firme (100 g)", 12],
  ["Frutos secos (30 g)", 5.5]
];

export interface Micro {
  nombre: string;
  funcion: string;
  fuentes: string;
  notas: string;
}

export const MICROS: Micro[] = [
  { nombre: "Hierro", funcion: "Hemoglobina y mioglobina: transporte de oxígeno.", fuentes: "Carne roja, legumbres, mejillones, espinacas (con vitamina C se absorbe mejor).", notas: "Mujeres con menstruación abundante, fondistas, dietas vegetarianas. Solo suplementar con analítica y criterio médico." },
  { nombre: "Calcio", funcion: "Hueso, contracción muscular, transmisión nerviosa.", fuentes: "Lácteos, sardinas con espina, almendras, brócoli.", notas: "Dietas muy bajas en calorías o sin lácteos." },
  { nombre: "Vitamina D", funcion: "Absorción de calcio, salud ósea y muscular.", fuentes: "Sol, pescado azul, huevo.", notas: "El déficit es frecuente incluso en zonas soleadas; solo suplementar con analítica." },
  { nombre: "Magnesio", funcion: "Contracción muscular, energía, sistema nervioso.", fuentes: "Frutos secos, legumbres, cereales integrales.", notas: "Los calambres no siempre son por magnesio: descartar antes la deshidratación." },
  { nombre: "Sodio, potasio, cloro", funcion: "Equilibrio hídrico y nervioso, contracción muscular.", fuentes: "Sal, plátano, patata, tomate, caldos, bebidas deportivas.", notas: "Pérdidas por sudor en esfuerzos largos o con calor." },
  { nombre: "Zinc", funcion: "Defensas, cicatrización, hormonas.", fuentes: "Carne, marisco, frutos secos, legumbres.", notas: "Dietas muy restrictivas." },
  { nombre: "Vitamina B12", funcion: "Sangre y sistema nervioso.", fuentes: "Solo de origen animal.", notas: "Dietas veganas: suplementación necesaria." },
  { nombre: "Vitaminas C y E", funcion: "Antioxidantes: defensa frente al estrés oxidativo.", fuentes: "Cítricos, kiwi, pimientos, aceite, frutos secos.", notas: "Dosis altas suplementadas pueden reducir la adaptación al entrenamiento." }
];
