export type Semaforo = "g" | "a" | "r";

export interface Suplemento {
  id: string;
  n: string;
  l: Semaforo;
  q: string;
  d: string;
  w: string;
  c: string;
  f: string;
  nm: string;
}

export const SUPS: Suplemento[] = [
  { id: "carb", n: "Bebidas deportivas y carbohidratos", l: "g", q: "Reponer glucosa y electrolitos en esfuerzos largos (más de 1 h).", d: "30-60 g de hidratos/h; bebida con 6-8 % de hidratos.", w: "Durante el esfuerzo.", c: "Probar la tolerancia digestiva antes de competir.", f: "Plátano, dátiles, pan con membrillo, agua con una pizca de sal.", nm: "Sirven en esfuerzos de más de una hora; para una clase de gimnasio de 45 minutos, con agua basta." },
  { id: "caf", n: "Cafeína", l: "g", q: "Mejora el rendimiento aeróbico, los deportes intermitentes y la fuerza; reduce la percepción del esfuerzo.", d: "3-6 mg/kg (el manual da 3 mg/kg).", w: "45-60 min antes.", c: "Insomnio, nerviosismo, molestias digestivas. Referencia de seguridad ≈ 400 mg/día en adultos. No en menores.", f: "Café o té; no hace falta pastilla ni energética.", nm: "Las bebidas energéticas añaden azúcar y mucha cafeína de golpe: no son una opción para menores ni para estudiar." },
  { id: "cre", n: "Creatina monohidrato", l: "g", q: "Mejora los esfuerzos repetidos de alta intensidad y la fuerza.", d: "3-5 g/día de forma continuada (el manual describe también una fase de carga, que hoy no se considera imprescindible).", w: "Cualquier momento, a diario.", c: "Puede retener algo de agua; usar solo producto con sello de calidad.", f: "La carne y el pescado aportan pequeñas cantidades, insuficientes para el efecto del suplemento.", nm: "Es de los más estudiados, pero solo tiene sentido en adultos con entrenamiento de fuerza o esfuerzos explosivos." },
  { id: "bic", n: "Bicarbonato sódico", l: "g", q: "Tampón de la acidez en esfuerzos de ~1 min o repetidos.", d: "0,2-0,3 g/kg (el manual: 0,3 g/kg una hora antes).", w: "60-120 min antes.", c: "Molestias digestivas muy frecuentes; probar antes en entrenamiento.", f: "No hay equivalente en alimentos.", nm: "Solo para deporte de alta intensidad de ~1-4 minutos; no es para quien entrena por salud." },
  { id: "nit", n: "Nitrato (zumo de remolacha)", l: "g", q: "Mejora la eficiencia en ejercicios continuos submáximos (carrera, ciclismo, natación).", d: "≈ 300-600 mg de nitrato (≈ 500 ml de zumo concentrado de remolacha).", w: "2-3 h antes (o varios días).", c: "Orina y heces de color rojo (inofensivo).", f: "Remolacha, espinacas, rúcula.", nm: "Efecto modesto; tiene más sentido en deportistas de resistencia." },
  { id: "pro", n: "Proteína en polvo (suero)", l: "g", q: "Comodidad para alcanzar el total diario.", d: "20-40 g por toma.", w: "Después de entrenar o cuando falte proteína.", c: "No es mejor que la proteína de la comida; es solo práctica.", f: "Huevos, yogur griego, queso fresco, atún, pollo, lentejas.", nm: "Si ya llegas a tu proteína con comida, el polvo no añade nada." },
  { id: "bet", n: "Beta-alanina", l: "a", q: "Puede mejorar esfuerzos de 1 a 4 minutos.", d: "≈ 3-6 g/día durante varias semanas.", w: "Repartida durante el día.", c: "Provoca hormigueo (parestesia) en la piel.", f: "—", nm: "Efecto pequeño y específico." },
  { id: "cit", n: "Citrato de sodio", l: "a", q: "Alternativa al bicarbonato si da molestias digestivas.", d: "Dosis variables según protocolo.", w: "Antes del esfuerzo.", c: "Los resultados no son uniformes.", f: "—", nm: "Evidencia menos consistente que el bicarbonato." },
  { id: "om3", n: "Omega-3", l: "a", q: "Puede ayudar si se come poco pescado azul.", d: "Primero mejorar la dieta.", w: "Con comidas.", c: "Elegir producto con control de calidad.", f: "Pescado azul 2 veces/semana, nueces, semillas.", nm: "Antes de comprar cápsulas, comer pescado azul." },
  { id: "hmb", n: "HMB", l: "a", q: "No hay eficacia demostrada de forma sólida (así lo señala el manual).", d: "—", w: "—", c: "No afecta a la salud en dosis habituales, pero tampoco hay motivo claro para tomarlo.", f: "—", nm: "Dinero dudoso." },
  { id: "med", n: "Vitamina D, hierro, calcio, B12", l: "a", q: "Suplementos médicos: corrigen un déficit confirmado.", d: "La fija el médico según analítica.", w: "—", c: "Los liposolubles (como la D) pueden dar toxicidad en exceso; el hierro sobrante también es dañino.", f: "Pescado azul y huevo (D), lácteos (calcio), carne y legumbres (hierro), alimentos animales (B12).", nm: "Solo con analítica y criterio médico. Los veganos necesitan B12." },
  { id: "bca", n: "BCAA y aminoácidos sueltos", l: "r", q: "Con una dieta con proteína suficiente no aportan beneficio adicional.", d: "—", w: "—", c: "Gasto innecesario.", f: "Cualquier fuente de proteína completa.", nm: "No necesarios si comes proteína suficiente." },
  { id: "glu", n: "Glutamina y L-carnitina", l: "r", q: "Sin beneficio demostrado en rendimiento.", d: "—", w: "—", c: "Gasto innecesario.", f: "—", nm: "Sin evidencia sólida." },
  { id: "mul", n: "Multivitamínicos «por si acaso»", l: "r", q: "Una dieta equilibrada basta.", d: "—", w: "—", c: "Dosis altas de vitamina C o E pueden reducir la adaptación al entrenamiento.", f: "Fruta, verdura, frutos secos, legumbres.", nm: "Mejor un plato variado que un bote." },
  { id: "qua", n: "Quemagrasas, boosters y pre-entrenos con mezclas desconocidas", l: "r", q: "Evidencia floja o nula.", d: "—", w: "—", c: "Riesgo de contaminación, taquicardia e interacciones; pueden contener sustancias prohibidas.", f: "—", nm: "El mayor riesgo del mercado." }
];

export const SEMAFORO_LABEL: Record<Semaforo, [string, string]> = {
  g: ["g", "Eficacia comprobada"],
  a: ["a", "Posible efecto / según el caso"],
  r: ["r", "Sin evidencia o desaconsejado"]
};

export interface PreguntaQuiz {
  q: string;
  o: string[];
  e: string;
}

/** Bulos: [texto, "V"|"F", explicación] */
export const BULOS: [string, "V" | "F", string][] = [
  ["«Quema grasa en 7 días SIN dieta ni ejercicio»", "F", "Promesa milagro: ninguna sustancia hace eso. Señal de alarma."],
  ["«Fórmula secreta patentada, no podemos decir las cantidades»", "F", "Si no detalla ingredientes y dosis, no puedes saber qué tomas. Señal de alarma."],
  ["«Miles de clientes felices»: solo testimonios y fotos de antes/después", "F", "Los testimonios no son estudios. Señal de alarma."],
  ["«Creatina monohidrato, 5 g por toma, con sello de control antidopaje»", "V", "Ingrediente con evidencia, dosis clara y control de calidad: señal razonable (aun así, solo para adultos y con objetivo de rendimiento)."],
  ["«Aumenta tu testosterona de forma natural y sube tu masa muscular sin entrenar»", "F", "Promesa sin base y de riesgo: es un clásico de producto contaminado. Señal de alarma."],
  ["«Contiene todo lo que necesitas, no hace falta cambiar tu dieta»", "F", "La base es siempre la alimentación y el descanso. Señal de alarma."],
  ["«Vitamina D recomendada tras detectar déficit en tu analítica»", "V", "Un suplemento médico con indicación concreta y supervisión es una señal razonable."],
  ["«Cápsulas de cafeína de 400 mg para tomar antes de estudiar»", "F", "Esa dosis está en el límite diario de seguridad de un adulto, de golpe y sin objetivo de rendimiento. Señal de alarma."]
];

export const SUPQ: PreguntaQuiz[] = [
  { q: "¿Qué va siempre primero antes de pensar en un suplemento?", o: ["Alimentación variada, suficiente, hidratación y sueño", "Una proteína en polvo", "Un pre-entreno", "Un multivitamínico"], e: "La base de la pirámide es comer bien, hidratarse y dormir." },
  { q: "¿Quién debería, según el manual, usar suplementos con objetivos de rendimiento?", o: ["Solo adultos", "Cualquier edad", "Solo menores", "Solo quien duerme poco"], e: "Los suplementos se emplean con objetivos de rendimiento deportivo y únicamente en adultos." },
  { q: "¿Cuál tiene eficacia comprobada para esfuerzos repetidos de alta intensidad?", o: ["Creatina monohidrato", "Quemagrasas", "BCAA", "L-carnitina"], e: "La creatina monohidrato (3-5 g/día) es de los suplementos mejor estudiados." },
  { q: "Un adulto de 70 kg: rango de cafeína de 3-6 mg/kg…", o: ["210-420 mg, sin pasar del límite diario de seguridad (≈ 400 mg)", "700 mg", "20 mg", "1.000 mg"], e: "70 × 3 = 210 y 70 × 6 = 420; el total diario de todas las fuentes no debería pasar de unos 400 mg." },
  { q: "¿Para qué se tomaría hierro o vitamina D en suplemento?", o: ["Solo ante un déficit confirmado en analítica", "Para dormir mejor", "Para ganar músculo", "Siempre, por si acaso"], e: "Son suplementos médicos: se pautan con analítica y criterio del médico." },
  { q: "¿Qué hacer antes de usar un suplemento en competición federada?", o: ["Consultar la lista de sustancias prohibidas y elegir productos con sello", "Fiarse de la etiqueta", "Probarlo el día de la prueba", "Preguntar en redes sociales"], e: "Hay productos contaminados: consulta la lista AMA/AEPSAD y prefiere productos con sellos como Informed Sport o NSF." },
  { q: "¿Qué debe hacer un deportista con un suplemento nuevo?", o: ["Probarlo en entrenamientos antes de usarlo en competición", "Estrenarlo en la competición", "Doblar la dosis", "Mezclarlo con otros"], e: "Probar en entrenamientos para ver la respuesta individual y la tolerancia digestiva." },
  { q: "Un cliente adolescente quiere «algo para ganar músculo». ¿Qué le aconsejas?", o: ["Comida suficiente, entrenamiento progresivo y descanso; sin suplementos", "Creatina y proteína ya", "Un quemagrasas", "Cafeína antes de cada sesión"], e: "Los suplementos no son para menores. Primero comer, entrenar bien y dormir." }
];
