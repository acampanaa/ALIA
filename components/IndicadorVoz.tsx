"use client";

// Botón de micrófono para preguntar por voz + estado visible/audible.

export default function IndicadorVoz({
  escuchando,
  onPreguntar,
  deshabilitado,
}: {
  escuchando: boolean;
  onPreguntar: () => void;
  deshabilitado: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPreguntar}
      disabled={deshabilitado}
      aria-pressed={escuchando}
      className={`w-full min-h-24 rounded-2xl text-2xl font-extrabold px-6 py-5 border-8 transition-colors ${
        escuchando
          ? "bg-red-600 border-red-300 text-white animate-pulse"
          : "bg-blue-600 border-blue-300 text-white"
      } disabled:opacity-50`}
    >
      <span aria-hidden="true" className="text-4xl mr-3">
        🎤
      </span>
      {escuchando ? "Te escucho… habla ahora" : "Toca y hazme una pregunta"}
    </button>
  );
}
