import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

const MAXIMO_CARACTERES = 4096;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { texto?: unknown; velocidad?: unknown };
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    const velocidadRecibida = typeof body.velocidad === "number" ? body.velocidad : 0.95;

    if (!texto) {
      return NextResponse.json({ error: "Falta el texto que se debe narrar." }, { status: 400 });
    }
    if (texto.length > MAXIMO_CARACTERES) {
      return NextResponse.json(
        { error: "El texto es demasiado largo para narrarlo de una sola vez." },
        { status: 400 },
      );
    }

    const audio = await getOpenAI().audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: texto,
      response_format: "mp3",
      speed: Math.min(1.15, Math.max(0.8, velocidadRecibida)),
    });

    return new Response(await audio.arrayBuffer(), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error al generar la voz de ALIA:", error);
    return NextResponse.json(
      { error: "No pudimos generar la voz en español. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
