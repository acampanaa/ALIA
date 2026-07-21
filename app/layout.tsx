import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALIA — Tecnología que se adapta a ti",
  description:
    "Fotografía un documento y escúchalo explicado en lenguaje claro. Accesibilidad con IA para personas ciegas y con baja visión.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // permitimos zoom: bloquearlo viola WCAG 1.4.4
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
