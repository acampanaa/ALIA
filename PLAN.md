# PLAN — Clarito 🎧📄

> Hackathon 6 horas · Portoviejo · Reto: Accesibilidad con IA · Equipo: **Andrea** y **Axel**

## 🎯 Objetivo final

**Clarito** — *"Cualquier papel, en tus oídos"*: una web app para **personas ciegas y con baja visión**. La persona fotografía un documento impreso (trámite municipal, planilla de agua, receta médica, notificación escolar) y Clarito:

1. **Lo narra en audio en lenguaje claro** — no lee la burocracia tal cual: explica qué es el documento y qué debe hacer la persona.
2. **Responde preguntas por voz** — "¿cuánto tengo que pagar?", "¿hasta cuándo tengo plazo?" — sin tocar la pantalla.
3. **Modo baja visión** — el texto en tipografía gigante y contraste AAA (amarillo sobre negro).

**El problema:** un papel impreso es totalmente inaccesible para una persona ciega. Depende de que otro se lo lea, perdiendo autonomía y privacidad (una receta, una deuda, una notificación legal). Los lectores de pantalla no sirven con papel físico.

**ODS:** 10 (reducción de desigualdades — eje "Igualdad y reducción de brechas") y 11 (ciudades inclusivas, meta 11.3). Evidencia para jueces: **índice de legibilidad Fernández-Huerta antes/después** mostrado en pantalla en cada documento + cifras CONADIS de discapacidad visual (Axel las verifica — no inventar).

## ⚙️ Funcionalidades (definición de "hecho")

| # | Funcionalidad | Está hecha cuando... |
|---|---|---|
| F1 | Fotografiar documento | Desde el celular, la foto llega a `/api/narrate` y vuelve el JSON con resumen |
| F2 | Narración en audio | Al llegar el resultado, la app lo lee en voz alta automáticamente (Web Speech API) |
| F3 | Preguntas por voz | Botón micrófono → pregunta hablada → `/api/ask` → respuesta hablada |
| F4 | Modo baja visión | Toggle a texto ≥1.6rem, amarillo sobre negro (contraste AAA) |
| F5 | Métrica de legibilidad | Índice antes/después visible en cada resultado (evidencia ODS) |
| F6 | Accesibilidad propia | Usable con TalkBack sin mirar la pantalla; foco visible; aria-live |

## 🗺️ Arquitectura (ya scaffoldeada en este repo)

```
app/page.tsx               → pantalla única audio-first
app/api/narrate/route.ts   → foto/texto → Claude visión → JSON {resumen, datos clave...}
app/api/ask/route.ts       → pregunta + contexto → respuesta corta hablable
lib/claude.ts              → cliente + system prompts
lib/readability.ts         → índice Fernández-Huerta (evidencia ODS)
lib/speech.ts              → hablar() / escuchar() (Web Speech API, gratis, Chrome)
components/                → BotonGigante, IndicadorVoz, ResultadoDocumento
```

Stack: Next.js 15 + API de Claude (`claude-sonnet-5`, visión) + Web Speech API + Tailwind. Deploy: Vercel.

## 👩‍💻 Plan de ANDREA — Frontend / UX accesible

| Hora | Tarea | Checklist |
|---|---|---|
| 0:00–0:30 | Levantar el repo (`npm install`, `npm run dev`), crear proyecto en Vercel y hacer el **primer deploy** | ☐ |
| 0:30–2:00 | Pantalla principal: probar captura de foto desde celular real, estados de carga anunciados por voz, TTS funcionando | ☐ |
| 2:00–3:00 | Vista resultado: narración automática al llegar el resumen + modo baja visión pulido | ☐ |
| 3:00–4:00 | Flujo de voz completo: micrófono → STT → `/api/ask` → respuesta hablada. Probar en Chrome del celular | ☐ |
| 4:00–5:00 | Auditoría de accesibilidad: **activar TalkBack** y recorrer toda la app sin mirar; corregir foco, labels, aria-live | ☐ |
| 5:00–5:45 | **Con Axel**: ensayo de demo completa con documento físico; grabar video de respaldo | ☐ |
| 5:45–6:00 | Deploy final + buffer | ☐ |

## 👨‍💻 Plan de AXEL — IA / Backend / Pitch

| Hora | Tarea | Checklist |
|---|---|---|
| 0:00–0:30 | Conseguir/configurar `ANTHROPIC_API_KEY` en `.env.local` y en Vercel; probar `/api/narrate` con una foto real | ☐ |
| 0:30–2:00 | Afinar el system prompt de narración (`lib/claude.ts`) con 3–4 documentos reales de Portoviejo: planilla de agua, trámite municipal, receta | ☐ |
| 2:00–3:00 | Probar `/api/ask` con preguntas típicas ("¿cuánto pago?", "¿qué llevo?"); manejar foto borrosa/ilegible con gracia | ☐ |
| 3:00–4:00 | Verificar métrica de legibilidad (que siempre mejore); conseguir cifras reales CONADIS sobre discapacidad visual en Ecuador/Manabí | ☐ |
| 4:00–5:00 | **Pitch**: slides con guion de `PITCH.md` (problema → demo → evidencia ODS → escala mundial) | ☐ |
| 5:00–5:45 | **Con Andrea**: ensayo de demo + pitch cronometrado | ☐ |
| 5:45–6:00 | Buffer | ☐ |

> Si se suma una 3ª persona: toma pitch + cifras + conseguir documentos reales desde la hora 0 (libera a Axel para solo IA), y desde la hora 3 hace QA con TalkBack en celular real.

## 🛡️ Reglas anti-riesgo

- **Deploy en Vercel desde la hora 0:30** y tras cada avance. Jamás demo solo desde localhost.
- Demo con 1 documento pre-probado + 1 en vivo. **Video de respaldo grabado a la hora 5** por si falla el WiFi.
- El reconocimiento de voz (STT) solo funciona bien en **Chrome** → demo en Chrome sí o sí.
- Si TalkBack complica la demo en vivo, se muestra en el video y la demo en vivo usa el flujo de voz propio de la app.
