"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Icono from "../components/Icono";
import IndicadorVoz, { type EstadoPregunta } from "../components/IndicadorVoz";
import { hablar, callar } from "@/lib/speech";

export interface Legibilidad {
  original: { indice: number; etiqueta: string };
  claro: { indice: number; etiqueta: string };
}

export default function ResultadoDocumento({
  tipoDocumento,
  resumenClaro,
  datosClave,
  proximosPasos,
  legible,
  legibilidad,
  estadoPregunta,
  respuestaVoz,
  onEscuchar,
  onPreguntar,
  onPreguntaTexto,
  onPreguntaRapida,
  onNuevo,
}: {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  proximosPasos: string[];
  legible: boolean;
  legibilidad: Legibilidad | null;
  estadoPregunta: EstadoPregunta;
  respuestaVoz: string | null;
  onEscuchar: () => void;
  onPreguntar: () => void;
  onPreguntaTexto: (pregunta: string) => void;
  onPreguntaRapida: (pregunta: string) => void;
  onNuevo: () => void;
}) {
  const [mostrarPregunta, setMostrarPregunta] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [modoEnfoque, setModoEnfoque] = useState(false);
  const [indicePaso, setIndicePaso] = useState(0);
  const inputPregunta = useRef<HTMLInputElement>(null);
  const tituloPaso = useRef<HTMLHeadingElement>(null);
  const botonModoEnfoque = useRef<HTMLButtonElement>(null);
  const regresoDesdeEnfoque = useRef(false);
  const ocupado = estadoPregunta !== "inactivo";

  useEffect(() => {
    if (mostrarPregunta) inputPregunta.current?.focus();
  }, [mostrarPregunta]);

  useEffect(() => {
    if (!modoEnfoque) {
      if (regresoDesdeEnfoque.current) {
        regresoDesdeEnfoque.current = false;
        botonModoEnfoque.current?.focus();
      }
      return;
    }

    const paso = proximosPasos[indicePaso];
    if (!paso) return;

    tituloPaso.current?.focus();
    callar();
    const prefijo = indicePaso === 0 ? "Modo enfoque. " : "";
    hablar(prefijo + "Paso " + (indicePaso + 1) + " de " + proximosPasos.length + ". " + paso);
  }, [modoEnfoque, indicePaso, proximosPasos]);

  function escucharPaso() {
    const paso = proximosPasos[indicePaso];
    if (!paso) return;
    callar();
    hablar("Paso " + (indicePaso + 1) + " de " + proximosPasos.length + ". " + paso);
  }

  function salirModoEnfoque() {
    callar();
    regresoDesdeEnfoque.current = true;
    setModoEnfoque(false);
    setIndicePaso(0);
    hablar("Volviste al resumen del documento.");
  }

  function enviarPregunta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const limpia = pregunta.trim();
    if (!limpia || ocupado) return;
    onPreguntaTexto(limpia);
    setPregunta("");
  }

  if (modoEnfoque) {
    const pasoActual = proximosPasos[indicePaso] ?? "";
    const haySiguiente = indicePaso < proximosPasos.length - 1;

    return (
      <article className="resultado resultado-enfoque">
        <header className="enfoque-encabezado">
          <span className="estado-exitoso">Modo enfoque</span>
          <h1 ref={tituloPaso} tabIndex={-1}>Paso {indicePaso + 1} de {proximosPasos.length}</h1>
        </header>

        <section className="paso-enfoque" aria-live="polite" aria-atomic="true" aria-label="Paso actual">
          <p>{pasoActual}</p>
        </section>

        <div className="controles-enfoque">
          <button type="button" className="boton boton-secundario" onClick={escucharPaso}>
            <Icono nombre="volumen" />
            Escuchar este paso otra vez
          </button>

          {haySiguiente && (
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => setIndicePaso((indice) => indice + 1)}
            >
              Siguiente paso
            </button>
          )}

          <button type="button" className="boton boton-discreto" onClick={salirModoEnfoque}>
            <Icono nombre="volver" />
            Volver al resumen
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="resultado">
      <header className="resultado-encabezado">
        <span className="estado-exitoso">
          <Icono nombre="check" /> Documento listo
        </span>
        <h1>{tipoDocumento}</h1>
      </header>

      {!legible && (
        <p className="aviso aviso-advertencia" role="alert">
          La imagen no se pudo leer completamente. Revisa la explicación y toma otra foto si falta información.
        </p>
      )}

      <section className="bloque-resumen" aria-labelledby="titulo-resumen">
        <h2 id="titulo-resumen">En pocas palabras</h2>
        <p>{resumenClaro}</p>
      </section>

      {proximosPasos.length > 0 && (
        <section className="proximos-pasos" aria-labelledby="titulo-proximos-pasos">
          <h2 id="titulo-proximos-pasos">Lo importante: qué debes hacer</h2>
          <ol>
            {proximosPasos.map((paso, indice) => (
              <li key={paso + "-" + indice}>{paso}</li>
            ))}
          </ol>
          <p>Estas acciones fueron extraídas del documento original.</p>
          <button
            ref={botonModoEnfoque}
            type="button"
            className="boton boton-enfoque"
            onClick={() => {
              setIndicePaso(0);
              setModoEnfoque(true);
            }}
            disabled={ocupado}
          >
            Modo enfoque
          </button>
        </section>
      )}

      {datosClave.length > 0 && (
        <section aria-labelledby="titulo-datos">
          <h2 id="titulo-datos">Datos importantes</h2>
          <dl className="datos-clave">
            {datosClave.map((dato, indice) => (
              <div key={`${dato.etiqueta}-${indice}`} className="dato-clave">
                <dt>{dato.etiqueta}</dt>
                <dd>{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {respuestaVoz && (
        <section className="respuesta" aria-labelledby="titulo-respuesta" aria-live="polite">
          <span className="respuesta-icono">
            <Icono nombre="volumen" />
          </span>
          <div>
            <h2 id="titulo-respuesta">Respuesta</h2>
            <p>{respuestaVoz}</p>
          </div>
        </section>
      )}

      <section className="acciones-resultado" aria-labelledby="titulo-acciones">
        <div>
          <h2 id="titulo-acciones">¿Quieres saber algo más?</h2>
          <p>Pregunta por voz o escribe tu pregunta.</p>
        </div>

        <section className="preguntas-rapidas" aria-labelledby="titulo-preguntas-rapidas" aria-busy={ocupado}>
          <h3 id="titulo-preguntas-rapidas">Preguntas rápidas</h3>
          <div className="preguntas-rapidas-lista">
            {["¿Cuánto tengo que pagar?", "¿Hasta cuándo tengo plazo?", "¿Dónde debo pagar o ir?"].map((preguntaRapida) => (
              <button
                key={preguntaRapida}
                type="button"
                className="boton pregunta-rapida"
                onClick={() => onPreguntaRapida(preguntaRapida)}
                disabled={ocupado}
              >
                {preguntaRapida}
              </button>
            ))}
          </div>
        </section>

        <div className="acciones-principales">
          <IndicadorVoz estado={estadoPregunta} onPreguntar={onPreguntar} deshabilitado={ocupado} />
          <button type="button" onClick={onEscuchar} disabled={ocupado} className="boton boton-secundario">
            <Icono nombre="volumen" />
            Escuchar otra vez
          </button>
        </div>

        <button
          type="button"
          className="boton boton-discreto"
          aria-expanded={mostrarPregunta}
          aria-controls="formulario-pregunta"
          onClick={() => setMostrarPregunta((valor) => !valor)}
          disabled={ocupado}
        >
          <Icono nombre="texto" />
          {mostrarPregunta ? "Ocultar pregunta escrita" : "Prefiero escribir mi pregunta"}
        </button>

        {mostrarPregunta && (
          <form id="formulario-pregunta" className="formulario-pregunta" onSubmit={enviarPregunta}>
            <label htmlFor="pregunta-documento">Escribe una pregunta sobre este documento</label>
            <div className="pregunta-en-linea">
              <input
                ref={inputPregunta}
                id="pregunta-documento"
                value={pregunta}
                onChange={(event) => setPregunta(event.target.value)}
                placeholder="Ejemplo: ¿Hasta cuándo puedo pagar?"
                disabled={ocupado}
              />
              <button type="submit" className="boton boton-primario" disabled={!pregunta.trim() || ocupado}>
                Preguntar
              </button>
            </div>
          </form>
        )}
      </section>

      {legibilidad && (
        <section className="legibilidad" aria-labelledby="titulo-legibilidad">
          <div>
            <h2 id="titulo-legibilidad">Claridad del texto</h2>
            <p>Un número más alto indica que el texto es más fácil de entender.</p>
          </div>
          <dl className="comparacion-legibilidad">
            <div>
              <dt>Documento original</dt>
              <dd><strong>{legibilidad.original.indice}/100</strong> {legibilidad.original.etiqueta}</dd>
            </div>
            <div className="legibilidad-alia">
              <dt>Explicación de ALIA</dt>
              <dd><strong>{legibilidad.claro.indice}/100</strong> {legibilidad.claro.etiqueta}</dd>
            </div>
          </dl>
        </section>
      )}

      <button type="button" onClick={onNuevo} className="boton boton-nuevo">
        <Icono nombre="nuevo" />
        Leer otro documento
      </button>
    </article>
  );
}
