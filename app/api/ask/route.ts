import { NextResponse } from "next/server";
import { getOpenAI, MODELO, SYSTEM_PREGUNTAR } from "@/lib/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { pregunta?: string; contexto?: string };
    if (!body.pregunta || !body.contexto) {
      return NextResponse.json({ error: "Falta pregunta o contexto" }, { status: 400 });
    }

    const respuesta = await getOpenAI().chat.completions.create({
      model: MODELO,
      max_completion_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PREGUNTAR },
        {
          role: "user",
          content: `DOCUMENTO:\n${body.contexto}\n\nPREGUNTA DEL USUARIO (por voz): ${body.pregunta}`,
        },
      ],
    });

    const texto = respuesta.choices[0]?.message?.content ?? "No pude responder.";

    return NextResponse.json({ respuesta: texto });
  } catch (err) {
    console.error("ask error:", err);
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
