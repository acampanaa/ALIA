"use client";

import { useState } from "react";
import IndicadorVoz from "./IndicadorVoz";

export interface Legibilidad {
  original: { indice: number; etiqueta: string };
  claro: { indice: number; etiqueta: string };
}

export default function ResultadoDocumento({
  tipoDocumento,
  resumenClaro,
  datosClave,
  legibilidad,
  escuchando,
  respuestaVoz,
  onEscuchar,
  onPreguntar,
  onNuevo,
  preguntaDeshabilitada,
}: {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  legibilidad: Legibilidad | null;
  escuchando: boolean;
  respuestaVoz: string | null;
  onEscuchar: () => void;
  onPreguntar: () => void;
  onNuevo: () => void;
  preguntaDeshabilitada: boolean;
}) {
  const [bajaVision, setBajaVision] = useState(false);

  return (
    <section
      aria-label="Resultado del documento"
      className={`flex flex-col gap-6 rounded-3xl p-6 ${
        bajaVision ? "modo-baja-vision" : "bg-white/10"
      }`}
    >
      <h2 className="text-3xl font-extrabold">{tipoDocumento}</h2>

      <p className="text-2xl leading-relaxed">{resumenClaro}</p>

      {datosClave.length > 0 && (
        <dl className="flex flex-col gap-2 text-xl">
          {datosClave.map((d) => (
            <div key={d.etiqueta} className="flex flex-wrap gap-2">
              <dt className="font-bold">{d.etiqueta}:</dt>
              <dd>{d.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {legibilidad && (
        <p className="text-lg" aria-label="Métrica de legibilidad">
          📊 Legibilidad: documento original{" "}
          <strong>
            {legibilidad.original.indice}/100 ({legibilidad.original.etiqueta})
          </strong>{" "}
          → versión ALIA{" "}
          <strong>
            {legibilidad.claro.indice}/100 ({legibilidad.claro.etiqueta})
          </strong>
        </p>
      )}

      {respuestaVoz && (
        <p className="text-2xl font-semibold border-l-8 border-yellow-400 pl-4">
          {respuestaVoz}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onEscuchar}
          className="min-h-20 rounded-2xl bg-green-600 border-8 border-green-300 text-white text-2xl font-extrabold px-6"
        >
          <span aria-hidden="true" className="text-4xl mr-3">
            🔊
          </span>
          Escuchar otra vez
        </button>

        <IndicadorVoz
          escuchando={escuchando}
          onPreguntar={onPreguntar}
          deshabilitado={preguntaDeshabilitada}
        />

        <button
          type="button"
          onClick={() => setBajaVision((v) => !v)}
          aria-pressed={bajaVision}
          className="min-h-16 rounded-2xl border-4 border-white/70 text-2xl font-bold px-6 py-4"
        >
          {bajaVision ? "Salir del modo baja visión" : "Modo baja visión (texto gigante)"}
        </button>

        <button
          type="button"
          onClick={onNuevo}
          className="min-h-16 rounded-2xl border-4 border-white/70 text-2xl font-bold px-6 py-4"
        >
          Leer otro documento
        </button>
      </div>
    </section>
  );
}
