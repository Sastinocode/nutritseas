"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Sexo } from "./nutricion";

export interface Perfil {
  nombre: string;
  peso: number | null;
  talla: number | null;
  edad: number | null;
  sexo: Sexo;
  actividad: number;
}

export interface Progreso {
  quiz: number;
  mitos: number;
  supq: number;
  bulos: number;
  seccionesVistas: string[];
}

interface NutriStore {
  perfil: Perfil;
  progreso: Progreso;

  setPerfil: (p: Partial<Perfil>) => void;
  marcarSeccion: (id: string) => void;
  guardarPuntuacion: (key: keyof Omit<Progreso, "seccionesVistas">, valor: number) => void;
  resetProgreso: () => void;
  resetAll: () => void;
}

const perfilInicial: Perfil = {
  nombre: "",
  peso: null,
  talla: null,
  edad: null,
  sexo: "hombre",
  actividad: 1.55
};

const progresoInicial: Progreso = {
  quiz: 0,
  mitos: 0,
  supq: 0,
  bulos: 0,
  seccionesVistas: []
};

export const useNutriStore = create<NutriStore>()(
  persist(
    (set) => ({
      perfil: perfilInicial,
      progreso: progresoInicial,

      setPerfil: (p) =>
        set((s) => ({ perfil: { ...s.perfil, ...p } })),

      marcarSeccion: (id) =>
        set((s) => ({
          progreso: {
            ...s.progreso,
            seccionesVistas: s.progreso.seccionesVistas.includes(id)
              ? s.progreso.seccionesVistas
              : [...s.progreso.seccionesVistas, id]
          }
        })),

      guardarPuntuacion: (key, valor) =>
        set((s) => ({
          progreso: {
            ...s.progreso,
            [key]: Math.max(s.progreso[key], valor)
          }
        })),

      resetProgreso: () =>
        set({ progreso: progresoInicial }),

      resetAll: () =>
        set({ perfil: perfilInicial, progreso: progresoInicial })
    }),
    {
      name: "nutritseas-v1",
      /* Solo persiste lo necesario; datos sensibles (peso/talla) quedan en dispositivo */
      partialize: (s) => ({
        perfil: s.perfil,
        progreso: s.progreso
      })
    }
  )
);
