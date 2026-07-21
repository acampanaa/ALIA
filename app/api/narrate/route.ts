import { NextResponse } from "next/server";
import { claude, MODELO, SYSTEM_NARRAR, SCHEMA_NARRACION, type Narracion } from "@/lib/claude";
import { fernandezHuerta, etiquetaLegibilidad } from "@/lib/readability";
import type Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const MEDIA_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type MediaPermitido = (typeof MEDIA_PERMITIDOS)[number];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageBase64?: string;
      mediaType?: string;
      texto?: string;
    };

    let contenido: Anthropic.ContentBlockParam[];
    if (body.imageBase64) {
      const mediaType = MEDIA_PERMITIDOS.includes(body.mediaType as MediaPermitido)
        ? (body.mediaType as MediaPermitido)
        : "image/jpeg";
      contenido = [
        {
          type: "image",
          source: { type: "base64", media_type: mediaType, data: body.imageBase64 },
        },
        { type: "text", text: "Explica este documento." },
      ];
    } else if (body.texto) {
      contenido = [
        { type: "text", text: `Explica este documento:\n\n${body.texto}` },
      ];
    } else {
      return NextResponse.json({ error: "Falta imageBase64 o texto" }, { status: 400 });
    }

    const respuesta = await claude.messages.create({
      model: MODELO,
      max_tokens: 4000,
      system: SYSTEM_NARRAR,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA_NARRACION },
      },
      messages: [{ role: "user", content: contenido }],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === "text");
    if (!bloqueTexto || bloqueTexto.type !== "text") {
      return NextResponse.json({ error: "El modelo no devolvió respuesta" }, { status: 502 });
    }

    const narracion = JSON.parse(bloqueTexto.text) as Narracion;

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
