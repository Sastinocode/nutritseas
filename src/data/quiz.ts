export interface PreguntaQuiz {
  q: string;
  o: string[];
  e: string;
}

/** La primera opción de cada pregunta es la correcta. Se baraja al mostrar. */
export const QUIZ: PreguntaQuiz[] = [
  { q: "¿Cuántas kcal aporta 1 gramo de grasa?", o: ["9 kcal", "4 kcal", "7 kcal", "2 kcal"], e: "Grasas 9 kcal/g; hidratos y proteínas 4 kcal/g; alcohol 7 kcal/g." },
  { q: "Un yogur tiene 10 g de hidratos, 5 g de proteína y 3 g de grasa. ¿Cuántas kcal aporta?", o: ["87 kcal", "63 kcal", "120 kcal", "54 kcal"], e: "40 + 20 + 27 = 87 kcal (4·H + 4·P + 9·G)." },
  { q: "¿Cuántos aminoácidos esenciales hay?", o: ["9", "5", "12", "20"], e: "Son 9 y deben venir de la dieta." },
  { q: "¿Qué función tiene principalmente la proteína?", o: ["Construir y reparar tejidos", "Ser la reserva más grande de energía", "Aportar el combustible rápido del ejercicio", "Disolver las vitaminas"], e: "Las proteínas son el ladrillo estructural y forman enzimas, hormonas y anticuerpos." },
  { q: "¿Qué combinación mejora la calidad de la proteína vegetal?", o: ["Legumbres con cereales", "Fruta con agua", "Aceite con sal", "Solo frutos secos"], e: "Las legumbres tienen poca metionina y los cereales poca lisina: se complementan." },
  { q: "Un deportista de fuerza de 70 kg y 1,8 g/kg necesita en torno a…", o: ["126 g de proteína al día", "56 g de proteína al día", "300 g de proteína al día", "20 g de proteína al día"], e: "70 × 1,8 = 126 g. Lo ideal es repartirlo en 3-5 tomas." },
  { q: "¿Qué dice la evidencia sobre la «ventana anabólica» de 30 minutos?", o: ["Es más amplia: importa el total del día", "Si no tomas proteína en 30 min, la pierdes", "Solo vale con batidos", "Solo existe en mujeres"], e: "Es en gran parte un mito; pesa más el aporte total y el reparto." },
  { q: "Orina de color amarillo oscuro indica…", o: ["Conviene beber más", "Estás perfectamente hidratado", "Exceso de vitaminas", "Que has comido proteína de más"], e: "Amarillo pálido = bien hidratado; amarillo oscuro = beber más." },
  { q: "Tras perder 1 kg en un entrenamiento por sudor, ¿cuánto conviene reponer?", o: ["En torno a 1,2-1,5 litros", "100 ml", "Medio litro de bebida energética", "Nada, se recupera solo"], e: "Se repone más de lo perdido (1,2-1,5 L por kg), con algo de sodio para retenerlo." },
  { q: "¿Cuál es la mejor definición de dieta mediterránea?", o: ["Aceite de oliva, vegetales, legumbres, integrales, pescado y fruta", "Mucha carne roja y poca verdura", "Sin hidratos", "Solo ensaladas"], e: "Es el modelo base recomendable por su respaldo científico y sostenibilidad." },
  { q: "Eres técnico deportivo y un cliente te pide una dieta para su diabetes. Lo correcto es…", o: ["Derivar al médico o dietista-nutricionista", "Darle un menú", "Recomendarle una cetogénica", "Pasarle un suplemento"], e: "El técnico educa en hábitos generales: no prescribe dietas terapéuticas ni individualizadas." },
  { q: "¿Qué grasas conviene priorizar?", o: ["Monoinsaturadas y omega-3 (AOVE, frutos secos, pescado azul)", "Trans de bollería", "Saturadas de embutidos", "Ninguna"], e: "Se trata de cambiar la calidad: no hay que «quitar grasa»." },
  { q: "Metabolismo basal de un hombre de 75 kg, 178 cm y 22 años (Mifflin-St Jeor)", o: ["≈ 1.758 kcal", "≈ 2.725 kcal", "≈ 1.200 kcal", "≈ 3.500 kcal"], e: "10·75 + 6,25·178 − 5·22 + 5 = 1.757,5. Con factor 1,55 el gasto total sale en torno a 2.700 kcal." },
  { q: "Sudar mucho en el entrenamiento significa…", o: ["Perder agua y sales, no grasa", "Quemar más grasa", "Que entrenas mejor", "Que desintoxicas"], e: "El sudor es termorregulación; se repone bebiendo." },
  { q: "¿Cuál es la referencia de fibra al día?", o: ["25-30 g", "5 g", "80 g", "No hace falta"], e: "El manual sitúa la recomendación en 25-30 g/día." }
];
