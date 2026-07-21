# Agente IA — Axel (Backend / IA / Pitch)

> **Repo:** `~/proyectos/ALIA` · **Producto:** ALIA  
> **Copia el PROMPT INICIAL al abrir tu chat con el agente.**

---

## PROMPT INICIAL

```
Eres el agente backend/IA para ALIA (hackatón Portoviejo — Accesibilidad con IA).

REPO: ~/proyectos/ALIA — Next.js 15 ya scaffoldeado.

LEE:
1. LEEME-PRIMERO.md
2. docs/AGENTE-AXEL.md
3. docs/02-equipo/axel-backend.md (tu cronograma)
4. lib/claude.ts, app/api/narrate, app/api/ask

PRODUCTO: app para personas CIEGAS y baja visión — foto de documento → lenguaje claro → audio → preguntas por voz.

TU ROL:
- /api/narrate y /api/ask
- Prompts IA (lib/claude.ts o migrar a OpenAI GPT-4o)
- lib/readability.ts (métrica ODS)
- Cifras CONADIS para pitch
- NO tocar components/ salvo emergencia

CRÍTICO: El hackatón exige OpenAI. El repo usa Claude — evaluar migración a GPT-4o Vision en hora 0-1.

ODS 10 + 11. Demo: documento real Portoviejo (planilla agua, trámite municipal).

Confirma rol, archivos que tocas, y primer paso. Luego ejecuta.
```

---

## Tu rol

| Área | Archivos |
|---|---|
| API narración | `app/api/narrate/route.ts` |
| API preguntas | `app/api/ask/route.ts` |
| Prompts + schema | `lib/claude.ts` *(o `lib/openai.ts` si migran)* |
| Métrica ODS | `lib/readability.ts` |
| Env / deploy keys | `.env.local`, Vercel env |
| Pitch datos | `docs/03-pitch/guion-pitch.md` — cifras CONADIS |

**Andrea hace:** UI, voz en browser, TalkBack, deploy UI.

---

## Carpetas — SOLO tuyas

```
app/api/narrate/route.ts
app/api/ask/route.ts
lib/claude.ts          (o lib/openai.ts)
lib/readability.ts
.env.local             (NO commitear)
```

**NO tocar (salvo emergencia hora 5):**
```
app/page.tsx
components/**
app/globals.css
lib/speech.ts          (Andrea — Web Speech API)
```

---

## APIs — contrato

### `POST /api/narrate`

**Input:** `{ imageBase64?: string, text?: string }`

**Output (JSON estructurado):**
```json
{
  "tipoDocumento": "planilla de agua potable",
  "resumenHablado": "Prosa corta para TTS — frases ≤15 palabras...",
  "datosClave": [{ "etiqueta": "Monto", "valor": "doce dólares" }],
  "textoCompleto": "...",
  "legibilidadAntes": 34,
  "legibilidadDespues": 88
}
```

**Reglas prompt:**
- Lenguaje para **escucharse**, no leerse
- Montos/fechas en palabras naturales
- Si foto borrosa → decirlo y pedir otra foto

---

### `POST /api/ask`

**Input:** `{ pregunta: string, contextoDocumento: object }`

**Output:**
```json
{
  "respuestaHablada": "Una a tres frases, prosa para voz",
  "encontradoEnDocumento": true
}
```

**Reglas:**
- Solo responder con info del documento
- Si no está: decirlo honestamente
- No inventar montos, fechas ni plazos

---

## OpenAI vs Claude (decisión obligatoria)

| | Claude (actual) | OpenAI (requerido hackatón) |
|---|---|---|
| Visión | ✅ en repo | GPT-4o Vision |
| Structured JSON | ✅ SCHEMA_NARRACION | response_format json_schema |
| Documentar en README | Anthropic | **GPT + Codex usado en dev** |

**Si migras a OpenAI:**
1. Crear `lib/openai.ts`
2. Reemplazar calls en narrate/ask
3. Actualizar README: "OpenAI GPT-4o Vision, TTS/STT vía Web Speech, Codex en desarrollo"

**Si NO migras a tiempo:** documentar Codex + al menos 1 call GPT en README *(riesgo con jurado)*.

---

## Orden de implementación

| Prioridad | Tarea |
|---|---|
| 1 | API key en `.env.local` + Vercel — probar narrate con 1 foto |
| 2 | Afinar SYSTEM_NARRAR con 3 docs reales Portoviejo |
| 3 | `/api/ask` con preguntas: "¿cuánto pago?", "¿hasta cuándo?" |
| 4 | Verificar legibilidad siempre mejora (antes < después) |
| 5 | Cifras CONADIS reales → docs/03-pitch/guion-pitch.md |
| 6 | Slides pitch hora 4 |

---

## Documentos demo (conseguir o crear)

- Planilla agua EPAP / Portoviejo
- Trámite o aviso municipal
- Receta o aviso de salud *(sin datos personales reales)*

Daniel puede ayudar a conseguirlos.

---

## Checklist Axel

- [ ] `/api/narrate` funciona con foto real
- [ ] `/api/ask` responde sin alucinar
- [ ] Legibilidad antes/después en respuesta
- [ ] OpenAI documentado en README (migración o híbrido)
- [ ] CONADIS: 1-2 cifras verificadas en pitch
- [ ] Env vars en Vercel producción

---

## Referencias

- `docs/02-equipo/axel-backend.md` — cronograma hora por hora
- `docs/03-pitch/guion-pitch.md` — guión
- `README.md` — stack
