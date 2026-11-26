import { Suspense } from "react"
import { NavShell } from "@/components/nav/NavShell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Sidebar skeleton evita layout shift mientras NavShell resuelve */}
      <Suspense
        fallback={
          <div
            className="hidden lg:block w-60 shrink-0"
            style={{ background: "var(--nt-dark)" }}
          />
        }
      >
        <NavShell />
      </Suspense>
      <main className="flex-1 overflow-y-auto">
        <div className="pb-[60px] lg:pb-0">{children}</div>
      </main>
    </div>
  )
}
