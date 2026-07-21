# CODEX.md — ALIA

App de accesibilidad para hackathon de 6 horas: fotografías un documento y lo escuchas explicado en lenguaje claro. Usuarios objetivo: personas ciegas y con baja visión. ALIA = Accesibilidad, Lenguaje, Inclusión y Autonomía.

## Prioridad absoluta

**Velocidad de demo sobre perfección.** Nada de tests, nada de abstracciones, nada de features no pedidas. Si algo funciona para la demo, está terminado.

## Stack y estructura

- Next.js 15 App Router + TypeScript + Tailwind 4. Deploy en Vercel.
- `app/api/narrate` — foto/texto → GPT-4o visión → JSON estructurado (response_format json_schema)
- `app/api/ask` — pregunta + contexto → respuesta corta hablable
- `lib/openai.ts` — cliente OpenAI + system prompts + schema. Modelo: `gpt-4o`
- `lib/speech.ts` — TTS/STT del navegador (Web Speech API). STT solo funciona en Chrome
- `lib/readability.ts` — índice Fernández-Huerta (evidencia ODS del pitch)

## Reglas del proyecto

1. **Audio-first**: cada estado nuevo de la UI debe anunciarse por voz Y por `aria-live`. La app completa debe poder usarse sin ver la pantalla.
2. **Accesibilidad no negociable**: contraste AAA en modo baja visión, foco visible, labels en todo control, tamaños táctiles ≥ 64px, HTML semántico. La app de accesibilidad ES accesible — es parte del pitch.
3. Textos de UI y de voz en **español ecuatoriano cercano** ("toca aquí", no "haga clic").
4. Los prompts viven en `lib/openai.ts` — al ajustarlos, mantener la regla de "apto para ser escuchado": frases cortas, cero jerga, montos y fechas en palabras.
5. `OPENAI_API_KEY` en `.env.local` (nunca commitearla).
6. No hacer `git commit` sin que el equipo lo pida.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # verificar que compila antes de push
```

## Documentación

- `LEEME-PRIMERO.md` — onboarding del equipo y agentes (empezar aquí).
- `docs/01-proyecto/` — objetivo, funcionalidades y **reparto de módulos con dueños por archivo** (Andrea = frontend, Axel = backend/IA, Daniel = métrica `lib/readability.ts` + QA/pitch/apoyo). Respetar ese reparto al editar.
- `docs/02-equipo/` — plan hora a hora de cada persona.
- `docs/03-pitch/` — guion del pitch e idea completa.
- El contrato JSON entre frontend y backend está en `docs/01-proyecto/arquitectura-y-modulos.md` — no cambiarlo sin actualizar ambos módulos.
