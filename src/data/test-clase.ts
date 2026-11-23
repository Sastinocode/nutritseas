export type Bloque = "N" | "S" | "M";
export type Letra = "A" | "B" | "C" | "D";

export interface Pregunta {
  b: Bloque;
  q: string;
  o: [string, string, string, string];
  c: Letra;
  e: string;
}

export interface ParsedCode {
  fase: "I" | "F";
  name: string;
  ans: string[];
}

export const TBLK: Record<Bloque, string> = {
  N: "Nutrición",
  S: "Suplementación",
  M: "Mitos",
};

export const TEST: Pregunta[] = [
  // Bloque N – Nutrición (índices 0-7)
  {
    b: "N",
    q: "Una barrita casera tiene 20 g de hidratos, 6 g de proteína y 5 g de grasa. ¿Cuántas kcal aporta aproximadamente?",
    o: ["111 kcal", "149 kcal", "186 kcal", "31 kcal"],
    c: "B",
    e: "4·20 + 4·6 + 9·5 = 80 + 24 + 45 = 149 kcal. Los 31 son los gramos totales, no las calorías.",
  },
  {
    b: "N",
    q: "¿Cuál es la función principal de la proteína en el deportista?",
    o: [
      "Ser el combustible principal del esfuerzo intenso",
      "Almacenar la mayor reserva de energía del cuerpo",
      "Regular la temperatura al sudar",
      "Construir y reparar tejidos, como el músculo",
    ],
    c: "D",
    e: "Es el ladrillo estructural y forma enzimas, hormonas y anticuerpos. El combustible principal son los hidratos y la mayor reserva, las grasas.",
  },
  {
    b: "N",
    q: "Una persona de 70 kg que entrena fuerza se plantea 1,8 g/kg de proteína al día. ¿Cuántos gramos son?",
    o: ["≈ 126 g", "≈ 56 g", "≈ 250 g", "≈ 18 g"],
    c: "A",
    e: "70 × 1,8 = 126 g, mejor repartidos en 3-5 tomas de unos 20-40 g.",
  },
  {
    b: "N",
    q: "¿Qué combinación mejora la calidad de la proteína de origen vegetal?",
    o: [
      "Fruta con agua",
      "Verdura con aceite de oliva",
      "Legumbres con cereales (por ejemplo, lentejas con arroz)",
      "Frutos secos con café",
    ],
    c: "C",
    e: "Las legumbres tienen poca metionina y los cereales poca lisina: juntos se complementan.",
  },
  {
    b: "N",
    q: "Vas a hacer una ruta de 3 horas por el Valle de Ricote. ¿Qué pauta de hidratos durante el esfuerzo es razonable?",
    o: [
      "30-60 g por hora (dátiles, plátano, bocadillo de pan con membrillo)",
      "Ninguno: se rinde mejor en ayunas",
      "Más de 200 g por hora para no desfallecer",
      "Solo proteína, porque los hidratos engordan",
    ],
    c: "A",
    e: "En esfuerzos de más de una hora se orienta a 30-60 g de hidratos por hora, acompañados de líquido.",
  },
  {
    b: "N",
    q: "Un alumno pierde 1 kg de peso en un entrenamiento por el sudor. ¿Cuánto líquido conviene reponer?",
    o: [
      "100-200 ml",
      "Medio litro de bebida energética",
      "Nada: el cuerpo se ajusta solo",
      "En torno a 1,2-1,5 litros, con algo de sodio",
    ],
    c: "D",
    e: "Se repone más de lo perdido (1,2-1,5 L por kg) y con algo de sodio para que se retenga.",
  },
  {
    b: "N",
    q: "¿Qué referencia de grasas es adecuada en la dieta de un deportista?",
    o: [
      "Menos del 5 % de la energía",
      "Entre el 20 y el 35 % de la energía, priorizando aceite de oliva, frutos secos y pescado azul",
      "Más del 60 % de la energía",
      "Cero: las grasas siempre engordan",
    ],
    c: "B",
    e: "Las grasas son esenciales: se trata de cambiar la calidad, no de eliminarlas.",
  },
  {
    b: "N",
    q: "Sobre la hidratación:\nI. Una orina amarillo oscuro indica que conviene beber más.\nII. Perder más del 2 % del peso corporal por sudor puede bajar el rendimiento.",
    o: [
      "Solo la I es correcta",
      "Solo la II es correcta",
      "La I y la II son correctas",
      "Ninguna es correcta",
    ],
    c: "C",
    e: "Ambas son correctas: el color de la orina y el 2 % del peso son dos señales prácticas.",
  },
  // Bloque S – Suplementación (índices 8-15)
  {
    b: "S",
    q: "Antes de plantearte un suplemento, ¿qué va siempre primero?",
    o: [
      "Un pre-entreno",
      "Una proteína en polvo",
      "Un multivitamínico",
      "Alimentación suficiente y variada, hidratación y sueño",
    ],
    c: "D",
    e: "Es la base de la pirámide: sin ella, ningún suplemento compensa.",
  },
  {
    b: "S",
    q: "¿Cuál de estos suplementos tiene eficacia demostrada para esfuerzos repetidos de alta intensidad en adultos?",
    o: ["Creatina monohidrato", "Un quemagrasas", "BCAA", "L-carnitina"],
    c: "A",
    e: "La creatina monohidrato (3-5 g/día) es de los mejor estudiados. Los otros tres no tienen evidencia sólida.",
  },
  {
    b: "S",
    q: "Un adulto de 70 kg valora cafeína a 3-6 mg/kg. ¿Qué rango sale y qué límite diario se toma como referencia?",
    o: [
      "70-140 mg; no hay límite",
      "210-420 mg; en torno a 400 mg al día sumando todas las fuentes",
      "700 mg; hasta 1 g al día",
      "20 mg; 50 mg al día",
    ],
    c: "B",
    e: "70 × 3 = 210 y 70 × 6 = 420. Como referencia de seguridad en un adulto: unos 400 mg/día entre café, té y energéticas.",
  },
  {
    b: "S",
    q: "Un chico de 16 años que entrena en Total Training te pide «algo para ganar músculo». ¿Qué haces como técnico?",
    o: [
      "Le recomiendas creatina a dosis bajas",
      "Le propones un pre-entreno para que rinda más",
      "Le explicas que los suplementos no son para menores y le orientas a comer bien, entrenar de forma progresiva y dormir; ante dudas, al médico",
      "Le sugieres un quemagrasas «natural»",
    ],
    c: "C",
    e: "Los suplementos se plantean solo en adultos con objetivo de rendimiento. El técnico educa en hábitos y deriva.",
  },
  {
    b: "S",
    q: "¿Cuándo tiene sentido suplementar vitamina D, hierro, calcio o B12?",
    o: [
      "Ante un déficit confirmado en una analítica y con criterio médico",
      "Siempre, «por si acaso»",
      "Para ganar más músculo",
      "Cuando se duerme mal",
    ],
    c: "A",
    e: "Son suplementos médicos: se pautan con analítica. Un exceso de algunos (D, hierro) también es dañino.",
  },
  {
    b: "S",
    q: "Si compites federado y quieres usar un suplemento:\nI. Consultas la lista de sustancias prohibidas (AMA/AEPSAD).\nII. Eliges un producto con sello de control de calidad.\nIII. Lo pruebas antes en entrenamientos.",
    o: ["Solo la I", "Solo la I y la II", "Solo la III", "Todas son correctas"],
    c: "D",
    e: "Se han detectado productos contaminados: las tres medidas son necesarias.",
  },
  {
    b: "S",
    q: "¿Cuál de estas frases de un anuncio es una señal de alarma?",
    o: [
      "«Creatina monohidrato, 5 g por toma, con sello de control antidopaje»",
      "«Vitamina D recomendada tras detectar déficit en tu analítica»",
      "«Fórmula secreta patentada: quema grasa en 7 días sin dieta ni ejercicio»",
      "«Ingredientes y dosis claramente indicados en la etiqueta»",
    ],
    c: "C",
    e: "Promesa milagro y fórmula secreta: sin ingredientes ni dosis claras no se puede saber qué se toma.",
  },
  {
    b: "S",
    q: "La proteína en polvo, comparada con la proteína de la comida real:",
    o: [
      "Es mucho mejor y más completa",
      "Es una opción práctica para llegar al total diario, pero no es mejor que la de la comida",
      "Es imprescindible para ganar músculo",
      "Sustituye por completo a la proteína de la dieta",
    ],
    c: "B",
    e: "Es solo comodidad: si ya llegas a tu proteína con comida, no añade nada.",
  },
  // Bloque M – Mitos (índices 16-23)
  {
    b: "M",
    q: "¿Cuál de estas afirmaciones es cierta?",
    o: [
      "Los hidratos de la cena engordan más que los del desayuno",
      "Hay que comer cada 2-3 horas para acelerar el metabolismo",
      "Sudar más equivale a quemar más grasa",
      "Lo que pesa es el balance de energía total del día, más que la hora a la que se come cada cosa",
    ],
    c: "D",
    e: "Las otras tres son mitos: sudar es perder agua y sales, y la frecuencia de comidas es cuestión de preferencia y organización.",
  },
  {
    b: "M",
    q: "La «ventana anabólica» de 30 minutos tras entrenar:",
    o: [
      "Es en gran parte un mito: pesa más el total diario de proteína y su reparto",
      "Es real: si no tomas proteína en 30 minutos, la pierdes",
      "Solo existe en las mujeres",
      "Obliga a tomar siempre un batido",
    ],
    c: "A",
    e: "La ventana es mucho más amplia. Importa el total del día, salvo que haya otra sesión en pocas horas.",
  },
  {
    b: "M",
    q: "¿Qué indica la evidencia sobre la proteína y los riñones en personas sanas?",
    o: [
      "Daña siempre los riñones",
      "Nunca hay que pasar de 1 g/kg",
      "No se ha observado daño con las ingestas habituales de deportistas; con enfermedad renal, consultar al médico",
      "Los riñones la acumulan y se «saturan»",
    ],
    c: "C",
    e: "En personas sanas no hay evidencia de daño con ingestas habituales. Con enfermedad renal o hepática, médico.",
  },
  {
    b: "M",
    q: "Las agujetas se deben a:",
    o: [
      "Cristales de ácido láctico",
      "Microlesiones musculares: el lactato no es el responsable",
      "Falta de magnesio",
      "Exceso de proteína",
    ],
    c: "B",
    e: "El lactato no causa la fatiga ni las agujetas: proceden de microlesiones en el músculo.",
  },
  {
    b: "M",
    q: "Sobre «sin gluten» y la fruta:\nI. «Sin gluten» no es más sano salvo en celiaquía o sensibilidad diagnosticada.\nII. La fruta entera aporta fibra, agua y micronutrientes; no es el problema de la dieta.",
    o: [
      "La I y la II son ciertas",
      "Solo la I es cierta",
      "Solo la II es cierta",
      "Ninguna es cierta",
    ],
    c: "A",
    e: "Las dos son ciertas. Evitar el gluten sin necesidad puede reducir la fibra de la dieta.",
  },
  {
    b: "M",
    q: "¿Se puede perder grasa solo del abdomen haciendo muchos abdominales?",
    o: [
      "Sí, se quema la grasa del músculo que trabajas",
      "Sí, con 100 abdominales al día",
      "Sí, con una faja que haga sudar",
      "No: la pérdida de grasa es general, no se elige de dónde sale",
    ],
    c: "D",
    e: "Los abdominales fortalecen el músculo, pero la grasa se pierde de forma general.",
  },
  {
    b: "M",
    q: "Sobre las dietas detox y los batidos «milagro»:\nI. No tienen base científica: el hígado y el riñón ya depuran.\nII. Pueden provocar carencias y efecto rebote.",
    o: [
      "Solo la I es cierta",
      "La I y la II son ciertas",
      "Solo la II es cierta",
      "Ninguna es cierta",
    ],
    c: "B",
    e: "Las dos son ciertas: no limpian nada y los déficits extremos acaban en rebote.",
  },
  {
    b: "M",
    q: "Un ritmo razonable de pérdida de peso es, en torno a:",
    o: [
      "3 kg por semana",
      "1 kg al día",
      "El 0,5-1 % del peso corporal por semana",
      "El que sea: da igual",
    ],
    c: "C",
    e: "Ritmos más rápidos suelen implicar pérdida de músculo y agua, y más rebote.",
  },
];

export function buildCode(
  name: string,
  fase: "I" | "F",
  ans: string[]
): string {
  const safeName =
    String(name || "sin nombre")
      .replace(/[|\n\r]/g, " ")
      .trim() || "sin nombre";
  return `NUTRI1|${fase}|${safeName}|${ans.map((a) => a || "-").join("")}`;
}

export function parseCodes(text: string): {
  ok: ParsedCode[];
  bad: string[];
} {
  const ok: ParsedCode[] = [];
  const bad: string[] = [];
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => {
      const p = l.split("|");
      if (
        p.length === 4 &&
        p[0] === "NUTRI1" &&
        /^[IF]$/.test(p[1]) &&
        p[3].length === TEST.length &&
        /^[A-D-]+$/.test(p[3])
      ) {
        ok.push({ fase: p[1] as "I" | "F", name: p[2], ans: p[3].split("") });
      } else {
        bad.push(l);
      }
    });
  return { ok, bad };
}

export function scoreOf(ans: string[]): Record<Bloque | "T", number> {
  const s: Record<Bloque | "T", number> = { N: 0, S: 0, M: 0, T: 0 };
  ans.forEach((a, i) => {
    if (i < TEST.length && a === TEST[i].c) {
      s[TEST[i].b]++;
      s.T++;
    }
  });
  return s;
}
