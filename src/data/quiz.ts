export type Pregunta = {
  id: number
  enunciado: string
  opciones: string[]
  correcta: number // índice 0-based
  explicacion: string
}

export const PREGUNTAS_QUIZ: Pregunta[] = [
  {
    id: 1,
    enunciado: "¿Cuántos macronutrientes principales existen?",
    opciones: ["2", "3", "4", "5"],
    correcta: 1,
    explicacion: "Los tres macronutrientes son proteínas, carbohidratos y grasas.",
  },
  {
    id: 2,
    enunciado: "¿Cuál es la función principal de los carbohidratos en el deporte?",
    opciones: ["Reparar músculo", "Proporcionar energía rápida", "Lubricar articulaciones", "Transportar oxígeno"],
    correcta: 1,
    explicacion: "Los carbohidratos son la fuente de energía más rápida y la principal durante ejercicios de alta intensidad.",
  },
  {
    id: 3,
    enunciado: "¿Qué significa 'metabolismo basal'?",
    opciones: [
      "Energía gastada haciendo deporte",
      "Energía mínima para funciones vitales en reposo",
      "Velocidad de digestión de los alimentos",
      "Calorías que aportan los alimentos",
    ],
    correcta: 1,
    explicacion: "El metabolismo basal es la energía que tu cuerpo necesita en reposo total para mantener funciones vitales como respirar o latir el corazón.",
  },
  {
    id: 4,
    enunciado: "¿Cuántos gramos de proteína por kilo de peso se recomiendan en deportistas?",
    opciones: ["0,5–0,8 g", "1,2–2,0 g", "3,0–4,0 g", "5,0–6,0 g"],
    correcta: 1,
    explicacion: "Los deportistas suelen necesitar entre 1,2 y 2,0 g de proteína por kg de peso al día, dependiendo de la actividad.",
  },
  {
    id: 5,
    enunciado: "¿Qué vitamina es fundamental para la absorción del calcio?",
    opciones: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"],
    correcta: 2,
    explicacion: "La vitamina D regula la absorción intestinal del calcio y es esencial para la salud ósea.",
  },
  {
    id: 6,
    enunciado: "¿Qué macronutriente tiene más calorías por gramo?",
    opciones: ["Proteínas", "Carbohidratos", "Grasas", "Fibra"],
    correcta: 2,
    explicacion: "Las grasas aportan 9 kcal/g, mientras que proteínas y carbohidratos aportan 4 kcal/g cada uno.",
  },
  {
    id: 7,
    enunciado: "¿Qué son los BCAA?",
    opciones: ["Un tipo de grasa", "Aminoácidos de cadena ramificada", "Vitaminas del grupo B", "Carbohidratos complejos"],
    correcta: 1,
    explicacion: "Los BCAA (Branch Chain Amino Acids) son leucina, isoleucina y valina. Son aminoácidos esenciales muy presentes en el músculo.",
  },
  {
    id: 8,
    enunciado: "¿Cuánto tiempo antes del ejercicio se recomienda hacer una comida principal?",
    opciones: ["30 minutos", "1 hora", "2–3 horas", "5 horas"],
    correcta: 2,
    explicacion: "Una comida abundante necesita 2–3 horas para digerirse. Comer demasiado cerca del ejercicio puede causar molestias digestivas.",
  },
  {
    id: 9,
    enunciado: "¿Cuánta cafeína máxima se recomienda al día para adultos sanos?",
    opciones: ["100 mg", "200 mg", "400 mg", "800 mg"],
    correcta: 2,
    explicacion: "La EFSA establece 400 mg/día como límite seguro para adultos sanos. Superar esta cantidad puede causar efectos adversos.",
  },
  {
    id: 10,
    enunciado: "¿Qué es la creatina?",
    opciones: [
      "Una vitamina liposoluble",
      "Un compuesto que mejora el rendimiento en esfuerzos cortos e intensos",
      "Un tipo de carbohidrato de liberación lenta",
      "Una grasa esencial",
    ],
    correcta: 1,
    explicacion: "La creatina es un compuesto natural que aumenta los depósitos de fosfocreatina muscular, mejorando la potencia en esfuerzos explosivos.",
  },
  {
    id: 11,
    enunciado: "¿Cuál es la principal fuente de energía en ejercicios de baja intensidad y larga duración?",
    opciones: ["Proteínas", "Carbohidratos", "Grasas", "Vitaminas"],
    correcta: 2,
    explicacion: "A intensidades bajas (<60% VO2max) el cuerpo usa principalmente las grasas como combustible, ya que son más abundantes y eficientes a largo plazo.",
  },
  {
    id: 12,
    enunciado: "¿Qué mineral es esencial para la contracción muscular?",
    opciones: ["Hierro", "Calcio", "Yodo", "Flúor"],
    correcta: 1,
    explicacion: "El calcio activa las proteínas contráctiles (actina y miosina) del músculo. Sin calcio no puede producirse la contracción.",
  },
  {
    id: 13,
    enunciado: "¿Cuántos litros de agua se recomienda beber aproximadamente al día a un adulto activo?",
    opciones: ["0,5–1 L", "1–1,5 L", "2–3 L", "5–6 L"],
    correcta: 2,
    explicacion: "Un adulto activo necesita entre 2 y 3 litros de agua al día, más lo que se pierda por sudoración durante el ejercicio.",
  },
  {
    id: 14,
    enunciado: "¿Qué es el índice glucémico (IG)?",
    opciones: [
      "La cantidad de azúcar en un alimento",
      "La velocidad a la que un alimento eleva la glucosa en sangre",
      "El número de calorías de los carbohidratos",
      "La cantidad de insulina que produce el cuerpo",
    ],
    correcta: 1,
    explicacion: "El IG mide qué tan rápido sube la glucosa en sangre tras comer un alimento. Un IG alto (>70) indica una subida rápida.",
  },
  {
    id: 15,
    enunciado: "¿Cuál de estos alimentos tiene más proteína por 100 g?",
    opciones: ["Arroz cocido", "Leche entera", "Pechuga de pollo", "Naranja"],
    correcta: 2,
    explicacion: "La pechuga de pollo aporta unos 31 g de proteína por 100 g, frente a los 3,5 g de la leche, el 2,7 g del arroz o el 0,9 g de la naranja.",
  },
]

export const XP_POR_RESPUESTA = 2   // XP base por respuesta correcta
export const XP_BONUS_PERFECTO = 15  // bonus si todas correctas
