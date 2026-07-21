# 🗺️ Arquitectura y reparto de módulos

## Arquitectura (ya scaffoldeada en este repo)

```
app/page.tsx               → pantalla única audio-first          [FRONTEND]
app/layout.tsx             → layout + metadata                   [FRONTEND]
app/globals.css            → estilos, foco visible, baja visión  [FRONTEND]
components/                → BotonGigante, IndicadorVoz,
                             ResultadoDocumento                  [FRONTEND]
lib/speech.ts              → hablar() / escuchar() (Web Speech)  [FRONTEND]

app/api/narrate/route.ts   → foto/texto → IA visión → JSON       [BACKEND]
app/api/ask/route.ts       → pregunta + contexto → respuesta     [BACKEND]
lib/openai.ts              → cliente + system prompts + schema   [BACKEND]
lib/readability.ts         → índice Fernández-Huerta             [MÉTRICA — Daniel]

docs/                      → planes, pitch, evidencia            [PITCH/QA]
```

Stack: Next.js 15 (App Router) + API de OpenAI (`gpt-4o`, visión, structured outputs) + Web Speech API (gratis, en navegador) + Tailwind 4. Deploy: Vercel.

## Reparto de módulos — regla de oro para no chocar

**Cada archivo tiene UN dueño principal. Si otro lo toca, avisa antes.**

| Módulo | Dueño principal | Archivos |
|---|---|---|
| **Frontend / UX accesible** | Andrea | `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/*`, `lib/speech.ts` |
| **Backend / IA** | Axel | `app/api/*`, `lib/openai.ts` |
| **Métrica de legibilidad (ODS)** | Daniel | `lib/readability.ts` — Axel solo la importa |
| **QA / Pitch / Docs** | Daniel | `docs/*`, slides, video de respaldo |
| **Código de apoyo** | Daniel *(con aviso)* | Bugs QA, polish, refuerzo en frontend o backend |

### El contrato entre módulos (NO romper sin acordarlo)

Frontend y backend solo se tocan a través de estos dos JSON. Mientras el contrato no cambie, cada quien trabaja libre en su módulo:

**`POST /api/narrate`** — entrada: `{ imageBase64?, mediaType?, texto? }` — salida:
```json
{
  "tipoDocumento": "planilla de agua potable",
  "resumenClaro": "…prosa apta para voz…",
  "datosClave": [{ "etiqueta": "Monto", "valor": "12,50 dólares" }],
  "proximosPasos": ["Paga doce dólares con cincuenta centavos.", "Hazlo hasta el quince de agosto."],
  "textoCompleto": "…transcripción literal…",
  "legible": true,
  "legibilidad": {
    "original": { "indice": 34, "etiqueta": "difícil" },
    "claro": { "indice": 88, "etiqueta": "muy fácil" }
  }
}
```

**`POST /api/ask`** — entrada: `{ pregunta, contexto }` — salida: `{ "respuesta": "…prosa hablable…" }`

Errores: siempre `{ "error": "mensaje" }` con status ≠ 200.

### Flujo git para no pisarse

- Trabajar directo en `main` está bien (somos 2-3 y 6 horas), PERO: **commits pequeños y `git pull` antes de cada push**.
- Si dos personas necesitan tocar el mismo archivo, se avisan por voz — están en la misma mesa.
- Conflicto de merge = 5 minutos perdidos. El reparto de módulos existe para que nunca pase.
