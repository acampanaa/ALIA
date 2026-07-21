# 👩‍💻 Plan de ANDREA — Módulo Frontend / UX accesible

**Archivos que te pertenecen:** `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/*`, `lib/speech.ts`
**No tocas:** `app/api/*`, `lib/claude.ts`, `lib/readability.ts` (módulo de Axel)

## Tu misión

Que una persona ciega pueda usar la app completa **sin ver la pantalla**: todo se anuncia por voz y por `aria-live`, todo es operable con TalkBack, y el modo baja visión cumple contraste AAA.

## Cronograma

| Hora | Tarea | ☐ |
|---|---|---|
| 0:00–0:30 | Levantar el repo (`npm install`, `npm run dev`), crear proyecto en Vercel y hacer el **primer deploy** | ☐ |
| 0:30–2:00 | Pantalla principal: probar captura de foto desde celular real, estados de carga anunciados por voz, TTS funcionando | ☐ |
| 2:00–3:00 | Vista resultado: narración automática al llegar el resumen + modo baja visión pulido | ☐ |
| 3:00–4:00 | Flujo de voz completo: micrófono → STT → `/api/ask` → respuesta hablada. Probar en Chrome del celular | ☐ |
| 4:00–5:00 | Auditoría de accesibilidad: **activar TalkBack** y recorrer toda la app sin mirar; corregir foco, labels, aria-live | ☐ |
| 5:00–5:45 | **Con Axel**: ensayo de demo completa con documento físico; grabar video de respaldo | ☐ |
| 5:45–6:00 | Deploy final + buffer | ☐ |

## Checklist de accesibilidad (tu definición de calidad)

- ☐ La app saluda por voz al abrir y anuncia cada cambio de estado
- ☐ Todo botón ≥ 64px de alto, con nombre accesible (los emojis con `aria-hidden`)
- ☐ Foco visible siempre (outline amarillo grueso)
- ☐ Modo baja visión: amarillo `#ffd400` sobre negro, texto ≥ 1.6rem
- ☐ Recorrido completo con TalkBack sin mirar la pantalla: foto → escuchar → preguntar → respuesta
- ☐ Zoom nunca bloqueado

## Si trabajas contra el backend a medias

Mientras Axel afina los prompts, tú no dependes de él: el contrato JSON está fijo en `docs/01-proyecto/arquitectura-y-modulos.md`. Puedes probar con el botón "pega el texto" y cualquier texto burocrático.
