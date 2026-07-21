"use client";

import Icono from "../components/Icono";

export type EstadoPregunta = "inactivo" | "escuchando" | "respondiendo";

export default function IndicadorVoz({
  estado,
  onPreguntar,
  deshabilitado,
}: {
  estado: EstadoPregunta;
  onPreguntar: () => void;
  deshabilitado: boolean;
}) {
  const escuchando = estado === "escuchando";
  const respondiendo = estado === "respondiendo";
  const etiqueta = escuchando
    ? "Te escucho. Habla ahora"
    : respondiendo
      ? "Buscando la respuesta"
      : "Preguntar por voz";

  return (
    <button
      type="button"
      onClick={onPreguntar}
      disabled={deshabilitado}
      aria-pressed={escuchando}
      aria-busy={respondiendo}
      className={`boton boton-primario boton-voz ${escuchando ? "esta-escuchando" : ""}`}
    >
      <Icono nombre="microfono" />
      <span>{etiqueta}</span>
    </button>
  );
}
