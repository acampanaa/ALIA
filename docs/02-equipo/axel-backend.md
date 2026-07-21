# 👨‍💻 Plan de AXEL — Módulo Backend / IA

**Archivos que te pertenecen:** `app/api/narrate/route.ts`, `app/api/ask/route.ts`, `lib/openai.ts`
**No tocas:** `app/page.tsx`, `components/*`, `lib/speech.ts` (módulo de Andrea) ni `lib/readability.ts` (módulo de Daniel — tú solo la importas)

## Tu misión

Que cualquier foto de un documento real de Portoviejo salga convertida en un resumen que **suene natural escuchado una sola vez**: corto, sin jerga, con montos y fechas en palabras. Y que la métrica de legibilidad siempre mejore (es la evidencia ODS del pitch).

## Cronograma

| Hora | Tarea | ☐ |
|---|---|---|
| 0:00–0:30 | Configurar `OPENAI_API_KEY` en `.env.local` y en Vercel; probar `/api/narrate` con una foto real | ☐ |
| 0:30–2:00 | Afinar `SYSTEM_NARRAR` en `lib/openai.ts` con 3–4 documentos reales: planilla de agua, trámite municipal, receta | ☐ |
| 2:00–3:00 | Probar `/api/ask` con preguntas típicas ("¿cuánto pago?", "¿qué llevo?"); manejar foto borrosa/ilegible con gracia | ☐ |
| 3:00–4:00 | Verificar con Daniel la métrica de legibilidad (que siempre mejore — el módulo es suyo); conseguir cifras reales CONADIS/INEC sobre discapacidad visual | ☐ |
| 4:00–5:00 | **Pitch**: slides con el guion de `docs/03-pitch/guion-pitch.md` (Daniel lidera pitch; Axel sigue con backend si hace falta) | ☐ |
| 5:00–5:45 | **Con Andrea**: ensayo de demo + pitch cronometrado | ☐ |
| 5:45–6:00 | Buffer | ☐ |

## Criterios de calidad del resumen narrado

1. Se entiende **escuchado una sola vez**. Frases ≤ 15 palabras.
2. Primero lo importante: qué es el papel y qué debe HACER la persona.
3. Cero jerga: nada de "el contribuyente", "sírvase cancelar".
4. Montos y fechas en palabras ("doce dólares con cincuenta", "hasta el viernes quince").
5. Sin viñetas ni símbolos: es prosa para voz.
6. Foto ilegible → lo dice con honestidad y pide otra foto con más luz.

## Cómo probar rápido sin la UI

```bash
# con la app corriendo en localhost:3000
curl -s -X POST localhost:3000/api/narrate \
  -H "Content-Type: application/json" \
  -d '{"texto": "EL GAD MUNICIPAL DE PORTOVIEJO NOTIFICA AL CONTRIBUYENTE..."}'
```

**Regla:** el contrato JSON de las rutas (ver `docs/01-proyecto/arquitectura-y-modulos.md`) no se cambia sin avisar a Andrea — su UI depende de esos campos.
