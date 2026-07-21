# 🎯 Objetivo y funcionalidades — ALIA

> **A**ccesibilidad, **L**enguaje, **I**nclusión y **A**utonomía · *Tecnología que se adapta a ti.*

> Hackathon 6 horas · Portoviejo · Reto: Accesibilidad con IA · ODS 10 y 11

## Objetivo final

**ALIA**: web app para **personas ciegas y con baja visión**. La persona fotografía un documento impreso (trámite municipal, planilla de agua, receta médica, notificación escolar) y ALIA:

1. **Lo narra en audio en lenguaje claro** — no lee la burocracia tal cual: explica qué es y qué debe hacer la persona.
2. **Responde preguntas por voz** — "¿cuánto tengo que pagar?", "¿hasta cuándo tengo plazo?" — sin tocar la pantalla.
3. **Modo baja visión** — texto gigante y contraste AAA (amarillo sobre negro).

**El problema:** un papel impreso es totalmente inaccesible para una persona ciega. Depende de que otro se lo lea, perdiendo autonomía y privacidad. Los lectores de pantalla no sirven con papel físico.

**Alineación ODS:**
- **ODS 10** (Reducción de desigualdades — eje "Igualdad y reducción de brechas"): autonomía en el acceso a información impresa.
- **ODS 11** (Ciudades inclusivas, meta 11.3): trámites municipales de Portoviejo accesibles sin intermediarios.
- **Evidencia medible**: índice de legibilidad Fernández-Huerta antes/después, mostrado en pantalla en cada documento + cifras CONADIS/INEC de discapacidad visual.

## Funcionalidades (definición de "hecho")

| # | Funcionalidad | Está hecha cuando... | Dueño |
|---|---|---|---|
| F1 | Fotografiar documento | Desde el celular, la foto llega a `/api/narrate` y vuelve el JSON con resumen | Frontend |
| F2 | Narración en audio | Al llegar el resultado, la app lo lee en voz alta automáticamente (Web Speech API) | Frontend |
| F3 | Preguntas por voz | Botón micrófono → pregunta hablada → `/api/ask` → respuesta hablada | Frontend + Backend |
| F4 | Modo baja visión | Toggle a texto ≥1.6rem, amarillo sobre negro (contraste AAA) | Frontend |
| F5 | Métrica de legibilidad | Índice antes/después visible en cada resultado (evidencia ODS) | Backend |
| F6 | Calidad de narración | El resumen suena natural, corto y sin jerga con documentos reales de Portoviejo | Backend |
| F7 | Accesibilidad propia | Usable con TalkBack sin mirar la pantalla; foco visible; aria-live | Frontend |
| F8 | Pitch + evidencia | Slides, guion cronometrado, cifras verificadas, video de respaldo | Daniel |

## Reglas anti-riesgo (leer antes de empezar)

- **Deploy en Vercel desde la hora 0:30** y tras cada avance. Jamás demo solo desde localhost.
- Demo con 1 documento pre-probado + 1 en vivo. **Video de respaldo grabado a la hora 5**.
- El reconocimiento de voz (STT) solo funciona en **Chrome** → demo en Chrome sí o sí.
- Si TalkBack complica la demo en vivo, se muestra en el video y la demo usa el flujo de voz propio.
