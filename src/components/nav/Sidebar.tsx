"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, UtensilsCrossed, FlaskConical, Trophy, GraduationCap, ClipboardList, LayoutDashboard, Microscope
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV_BASE = [
  { href: "/",            label: "Inicio",       Icon: Home            },
  { href: "/aprende",     label: "Aprende",      Icon: BookOpen        },
  { href: "/menus",       label: "Menús",        Icon: UtensilsCrossed },
  { href: "/suplementos",  label: "Suplementos",  Icon: FlaskConical    },
  { href: "/laboratorio",  label: "Laboratorio",  Icon: Microscope      },
  { href: "/retos",        label: "Retos",        Icon: Trophy          },
  { href: "/tareas",      label: "Tareas",       Icon: ClipboardList   },
  { href: "/clase",       label: "Clase",        Icon: GraduationCap   },
];

const NAV_PROFE_EXTRA = [
  { href: "/clase/panel", label: "Panel de clase", Icon: LayoutDashboard },
];

export function Sidebar({ esProfe = false, nombre = "" }: { esProfe?: boolean; nombre?: string }) {
  const NAV_ITEMS = esProfe ? [...NAV_BASE, ...NAV_PROFE_EXTRA] : NAV_BASE;
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-60 shrink-0 h-full overflow-y-auto"
      style={{
        background: "var(--nt-dark)",
        borderRight: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      {/* Cabecera */}
      <div className="px-5 py-6 select-none">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-60 text-white mb-1">
          TSEAS 26/27
        </p>
        <h1 className="text-lg font-bold text-white leading-tight">
          NutriTSEAS
        </h1>
        <p className="text-xs opacity-50 text-white mt-0.5">Nutrición Deportiva</p>
      </div>

      {/* Separador */}
      <div className="mx-4 h-px opacity-20" style={{ background: "white" }} />

      {/* Navegación */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.7} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Pie: usuario + cerrar sesión */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {nombre && (
          <p className="text-sm font-medium text-white opacity-80 truncate px-1">
            {nombre}
          </p>
        )}
        <SignOutButton />
        <p className="text-[10px] opacity-30 text-white mt-1">
          Orientativo. No sustituye a un dietista-nutricionista.
        </p>
      </div>
    </aside>
  );
}
