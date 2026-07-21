"use client";

// Botón principal: ocupa media pantalla, alto contraste, operable con
// teclado y lector de pantalla. La cámara se abre con input capture.

export default function BotonGigante({
  onFoto,
  onTexto,
  deshabilitado,
}: {
  onFoto: (archivo: File) => void;
  onTexto: () => void;
  deshabilitado: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <label
        className={`flex flex-col items-center justify-center gap-4 min-h-[50vh] rounded-3xl border-8 border-yellow-400 bg-yellow-400 text-black text-center cursor-pointer select-none active:scale-[0.98] transition-transform ${
          deshabilitado ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <span aria-hidden="true" className="text-8xl">
          📷
        </span>
        <span className="text-4xl font-extrabold px-6">
          Toca aquí y fotografía tu documento
        </span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          aria-label="Fotografiar documento con la cámara"
          disabled={deshabilitado}
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (archivo) onFoto(archivo);
            e.target.value = "";
          }}
        />
      </label>

      <button
        type="button"
        onClick={onTexto}
        disabled={deshabilitado}
        className="min-h-16 rounded-2xl border-4 border-white/70 text-white text-2xl font-bold px-6 py-4 disabled:opacity-50"
      >
        O pega el texto del documento
      </button>
    </div>
  );
}
