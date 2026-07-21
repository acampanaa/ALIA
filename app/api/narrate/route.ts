import { NextResponse } from "next/server";
import { getOpenAI, MODELO, SYSTEM_NARRAR, SCHEMA_NARRACION, type Narracion } from "@/lib/openai";
import { fernandezHuerta, etiquetaLegibilidad } from "@/lib/readability";
import type OpenAI from "openai";

export const maxDuration = 60;

const TAMANO_MAXIMO = 10 * 1024 * 1024;
const MEDIA_POR_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".rtf": "application/rtf",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const MEDIA_PERMITIDOS = new Set(Object.values(MEDIA_POR_EXTENSION));

function extensionDe(nombre: string): string {
  const punto = nombre.lastIndexOf(".");
  return punto >= 0 ? nombre.slice(punto).toLowerCase() : "";
}

function resolverMediaType(mediaType: string, nombre: string): string | null {
  const extension = extensionDe(nombre);
  const mediaPorExtension = MEDIA_POR_EXTENSION[extension];
  if (mediaPorExtension) return mediaPorExtension;
  if (!extension && MEDIA_PERMITIDOS.has(mediaType)) return mediaType;
  return null;
}

function limpiarNombre(nombre: string): string {
  const limpio = nombre.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return limpio || "documento";
}

function tamanoBase64(base64: string): number {
  return Math.floor((base64.length * 3) / 4);
}

function contenidoDeArchivo(
  base64: string,
  mediaType: string,
  nombre: string,
): OpenAI.Chat.Completions.ChatCompletionContentPart[] {
  const dataUrl = "data:" + mediaType + ";base64," + base64;

  if (mediaType.startsWith("image/")) {
    return [
      { type: "image_url", image_url: { url: dataUrl } },
      { type: "text", text: "Explica este documento." },
    ];
  }

  return [
    {
      type: "file",
      file: {
        filename: limpiarNombre(nombre),
        file_data: dataUrl,
      },
    },
    { type: "text", text: "Explica este documento." },
  ];
}

export async function POST(req: Request) {
  try {
    let contenido: OpenAI.Chat.Completions.ChatCompletionContentPart[];
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formulario = await req.formData();
      const entrada = formulario.get("archivo");

      if (!(entrada instanceof File)) {
        return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
      }
      if (entrada.size > TAMANO_MAXIMO) {
        return NextResponse.json({ error: "El archivo supera el límite de 10 MB" }, { status: 413 });
      }

      const mediaType = resolverMediaType(entrada.type, entrada.name);
      if (!mediaType) {
        return NextResponse.json({ error: "El tipo de archivo no es compatible" }, { status: 415 });
      }

      const base64 = Buffer.from(await entrada.arrayBuffer()).toString("base64");
      contenido = contenidoDeArchivo(base64, mediaType, entrada.name);
    } else {
      const body = (await req.json()) as {
        imageBase64?: string;
        fileBase64?: string;
        fileName?: string;
        mediaType?: string;
        texto?: string;
      };
      const base64 = body.fileBase64 ?? body.imageBase64;

      if (base64) {
        if (tamanoBase64(base64) > TAMANO_MAXIMO) {
          return NextResponse.json({ error: "El archivo supera el límite de 10 MB" }, { status: 413 });
        }

        const nombre = body.fileName ?? (body.imageBase64 ? "documento.jpg" : "documento");
        const mediaType = resolverMediaType(body.mediaType ?? "", nombre);
        if (!mediaType) {
          return NextResponse.json({ error: "El tipo de archivo no es compatible" }, { status: 415 });
        }
        contenido = contenidoDeArchivo(base64, mediaType, nombre);
      } else if (body.texto?.trim()) {
        contenido = [{ type: "text", text: "Explica este documento:\n\n" + body.texto.trim() }];
      } else {
        return NextResponse.json({ error: "Falta un archivo o texto" }, { status: 400 });
      }
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
