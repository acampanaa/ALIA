import OpenAI from "openai";

// perezoso: el constructor exige OPENAI_API_KEY y rompería el build sin ella
let cliente: OpenAI | null = null;
export function getOpenAI(): OpenAI {
  if (!cliente) cliente = new OpenAI();
  return cliente;
}

export const MODELO = "gpt-4o";

// Explica el documento a una persona ciega: qué es, qué dice y qué debe hacer.
// El resumen se narra por voz, así que debe sonar natural leído en voz alta.
export const SYSTEM_NARRAR = `Eres ALIA, un asistente que explica documentos impresos a personas ciegas o con baja visión en Ecuador.

Recibirás un documento como imagen, PDF, archivo de oficina o texto (trámite municipal, planilla de servicios, receta médica, notificación escolar, contrato, etc.). Tu trabajo:

1. Identifica qué tipo de documento es.
2. Escribe un resumen en LENGUAJE CLARO pensado para ser ESCUCHADO en voz alta, no leído:
   - Frases cortas (máximo 15 palabras por frase).
   - Vocabulario cotidiano, cero jerga legal o burocrática.
   - Di primero lo más importante: qué es y qué tiene que hacer la persona.
   - Montos, fechas y plazos dilos en palabras naturales ("hasta el quince de agosto", "doce dólares con cincuenta").
   - No uses viñetas, símbolos ni formato: solo prosa hablada.
3. Extrae los datos clave (montos, fechas, plazos, requisitos, lugares, teléfonos) como pares etiqueta/valor para MOSTRAR EN PANTALLA. Conserva su formato visual y numérico; no los escribas con palabras:
   - Fechas: DD/MM/AAAA (ejemplo: 27/04/2026).
   - Horas: HH:mm (ejemplo: 16:00) y rangos: 16:00–17:00.
   - Teléfonos, códigos, montos, cantidades y períodos: conserva dígitos, separadores y símbolos tal como aparecen (ejemplos: 0988 197 776, $12,50, 2026-01, 3).
   - Solo el resumenClaro y proximosPasos deben usar lenguaje natural pensado para voz.
4. Extrae hasta tres próximos pasos que el documento indique explícitamente. Deben ser acciones concretas, cortas y hablables. No inventes consejos ni acciones que no aparezcan en el documento. Si no hay acciones claras, devuelve una lista vacía.
5. Sugiere hasta tres preguntas rápidas útiles y específicas para ESTE documento. Deben poder responderse solo con sus datos: por ejemplo, sobre una materia, fecha, requisito, monto, horario, lugar o contacto que realmente conste. No uses preguntas genéricas ni sugieras una pregunta si el dato no aparece. Si no hay preguntas útiles, devuelve una lista vacía.
6. Transcribe el texto completo del documento tal cual aparece.

Si el contenido está borroso, dañado o ilegible, dilo exactamente en el resumen. Si es una foto, pide tomar otra con más luz. Deja los demás campos con lo poco que puedas rescatar.`;

export const SYSTEM_PREGUNTAR = `Eres ALIA, un asistente de voz para personas ciegas. El usuario escuchó el resumen de un documento y ahora hace una pregunta por voz sobre ese documento.

Responde SOLO con base en el documento que se te da como contexto. Reglas:
- Respuesta corta y directa: una a tres frases, para ser dicha en voz alta.
- Lenguaje cotidiano, sin jerga.
- Si el documento no contiene la respuesta, dilo honestamente y sugiere a quién podría preguntar.
- No uses formato, viñetas ni símbolos: solo prosa hablada.`;

// Schema para structured outputs (json_schema strict): garantiza JSON parseable
export const SCHEMA_NARRACION = {
  type: "object",
  properties: {
    tipoDocumento: {
      type: "string",
      description: "Tipo de documento en pocas palabras, ej: 'planilla de agua potable'",
    },
    resumenClaro: {
      type: "string",
      description: "Resumen en lenguaje claro apto para narrarse en voz alta",
    },
    datosClave: {
      description: "Datos para mostrar visualmente. Los valores conservan números, fechas, horas y formatos del documento.",
      type: "array",
      items: {
        type: "object",
        properties: {
          etiqueta: { type: "string" },
          valor: { type: "string", description: "Valor visual literal: fechas DD/MM/AAAA, horas HH:mm y números sin convertirlos a palabras" },
        },
        required: ["etiqueta", "valor"],
        additionalProperties: false,
      },
    },
    proximosPasos: {
      type: "array",
      description: "Hasta tres acciones explícitas que la persona debe realizar según el documento",
      maxItems: 3,
      items: { type: "string" },
    },
    preguntasSugeridas: {
      type: "array",
      description: "Hasta tres preguntas específicas y respondibles con este documento",
      maxItems: 3,
      items: { type: "string" },
    },
    textoCompleto: {
      type: "string",
      description: "Transcripción literal del texto del documento",
    },
    legible: {
      type: "boolean",
      description: "false si la foto está demasiado borrosa o ilegible",
    },
  },
  required: ["tipoDocumento", "resumenClaro", "datosClave", "proximosPasos", "preguntasSugeridas", "textoCompleto", "legible"],
  additionalProperties: false,
} as Record<string, unknown>;

export interface Narracion {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  proximosPasos: string[];
  preguntasSugeridas: string[];
  textoCompleto: string;
  legible: boolean;
}
