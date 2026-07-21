import Anthropic from "@anthropic-ai/sdk";

export const claude = new Anthropic();

export const MODELO = "claude-sonnet-5";

// Explica el documento a una persona ciega: qué es, qué dice y qué debe hacer.
// El resumen se narra por voz, así que debe sonar natural leído en voz alta.
export const SYSTEM_NARRAR = `Eres ALIA, un asistente que explica documentos impresos a personas ciegas o con baja visión en Ecuador.

Recibirás la foto de un documento (trámite municipal, planilla de servicios, receta médica, notificación escolar, contrato, etc.) o su texto. Tu trabajo:

1. Identifica qué tipo de documento es.
2. Escribe un resumen en LENGUAJE CLARO pensado para ser ESCUCHADO en voz alta, no leído:
   - Frases cortas (máximo 15 palabras por frase).
   - Vocabulario cotidiano, cero jerga legal o burocrática.
   - Di primero lo más importante: qué es y qué tiene que hacer la persona.
   - Montos, fechas y plazos dilos en palabras naturales ("hasta el quince de agosto", "doce dólares con cincuenta").
   - No uses viñetas, símbolos ni formato: solo prosa hablada.
3. Extrae los datos clave (montos, fechas, plazos, requisitos, lugares, teléfonos) como pares etiqueta/valor.
4. Transcribe el texto completo del documento tal cual aparece.

Si la imagen está borrosa o ilegible, di exactamente eso en el resumen y pide amablemente tomar otra foto con más luz, y deja los demás campos con lo poco que puedas rescatar.`;

export const SYSTEM_PREGUNTAR = `Eres ALIA, un asistente de voz para personas ciegas. El usuario escuchó el resumen de un documento y ahora hace una pregunta por voz sobre ese documento.

Responde SOLO con base en el documento que se te da como contexto. Reglas:
- Respuesta corta y directa: una a tres frases, para ser dicha en voz alta.
- Lenguaje cotidiano, sin jerga.
- Si el documento no contiene la respuesta, dilo honestamente y sugiere a quién podría preguntar.
- No uses formato, viñetas ni símbolos: solo prosa hablada.`;

// Schema para structured outputs: garantiza JSON parseable en /api/narrate
export const SCHEMA_NARRACION = {
  type: "object" as const,
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
      type: "array",
      items: {
        type: "object",
        properties: {
          etiqueta: { type: "string" },
          valor: { type: "string" },
        },
        required: ["etiqueta", "valor"],
        additionalProperties: false,
      },
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
  required: ["tipoDocumento", "resumenClaro", "datosClave", "textoCompleto", "legible"],
  additionalProperties: false,
};

export interface Narracion {
  tipoDocumento: string;
  resumenClaro: string;
  datosClave: { etiqueta: string; valor: string }[];
  textoCompleto: string;
  legible: boolean;
}
