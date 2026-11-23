export interface Alimento {
  id: string;
  nombre: string;
  emoji: string;
  grupo: string;
  kcal: number;
  p: number;
  c: number;
  g: number;
  fib: number;
  azuc: number;
  sat: number;
  fe: number;
  ca: number;
  mg: number;
  k: number;
  na: number;
  vc: number;
  vd: number;
  b12: number;
  porcion: number;
  unidad: string;
  solo_adultos?: boolean;
}

export const GRUPOS = [
  "Cereales y tubérculos",
  "Legumbres",
  "Carnes",
  "Pescados y mariscos",
  "Huevos y lácteos",
  "Verduras",
  "Frutas",
  "Frutos secos y semillas",
  "Grasas y aceites",
  "Otros",
  "Bebidas",
  "Suplementos",
] as const;

export const ALIMENTOS: Alimento[] = [
  // Cereales y tubérculos
  { id: "arroz-blanco", nombre: "Arroz blanco cocido", emoji: "🍚", grupo: "Cereales y tubérculos", kcal: 130, p: 2.7, c: 28.0, g: 0.3, fib: 0.4, azuc: 0.1, sat: 0.1, fe: 0.2, ca: 10, mg: 12, k: 35, na: 1, vc: 0, vd: 0, b12: 0, porcion: 150, unidad: "plato" },
  { id: "arroz-integral", nombre: "Arroz integral cocido", emoji: "🍚", grupo: "Cereales y tubérculos", kcal: 123, p: 2.7, c: 25.6, g: 1.0, fib: 1.6, azuc: 0.2, sat: 0.2, fe: 0.5, ca: 10, mg: 43, k: 86, na: 4, vc: 0, vd: 0, b12: 0, porcion: 150, unidad: "plato" },
  { id: "pasta", nombre: "Pasta cocida", emoji: "🍝", grupo: "Cereales y tubérculos", kcal: 158, p: 5.8, c: 31.0, g: 0.9, fib: 1.8, azuc: 0.6, sat: 0.2, fe: 1.3, ca: 7, mg: 18, k: 44, na: 1, vc: 0, vd: 0, b12: 0, porcion: 180, unidad: "plato" },
  { id: "pasta-integral", nombre: "Pasta integral cocida", emoji: "🍝", grupo: "Cereales y tubérculos", kcal: 124, p: 5.3, c: 26.5, g: 0.5, fib: 3.9, azuc: 0.8, sat: 0.1, fe: 1.1, ca: 15, mg: 42, k: 62, na: 3, vc: 0, vd: 0, b12: 0, porcion: 180, unidad: "plato" },
  { id: "pan-integral", nombre: "Pan integral", emoji: "🍞", grupo: "Cereales y tubérculos", kcal: 247, p: 13.0, c: 41.0, g: 3.4, fib: 7.0, azuc: 6.0, sat: 0.7, fe: 2.5, ca: 107, mg: 82, k: 250, na: 450, vc: 0, vd: 0, b12: 0, porcion: 40, unidad: "rebanada" },
  { id: "pan-blanco", nombre: "Pan blanco", emoji: "🥖", grupo: "Cereales y tubérculos", kcal: 265, p: 9.0, c: 49.0, g: 3.2, fib: 2.7, azuc: 5.0, sat: 0.7, fe: 3.6, ca: 260, mg: 25, k: 115, na: 490, vc: 0, vd: 0, b12: 0, porcion: 40, unidad: "rebanada" },
  { id: "avena", nombre: "Copos de avena", emoji: "🌾", grupo: "Cereales y tubérculos", kcal: 389, p: 16.9, c: 66.0, g: 6.9, fib: 10.6, azuc: 1.0, sat: 1.2, fe: 4.7, ca: 54, mg: 177, k: 429, na: 2, vc: 0, vd: 0, b12: 0, porcion: 40, unidad: "ración" },
  { id: "patata", nombre: "Patata cocida", emoji: "🥔", grupo: "Cereales y tubérculos", kcal: 87, p: 1.9, c: 20.0, g: 0.1, fib: 1.8, azuc: 0.9, sat: 0.0, fe: 0.3, ca: 5, mg: 22, k: 328, na: 4, vc: 13, vd: 0, b12: 0, porcion: 200, unidad: "ración" },
  { id: "boniato", nombre: "Boniato cocido", emoji: "🍠", grupo: "Cereales y tubérculos", kcal: 90, p: 2.0, c: 21.0, g: 0.2, fib: 3.3, azuc: 6.5, sat: 0.0, fe: 0.7, ca: 38, mg: 27, k: 475, na: 36, vc: 19, vd: 0, b12: 0, porcion: 200, unidad: "ración" },
  { id: "quinoa", nombre: "Quinoa cocida", emoji: "🌾", grupo: "Cereales y tubérculos", kcal: 120, p: 4.4, c: 21.0, g: 1.9, fib: 2.8, azuc: 0.9, sat: 0.2, fe: 1.5, ca: 17, mg: 64, k: 172, na: 7, vc: 0, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  { id: "cuscus", nombre: "Cuscús cocido", emoji: "🌾", grupo: "Cereales y tubérculos", kcal: 112, p: 3.8, c: 23.0, g: 0.2, fib: 1.4, azuc: 0.1, sat: 0.0, fe: 0.4, ca: 8, mg: 8, k: 58, na: 5, vc: 0, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  // Legumbres
  { id: "lentejas", nombre: "Lentejas cocidas", emoji: "🫘", grupo: "Legumbres", kcal: 116, p: 9.0, c: 20.0, g: 0.4, fib: 7.9, azuc: 1.8, sat: 0.1, fe: 3.3, ca: 19, mg: 36, k: 369, na: 2, vc: 1.5, vd: 0, b12: 0, porcion: 200, unidad: "plato" },
  { id: "garbanzos", nombre: "Garbanzos cocidos", emoji: "🫘", grupo: "Legumbres", kcal: 164, p: 8.9, c: 27.0, g: 2.6, fib: 7.6, azuc: 4.8, sat: 0.3, fe: 2.9, ca: 49, mg: 48, k: 291, na: 7, vc: 1.3, vd: 0, b12: 0, porcion: 200, unidad: "plato" },
  { id: "alubias", nombre: "Alubias cocidas", emoji: "🫘", grupo: "Legumbres", kcal: 127, p: 8.7, c: 22.8, g: 0.5, fib: 6.4, azuc: 0.3, sat: 0.1, fe: 2.2, ca: 35, mg: 45, k: 405, na: 2, vc: 0, vd: 0, b12: 0, porcion: 200, unidad: "plato" },
  { id: "tofu", nombre: "Tofu", emoji: "🧈", grupo: "Legumbres", kcal: 76, p: 8.0, c: 1.9, g: 4.8, fib: 0.3, azuc: 0.6, sat: 0.7, fe: 5.4, ca: 350, mg: 30, k: 121, na: 7, vc: 0.1, vd: 0, b12: 0, porcion: 120, unidad: "ración" },
  { id: "hummus", nombre: "Hummus", emoji: "🥣", grupo: "Legumbres", kcal: 166, p: 8.0, c: 14.0, g: 9.6, fib: 6.0, azuc: 0.3, sat: 1.4, fe: 2.4, ca: 38, mg: 71, k: 228, na: 379, vc: 0, vd: 0, b12: 0, porcion: 50, unidad: "ración" },
  // Carnes
  { id: "pollo", nombre: "Pechuga de pollo a la plancha", emoji: "🍗", grupo: "Carnes", kcal: 165, p: 31.0, c: 0.0, g: 3.6, fib: 0.0, azuc: 0.0, sat: 1.0, fe: 1.0, ca: 15, mg: 29, k: 256, na: 74, vc: 0, vd: 0.1, b12: 0.3, porcion: 150, unidad: "filete" },
  { id: "pavo", nombre: "Pechuga de pavo (fiambre)", emoji: "🦃", grupo: "Carnes", kcal: 104, p: 17.0, c: 1.7, g: 2.7, fib: 0.0, azuc: 1.0, sat: 0.8, fe: 0.8, ca: 10, mg: 20, k: 300, na: 900, vc: 0, vd: 0, b12: 0.4, porcion: 30, unidad: "loncha" },
  { id: "ternera", nombre: "Ternera magra a la plancha", emoji: "🥩", grupo: "Carnes", kcal: 170, p: 28.0, c: 0.0, g: 6.0, fib: 0.0, azuc: 0.0, sat: 2.5, fe: 2.7, ca: 12, mg: 25, k: 330, na: 60, vc: 0, vd: 0.1, b12: 2.5, porcion: 150, unidad: "filete" },
  { id: "lomo", nombre: "Lomo de cerdo a la plancha", emoji: "🥩", grupo: "Carnes", kcal: 190, p: 29.0, c: 0.0, g: 8.0, fib: 0.0, azuc: 0.0, sat: 2.8, fe: 1.0, ca: 8, mg: 28, k: 380, na: 62, vc: 0, vd: 0.7, b12: 0.7, porcion: 150, unidad: "filete" },
  { id: "jamon-serrano", nombre: "Jamón serrano", emoji: "🍖", grupo: "Carnes", kcal: 241, p: 31.0, c: 0.0, g: 12.0, fib: 0.0, azuc: 0.0, sat: 4.0, fe: 2.0, ca: 10, mg: 25, k: 400, na: 2300, vc: 0, vd: 0, b12: 0.6, porcion: 30, unidad: "loncha" },
  // Pescados y mariscos
  { id: "salmon", nombre: "Salmón al horno", emoji: "🐟", grupo: "Pescados y mariscos", kcal: 206, p: 22.0, c: 0.0, g: 12.4, fib: 0.0, azuc: 0.0, sat: 2.5, fe: 0.4, ca: 12, mg: 30, k: 384, na: 61, vc: 0, vd: 11, b12: 3.0, porcion: 150, unidad: "filete" },
  { id: "atun-lata", nombre: "Atún al natural (lata)", emoji: "🐟", grupo: "Pescados y mariscos", kcal: 116, p: 26.0, c: 0.0, g: 1.0, fib: 0.0, azuc: 0.0, sat: 0.3, fe: 1.3, ca: 10, mg: 30, k: 237, na: 247, vc: 0, vd: 2.3, b12: 2.2, porcion: 80, unidad: "lata" },
  { id: "merluza", nombre: "Merluza cocida", emoji: "🐟", grupo: "Pescados y mariscos", kcal: 90, p: 19.0, c: 0.0, g: 1.3, fib: 0.0, azuc: 0.0, sat: 0.3, fe: 0.4, ca: 15, mg: 35, k: 400, na: 90, vc: 0, vd: 1, b12: 1.1, porcion: 150, unidad: "filete" },
  { id: "sardinas", nombre: "Sardinas en lata (escurridas)", emoji: "🐟", grupo: "Pescados y mariscos", kcal: 208, p: 25.0, c: 0.0, g: 11.5, fib: 0.0, azuc: 0.0, sat: 1.5, fe: 2.9, ca: 382, mg: 39, k: 397, na: 505, vc: 0, vd: 4.8, b12: 8.9, porcion: 80, unidad: "lata" },
  { id: "gambas", nombre: "Gambas cocidas", emoji: "🦐", grupo: "Pescados y mariscos", kcal: 99, p: 24.0, c: 0.2, g: 0.3, fib: 0.0, azuc: 0.0, sat: 0.1, fe: 0.5, ca: 70, mg: 37, k: 260, na: 560, vc: 0, vd: 0, b12: 1.1, porcion: 100, unidad: "ración" },
  // Huevos y lácteos
  { id: "huevo", nombre: "Huevo", emoji: "🥚", grupo: "Huevos y lácteos", kcal: 143, p: 12.6, c: 0.7, g: 9.5, fib: 0.0, azuc: 0.4, sat: 3.1, fe: 1.8, ca: 56, mg: 12, k: 138, na: 142, vc: 0, vd: 2, b12: 1.1, porcion: 60, unidad: "unidad" },
  { id: "leche", nombre: "Leche semidesnatada", emoji: "🥛", grupo: "Huevos y lácteos", kcal: 46, p: 3.4, c: 4.9, g: 1.6, fib: 0.0, azuc: 4.9, sat: 1.0, fe: 0.0, ca: 120, mg: 11, k: 150, na: 45, vc: 0, vd: 0.1, b12: 0.4, porcion: 250, unidad: "vaso" },
  { id: "yogur", nombre: "Yogur natural", emoji: "🥛", grupo: "Huevos y lácteos", kcal: 61, p: 3.5, c: 4.7, g: 3.3, fib: 0.0, azuc: 4.7, sat: 2.1, fe: 0.1, ca: 121, mg: 12, k: 155, na: 46, vc: 0.5, vd: 0, b12: 0.4, porcion: 125, unidad: "unidad" },
  { id: "yogur-griego", nombre: "Yogur griego natural", emoji: "🥛", grupo: "Huevos y lácteos", kcal: 97, p: 9.0, c: 3.9, g: 5.0, fib: 0.0, azuc: 3.6, sat: 3.2, fe: 0.1, ca: 100, mg: 11, k: 141, na: 36, vc: 0, vd: 0, b12: 0.5, porcion: 125, unidad: "unidad" },
  { id: "queso-batido", nombre: "Queso fresco batido 0 %", emoji: "🧀", grupo: "Huevos y lácteos", kcal: 46, p: 8.0, c: 3.5, g: 0.2, fib: 0.0, azuc: 3.5, sat: 0.1, fe: 0.1, ca: 100, mg: 10, k: 150, na: 40, vc: 0, vd: 0, b12: 0.5, porcion: 125, unidad: "tarrina" },
  { id: "queso-fresco", nombre: "Queso fresco (Burgos)", emoji: "🧀", grupo: "Huevos y lácteos", kcal: 174, p: 13.0, c: 3.0, g: 12.0, fib: 0.0, azuc: 2.0, sat: 8.0, fe: 0.2, ca: 180, mg: 14, k: 90, na: 250, vc: 0, vd: 0, b12: 0.5, porcion: 50, unidad: "ración" },
  { id: "queso-curado", nombre: "Queso curado", emoji: "🧀", grupo: "Huevos y lácteos", kcal: 400, p: 25.0, c: 0.5, g: 33.0, fib: 0.0, azuc: 0.5, sat: 21.0, fe: 0.4, ca: 800, mg: 30, k: 100, na: 700, vc: 0, vd: 0.5, b12: 1.5, porcion: 30, unidad: "cuña" },
  // Verduras
  { id: "tomate", nombre: "Tomate", emoji: "🍅", grupo: "Verduras", kcal: 18, p: 0.9, c: 3.9, g: 0.2, fib: 1.2, azuc: 2.6, sat: 0.0, fe: 0.3, ca: 10, mg: 11, k: 237, na: 5, vc: 14, vd: 0, b12: 0, porcion: 150, unidad: "unidad" },
  { id: "lechuga", nombre: "Lechuga", emoji: "🥬", grupo: "Verduras", kcal: 15, p: 1.4, c: 2.9, g: 0.2, fib: 1.3, azuc: 0.8, sat: 0.0, fe: 0.9, ca: 36, mg: 13, k: 194, na: 28, vc: 9, vd: 0, b12: 0, porcion: 60, unidad: "ración" },
  { id: "espinacas", nombre: "Espinacas", emoji: "🥬", grupo: "Verduras", kcal: 23, p: 2.9, c: 3.6, g: 0.4, fib: 2.2, azuc: 0.4, sat: 0.1, fe: 2.7, ca: 99, mg: 79, k: 558, na: 79, vc: 28, vd: 0, b12: 0, porcion: 80, unidad: "ración" },
  { id: "brocoli", nombre: "Brócoli cocido", emoji: "🥦", grupo: "Verduras", kcal: 35, p: 2.4, c: 7.2, g: 0.4, fib: 3.3, azuc: 1.4, sat: 0.1, fe: 0.7, ca: 40, mg: 21, k: 293, na: 41, vc: 65, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  { id: "zanahoria", nombre: "Zanahoria", emoji: "🥕", grupo: "Verduras", kcal: 41, p: 0.9, c: 9.6, g: 0.2, fib: 2.8, azuc: 4.7, sat: 0.0, fe: 0.3, ca: 33, mg: 12, k: 320, na: 69, vc: 6, vd: 0, b12: 0, porcion: 100, unidad: "unidad" },
  { id: "pimiento", nombre: "Pimiento rojo", emoji: "🫑", grupo: "Verduras", kcal: 31, p: 1.0, c: 6.0, g: 0.3, fib: 2.1, azuc: 4.2, sat: 0.1, fe: 0.4, ca: 7, mg: 12, k: 211, na: 4, vc: 128, vd: 0, b12: 0, porcion: 100, unidad: "unidad" },
  { id: "cebolla", nombre: "Cebolla", emoji: "🧅", grupo: "Verduras", kcal: 40, p: 1.1, c: 9.3, g: 0.1, fib: 1.7, azuc: 4.2, sat: 0.0, fe: 0.2, ca: 23, mg: 10, k: 146, na: 4, vc: 7, vd: 0, b12: 0, porcion: 80, unidad: "unidad" },
  { id: "pepino", nombre: "Pepino", emoji: "🥒", grupo: "Verduras", kcal: 15, p: 0.7, c: 3.6, g: 0.1, fib: 0.5, azuc: 1.7, sat: 0.0, fe: 0.3, ca: 16, mg: 13, k: 147, na: 2, vc: 2.8, vd: 0, b12: 0, porcion: 100, unidad: "ración" },
  { id: "calabacin", nombre: "Calabacín", emoji: "🥒", grupo: "Verduras", kcal: 17, p: 1.2, c: 3.1, g: 0.3, fib: 1.0, azuc: 2.5, sat: 0.1, fe: 0.4, ca: 16, mg: 18, k: 261, na: 8, vc: 18, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  { id: "judias-verdes", nombre: "Judías verdes cocidas", emoji: "🫛", grupo: "Verduras", kcal: 35, p: 1.9, c: 7.9, g: 0.3, fib: 3.2, azuc: 1.4, sat: 0.0, fe: 0.6, ca: 44, mg: 24, k: 146, na: 1, vc: 1, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  { id: "champinon", nombre: "Champiñones", emoji: "🍄", grupo: "Verduras", kcal: 22, p: 3.1, c: 3.3, g: 0.3, fib: 1.0, azuc: 2.0, sat: 0.0, fe: 0.5, ca: 3, mg: 9, k: 318, na: 5, vc: 2, vd: 0.2, b12: 0, porcion: 100, unidad: "ración" },
  { id: "aguacate", nombre: "Aguacate", emoji: "🥑", grupo: "Verduras", kcal: 160, p: 2.0, c: 8.5, g: 14.7, fib: 6.7, azuc: 0.7, sat: 2.1, fe: 0.6, ca: 12, mg: 29, k: 485, na: 7, vc: 10, vd: 0, b12: 0, porcion: 100, unidad: "medio" },
  // Frutas
  { id: "platano", nombre: "Plátano", emoji: "🍌", grupo: "Frutas", kcal: 89, p: 1.1, c: 23.0, g: 0.3, fib: 2.6, azuc: 12.0, sat: 0.1, fe: 0.3, ca: 5, mg: 27, k: 358, na: 1, vc: 8.7, vd: 0, b12: 0, porcion: 120, unidad: "unidad" },
  { id: "naranja", nombre: "Naranja", emoji: "🍊", grupo: "Frutas", kcal: 47, p: 0.9, c: 11.8, g: 0.1, fib: 2.4, azuc: 9.4, sat: 0.0, fe: 0.1, ca: 40, mg: 10, k: 181, na: 0, vc: 53, vd: 0, b12: 0, porcion: 150, unidad: "unidad" },
  { id: "manzana", nombre: "Manzana", emoji: "🍎", grupo: "Frutas", kcal: 52, p: 0.3, c: 13.8, g: 0.2, fib: 2.4, azuc: 10.0, sat: 0.0, fe: 0.1, ca: 6, mg: 5, k: 107, na: 1, vc: 4.6, vd: 0, b12: 0, porcion: 180, unidad: "unidad" },
  { id: "fresas", nombre: "Fresas", emoji: "🍓", grupo: "Frutas", kcal: 32, p: 0.7, c: 7.7, g: 0.3, fib: 2.0, azuc: 4.9, sat: 0.0, fe: 0.4, ca: 16, mg: 13, k: 153, na: 1, vc: 59, vd: 0, b12: 0, porcion: 150, unidad: "ración" },
  { id: "uvas", nombre: "Uvas", emoji: "🍇", grupo: "Frutas", kcal: 69, p: 0.7, c: 18.0, g: 0.2, fib: 0.9, azuc: 15.0, sat: 0.1, fe: 0.4, ca: 10, mg: 7, k: 191, na: 2, vc: 3.2, vd: 0, b12: 0, porcion: 120, unidad: "racimo" },
  { id: "sandia", nombre: "Sandía", emoji: "🍉", grupo: "Frutas", kcal: 30, p: 0.6, c: 7.6, g: 0.2, fib: 0.4, azuc: 6.2, sat: 0.0, fe: 0.2, ca: 7, mg: 10, k: 112, na: 1, vc: 8.1, vd: 0, b12: 0, porcion: 250, unidad: "tajada" },
  { id: "kiwi", nombre: "Kiwi", emoji: "🥝", grupo: "Frutas", kcal: 61, p: 1.1, c: 14.7, g: 0.5, fib: 3.0, azuc: 9.0, sat: 0.0, fe: 0.3, ca: 34, mg: 17, k: 312, na: 3, vc: 93, vd: 0, b12: 0, porcion: 100, unidad: "unidad" },
  { id: "datiles", nombre: "Dátiles", emoji: "🌴", grupo: "Frutas", kcal: 282, p: 2.5, c: 75.0, g: 0.4, fib: 8.0, azuc: 63.0, sat: 0.0, fe: 1.0, ca: 39, mg: 54, k: 656, na: 2, vc: 0, vd: 0, b12: 0, porcion: 30, unidad: "3 unidades" },
  // Frutos secos y semillas
  { id: "almendras", nombre: "Almendras", emoji: "🌰", grupo: "Frutos secos y semillas", kcal: 579, p: 21.0, c: 22.0, g: 50.0, fib: 12.5, azuc: 4.0, sat: 3.8, fe: 3.7, ca: 269, mg: 270, k: 733, na: 1, vc: 0, vd: 0, b12: 0, porcion: 25, unidad: "puñado" },
  { id: "nueces", nombre: "Nueces", emoji: "🌰", grupo: "Frutos secos y semillas", kcal: 654, p: 15.0, c: 14.0, g: 65.0, fib: 6.7, azuc: 2.6, sat: 6.0, fe: 2.9, ca: 98, mg: 158, k: 441, na: 2, vc: 1.3, vd: 0, b12: 0, porcion: 25, unidad: "puñado" },
  { id: "cacahuetes", nombre: "Cacahuetes", emoji: "🥜", grupo: "Frutos secos y semillas", kcal: 567, p: 26.0, c: 16.0, g: 49.0, fib: 8.5, azuc: 4.0, sat: 6.8, fe: 4.6, ca: 92, mg: 168, k: 705, na: 18, vc: 0, vd: 0, b12: 0, porcion: 25, unidad: "puñado" },
  { id: "crema-cacahuete", nombre: "Crema de cacahuete", emoji: "🥜", grupo: "Frutos secos y semillas", kcal: 588, p: 25.0, c: 20.0, g: 50.0, fib: 6.0, azuc: 9.0, sat: 10.0, fe: 1.9, ca: 49, mg: 154, k: 649, na: 459, vc: 0, vd: 0, b12: 0, porcion: 20, unidad: "cucharada" },
  { id: "pipas-calabaza", nombre: "Pipas de calabaza", emoji: "🌱", grupo: "Frutos secos y semillas", kcal: 559, p: 30.0, c: 11.0, g: 49.0, fib: 6.0, azuc: 1.4, sat: 8.7, fe: 8.8, ca: 46, mg: 592, k: 809, na: 7, vc: 1.9, vd: 0, b12: 0, porcion: 20, unidad: "cucharada" },
  // Grasas y aceites
  { id: "aceite-oliva", nombre: "Aceite de oliva virgen extra", emoji: "🫒", grupo: "Grasas y aceites", kcal: 884, p: 0.0, c: 0.0, g: 100.0, fib: 0.0, azuc: 0.0, sat: 13.8, fe: 0.6, ca: 1, mg: 0, k: 1, na: 2, vc: 0, vd: 0, b12: 0, porcion: 10, unidad: "cucharada" },
  // Otros
  { id: "chocolate-negro", nombre: "Chocolate negro 70 %", emoji: "🍫", grupo: "Otros", kcal: 598, p: 7.8, c: 46.0, g: 43.0, fib: 11.0, azuc: 24.0, sat: 25.0, fe: 11.9, ca: 73, mg: 228, k: 715, na: 20, vc: 0, vd: 0, b12: 0, porcion: 20, unidad: "onza" },
  { id: "miel", nombre: "Miel", emoji: "🍯", grupo: "Otros", kcal: 304, p: 0.3, c: 82.0, g: 0.0, fib: 0.2, azuc: 82.0, sat: 0.0, fe: 0.4, ca: 6, mg: 2, k: 52, na: 4, vc: 0.5, vd: 0, b12: 0, porcion: 15, unidad: "cucharada" },
  // Bebidas
  { id: "leche-soja", nombre: "Bebida de soja enriquecida", emoji: "🥛", grupo: "Bebidas", kcal: 33, p: 2.9, c: 1.7, g: 1.8, fib: 0.6, azuc: 1.0, sat: 0.2, fe: 0.4, ca: 120, mg: 15, k: 120, na: 50, vc: 0, vd: 1, b12: 0, porcion: 250, unidad: "vaso" },
  { id: "zumo-naranja", nombre: "Zumo de naranja", emoji: "🧃", grupo: "Bebidas", kcal: 45, p: 0.7, c: 10.4, g: 0.2, fib: 0.2, azuc: 8.4, sat: 0.0, fe: 0.2, ca: 11, mg: 11, k: 200, na: 1, vc: 50, vd: 0, b12: 0, porcion: 200, unidad: "vaso" },
  { id: "isotonica", nombre: "Bebida isotónica", emoji: "🥤", grupo: "Bebidas", kcal: 26, p: 0.0, c: 6.4, g: 0.0, fib: 0.0, azuc: 5.8, sat: 0.0, fe: 0.0, ca: 0, mg: 0, k: 0, na: 40, vc: 0, vd: 0, b12: 0, porcion: 500, unidad: "botella" },
  // Suplementos
  { id: "whey", nombre: "Batido de proteína (whey), solo adultos", emoji: "🥤", grupo: "Suplementos", kcal: 380, p: 78.0, c: 8.0, g: 6.0, fib: 0.0, azuc: 5.0, sat: 3.0, fe: 0.5, ca: 400, mg: 60, k: 400, na: 300, vc: 0, vd: 0, b12: 0, porcion: 30, unidad: "cacito", solo_adultos: true },
];
