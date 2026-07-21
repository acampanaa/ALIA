// Índice de legibilidad Fernández-Huerta (adaptación española del Flesch).
// L = 206.84 − 0.60·P − 1.02·F
//   P = sílabas por cada 100 palabras, F = palabras por frase.
// Escala 0–100: más alto = más fácil de leer. Es la evidencia cuantitativa
// del pitch: mostramos el índice del documento original vs. el resumen claro.

function contarSilabas(palabra: string): number {
  const limpia = palabra
    .toLowerCase()
    .normalize("NFD")
    .replace(/[́̈]/g, "") // quita tildes/diéresis para agrupar vocales
    .normalize("NFC");
  const grupos = limpia.match(/[aeiouáéíóúü]+/gi);
  return grupos ? grupos.length : 1;
}

export function fernandezHuerta(texto: string): number {
  const palabras = texto.match(/[a-záéíóúüñ]+/gi) ?? [];
  if (palabras.length === 0) return 0;

  const frases = texto.split(/[.!?;:\n]+/).filter((f) => f.trim().length > 0);
  const numFrases = Math.max(frases.length, 1);

  const silabas = palabras.reduce((total, p) => total + contarSilabas(p), 0);

  const P = (silabas / palabras.length) * 100;
  const F = palabras.length / numFrases;

  const indice = 206.84 - 0.6 * P - 1.02 * F;
  return Math.round(Math.min(100, Math.max(0, indice)));
}

export function etiquetaLegibilidad(indice: number): string {
  if (indice >= 90) return "muy fácil";
  if (indice >= 70) return "fácil";
  if (indice >= 50) return "normal";
  if (indice >= 30) return "difícil";
  return "muy difícil";
}
