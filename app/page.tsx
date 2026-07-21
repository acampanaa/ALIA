"use client";

import { useEffect, useRef, useState } from "react";
import BotonGigante from "@/components/BotonGigante";
import Icono from "@/components/Icono";
import ResultadoDocumento, { type Legibilidad } from "@/components/ResultadoDocumento";
import { hablar, callar, escuchar, soportaEscucha } from "@/lib/speech";

interface Resultado {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  proximosPasos: string[];
  textoCompleto: string;
  legible: boolean;
  legibilidad: Legibilidad | null;
}

type Estado = "inicio" | "procesando" | "listo" | "escuchando" | "respondiendo";

const pasos = ["Documento", "Explicación", "Preguntas"];

export default function Home() {
  const [estado, setEstado] = useState<Estado>("inicio");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [respuestaVoz, setRespuestaVoz] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mostrarTexto, setMostrarTexto] = useState(false);
  const [textoPegado, setTextoPegado] = useState("");
  const [altaVisibilidad, setAltaVisibilidad] = useState(false);
  const campoTexto = useRef<HTMLTextAreaElement>(null);
  const resultadoEnPantalla = useRef<HTMLDivElement>(null);
  const alertaError = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mostrarTexto) campoTexto.current?.focus();
  }, [mostrarTexto]);

  useEffect(() => {
    if (resultado) resultadoEnPantalla.current?.focus();
  }, [resultado]);

  useEffect(() => {
    if (error) alertaError.current?.focus();
  }, [error]);

  function anunciar(mensaje: string, conVoz = true) {
    setAnuncio(mensaje);
    if (conVoz) hablar(mensaje);
  }

  function mostrarError(mensaje: string) {
    setError(mensaje);
    setAnuncio(mensaje);
    hablar(mensaje);
  }

  async function procesar(payload: { imageBase64?: string; mediaType?: string; texto?: string }) {
    setEstado("procesando");
    setError(null);
    setRespuestaVoz(null);
    anunciar("Estoy leyendo tu documento. Dame unos segundos.");

    try {
      const respuesta = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await respuesta.json()) as Resultado & { error?: string };
      if (!respuesta.ok) throw new Error(data.error ?? "No pude procesar el documento.");
      if (!data.tipoDocumento || !data.resumenClaro) {
        throw new Error("La respuesta del documento está incompleta.");
      }

      const proximosPasos = Array.isArray(data.proximosPasos)
        ? data.proximosPasos.filter((paso): paso is string => typeof paso === "string")
        : [];
      const resultadoCompleto = { ...data, proximosPasos };
      const pasosHablados = proximosPasos.length > 0
        ? " Lo importante: " + proximosPasos.join(" ")
        : "";

      setResultado(resultadoCompleto);
      setEstado("listo");
      setAnuncio("Documento listo.");
      hablar(data.tipoDocumento + ". " + data.resumenClaro + pasosHablados);
    } catch (err) {
      setEstado("inicio");
      const mensaje = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      mostrarError(`${mensaje} Intenta nuevamente.`);
    }
  }

  function recibirFoto(archivo: File) {
    if (!archivo.type.startsWith("image/")) {
      mostrarError("El archivo debe ser una imagen.");
      return;
    }

    const lector = new FileReader();
    lector.onerror = () => mostrarError("No pude abrir la imagen. Elige otra e intenta nuevamente.");
    lector.onload = () => {
      const dataUrl = lector.result as string;
      const [cabecera, base64] = dataUrl.split(",");
      if (!base64) {
        mostrarError("La imagen no se pudo preparar. Elige otra e intenta nuevamente.");
        return;
      }
      const mediaType = cabecera.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
      procesar({ imageBase64: base64, mediaType });
    };
    lector.readAsDataURL(archivo);
  }

  async function responderPregunta(pregunta: string, esRapida = false) {
    if (!resultado) return;
    setEstado("respondiendo");
    setError(null);
    setRespuestaVoz(null);
    anunciar(esRapida ? "Pregunta seleccionada. Buscando la respuesta." : "Estoy buscando la respuesta.");

    try {
      const contexto = `${resultado.textoCompleto}\n\nResumen: ${resultado.resumenClaro}`;
      const respuesta = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta, contexto }),
      });
      const data = (await respuesta.json()) as { respuesta?: string; error?: string };
      if (!respuesta.ok || !data.respuesta) {
        throw new Error(data.error ?? "No pude encontrar una respuesta.");
      }
      setRespuestaVoz(data.respuesta);
      setEstado("listo");
      setAnuncio(data.respuesta);
      hablar(data.respuesta);
    } catch (err) {
      setEstado("listo");
      const mensaje = err instanceof Error ? err.message : "No pude responder.";
      mostrarError(`${mensaje} Puedes intentarlo otra vez.`);
    }
  }

  async function preguntarPorVoz() {
    if (!resultado) return;
    if (!soportaEscucha()) {
      mostrarError("Este navegador no permite preguntas por voz. Puedes escribir tu pregunta aquí mismo.");
      return;
    }

    callar();
    setEstado("escuchando");
    setError(null);
    setAnuncio("Te escucho. Habla ahora.");

    try {
      const pregunta = await escuchar();
      if (!pregunta) {
        setEstado("listo");
        mostrarError("No escuché una pregunta. Acércate al micrófono e intenta otra vez.");
        return;
      }
      await responderPregunta(pregunta);
    } catch (err) {
      setEstado("listo");
      const mensaje = err instanceof Error ? err.message : "No pude usar el micrófono.";
      mostrarError(`${mensaje} También puedes escribir tu pregunta.`);
    }
  }

  function reiniciar() {
    callar();
    setResultado(null);
    setRespuestaVoz(null);
    setError(null);
    setMostrarTexto(false);
    setTextoPegado("");
    setEstado("inicio");
    anunciar("Listo. Puedes fotografiar otro documento.");
  }

  const pasoActual = estado === "inicio" ? 1 : estado === "procesando" ? 2 : 3;
  const estadoPregunta =
    estado === "escuchando" ? "escuchando" : estado === "respondiendo" ? "respondiendo" : "inactivo";

  return (
    <div className={`aplicacion ${altaVisibilidad ? "alta-visibilidad" : ""}`}>
      <a href="#contenido-principal" className="saltar-contenido">Ir al contenido principal</a>

      <header className="barra-superior">
        <div className="marca" aria-label="ALIA, Accesibilidad, Lenguaje, Inclusión y Autonomía">
          <span className="marca-icono"><Icono nombre="documento" /></span>
          <span><strong>ALIA</strong><small>Tecnología que se adapta a ti</small></span>
        </div>
        <div className="utilidades" aria-label="Opciones de accesibilidad">
          <button
            type="button"
            className="boton-utilidad"
            onClick={() => hablar("Fotografía un documento o pega su texto. ALIA lo explicará y podrás hacer preguntas.")}
          >
            <Icono nombre="volumen" />
            <span>Escuchar guía</span>
          </button>
          <button
            type="button"
            className="boton-utilidad"
            aria-pressed={altaVisibilidad}
            onClick={() => setAltaVisibilidad((valor) => !valor)}
          >
            <Icono nombre="contraste" />
            <span>{altaVisibilidad ? "Vista normal" : "Alto contraste"}</span>
          </button>
        </div>
      </header>

      <main id="contenido-principal" className="contenido-principal">
        <p className="sr-only" aria-live="polite" role="status">{anuncio}</p>

        <nav className="progreso" aria-label="Progreso del documento">
          <ol>
            {pasos.map((paso, indice) => {
              const numero = indice + 1;
              return (
                <li
                  key={paso}
                  className={numero < pasoActual ? "completo" : numero === pasoActual ? "actual" : ""}
                  aria-current={numero === pasoActual ? "step" : undefined}
                >
                  <span>{numero < pasoActual ? <Icono nombre="check" /> : numero}</span>
                  {paso}
                </li>
              );
            })}
          </ol>
        </nav>

        {error && (
          <div ref={alertaError} tabIndex={-1} className="aviso aviso-error" role="alert">
            <strong>No pudimos continuar</strong>
            <span>{error}</span>
          </div>
        )}

        {estado === "inicio" && (
          <section className="inicio">
            <div className="presentacion">
              <span className="etiqueta">Información clara y privada</span>
              <h1>Entiende tus documentos sin depender de otra persona</h1>
              <p>
                Toma una foto. ALIA te explicará lo importante con palabras sencillas y en voz alta.
              </p>
              <ul className="beneficios" aria-label="Beneficios">
                <li><Icono nombre="check" /> Lenguaje claro</li>
                <li><Icono nombre="check" /> Audio inmediato</li>
                <li><Icono nombre="check" /> Preguntas por voz</li>
              </ul>
            </div>

            <div className="tarjeta-inicio">
              {!mostrarTexto ? (
                <>
                  <div className="tarjeta-titulo">
                    <span>Paso 1</span>
                    <h2>¿Cómo quieres cargar el documento?</h2>
                    <p>Elige una de estas dos opciones.</p>
                  </div>
                  <BotonGigante onFoto={recibirFoto} onTexto={() => setMostrarTexto(true)} deshabilitado={false} />
                </>
              ) : (
                <form
                  className="formulario-texto"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const texto = textoPegado.trim();
                    if (!texto) {
                      mostrarError("Pega el contenido del documento antes de continuar.");
                      return;
                    }
                    procesar({ texto });
                  }}
                >
                  <button type="button" className="boton-volver" onClick={() => setMostrarTexto(false)}>
                    <Icono nombre="volver" /> Volver
                  </button>
                  <div className="tarjeta-titulo">
                    <span>Paso 1</span>
                    <h2>Pega el texto del documento</h2>
                    <p>No necesitas corregirlo ni ordenarlo.</p>
                  </div>
                  <label htmlFor="texto-documento">Contenido del documento</label>
                  <textarea
                    ref={campoTexto}
                    id="texto-documento"
                    value={textoPegado}
                    onChange={(event) => setTextoPegado(event.target.value)}
                    rows={9}
                    placeholder="Pega aquí el texto que quieres entender"
                  />
                  <button type="submit" className="boton boton-primario" disabled={!textoPegado.trim()}>
                    <Icono nombre="documento" /> Explicar este texto
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {estado === "procesando" && (
          <section className="procesando" aria-labelledby="titulo-procesando" aria-busy="true">
            <span className="cargador" aria-hidden="true" />
            <span className="etiqueta">Paso 2 de 3</span>
            <h1 id="titulo-procesando">Estamos preparando una explicación clara</h1>
            <p>Identificamos el documento, sus fechas, montos y acciones importantes.</p>
            <div className="esqueleto" aria-hidden="true"><span /><span /><span /></div>
          </section>
        )}

        {resultado && estado !== "procesando" && (
          <div ref={resultadoEnPantalla} tabIndex={-1} className="foco-programatico">
            <ResultadoDocumento
              tipoDocumento={resultado.tipoDocumento}
              resumenClaro={resultado.resumenClaro}
              datosClave={resultado.datosClave}
              proximosPasos={resultado.proximosPasos}
              legible={resultado.legible}
              legibilidad={resultado.legibilidad}
              estadoPregunta={estadoPregunta}
              respuestaVoz={respuestaVoz}
              onEscuchar={() => {
                const pasosHablados = resultado.proximosPasos.length > 0
                  ? " Lo importante: " + resultado.proximosPasos.join(" ")
                  : "";
                hablar(resultado.tipoDocumento + ". " + resultado.resumenClaro + pasosHablados);
              }}
              onPreguntar={preguntarPorVoz}
              onPreguntaTexto={responderPregunta}
              onPreguntaRapida={(pregunta) => responderPregunta(pregunta, true)}
              onNuevo={reiniciar}
            />
          </div>
        )}
      </main>

      <footer className="pie-pagina">
        <p>ALIA no crea un historial de tus documentos.</p>
      </footer>
    </div>
  );
}
