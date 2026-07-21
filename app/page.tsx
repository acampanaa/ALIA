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
  preguntasSugeridas: string[];
  textoCompleto: string;
  legible: boolean;
  legibilidad: Legibilidad | null;
}

type Estado = "inicio" | "procesando" | "listo" | "escuchando" | "respondiendo";

const pasos = ["Documento", "Explicación", "Preguntas"];
const CLAVE_MODO_ACOMPANAMIENTO = "alia-modo-acompanamiento";
const CLAVE_VELOCIDAD_VOZ = "alia-velocidad-voz";

function normalizarOrden(orden: string) {
  return orden
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function Home() {
  const [estado, setEstado] = useState<Estado>("inicio");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [respuestaVoz, setRespuestaVoz] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mostrarTexto, setMostrarTexto] = useState(false);
  const [textoPegado, setTextoPegado] = useState("");
  const [altaVisibilidad, setAltaVisibilidad] = useState(false);
  const [modoAcompanamiento, setModoAcompanamiento] = useState(true);
  const [velocidadVoz, setVelocidadVoz] = useState(0.95);
  const [escuchandoComando, setEscuchandoComando] = useState(false);
  const [panelAcompanamientoAbierto, setPanelAcompanamientoAbierto] = useState(false);
  const [errorVoz, setErrorVoz] = useState<string | null>(null);
  const campoTexto = useRef<HTMLTextAreaElement>(null);
  const resultadoEnPantalla = useRef<HTMLDivElement>(null);
  const alertaError = useRef<HTMLDivElement>(null);
  const botonAcompanamiento = useRef<HTMLButtonElement>(null);
  const panelAcompanamiento = useRef<HTMLElement>(null);
  const ultimoMensajeVoz = useRef(
    "Puedes fotografiar o subir un documento. También puedes pegar su texto.",
  );
  const indicePasoVoz = useRef(0);

  useEffect(() => {
    const modoGuardado = window.localStorage.getItem(CLAVE_MODO_ACOMPANAMIENTO);
    const velocidadGuardada = Number(window.localStorage.getItem(CLAVE_VELOCIDAD_VOZ));

    if (modoGuardado !== null) setModoAcompanamiento(modoGuardado === "true");
    if ([0.8, 0.95, 1.15].includes(velocidadGuardada)) {
      setVelocidadVoz(velocidadGuardada);
    }
  }, []);

  useEffect(() => {
    function avisarErrorVoz(event: Event) {
      const mensaje = event instanceof CustomEvent && typeof event.detail === "string"
        ? event.detail
        : "No pudimos reproducir la voz en español.";
      setErrorVoz(mensaje);
      setAnuncio(mensaje);
    }

    window.addEventListener("alia:voz-error", avisarErrorVoz);
    return () => window.removeEventListener("alia:voz-error", avisarErrorVoz);
  }, []);

  useEffect(() => {
    if (!panelAcompanamientoAbierto) return;

    function cerrarAlTocarFuera(event: PointerEvent) {
      const objetivo = event.target as Node;
      if (
        !panelAcompanamiento.current?.contains(objetivo)
        && !botonAcompanamiento.current?.contains(objetivo)
      ) {
        setPanelAcompanamientoAbierto(false);
      }
    }

    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setPanelAcompanamientoAbierto(false);
      botonAcompanamiento.current?.focus();
    }

    document.addEventListener("pointerdown", cerrarAlTocarFuera);
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("pointerdown", cerrarAlTocarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [panelAcompanamientoAbierto]);

  useEffect(() => {
    if (mostrarTexto) campoTexto.current?.focus();
  }, [mostrarTexto]);

  useEffect(() => {
    if (resultado) resultadoEnPantalla.current?.focus();
  }, [resultado]);

  useEffect(() => {
    if (error) alertaError.current?.focus();
  }, [error]);

  function decir(mensaje: string, velocidad = velocidadVoz) {
    setErrorVoz(null);
    ultimoMensajeVoz.current = mensaje;
    hablar(mensaje, { velocidad });
  }

  function anunciar(mensaje: string, conVoz = true) {
    setAnuncio(mensaje);
    if (conVoz && modoAcompanamiento) decir(mensaje);
  }

  function mostrarError(mensaje: string) {
    setError(mensaje);
    anunciar(mensaje);
  }

  function narracionDelResultado(resultadoActual: Resultado) {
    const pasosHablados = resultadoActual.proximosPasos.length > 0
      ? " Lo importante: " + resultadoActual.proximosPasos.join(" ")
      : "";
    return resultadoActual.tipoDocumento + ". " + resultadoActual.resumenClaro + pasosHablados;
  }

  async function procesar(payload: { archivo?: File; texto?: string }) {
    setEstado("procesando");
    setError(null);
    setRespuestaVoz(null);
    anunciar("Estoy leyendo tu documento. Dame unos segundos.");

    try {
      let body: BodyInit;
      let headers: HeadersInit | undefined;

      if (payload.archivo) {
        const formulario = new FormData();
        formulario.append("archivo", payload.archivo);
        body = formulario;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ texto: payload.texto });
      }

      const respuesta = await fetch("/api/narrate", {
        method: "POST",
        headers,
        body,
      });
      const data = (await respuesta.json()) as Resultado & { error?: string };
      if (!respuesta.ok) throw new Error(data.error ?? "No pude procesar el documento.");
      if (!data.tipoDocumento || !data.resumenClaro) {
        throw new Error("La respuesta del documento está incompleta.");
      }

      const proximosPasos = Array.isArray(data.proximosPasos)
        ? data.proximosPasos.filter((paso): paso is string => typeof paso === "string")
        : [];
      const preguntasSugeridas = Array.isArray(data.preguntasSugeridas)
        ? data.preguntasSugeridas.filter((pregunta): pregunta is string => typeof pregunta === "string")
        : [];
      const resultadoCompleto = { ...data, proximosPasos, preguntasSugeridas };
      const narracionCompleta = narracionDelResultado(resultadoCompleto);

      setResultado(resultadoCompleto);
      indicePasoVoz.current = 0;
      setEstado("listo");
      setAnuncio("Documento listo. " + narracionCompleta);
      if (modoAcompanamiento) decir(narracionCompleta);
    } catch (err) {
      setEstado("inicio");
      const mensaje = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      mostrarError(`${mensaje} Intenta nuevamente.`);
    }
  }

  function recibirArchivo(archivo: File) {
    if (archivo.size > 10 * 1024 * 1024) {
      mostrarError("El archivo supera el límite de 10 MB.");
      return;
    }
    procesar({ archivo });
  }

  async function responderPregunta(
    pregunta: string,
    esRapida = false,
    respuestaHablada = false,
  ) {
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
      if (modoAcompanamiento || respuestaHablada) decir(data.respuesta);
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
      await responderPregunta(pregunta, false, true);
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

  function guiaActual() {
    if (estado === "procesando") {
      return "Estoy leyendo tu documento. Espera unos segundos.";
    }
    if (resultado) {
      return "El documento está listo. Puedes decir: leer resumen, siguiente paso, repetir o detener.";
    }
    if (mostrarTexto) {
      return "Pega el contenido en el campo de texto y toca explicar este texto.";
    }
    return "Puedes fotografiar o subir un documento. También puedes pegar su texto.";
  }

  function alternarModoAcompanamiento() {
    const siguienteEstado = !modoAcompanamiento;
    setModoAcompanamiento(siguienteEstado);
    window.localStorage.setItem(CLAVE_MODO_ACOMPANAMIENTO, String(siguienteEstado));

    if (!siguienteEstado) {
      callar();
      setAnuncio("Modo acompañamiento desactivado. Los lectores de pantalla seguirán recibiendo los anuncios.");
      return;
    }

    const mensaje = "Modo acompañamiento activado. " + guiaActual();
    setAnuncio(mensaje);
    decir(mensaje);
  }

  function cambiarVelocidad(nuevaVelocidad: number) {
    setVelocidadVoz(nuevaVelocidad);
    window.localStorage.setItem(CLAVE_VELOCIDAD_VOZ, String(nuevaVelocidad));
    const mensaje = nuevaVelocidad < 0.9
      ? "Velocidad lenta."
      : nuevaVelocidad > 1
        ? "Velocidad rápida."
        : "Velocidad normal.";
    setAnuncio(mensaje);
    if (modoAcompanamiento) decir(mensaje, nuevaVelocidad);
  }

  function repetirUltimoMensaje() {
    callar();
    decir(ultimoMensajeVoz.current);
  }

  function ejecutarComando(orden: string) {
    const comando = normalizarOrden(orden);

    if (comando.includes("detener") || comando.includes("parar") || comando.includes("callar")) {
      callar();
      setAnuncio("Narración detenida.");
      return;
    }

    if (comando.includes("repetir") || comando.includes("otra vez")) {
      repetirUltimoMensaje();
      return;
    }

    if (comando.includes("resumen") || comando.includes("explicacion")) {
      if (!resultado) {
        decir("Todavía no hay un documento listo. Primero fotografía, sube o pega un documento.");
        return;
      }
      decir(narracionDelResultado(resultado));
      return;
    }

    if (comando.includes("siguiente") || comando.includes("proximo paso")) {
      if (!resultado?.proximosPasos.length) {
        decir("Este documento no tiene pasos pendientes.");
        return;
      }

      const indice = Math.min(indicePasoVoz.current, resultado.proximosPasos.length - 1);
      const esUltimo = indice === resultado.proximosPasos.length - 1;
      decir(
        "Paso " + (indice + 1) + " de " + resultado.proximosPasos.length + ". "
        + resultado.proximosPasos[indice]
        + (esUltimo ? " Este es el último paso." : ""),
      );
      if (!esUltimo) indicePasoVoz.current = indice + 1;
      return;
    }

    if (comando.includes("nuevo documento") || comando.includes("otro documento")) {
      reiniciar();
      return;
    }

    if (comando.includes("ayuda") || comando.includes("guia")) {
      decir(guiaActual());
      return;
    }

    decir(
      "No reconocí esa orden. Puedes decir: leer resumen, siguiente paso, repetir, detener o nuevo documento.",
    );
  }

  async function escucharComando() {
    if (!soportaEscucha()) {
      mostrarError("Este navegador no permite órdenes por voz. Puedes usar los botones de acompañamiento.");
      return;
    }

    callar();
    setError(null);
    setEscuchandoComando(true);
    setAnuncio("Te escucho. Di una orden.");

    try {
      const orden = await escuchar();
      setEscuchandoComando(false);
      if (!orden) {
        mostrarError("No escuché una orden. Acércate al micrófono e intenta nuevamente.");
        return;
      }
      ejecutarComando(orden);
    } catch (err) {
      setEscuchandoComando(false);
      const mensaje = err instanceof Error ? err.message : "No pude usar el micrófono.";
      mostrarError(mensaje + " También puedes usar los botones.");
    }
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
            ref={botonAcompanamiento}
            type="button"
            className={"boton-utilidad " + (modoAcompanamiento ? "activa" : "")}
            aria-label={"Acompañamiento. Voz de ALIA " + (modoAcompanamiento ? "activada" : "apagada")}
            aria-expanded={panelAcompanamientoAbierto}
            aria-controls="modo-acompanamiento"
            onClick={() => setPanelAcompanamientoAbierto((abierto) => !abierto)}
          >
            <Icono nombre="volumen" />
            <span>Acompañamiento</span>
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

          {panelAcompanamientoAbierto && (
            <section
              ref={panelAcompanamiento}
              id="modo-acompanamiento"
              className={"acompanamiento " + (modoAcompanamiento ? "acompanamiento-activo" : "")}
              aria-labelledby="titulo-acompanamiento"
            >
              <header className="acompanamiento-encabezado">
                <div>
                  <span className="acompanamiento-estado">
                    {modoAcompanamiento ? "Voz activa" : "Voz apagada"}
                  </span>
                  <h2 id="titulo-acompanamiento">Acompañamiento</h2>
                </div>
                <button
                  type="button"
                  className="acompanamiento-cerrar"
                  aria-label="Cerrar opciones de acompañamiento"
                  onClick={() => {
                    setPanelAcompanamientoAbierto(false);
                    botonAcompanamiento.current?.focus();
                  }}
                >
                  <Icono nombre="cerrar" />
                </button>
              </header>

              <p className="acompanamiento-descripcion">
                ALIA puede guiarte y controlar el documento con la voz.
              </p>

              {errorVoz && <p className="acompanamiento-error" role="status">{errorVoz}</p>}

              <div className="controles-acompanamiento">
                <button
                  type="button"
                  className={"boton " + (modoAcompanamiento ? "boton-discreto" : "boton-primario")}
                  aria-pressed={modoAcompanamiento}
                  onClick={alternarModoAcompanamiento}
                >
                  <Icono nombre="volumen" />
                  {modoAcompanamiento ? "Apagar voz" : "Activar voz"}
                </button>

                <label className="control-velocidad" htmlFor="velocidad-voz">
                  <span>Velocidad</span>
                  <select
                    id="velocidad-voz"
                    value={velocidadVoz}
                    disabled={!modoAcompanamiento}
                    onChange={(event) => cambiarVelocidad(Number(event.target.value))}
                  >
                    <option value={0.8}>Lenta</option>
                    <option value={0.95}>Normal</option>
                    <option value={1.15}>Rápida</option>
                  </select>
                </label>

                <button
                  type="button"
                  className={"boton boton-primario boton-voz " + (escuchandoComando ? "esta-escuchando" : "")}
                  disabled={!modoAcompanamiento || escuchandoComando || estado === "escuchando"}
                  aria-pressed={escuchandoComando}
                  onClick={escucharComando}
                >
                  <Icono nombre="microfono" />
                  {escuchandoComando ? "Te escucho. Habla ahora" : "Dar una orden"}
                </button>

                <div className="acciones-narracion">
                  <button
                    type="button"
                    className="boton boton-secundario"
                    disabled={!modoAcompanamiento || escuchandoComando}
                    onClick={repetirUltimoMensaje}
                  >
                    Repetir
                  </button>
                  <button
                    type="button"
                    className="boton boton-discreto"
                    disabled={!modoAcompanamiento}
                    onClick={() => {
                      callar();
                      setAnuncio("Narración detenida.");
                    }}
                  >
                    Detener
                  </button>
                </div>
              </div>

              <p className="comandos-disponibles">
                Di: “leer resumen”, “siguiente paso”, “repetir”, “detener” o “nuevo documento”.
              </p>
            </section>
          )}
        </div>
      </header>

      <main id="contenido-principal" className="contenido-principal">
        <p className="sr-only" aria-live="polite" aria-atomic="true" role="status">{anuncio}</p>

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
                  <BotonGigante onArchivo={recibirArchivo} onTexto={() => setMostrarTexto(true)} deshabilitado={false} />
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
              preguntasSugeridas={resultado.preguntasSugeridas}
              legible={resultado.legible}
              legibilidad={resultado.legibilidad}
              estadoPregunta={estadoPregunta}
              respuestaVoz={respuestaVoz}
              narracionAutomatica={modoAcompanamiento}
              velocidadVoz={velocidadVoz}
              onEscuchar={() => decir(narracionDelResultado(resultado))}
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
