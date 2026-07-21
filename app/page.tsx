"use client";

import { useEffect, useRef, useState } from "react";
import BotonGigante from "@/components/BotonGigante";
import ResultadoDocumento, { type Legibilidad } from "@/components/ResultadoDocumento";
import { hablar, callar, escuchar, soportaEscucha } from "@/lib/speech";

interface Resultado {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  textoCompleto: string;
  legible: boolean;
  legibilidad: Legibilidad | null;
}

type Estado = "inicio" | "procesando" | "listo" | "escuchando" | "respondiendo";

export default function Home() {
  const [estado, setEstado] = useState<Estado>("inicio");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [respuestaVoz, setRespuestaVoz] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [mostrarTexto, setMostrarTexto] = useState(false);
  const [textoPegado, setTextoPegado] = useState("");
  const saludado = useRef(false);

  // Audio-first: al abrir la app, la voz explica qué hacer
  useEffect(() => {
    if (saludado.current) return;
    saludado.current = true;
    const saludar = () =>
      hablar("Hola, soy Clarito. Toca el botón grande y fotografía tu documento. Yo te lo explico.");
    // las voces cargan asíncrono en algunos navegadores
    if (window.speechSynthesis.getVoices().length > 0) saludar();
    else window.speechSynthesis.onvoiceschanged = saludar;
  }, []);

  function anunciar(mensaje: string) {
    setAnuncio(mensaje);
    hablar(mensaje);
  }

  async function procesar(payload: { imageBase64?: string; mediaType?: string; texto?: string }) {
    setEstado("procesando");
    setRespuestaVoz(null);
    anunciar("Leyendo tu documento. Dame unos segundos.");
    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al procesar");
      setResultado(data);
      setEstado("listo");
      setAnuncio("Documento listo.");
      hablar(`${data.tipoDocumento}. ${data.resumenClaro}`);
    } catch (err) {
      setEstado("inicio");
      const msg = err instanceof Error ? err.message : "Error desconocido";
      anunciar(`Hubo un problema: ${msg}. Intenta otra vez.`);
    }
  }

  function onFoto(archivo: File) {
    const lector = new FileReader();
    lector.onload = () => {
      const dataUrl = lector.result as string;
      const [cabecera, base64] = dataUrl.split(",");
      const mediaType = cabecera.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
      procesar({ imageBase64: base64, mediaType });
    };
    lector.readAsDataURL(archivo);
  }

  async function preguntar() {
    if (!resultado) return;
    if (!soportaEscucha()) {
      anunciar("Tu navegador no soporta preguntas por voz. Usa Chrome.");
      return;
    }
    callar();
    setEstado("escuchando");
    setAnuncio("Te escucho. Haz tu pregunta.");
    try {
      const pregunta = await escuchar();
      if (!pregunta) {
        setEstado("listo");
        anunciar("No escuché nada. Toca el micrófono e intenta otra vez.");
        return;
      }
      setEstado("respondiendo");
      anunciar("Buscando la respuesta.");
      const contexto = `${resultado.textoCompleto}\n\nResumen: ${resultado.resumenClaro}`;
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta, contexto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al responder");
      setRespuestaVoz(data.respuesta);
      setEstado("listo");
      setAnuncio(data.respuesta);
      hablar(data.respuesta);
    } catch (err) {
      setEstado("listo");
      const msg = err instanceof Error ? err.message : "Error desconocido";
      anunciar(msg);
    }
  }

  function reiniciar() {
    callar();
    setResultado(null);
    setRespuestaVoz(null);
    setMostrarTexto(false);
    setTextoPegado("");
    setEstado("inicio");
    anunciar("Listo. Fotografía otro documento cuando quieras.");
  }

  return (
    <main className="max-w-2xl mx-auto flex flex-col gap-8 p-6">
      <header className="text-center">
        <h1 className="text-5xl font-black text-yellow-400">Clarito</h1>
        <p className="text-2xl mt-2">Cualquier papel, en tus oídos</p>
      </header>

      {/* Anuncios para lector de pantalla, además de la voz sintetizada */}
      <p aria-live="polite" role="status" className="sr-only">
        {anuncio}
      </p>

      {estado === "inicio" && !mostrarTexto && (
        <BotonGigante
          onFoto={onFoto}
          onTexto={() => setMostrarTexto(true)}
          deshabilitado={false}
        />
      )}

      {estado === "inicio" && mostrarTexto && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (textoPegado.trim()) procesar({ texto: textoPegado });
          }}
        >
          <label htmlFor="texto-doc" className="text-2xl font-bold">
            Pega aquí el texto del documento
          </label>
          <textarea
            id="texto-doc"
            value={textoPegado}
            onChange={(e) => setTextoPegado(e.target.value)}
            rows={8}
            className="rounded-2xl bg-white text-black text-xl p-4"
          />
          <button
            type="submit"
            className="min-h-16 rounded-2xl bg-yellow-400 text-black text-2xl font-extrabold"
          >
            Explicar este texto
          </button>
          <button
            type="button"
            onClick={() => setMostrarTexto(false)}
            className="min-h-16 rounded-2xl border-4 border-white/70 text-2xl font-bold"
          >
            Volver
          </button>
        </form>
      )}

      {estado === "procesando" && (
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <span aria-hidden="true" className="text-8xl animate-bounce">
            👀
          </span>
          <p className="text-3xl font-bold">Leyendo tu documento…</p>
        </div>
      )}

      {(estado === "listo" || estado === "escuchando" || estado === "respondiendo") &&
        resultado && (
          <ResultadoDocumento
            tipoDocumento={resultado.tipoDocumento}
            resumenClaro={resultado.resumenClaro}
            datosClave={resultado.datosClave}
            legibilidad={resultado.legibilidad}
            escuchando={estado === "escuchando"}
            respuestaVoz={respuestaVoz}
            onEscuchar={() => hablar(`${resultado.tipoDocumento}. ${resultado.resumenClaro}`)}
            onPreguntar={preguntar}
            onNuevo={reiniciar}
            preguntaDeshabilitada={estado !== "listo"}
          />
        )}
    </main>
  );
}
