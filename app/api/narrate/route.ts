import { NextResponse } from "next/server";
import { getOpenAI, MODELO, SYSTEM_NARRAR, SCHEMA_NARRACION, type Narracion } from "@/lib/openai";
import { fernandezHuerta, etiquetaLegibilidad } from "@/lib/readability";
import type OpenAI from "openai";

export const maxDuration = 60;

const MEDIA_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageBase64?: string;
      mediaType?: string;
      texto?: string;
    };

    let contenido: OpenAI.Chat.Completions.ChatCompletionContentPart[];
    if (body.imageBase64) {
      const mediaType = MEDIA_PERMITIDOS.includes(body.mediaType ?? "")
        ? body.mediaType
        : "image/jpeg";
      contenido = [
        {
          type: "image_url",
          image_url: { url: `data:${mediaType};base64,${body.imageBase64}` },
        },
        { type: "text", text: "Explica este documento." },
      ];
    } else if (body.texto) {
      contenido = [{ type: "text", text: `Explica este documento:\n\n${body.texto}` }];
    } else {
      return NextResponse.json({ error: "Falta imageBase64 o texto" }, { status: 400 });
    }

    const respuesta = await getOpenAI().chat.completions.create({
      model: MODELO,
      max_completion_tokens: 4000,
      response_format: {
        type: "json_schema",
        json_schema: { name: "narracion", strict: true, schema: SCHEMA_NARRACION },
      },
      messages: [
        { role: "system", content: SYSTEM_NARRAR },
        { role: "user", content: contenido },
      ],
    });

    const texto = respuesta.choices[0]?.message?.content;
    if (!texto) {
      return NextResponse.json({ error: "El modelo no devolvió respuesta" }, { status: 502 });
    }

    const narracion = JSON.parse(texto) as Narracion;

    // Evidencia ODS: índice de legibilidad antes (documento) vs después (resumen)
    const indiceOriginal = fernandezHuerta(narracion.textoCompleto);
    const indiceClaro = fernandezHuerta(narracion.resumenClaro);

    return NextResponse.json({
      ...narracion,
      legibilidad: {
        original: { indice: indiceOriginal, etiqueta: etiquetaLegibilidad(indiceOriginal) },
        claro: { indice: indiceClaro, etiqueta: etiquetaLegibilidad(indiceClaro) },
      },
    });
  } catch (err) {
    console.error("narrate error:", err);
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
