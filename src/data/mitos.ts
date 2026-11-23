/** [afirmación, veredicto, explicación] */
export type Veredicto = "F" | "D";

export const MITOS: [string, Veredicto, string][] = [
  ["«Los hidratos de la cena engordan»", "F", "Engorda el balance energético total del día, no la hora. Los hidratos de la cena incluso ayudan a recuperar glucógeno."],
  ["«Hay que comer cada 2-3 horas para acelerar el metabolismo»", "F", "El efecto térmico depende de la cantidad total, no de la frecuencia. Es cuestión de preferencia, saciedad y organización."],
  ["«Tras entrenar hay 30 minutos para tomar la proteína o se pierde»", "D", "Exagerado: la ventana es mucho más amplia. Importa el total diario y el reparto."],
  ["«La proteína daña los riñones»", "F", "En personas sanas no hay evidencia de daño con ingestas habituales de deportistas. Prudencia en enfermedad renal y vigilar la hidratación."],
  ["«Las grasas son malas»", "F", "Son esenciales. Lo importante es la calidad: aceite de oliva, pescado, frutos secos."],
  ["«Sin gluten es más sano»", "F", "Solo es necesario en celiaquía o sensibilidad diagnosticada. Para el resto no aporta beneficios y puede reducir fibra."],
  ["«Hay que tomar suplementos para progresar»", "F", "Una dieta equilibrada cubre casi todo; los suplementos con evidencia son pocos y específicos."],
  ["«Sudar más es quemar más grasa»", "F", "Sudar es perder agua y sales, no grasa. Se recupera al hidratarse."],
  ["«Haciendo abdominales pierdes grasa del abdomen»", "F", "No se puede elegir de dónde se pierde grasa; la pérdida es general."],
  ["«Los productos light o 0 % adelgazan»", "F", "Pueden reducir energía, pero a veces se compensa comiendo más o llevan más azúcares."],
  ["«El azúcar moreno o la miel son mucho más sanos que el azúcar blanco»", "F", "Nutricionalmente son muy parecidos: son azúcares."],
  ["«La fruta engorda por el azúcar»", "F", "La fruta entera aporta fibra, agua y micronutrientes; no es el problema de la dieta occidental."],
  ["«Los huevos suben el colesterol»", "D", "En personas sanas, un consumo moderado no es un problema; el manual recomienda moderación (menos de 300 mg de colesterol al día)."],
  ["«Las dietas detox limpian el organismo»", "F", "El hígado y el riñón ya depuran; no hay base científica para estos productos."],
  ["«Las agujetas son cristales de ácido láctico»", "F", "El lactato no causa la fatiga ni las agujetas; proceden de microlesiones musculares."],
  ["«Perder 1 kg por semana es lo normal»", "F", "Ritmos más rápidos suelen implicar pérdida de músculo y agua; lo razonable es en torno a 0,5-1 % del peso corporal por semana."]
];
