# Agente IA — Andrea (Frontend / UX accesible)

> **Repo:** `~/proyectos/ALIA` · **Producto:** ALIA  
> **Copia el PROMPT INICIAL al abrir tu chat con el agente.**

---

## PROMPT INICIAL

```
Eres el agente frontend para ALIA (hackatón Portoviejo — Accesibilidad con IA).

REPO: ~/proyectos/ALIA — Next.js 15 + Tailwind 4 YA scaffoldeado con componentes base.

LEE:
1. LEEME-PRIMERO.md
2. docs/AGENTE-ANDREA.md
3. docs/02-equipo/andrea-frontend.md (tu cronograma)
4. README.md, app/page.tsx, components/, lib/speech.ts

PRODUCTO: app AUDIO-FIRST para personas CIEGAS — fotografían documento → escuchan explicación → preguntan por voz.

TU ROL:
- app/page.tsx (pantalla única)
- components/ (BotonGigante, IndicadorVoz, ResultadoDocumento)
- lib/speech.ts (TTS/STT Web Speech API)
- Modo baja visión (contraste AAA)
- Deploy Vercel desde hora 0:30
- Auditoría TalkBack hora 4-5

NO tocar: app/api/, lib/openai.ts (Axel) ni lib/readability.ts (Daniel)

Demo en CHROME (STT). Deploy Vercel siempre.

Confirma rol y checklist F1-F7 de docs/01-proyecto/objetivo-y-funcionalidades.md. Ejecuta.
```

---

## Tu rol

ALIA debe usarse **sin mirar la pantalla** (TalkBack) o con **mínima visión** (modo alto contraste).

| Funcionalidad | ID | Está hecha cuando… |
|---|---|---|
| Fotografiar documento | F1 | Foto celular → `/api/narrate` → JSON |
| Narración audio | F2 | Al llegar resultado, TTS automático |
| Preguntas por voz | F3 | Mic → STT → `/api/ask` → respuesta hablada |
| Modo baja visión | F4 | Toggle texto ≥1.6rem, amarillo/negro AAA |
| Métrica legibilidad | F5 | Índice antes/después visible |
| Accesibilidad app | F6 | TalkBack usable, foco, aria-live |

---

## Carpetas — SOLO tuyas

```
app/page.tsx
app/layout.tsx
app/globals.css
components/BotonGigante.tsx
components/IndicadorVoz.tsx
components/ResultadoDocumento.tsx
lib/speech.ts              → hablar() / escuchar()
```

**NO tocar:**
```
app/api/**
lib/openai.ts              (Axel)
lib/readability.ts         (Daniel calcula; tú muestras)
```

---

## Flujo UI (pantalla única)

```
[Estado: inicio]
  → Botón gigante "Fotografiar documento" (accesible)
  → O pegar texto
  → Loading anunciado por voz ("Procesando documento...")

[Estado: resultado]
  → TTS automático del resumen (F2)
  → ResultadoDocumento: datos clave + legibilidad antes/después
  → Toggle modo baja visión (F4)
  → Botón micrófono "Hacer pregunta" (F3)

[Estado: escuchando pregunta]
  → IndicadorVoz activo
  → POST /api/ask
  → hablar(respuesta)
```

---

## lib/speech.ts — tu dominio

- `hablar(texto)` — Web Speech API TTS español
- `escuchar()` — STT → Promise<string>
- **Solo Chrome** confiable para demo
- Anunciar estados con `aria-live="polite"`

---

## Modo baja visión (F4)

- Texto **≥ 1.6rem**
- **Amarillo (#FFFF00) sobre negro (#000000)** — contraste AAA
- Toggle accesible con label claro
- Botones mínimo **44×44px**

---

## Deploy — CRÍTICO

| Hora | Acción |
|---|---|
| **0:30** | Primer deploy Vercel |
| Tras cada feature | Re-deploy |
| **5:45** | URL final para jurado |

Cámara en móvil necesita **HTTPS** → Vercel, no localhost.

---

## Cronograma (de docs/02-equipo/andrea-frontend.md)

| Hora | Tarea |
|---|---|
| 0:00–0:30 | `npm install`, dev, **primer deploy Vercel** |
| 0:30–2:00 | Captura foto móvil, loading + TTS |
| 2:00–3:00 | Resultado + modo baja visión |
| 3:00–4:00 | Flujo voz completo mic → ask → hablar |
| 4:00–5:00 | **TalkBack** audit — sin mirar pantalla |
| 5:00–5:45 | Ensayo demo con Axel + **video respaldo** |
| 5:45–6:00 | Deploy final |

---

## Checklist Andrea

- [ ] F1–F7 de docs/01-proyecto/objetivo-y-funcionalidades.md completos
- [ ] TalkBack recorre app sin bloqueos
- [ ] TTS arranca solo al recibir resumen
- [ ] STT funciona en Chrome móvil
- [ ] Modo baja visión legible
- [ ] Vercel URL en README
- [ ] Video respaldo hora 5

---

## Si Daniel está en el equipo

- Él hace QA TalkBack en **segundo celular** (hora 3+) y **puede corregir bugs** en código (avisando antes)
- Él consigue documentos físicos para demo
- Coordinar antes de editar el mismo archivo al mismo tiempo

---

## Referencias

- `docs/02-equipo/andrea-frontend.md` — cronograma
- `docs/03-pitch/guion-pitch.md` — qué debe funcionar en demo en vivo
- `components/` — ya scaffoldeado, extender no reescribir
