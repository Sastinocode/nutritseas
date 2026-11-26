"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, UtensilsCrossed, FlaskConical, Trophy, GraduationCap, ClipboardList, LayoutDashboard } from "lucide-react";

const NAV_ALUMNOS = [
  { href: "/",             label: "Inicio",       Icon: Home           },
  { href: "/aprende",      label: "Aprende",      Icon: BookOpen       },
  { href: "/menus",        label: "Menús",        Icon: UtensilsCrossed},
  { href: "/suplementos",  label: "Supl.",        Icon: FlaskConical   },
  { href: "/retos",        label: "Retos",        Icon: Trophy         },
  { href: "/tareas",       label: "Tareas",       Icon: ClipboardList  },
  { href: "/clase",        label: "Clase",        Icon: GraduationCap  },
];

const NAV_PROFE = [
  { href: "/",             label: "Inicio",       Icon: Home           },
  { href: "/aprende",      label: "Aprende",      Icon: BookOpen       },
  { href: "/menus",        label: "Menús",        Icon: UtensilsCrossed},
  { href: "/suplementos",  label: "Supl.",        Icon: FlaskConical   },
  { href: "/retos",        label: "Retos",        Icon: Trophy         },
  { href: "/tareas",       label: "Tareas",       Icon: ClipboardList  },
  { href: "/clase/panel",  label: "Panel",        Icon: LayoutDashboard},
];

export function BottomNav({ esProfe = false }: { esProfe?: boolean }) {
  const pathname = usePathname();
  const NAV_ITEMS = esProfe ? NAV_PROFE : NAV_ALUMNOS;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: "var(--nt-card)",
        borderTop: "1px solid var(--nt-line)",
        height: "calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors"
            style={{
              color: active ? "var(--nt-mid)" : "var(--nt-soft)",
            }}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.2 : 1.6}
              style={{ color: active ? "var(--nt-mid)" : "var(--nt-soft)" }}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
