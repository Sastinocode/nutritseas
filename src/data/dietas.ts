export type SemaforoDieta = "g" | "a" | "r";

export interface Dieta {
  nombre: string;
  semaforo: SemaforoDieta;
  descripcion: string;
  pros: string;
  contras: string;
  valoracion: string;
}

export const DIETAS: Dieta[] = [
  { nombre: "Mediterránea", semaforo: "g", descripcion: "Aceite de oliva, vegetales, legumbres, cereales integrales, pescado, fruta; poca carne roja y procesada.", pros: "Respaldo científico amplio; sostenible; cardiosaludable.", contras: "Si no se controla la cantidad de energía, no garantiza el objetivo calórico.", valoracion: "Modelo base recomendable." },
  { nombre: "Hipocalórica (déficit)", semaforo: "g", descripcion: "Menos energía que el gasto, manteniendo proporciones de macronutrientes.", pros: "Base de toda pérdida de grasa; flexible.", contras: "Déficits excesivos pierden músculo y rendimiento y favorecen carencias.", valoracion: "Recomendable si es moderada y con proteína alta." },
  { nombre: "Hipercalórica (volumen)", semaforo: "a", descripcion: "Más energía que el gasto para ganar masa.", pros: "Facilita ganar músculo con entrenamiento de fuerza.", contras: "Sin entrenamiento, el exceso se convierte en grasa.", valoracion: "Útil con superávit leve y control." },
  { nombre: "Alta en proteínas", semaforo: "a", descripcion: "Proteína por encima de 1,6-2 g/kg.", pros: "Saciedad, conserva masa muscular en déficit.", contras: "Si es excesiva, desplaza hidratos y verduras; vigilar la función renal en personas con riesgo.", valoracion: "Aceptable si es equilibrada." },
  { nombre: "Baja en hidratos / cetogénica", semaforo: "r", descripcion: "Hidratos muy bajos (menos de 50 g/día en keto), grasa alta.", pros: "Pérdida rápida de peso inicial (en buena parte agua); útil en contextos clínicos concretos.", contras: "Puede reducir el rendimiento en alta intensidad; adherencia baja; efectos adversos iniciales.", valoracion: "No recomendable de forma general para entrenamiento intenso." },
  { nombre: "Ayuno intermitente", semaforo: "a", descripcion: "Concentrar la ingesta en ventanas horarias (16:8, 5:2…).", pros: "Puede facilitar el déficit a quien lo encuentra cómodo.", contras: "Con la misma energía total, resultados similares a otras estrategias; complica entrenar fuerte en ayunas y repartir la proteína.", valoracion: "Una herramienta más, no superior; no recomendable en menores ni con antecedentes de TCA." },
  { nombre: "Vegetariana / vegana", semaforo: "a", descripcion: "Excluye carne (y todo producto animal en la vegana).", pros: "Rica en fibra y fitoquímicos; sostenible.", contras: "Riesgo de déficit de B12, hierro, zinc, calcio, omega-3 y proteína si se planifica mal.", valoracion: "Viable con buena planificación y supervisión." },
  { nombre: "Paleo", semaforo: "a", descripcion: "Evita cereales, lácteos y procesados; carne, pescado, frutos secos, fruta, verdura.", pros: "Elimina ultraprocesados; alta en proteína.", contras: "Excluye grupos útiles (integrales, legumbres, lácteos); puede ser baja en hidratos para entrenar.", valoracion: "Valoración mixta; adaptable." },
  { nombre: "Flexible / contar macros", semaforo: "a", descripcion: "Cualquier alimento mientras se cumplan objetivos de energía y macronutrientes.", pros: "Muy educativa; flexible; fácil de ajustar.", contras: "Puede derivar en obsesión por los números; riesgo en personas predispuestas.", valoracion: "Útil con control del profesional y sin obsesión." },
  { nombre: "Dietas «milagro» (detox, sopa de col…)", semaforo: "r", descripcion: "Promesas de pérdida rápida.", pros: "Ninguno relevante.", contras: "Carencias, efecto rebote, deshidratación, sin base científica.", valoracion: "Desaconsejadas." }
];
