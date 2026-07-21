"use client";

import { useRef } from "react";
import Icono from "../components/Icono";

export default function BotonGigante({
  onFoto,
  onTexto,
  deshabilitado,
}: {
  onFoto: (archivo: File) => void;
  onTexto: () => void;
  deshabilitado: boolean;
}) {
  const inputFoto = useRef<HTMLInputElement>(null);

  return (
    <div className="opciones-entrada">
      <button
        type="button"
        className="opcion-entrada opcion-entrada-principal"
        onClick={() => inputFoto.current?.click()}
        disabled={deshabilitado}
      >
        <span className="opcion-icono">
          <Icono nombre="camara" />
        </span>
        <span className="opcion-contenido">
          <strong>Fotografiar documento</strong>
          <small>Abre la cámara o elige una imagen</small>
        </span>
      </button>

      <input
        ref={inputFoto}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        disabled={deshabilitado}
        onChange={(event) => {
          const archivo = event.target.files?.[0];
          if (archivo) onFoto(archivo);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={onTexto}
        disabled={deshabilitado}
        className="opcion-entrada opcion-entrada-secundaria"
      >
        <span className="opcion-icono">
          <Icono nombre="texto" />
        </span>
        <span className="opcion-contenido">
          <strong>Pegar el texto</strong>
          <small>Si ya tienes el contenido copiado</small>
        </span>
      </button>
    </div>
  );
}
