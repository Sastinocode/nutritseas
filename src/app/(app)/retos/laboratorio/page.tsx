import { ModoReto } from "../../menus/ModoReto"

export default function RetosLaboratorioPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--nt-dark)" }}>
        Reto del laboratorio
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--nt-soft)" }}>
        Arma un menú del día con los platos aprobados por la clase y gana XP.
      </p>
      <ModoReto />
    </div>
  )
}
