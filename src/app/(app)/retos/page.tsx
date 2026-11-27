"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { PREGUNTAS_QUIZ, XP_POR_RESPUESTA, XP_BONUS_PERFECTO, type Pregunta } from "@/data/quiz"

type Estado = "idle" | "playing" | "answered" | "finished"

type Respuesta = { preguntaId: number; correcta: boolean }

function BarraPregunta({ actual, total }: { actual: number; total: number }) {
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full"
          style={{
            background: i < actual ? "var(--nt-mid)" : "var(--nt-line)",
          }}
        />
      ))}
    </div>
  )
}

function PantallaFinal({
  respuestas,
  xpGanado,
  onReiniciar,
}: {
  respuestas: Respuesta[]
  xpGanado: number
  onReiniciar: () => void
}) {
  const correctas = respuestas.filter((r) => r.correcta).length
  const total = respuestas.length
  const perfecto = correctas === total

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">{perfecto ? "🏆" : correctas >= total * 0.7 ? "🎯" : "📚"}</div>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--nt-dark)" }}>
          {perfecto ? "¡Quiz perfecto!" : correctas >= total * 0.7 ? "¡Muy bien!" : "Sigue practicando"}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
          {correctas} de {total} respuestas correctas
        </p>
      </div>

      <div
        className="rounded-2xl p-6 space-y-2"
        style={{ background: "var(--nt-abg)", border: "1px solid var(--nt-a)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--nt-soft)" }}>
          XP ganado
        </p>
        <p className="text-4xl font-black" style={{ color: "var(--nt-mid)" }}>
          +{xpGanado}
        </p>
        {perfecto && (
          <p className="text-xs" style={{ color: "var(--nt-g)" }}>
            🏅 Incluye bonus de quiz perfecto
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {respuestas.map((r, i) => (
          <div
            key={i}
            className="rounded-xl p-3 text-center text-xs"
            style={{
              background: r.correcta ? "var(--nt-gbg)" : "var(--nt-rbg)",
              color: r.correcta ? "var(--nt-g)" : "var(--nt-r)",
            }}
          >
            <div className="text-lg">{r.correcta ? "✓" : "✗"}</div>
            Preg. {i + 1}
          </div>
        ))}
      </div>

      <button
        onClick={onReiniciar}
        className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ background: "var(--nt-mid)", color: "#fff" }}
      >
        Volver a intentarlo
      </button>
    </div>
  )
}

function TarjetaPregunta({
  pregunta,
  estado,
  seleccion,
  onSeleccionar,
  onSiguiente,
  numeroPregunta,
  totalPreguntas,
}: {
  pregunta: Pregunta
  estado: "playing" | "answered"
  seleccion: number | null
  onSeleccionar: (idx: number) => void
  onSiguiente: () => void
  numeroPregunta: number
  totalPreguntas: number
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--nt-soft)" }}>
          Pregunta {numeroPregunta} de {totalPreguntas}
        </p>
        <h2 className="text-lg font-bold leading-snug" style={{ color: "var(--nt-dark)" }}>
          {pregunta.enunciado}
        </h2>
      </div>

      <div className="space-y-2">
        {pregunta.opciones.map((opcion, idx) => {
          let bg = "var(--nt-card)"
          let border = "var(--nt-line)"
          let color = "var(--nt-dark)"

          if (estado === "answered") {
            if (idx === pregunta.correcta) {
              bg = "var(--nt-gbg)"
              border = "var(--nt-g)"
              color = "var(--nt-g)"
            } else if (idx === seleccion && idx !== pregunta.correcta) {
              bg = "var(--nt-rbg)"
              border = "var(--nt-r)"
              color = "var(--nt-r)"
            }
          } else if (seleccion === idx) {
            border = "var(--nt-mid)"
          }

          return (
            <button
              key={idx}
              onClick={() => estado === "playing" && onSeleccionar(idx)}
              disabled={estado === "answered"}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                color,
              }}
            >
              <span className="font-bold mr-2" style={{ color: "var(--nt-soft)" }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opcion}
            </button>
          )
        })}
      </div>

      {estado === "answered" && (
        <>
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: "var(--nt-bg)", border: "1px solid var(--nt-line)" }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--nt-dark)" }}>
              {seleccion === pregunta.correcta ? "✅ ¡Correcto!" : "❌ Incorrecto"}
            </p>
            <p style={{ color: "var(--nt-soft)" }}>{pregunta.explicacion}</p>
          </div>

          <button
            onClick={onSiguiente}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: "var(--nt-mid)", color: "#fff" }}
          >
            {numeroPregunta < totalPreguntas ? "Siguiente →" : "Ver resultado"}
          </button>
        </>
      )}
    </div>
  )
}

export default function RetosPage() {
  const [estado, setEstado] = useState<Estado>("idle")
  const [preguntaIdx, setPreguntaIdx] = useState(0)
  const [seleccion, setSeleccion] = useState<number | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [xpGanado, setXpGanado] = useState(0)
  const [yaJugado, setYaJugado] = useState<number | null>(null) // mejor puntuación previa

  const supabase = createClient()

  useEffect(() => {
    async function cargarHistorial() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("intentos_juego")
        .select("puntuacion")
        .eq("alumno_id", user.id)
        .order("puntuacion", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data) setYaJugado(data.puntuacion)
    }
    cargarHistorial()
  }, [])

  const iniciar = () => {
    setPreguntaIdx(0)
    setSeleccion(null)
    setRespuestas([])
    setXpGanado(0)
    setEstado("playing")
  }

  const seleccionar = (idx: number) => {
    setSeleccion(idx)
    setEstado("answered")
  }

  const siguiente = useCallback(async () => {
    const pregunta = PREGUNTAS_QUIZ[preguntaIdx]
    const correcta = seleccion === pregunta.correcta
    const nuevasRespuestas = [...respuestas, { preguntaId: pregunta.id, correcta }]

    if (preguntaIdx < PREGUNTAS_QUIZ.length - 1) {
      setRespuestas(nuevasRespuestas)
      setPreguntaIdx((p) => p + 1)
      setSeleccion(null)
      setEstado("playing")
    } else {
      // Fin del quiz
      const correctas = nuevasRespuestas.filter((r) => r.correcta).length
      const perfecto = correctas === PREGUNTAS_QUIZ.length
      const xp = correctas * XP_POR_RESPUESTA + (perfecto ? XP_BONUS_PERFECTO : 0)
      setXpGanado(xp)
      setRespuestas(nuevasRespuestas)
      setEstado("finished")

      // Guardar en BD
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Sumar XP
      if (xp > 0) {
        await supabase.rpc("fn_sumar_xp", { p_xp: xp })
      }

      // Buscar juego quiz
      const { data: juego } = await supabase
        .from("juegos")
        .select("id")
        .ilike("nombre", "%quiz%")
        .maybeSingle()

      // Guardar intento
      if (juego) {
        await supabase.from("intentos_juego").insert({
          alumno_id: user.id,
          juego_id: juego.id,
          puntuacion: Math.round((correctas / PREGUNTAS_QUIZ.length) * 100),
          respuestas_ok: correctas,
          total_preguntas: PREGUNTAS_QUIZ.length,
          xp_ganado: xp,
        })
      }

      // Logros automáticos
      const slugsBuscar = perfecto ? ["primer_quiz", "quiz_perfecto"] : ["primer_quiz"]
      const { data: logros } = await supabase
        .from("logros")
        .select("id, slug")
        .in("slug", slugsBuscar)
        .eq("manual", false)

      if (logros) {
        for (const logro of logros) {
          await supabase
            .from("logros_alumno")
            .upsert(
              { alumno_id: user.id, logro_id: logro.id },
              { onConflict: "alumno_id,logro_id", ignoreDuplicates: true }
            )
        }
      }

      setYaJugado(correctas)
    }
  }, [preguntaIdx, seleccion, respuestas, supabase])

  return (
    <div className="p-4 max-w-xl mx-auto pb-safe">
      {estado === "idle" && (
        <div className="space-y-6">
          {/* Tarjeta del juego de estaciones */}
          <div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--nt-dark)" }}>
              Retos
            </h1>
            <Link
              href="/retos/estaciones"
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
            >
              <span className="text-3xl">🏃</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold" style={{ color: "var(--nt-dark)" }}>
                  Reto de las 8 estaciones
                </p>
                <p className="text-sm" style={{ color: "var(--nt-soft)" }}>
                  Dale de comer al deportista · Hasta 60 XP
                </p>
              </div>
              <span style={{ color: "var(--nt-soft)" }}>→</span>
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--nt-dark)" }}>
              Quiz de nutrición
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--nt-soft)" }}>
              {PREGUNTAS_QUIZ.length} preguntas · Gana XP por cada respuesta correcta
            </p>
          </div>

          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "var(--nt-card)", border: "1px solid var(--nt-line)" }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--nt-soft)" }}>Por respuesta correcta</span>
              <span className="font-bold" style={{ color: "var(--nt-mid)" }}>+{XP_POR_RESPUESTA} XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--nt-soft)" }}>Bonus quiz perfecto</span>
              <span className="font-bold" style={{ color: "var(--nt-mid)" }}>+{XP_BONUS_PERFECTO} XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--nt-soft)" }}>Máximo posible</span>
              <span className="font-bold" style={{ color: "var(--nt-mid)" }}>
                +{PREGUNTAS_QUIZ.length * XP_POR_RESPUESTA + XP_BONUS_PERFECTO} XP
              </span>
            </div>
            {yaJugado !== null && (
              <div
                className="pt-3 border-t text-sm flex justify-between"
                style={{ borderColor: "var(--nt-line)" }}
              >
                <span style={{ color: "var(--nt-soft)" }}>Tu mejor resultado</span>
                <span className="font-bold" style={{ color: "var(--nt-g)" }}>
                  {yaJugado}/{PREGUNTAS_QUIZ.length} correctas
                </span>
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-4 text-xs"
            style={{ background: "var(--nt-bg)", color: "var(--nt-soft)" }}
          >
            Orientativo, para adultos sanos. No sustituye a un médico o dietista-nutricionista.
          </div>

          <button
            onClick={iniciar}
            className="w-full py-4 rounded-2xl font-bold text-base"
            style={{ background: "var(--nt-mid)", color: "#fff" }}
          >
            Iniciar quiz 🎯
          </button>
        </div>
      )}

      {(estado === "playing" || estado === "answered") && (
        <div>
          <BarraPregunta actual={preguntaIdx} total={PREGUNTAS_QUIZ.length} />
          <TarjetaPregunta
            pregunta={PREGUNTAS_QUIZ[preguntaIdx]}
            estado={estado}
            seleccion={seleccion}
            onSeleccionar={seleccionar}
            onSiguiente={siguiente}
            numeroPregunta={preguntaIdx + 1}
            totalPreguntas={PREGUNTAS_QUIZ.length}
          />
        </div>
      )}

      {estado === "finished" && (
        <PantallaFinal
          respuestas={respuestas}
          xpGanado={xpGanado}
          onReiniciar={iniciar}
        />
      )}
    </div>
  )
}
