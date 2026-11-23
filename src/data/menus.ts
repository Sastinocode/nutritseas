export interface Comida {
  hora: string;
  descripcion: string;
  kcal: number;
}

export type NombreMenu = "Día de entreno" | "Día de descanso" | "Pérdida de grasa" | "Vegetariano";

export const MENUS: Record<NombreMenu, Comida[]> = {
  "Día de entreno": [
    { hora: "Desayuno (8:00)", descripcion: "2 tostadas de pan integral (80 g) con aceite de oliva y tomate rallado, 2 huevos revueltos, 1 naranja y café con leche", kcal: 550 },
    { hora: "Media mañana (11:00)", descripcion: "Yogur griego natural con un puñado de frutos secos (25 g) y una pieza de fruta", kcal: 300 },
    { hora: "Comida (14:30)", descripcion: "Arroz (90 g en crudo) con pollo y verduras de la huerta, ensalada con aceite de oliva, fruta", kcal: 850 },
    { hora: "Pre-entreno (17:00)", descripcion: "Bocadillo pequeño de pavo y queso fresco + plátano", kcal: 350 },
    { hora: "Cena (21:30)", descripcion: "Pasta integral (90 g en crudo) con atún, tomate y albahaca, ensalada y yogur", kcal: 650 }
  ],
  "Día de descanso": [
    { hora: "Desayuno", descripcion: "Avena cocida con leche, fruta troceada y unas nueces", kcal: 450 },
    { hora: "Media mañana", descripcion: "Tostada con pavo o queso fresco y una fruta", kcal: 250 },
    { hora: "Comida", descripcion: "Lentejas estofadas con verduras, merluza a la plancha, ensalada y pan", kcal: 800 },
    { hora: "Merienda", descripcion: "Yogur natural con fruta", kcal: 200 },
    { hora: "Cena", descripcion: "Tortilla de 3 huevos con verduras salteadas, pan y fruta", kcal: 600 }
  ],
  "Pérdida de grasa": [
    { hora: "Desayuno", descripcion: "Tortilla de 2 huevos con espinacas, 1 tostada de pan integral, café", kcal: 400 },
    { hora: "Media mañana", descripcion: "Queso fresco batido 0 % con fruta", kcal: 150 },
    { hora: "Comida", descripcion: "Ensalada grande con atún, huevo cocido y garbanzos, pollo a la plancha con verduras", kcal: 650 },
    { hora: "Merienda", descripcion: "Yogur natural y un puñado pequeño de almendras", kcal: 200 },
    { hora: "Cena", descripcion: "Merluza al horno con verduras y patata cocida, fruta", kcal: 500 }
  ],
  "Vegetariano": [
    { hora: "Desayuno", descripcion: "Avena con bebida de soja enriquecida, plátano, semillas de calabaza y una cucharada de crema de cacahuete", kcal: 550 },
    { hora: "Media mañana", descripcion: "Tostada con hummus y tomate", kcal: 300 },
    { hora: "Comida", descripcion: "Arroz con lentejas y verduras (complementación de proteínas), ensalada, fruta", kcal: 800 },
    { hora: "Merienda", descripcion: "Yogur de soja con frutos secos y fruta", kcal: 250 },
    { hora: "Cena", descripcion: "Salteado de tofu con verduras y quinoa o fideos, fruta", kcal: 600 }
  ]
};

export const MENU_INFO: Record<NombreMenu, string> = {
  "Día de entreno": "Perfil del ejemplo: hombre de 75 kg, en torno a 2.700 kcal (H 50 % / P 20 % / G 30 %).",
  "Día de descanso": "Menos hidratos, proteína constante.",
  "Pérdida de grasa": "Persona de 65 kg, proteína alta, déficit moderado.",
  "Vegetariano": "Deportista; vigilar B12, hierro, calcio, zinc, yodo y omega-3 en dietas estrictas."
};

/** Timing peri-entreno: [momento, objetivo, cómo, ejemplos] */
export const TIMING: [string, string, string, string][] = [
  ["3-4 h antes", "Llegar con depósitos llenos", "Comida con hidratos de fácil digestión, poca grasa y fibra, proteína moderada.", "Arroz con pollo, pasta con tomate, tostadas con jamón"],
  ["30-60 min antes", "Evitar hambre sin sobrecargar", "Pequeño aporte de hidratos fáciles si se necesita. El manual aconseja evitar azúcares simples en los 30-40 min previos.", "Plátano, barrita, tostada con miel"],
  ["Durante (más de 1 h)", "Mantener glucemia e hidratación", "30-60 g de hidratos/hora y bebida con electrolitos. En esfuerzos de más de 2,5 h puede llegarse a 90 g/h combinando fuentes.", "Bebida deportiva, geles, plátano, barritas"],
  ["0-2 h después", "Reponer glucógeno y reparar músculo", "1-1,2 g/kg de hidratos por hora las primeras horas + 20-40 g de proteína.", "Bocadillo de pavo y leche con cacao; arroz con pollo; batido con fruta"],
  ["Resto del día", "Completar y descansar", "Tras sesiones intensas, el glucógeno tarda en torno a 24-48 h en recuperarse.", "Comidas normales, ricas en hidratos y variadas"]
];

/** Maratón/competición: [momento, consejo, ejemplo] */
export const MARATON: [string, string, string][] = [
  ["Víspera", "Aumentar hidratos sin probar nada nuevo; poca fibra y grasa en la cena", "Pasta con tomate y pollo, pan, fruta madura"],
  ["Desayuno (3 h antes)", "Hidratos fáciles y baja fibra (≈ 1-3 g/kg)", "Tostadas con miel, plátano, café, 500 ml de agua"],
  ["Antes de salir", "Pequeño aporte si hay hambre", "Un gel o gominolas 15 min antes"],
  ["Durante", "30-60 g de hidratos/hora + agua/electrolitos según sudoración", "1 gel cada 30-40 min o bebida deportiva en avituallamientos"],
  ["Después (0-60 min)", "Hidratos rápidos, proteína y líquidos con sodio", "Bocadillo, fruta, bebida con electrolitos, batido"],
  ["Cena de recuperación", "Comida completa", "Arroz con carne o pescado, ensalada, pan, fruta"]
];
