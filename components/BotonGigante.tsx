"use client";

import { useEffect, useRef, useState } from "react";
import Icono from "../components/Icono";

const FORMATOS_ACEPTADOS = ".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif";
const TIPOS_ACEPTADOS = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
type VistaModal = "opciones" | "camara";
type EstadoCamara = "inactiva" | "iniciando" | "lista" | "error";

export default function BotonGigante({
  onFoto,
  onTexto,
  deshabilitado,
}: {
  onFoto: (archivo: File) => void;
  onTexto: () => void;
  deshabilitado: boolean;
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState<VistaModal>("opciones");
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [estadoCamara, setEstadoCamara] = useState<EstadoCamara>("inactiva");
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [flujoCamara, setFlujoCamara] = useState<MediaStream | null>(null);
  const [camaraPreferida, setCamaraPreferida] = useState<"environment" | "user">("environment");
  const [cantidadCamaras, setCantidadCamaras] = useState(0);
  const flujoActivo = useRef<MediaStream | null>(null);
  const modalAbiertoRef = useRef(false);
  const botonAbrir = useRef<HTMLButtonElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const tituloModal = useRef<HTMLHeadingElement>(null);
  const botonCamara = useRef<HTMLButtonElement>(null);
  const inputArchivo = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  function detenerCamara() {
    flujoActivo.current?.getTracks().forEach((track) => track.stop());
    flujoActivo.current = null;
    if (video.current) video.current.srcObject = null;
    setFlujoCamara(null);
    setEstadoCamara("inactiva");
  }

  function cerrarModal() {
    modalAbiertoRef.current = false;
    detenerCamara();
    setModalAbierto(false);
    setVista("opciones");
    setErrorCamara(null);
  }

  useEffect(() => {
    if (!flujoCamara || !video.current) return;
    video.current.srcObject = flujoCamara;
    video.current.play().catch(() => {
      setEstadoCamara("error");
      setErrorCamara("No pudimos mostrar la cámara. Revisa los permisos del navegador.");
    });
  }, [flujoCamara, vista]);

  useEffect(() => {
    return () => {
      modalAbiertoRef.current = false;
      flujoActivo.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!modalAbierto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function controlarTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        cerrarModal();
        return;
      }

      if (event.key !== "Tab" || !modal.current) return;
      const elementos = Array.from(
        modal.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (!primero || !ultimo) return;

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", controlarTeclado);
    return () => {
      document.removeEventListener("keydown", controlarTeclado);
      document.body.style.overflow = overflowAnterior;
      botonAbrir.current?.focus();
    };
  }, [modalAbierto]);

  useEffect(() => {
    if (!modalAbierto) return;

    const temporizador = window.setTimeout(() => {
      if (vista === "opciones") {
        botonCamara.current?.focus();
      } else {
        tituloModal.current?.focus();
      }
    }, 0);

    return () => window.clearTimeout(temporizador);
  }, [modalAbierto, vista]);

  function abrirModal() {
    modalAbiertoRef.current = true;
    setErrorArchivo(null);
    setErrorCamara(null);
    setVista("opciones");
    setModalAbierto(true);
  }

  function mensajeErrorCamara(error: unknown): string {
    if (!(error instanceof DOMException)) {
      return "No pudimos iniciar la cámara. Puedes subir una imagen guardada.";
    }
    if (error.name === "NotAllowedError") {
      return "El permiso de cámara está bloqueado. Habilítalo en el navegador e intenta otra vez.";
    }
    if (error.name === "NotFoundError") {
      return "No encontramos una cámara conectada a este dispositivo.";
    }
    if (error.name === "NotReadableError") {
      return "La cámara está siendo usada por otra aplicación. Ciérrala e intenta otra vez.";
    }
    if (error.name === "SecurityError") {
      return "El navegador bloqueó la cámara. Abre ALIA mediante HTTPS o desde localhost.";
    }
    return "No pudimos iniciar la cámara. Revisa sus permisos o sube una imagen guardada.";
  }

  async function iniciarCamara(preferencia: "environment" | "user" = camaraPreferida) {
    setVista("camara");
    setEstadoCamara("iniciando");
    setErrorCamara(null);
    flujoActivo.current?.getTracks().forEach((track) => track.stop());
    flujoActivo.current = null;
    setFlujoCamara(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setEstadoCamara("error");
      setErrorCamara("La cámara necesita una conexión segura. Abre ALIA mediante HTTPS o desde localhost.");
      return;
    }

    try {
      const nuevoFlujo = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: preferencia },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (!modalAbiertoRef.current) {
        nuevoFlujo.getTracks().forEach((track) => track.stop());
        return;
      }

      setCamaraPreferida(preferencia);
      flujoActivo.current = nuevoFlujo;
      setFlujoCamara(nuevoFlujo);
      setEstadoCamara("lista");
      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      setCantidadCamaras(dispositivos.filter((dispositivo) => dispositivo.kind === "videoinput").length);
    } catch (error) {
      if (!modalAbiertoRef.current) return;
      setEstadoCamara("error");
      setErrorCamara(mensajeErrorCamara(error));
    }
  }

  async function cambiarCamara() {
    const siguiente = camaraPreferida === "environment" ? "user" : "environment";
    await iniciarCamara(siguiente);
  }

  function capturarFoto() {
    const elementoVideo = video.current;
    if (!elementoVideo || elementoVideo.videoWidth === 0 || elementoVideo.videoHeight === 0) {
      setErrorCamara("La cámara todavía se está preparando. Espera un momento e intenta otra vez.");
      return;
    }

    const lienzo = document.createElement("canvas");
    lienzo.width = elementoVideo.videoWidth;
    lienzo.height = elementoVideo.videoHeight;
    const contexto = lienzo.getContext("2d");
    if (!contexto) {
      setErrorCamara("No pudimos capturar la imagen. Intenta otra vez.");
      return;
    }

    contexto.drawImage(elementoVideo, 0, 0, lienzo.width, lienzo.height);
    lienzo.toBlob(
      (blob) => {
        if (!blob) {
          setErrorCamara("No pudimos guardar la foto. Intenta otra vez.");
          return;
        }
        const archivo = new File([blob], `documento-${Date.now()}.jpg`, { type: "image/jpeg" });
        cerrarModal();
        onFoto(archivo);
      },
      "image/jpeg",
      0.9,
    );
  }

  function seleccionarArchivo(archivo: File | undefined, input: HTMLInputElement) {
    input.value = "";
    if (!archivo) return;
    if (!TIPOS_ACEPTADOS.has(archivo.type)) {
      setErrorArchivo("Este formato no es compatible. Usa una imagen JPG, PNG, WEBP o GIF.");
      return;
    }
    setErrorArchivo(null);
    cerrarModal();
    onFoto(archivo);
  }

  return (
    <>
      <div className="opciones-entrada">
        <button
          ref={botonAbrir}
          type="button"
          className="opcion-entrada opcion-entrada-principal"
          onClick={abrirModal}
          disabled={deshabilitado}
          aria-haspopup="dialog"
        >
          <span className="opcion-icono"><Icono nombre="camara" /></span>
          <span className="opcion-contenido">
            <strong>Fotografiar o subir documento</strong>
            <small>Usa una cámara o elige una imagen</small>
          </span>
        </button>

        <button type="button" onClick={onTexto} disabled={deshabilitado} className="opcion-entrada opcion-entrada-secundaria">
          <span className="opcion-icono"><Icono nombre="texto" /></span>
          <span className="opcion-contenido">
            <strong>Pegar el texto</strong>
            <small>Si ya tienes el contenido copiado</small>
          </span>
        </button>
      </div>

      {modalAbierto && (
        <div className="modal-fondo" onClick={cerrarModal}>
          <div
            ref={modal}
            className="modal-documento"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-documento"
            aria-describedby="descripcion-modal-documento"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-encabezado">
              <div>
                <span className="modal-paso">Agregar documento</span>
                <h2 ref={tituloModal} id="titulo-modal-documento" tabIndex={-1}>
                  {vista === "camara" ? "Toma una foto del documento" : "¿Qué quieres hacer?"}
                </h2>
              </div>
              <button type="button" className="modal-cerrar" onClick={cerrarModal} aria-label="Cerrar opciones de documento">
                <Icono nombre="cerrar" />
              </button>
            </header>

            {vista === "opciones" ? (
              <>
                <p id="descripcion-modal-documento" className="modal-descripcion">
                  Usa una cámara disponible en tu dispositivo o elige una imagen guardada.
                </p>

                <div className="modal-opciones">
                  <button ref={botonCamara} type="button" className="modal-opcion modal-opcion-principal" onClick={() => iniciarCamara()}>
                    <span><Icono nombre="camara" /></span>
                    <strong>Abrir cámara</strong>
                    <small>Funciona con cámaras integradas o conectadas</small>
                  </button>

                  <button type="button" className="modal-opcion modal-opcion-secundaria" onClick={() => inputArchivo.current?.click()}>
                    <span><Icono nombre="subir" /></span>
                    <strong>Subir una imagen</strong>
                    <small>Elige un archivo guardado</small>
                  </button>
                </div>

                <input
                  ref={inputArchivo}
                  type="file"
                  accept={FORMATOS_ACEPTADOS}
                  hidden
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={(event) => seleccionarArchivo(event.target.files?.[0], event.target)}
                />

                {errorArchivo && <p className="modal-error" role="alert">{errorArchivo}</p>}

                <section className="modal-formatos" aria-labelledby="titulo-formatos">
                  <h3 id="titulo-formatos">¿Qué puedes cargar?</h3>
                  <p><strong>Imágenes:</strong> JPG, JPEG, PNG, WEBP y GIF.</p>
                  <p><strong>Documentos fotografiados:</strong> planillas, recetas, trámites, contratos, avisos y notificaciones.</p>
                  <p><strong>Todavía no disponible:</strong> PDF, Word o Excel. Puedes pegar su texto desde la pantalla anterior.</p>
                  <p><strong>Para usar una cámara:</strong> permite su acceso cuando el navegador lo solicite. Fuera de localhost se necesita HTTPS.</p>
                </section>
              </>
            ) : (
              <section className="vista-camara" aria-live="polite">
                <p id="descripcion-modal-documento" className="modal-descripcion">
                  Coloca el documento completo dentro del recuadro y evita reflejos.
                </p>

                <div className="marco-camara">
                  <video ref={video} muted playsInline aria-label="Vista previa de la cámara" />
                  {estadoCamara === "iniciando" && <p className="camara-estado">Iniciando cámara…</p>}
                  {estadoCamara === "error" && <p className="camara-estado camara-error" role="alert">{errorCamara}</p>}
                </div>

                {estadoCamara === "lista" && (
                  <div className="controles-camara">
                    <button type="button" className="capturar-foto" onClick={capturarFoto}>
                      <Icono nombre="camara" /> Capturar documento
                    </button>
                    {cantidadCamaras > 1 && (
                      <button type="button" className="cambiar-camara" onClick={cambiarCamara}>
                        <Icono nombre="nuevo" /> Cambiar cámara
                      </button>
                    )}
                  </div>
                )}

                {estadoCamara === "error" && (
                  <button type="button" className="reintentar-camara" onClick={() => iniciarCamara(camaraPreferida)}>
                    Intentar nuevamente
                  </button>
                )}

                <button
                  type="button"
                  className="volver-opciones"
                  onClick={() => {
                    detenerCamara();
                    setErrorCamara(null);
                    setVista("opciones");
                  }}
                >
                  <Icono nombre="volver" /> Volver a las opciones
                </button>
              </section>
            )}

            {vista === "opciones" && (
              <button type="button" className="modal-cancelar" onClick={cerrarModal}>Cancelar</button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-fondo {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 16px;
          overflow-y: auto;
          background: rgba(5, 20, 29, 0.76);
        }
        .modal-documento {
          width: min(100%, 680px);
          max-height: calc(100dvh - 32px);
          overflow-y: auto;
          padding: clamp(20px, 5vw, 32px);
          border: 3px solid var(--borde);
          border-radius: 24px;
          background: var(--superficie);
          color: var(--texto);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
        }
        .modal-encabezado { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .modal-paso { color: var(--primario); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
        .modal-encabezado h2 { margin: 4px 0 0; font-size: clamp(1.55rem, 6vw, 2.1rem); line-height: 1.2; }
        .modal-cerrar {
          width: 64px;
          min-width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border: 2px solid var(--borde-fuerte);
          border-radius: 16px;
          background: var(--superficie);
          color: var(--texto);
          cursor: pointer;
        }
        .modal-cerrar :global(.icono) { width: 28px; height: 28px; }
        .modal-descripcion { margin: 14px 0 22px; color: var(--texto-secundario); }
        .modal-opciones { display: grid; gap: 12px; }
        .modal-opcion {
          width: 100%;
          min-height: 150px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 7px;
          border-radius: 18px;
          text-align: left;
          cursor: pointer;
        }
        .modal-opcion > span {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 4px;
          border-radius: 13px;
        }
        .modal-opcion :global(.icono) { width: 28px; height: 28px; }
        .modal-opcion strong { font-size: 1.12rem; }
        .modal-opcion small { color: inherit; font-size: 0.86rem; opacity: 0.9; }
        .modal-opcion-principal { border: 3px solid var(--primario); background: var(--primario); color: var(--sobre-primario); }
        .modal-opcion-principal > span { background: rgba(255, 255, 255, 0.18); }
        .modal-opcion-secundaria { border: 2px solid var(--borde-fuerte); background: var(--superficie); color: var(--texto); }
        .modal-opcion-secundaria > span { background: var(--superficie-suave); color: var(--primario); }
        .modal-error {
          margin: 16px 0 0;
          padding: 14px;
          border: 3px solid var(--error);
          border-radius: 12px;
          background: var(--error-fondo);
          color: var(--error);
          font-weight: 700;
        }
        .modal-formatos { margin-top: 20px; padding: 18px; border-radius: 16px; background: var(--superficie-suave); }
        .modal-formatos h3 { margin: 0 0 8px; font-size: 1rem; }
        .modal-formatos p { margin: 7px 0; font-size: 0.88rem; line-height: 1.5; }
        .modal-cancelar, .volver-opciones, .reintentar-camara, .cambiar-camara {
          width: 100%;
          min-height: 64px;
          margin-top: 14px;
          padding: 12px 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 2px solid var(--borde-fuerte);
          border-radius: 14px;
          background: transparent;
          color: var(--texto);
          font-weight: 800;
          cursor: pointer;
        }
        .marco-camara {
          position: relative;
          min-height: 260px;
          overflow: hidden;
          display: grid;
          place-items: center;
          border: 3px solid var(--borde-fuerte);
          border-radius: 18px;
          background: #07151d;
        }
        .marco-camara video { width: 100%; max-height: 58dvh; display: block; object-fit: contain; }
        .camara-estado { max-width: 34ch; margin: 0; padding: 22px; color: #fff; text-align: center; font-weight: 700; }
        .camara-error { color: #fff; }
        .controles-camara { display: grid; gap: 10px; margin-top: 14px; }
        .capturar-foto {
          width: 100%;
          min-height: 72px;
          padding: 14px 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 3px solid var(--primario);
          border-radius: 16px;
          background: var(--primario);
          color: var(--sobre-primario);
          font-weight: 800;
          cursor: pointer;
        }
        @media (min-width: 560px) {
          .modal-opciones, .controles-camara { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cambiar-camara { margin-top: 0; }
        }
        @media (max-width: 390px) {
          .modal-fondo { padding: 8px; }
          .modal-documento { max-height: calc(100dvh - 16px); border-radius: 18px; }
          .modal-opcion { min-height: 128px; }
          .marco-camara { min-height: 220px; }
        }
      `}</style>
    </>
  );
}
