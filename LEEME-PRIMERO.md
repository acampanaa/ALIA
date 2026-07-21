# LEEME PRIMERO — Proyecto ALIA

> **Si eres un agente IA o un miembro del equipo: empieza aquí.**

**Carpeta del repo:** `~/proyectos/ALIA`  
**Producto:** **ALIA** — *Accesibilidad, Lenguaje, Inclusión y Autonomía* · *"Tecnología que se adapta a ti"*  
**Hackatón:** Impacto global desde Portoviejo · Accesibilidad con IA  
**ODS:** 10 (principal) + 11 (secundario)

---

## Qué estamos haciendo (lo esencial)

**ALIA** ayuda a **personas ciegas y con baja visión** a entender documentos impresos (planillas, trámites, recetas, avisos) que hoy **no pueden leer**.

1. **Fotografían** el documento (o pegan texto)
2. La IA lo **explica en lenguaje claro** (pensado para escucharse, no para leerse)
3. La app **narra en voz alta** (Web Speech API)
4. Preguntan **por voz**: *"¿cuánto pago?"* → respuesta hablada
5. Muestra **métrica de legibilidad** antes/después (evidencia ODS)

**Problema:** el papel es invisible para quien no ve. Depende de terceros → pierde autonomía y privacidad.

**Caso narrativo:** Doña Elena, 68 años, Portoviejo — recibe foto de planilla/receta por WhatsApp, no puede leerla.

---

## Paso 1 — ¿Quién eres?

| Si dices… | Lee este archivo |
|---|---|
| **Soy Axel** | [`docs/AGENTE-AXEL.md`](docs/AGENTE-AXEL.md) |
| **Soy Andrea** | [`docs/AGENTE-ANDREA.md`](docs/AGENTE-ANDREA.md) |
| **Soy Daniel** (Persona 3) | [`docs/AGENTE-APOYO.md`](docs/AGENTE-APOYO.md) |

---

## Paso 2 — Documentos del repo (orden de lectura)

| # | Archivo | Para qué |
|---|---|---|
| 1 | `LEEME-PRIMERO.md` | Este archivo |
| 2 | `README.md` | Qué es ALIA + cómo correr |
| 3 | `docs/01-proyecto/` | Objetivo, funcionalidades, arquitectura |
| 4 | `docs/02-equipo/` | Cronograma 6 h por persona |
| 5 | `docs/03-pitch/guion-pitch.md` | Guión presentación + ODS |
| 6 | `docs/AGENTE-*.md` | Tareas por persona / agente IA |

---

## Reparto de archivos — regla de oro

**Cada archivo tiene UN dueño principal. Si otro toca el mismo archivo, avisa antes.**

| Dueño principal | Archivos | Coordinar con |
|---|---|---|
| **Andrea** (frontend) | `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/*`, `lib/speech.ts` | Axel si cambia el contrato JSON |
| **Axel** (backend/IA) | `app/api/narrate/route.ts`, `app/api/ask/route.ts`, `lib/openai.ts` | Andrea si cambia el contrato JSON |
| **Daniel** (QA / pitch / código) | **`lib/readability.ts`** (métrica ODS — módulo de código propio) · `docs/*`, slides, video respaldo · también bugs QA/polish en otros archivos | Andrea o Axel según el archivo — **avisar antes de editar** lo que no es suyo |

El contrato entre frontend y backend está en [`docs/01-proyecto/arquitectura-y-modulos.md`](docs/01-proyecto/arquitectura-y-modulos.md). **No cambiar campos JSON sin avisar.**

---

## Arquitectura ya scaffoldeada (NO reinventar)

```
app/page.tsx                 → pantalla única audio-first          [Andrea]
app/api/narrate/route.ts     → foto/texto → IA visión → JSON       [Axel]
app/api/ask/route.ts         → pregunta + contexto → respuesta     [Axel]
lib/openai.ts                → prompts + schema                     [Axel]
lib/readability.ts           → índice Fernández-Huerta (ODS)        [Daniel]
lib/speech.ts                → TTS/STT Web Speech API             [Andrea]
components/                  → BotonGigante, IndicadorVoz, etc.     [Andrea]
```

**Stack:** Next.js 15 · Tailwind 4 · OpenAI GPT-4o (visión) · Web Speech · Vercel

---

## ✅ Backend de IA — OpenAI

El backend corre sobre **OpenAI GPT-4o** (visión + structured outputs) en `lib/openai.ts`, con **Codex** como asistente de desarrollo. Clave en `.env.local`: `OPENAI_API_KEY` (también en Vercel). No cambiar de proveedor sin decisión del equipo.

---

## Público que englobamos

| Grupo | En MVP |
|---|---|
| Personas **ciegas** | ✅ Principal |
| Personas con **baja visión** | ✅ Modo alto contraste + texto grande |
| Adultos mayores con baja visión | ✅ Mismo flujo |
| Sordos / lengua de señas | ❌ Fuera de MVP |
| Accesibilidad web completa | ❌ Fuera de MVP |

---

## 4 módulos (extremo a extremo)

| # | Módulo | Dueño | Archivo |
|---|---|---|---|
| 1 | **Capturar** documento | Andrea | `app/page.tsx` + cámara |
| 2 | **Narrar** en lenguaje claro | Axel | `POST /api/narrate` |
| 3 | **Escuchar** + modo baja visión | Andrea | `lib/speech.ts` + `ResultadoDocumento` |
| 4 | **Preguntar** por voz | Andrea + Axel | micrófono + `POST /api/ask` |

---

## Reglas del equipo

1. **Deploy Vercel desde hora 0:30** — nunca demo solo en localhost
2. **Chrome obligatorio** para STT en demo
3. **TalkBack** para auditoría accesibilidad (Andrea / Daniel)
4. **1 documento pre-probado** + video respaldo hora 5
5. **No inventar** respuestas fuera del documento
6. **No scope creep:** sin señas, sin traductor universal, sin portal municipal entero
7. **`git pull` antes de cada push** — commits pequeños en `main`

---

## Mensajes listos para el agente (copiar)

### Axel
```
Soy Axel. Repo: ~/proyectos/ALIA (producto ALIA).
Lee LEEME-PRIMERO.md y docs/AGENTE-AXEL.md.
Backend/IA: /api/narrate, /api/ask, prompts, métrica legibilidad, pitch CONADIS.
Confirma rol y orden. No toco UI salvo emergencia.
```

### Andrea
```
Soy Andrea. Repo: ~/proyectos/ALIA (producto ALIA).
Lee LEEME-PRIMERO.md y docs/AGENTE-ANDREA.md.
Frontend accesible audio-first: page.tsx, componentes, TTS/STT, TalkBack, deploy Vercel.
Confirma rol. No toco lib/openai.ts ni prompts sin coordinar con Axel.
```

### Daniel
```
Soy Daniel (Persona 3). Repo: ~/proyectos/ALIA (ALIA).
Lee LEEME-PRIMERO.md y docs/AGENTE-APOYO.md.
Mi módulo de código: lib/readability.ts (métrica ODS).
QA TalkBack, documentos reales Portoviejo, cifras CONADIS, pitch, video respaldo.
También puedo tocar otro código (bugs, polish, apoyo) — aviso a Andrea o Axel antes de editar su archivo.
```

---

## Sync points (equipo completo)

| Hora | Verificar |
|---|---|
| **0:30** | Deploy Vercel live |
| **2:00** | Foto → narración audio funciona |
| **4:00** | Pregunta por voz funciona |
| **5:00** | Video respaldo grabado |
| **5:45** | Demo + pitch ≤ 3 min |

---

*ALIA = nombre del producto y del repo*
