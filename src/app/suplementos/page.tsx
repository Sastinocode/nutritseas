export default function SuplementosPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>Suplementos</h1>
      <p className="text-sm mb-4" style={{ color: "var(--nt-soft)" }}>
        Semáforo de evidencia, checklist y detector de bulos — Fase 2 (próximamente)
      </p>
      <div
        className="rounded-xl border p-6 text-center"
        style={{ background: "var(--nt-card)", borderColor: "var(--nt-line)" }}
      >
        <span className="text-4xl mb-3 block">💊</span>
        <p style={{ color: "var(--nt-soft)" }}>
          Esta sección se desarrolla en la Fase 2. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
