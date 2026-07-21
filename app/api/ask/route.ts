import { NextResponse } from "next/server";
import { claude, MODELO, SYSTEM_PREGUNTAR } from "@/lib/claude";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { pregunta?: string; contexto?: string };
    if (!body.pregunta || !body.contexto) {
      return NextResponse.json({ error: "Falta pregunta o contexto" }, { status: 400 });
    }

    const respuesta = await claude.messages.create({
      model: MODELO,
      max_tokens: 500,
      system: SYSTEM_PREGUNTAR,
      output_config: { effort: "low" },
      messages: [
        {
          role: "user",
          content: `DOCUMENTO:\n${body.contexto}\n\nPREGUNTA DEL USUARIO (por voz): ${body.pregunta}`,
        },
      ],
    });

    const bloqueTexto = respuesta.content.find((b) => b.type === "text");
    const texto = bloqueTexto?.type === "text" ? bloqueTexto.text : "No pude responder.";

    return NextResponse.json({ respuesta: texto });
  } catch (err) {
    console.error("ask error:", err);
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
