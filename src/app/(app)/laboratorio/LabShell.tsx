"use client"
import { useState } from "react"
import { TabAlimentos }  from "./TabAlimentos"
import { TabCrearPlato } from "./TabCrearPlato"
import { TabMisPlatos }  from "./TabMisPlatos"
import { TabClase }      from "./TabClase"

type TabId = "alimentos" | "crear" | "mis-platos" | "clase"

const TABS: { id: TabId; label: string }[] = [
  { id: "alimentos",  label: "Mis alimentos" },
  { id: "crear",      label: "Crear plato"   },
  { id: "mis-platos", label: "Mis platos"    },
  { id: "clase",      label: "De la clase"   },
]

export function LabShell() {
  const [tab, setTab] = useState<TabId>("alimentos")

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Laboratorio</h1>
      <p className="text-sm mb-5" style={{ color: "var(--nt-soft)" }}>
        Crea tu base de alimentos y compón platos
      </p>

      {/* Tabs */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-5"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={tab === t.id
              ? { background: "var(--nt-dark)", color: "#fff" }
              : { background: "var(--nt-bg)", color: "var(--nt-soft)", border: "1px solid var(--nt-line)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "alimentos"  && <TabAlimentos />}
      {tab === "crear"      && <TabCrearPlato />}
      {tab === "mis-platos" && <TabMisPlatos />}
      {tab === "clase"      && <TabClase />}
    </div>
  )
}
