export type NombreIcono =
  | "camara"
  | "texto"
  | "volumen"
  | "microfono"
  | "contraste"
  | "documento"
  | "check"
  | "volver"
  | "nuevo"
  | "subir"
  | "cerrar";

export default function Icono({
  nombre,
  className = "icono",
}: {
  nombre: NombreIcono;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {nombre === "camara" && (
        <>
          <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
          <circle cx="12" cy="13" r="4" />
        </>
      )}
      {nombre === "texto" && (
        <>
          <path d="M4 5h16M8 9h8M6 13h12M6 17h9" />
          <path d="M4 3v4M20 3v4" />
        </>
      )}
      {nombre === "volumen" && (
        <>
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
        </>
      )}
      {nombre === "microfono" && (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
        </>
      )}
      {nombre === "contraste" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" />
        </>
      )}
      {nombre === "documento" && (
        <>
          <path d="M6 2h8l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v5h5M8 12h6M8 16h6" />
        </>
      )}
      {nombre === "check" && <path d="m5 12 4 4L19 6" />}
      {nombre === "volver" && <path d="m15 18-6-6 6-6" />}
      {nombre === "nuevo" && (
        <>
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 4v7h-7" />
        </>
      )}
      {nombre === "subir" && (
        <>
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        </>
      )}
      {nombre === "cerrar" && <path d="m6 6 12 12M18 6 6 18" />}
    </svg>
  );
}
