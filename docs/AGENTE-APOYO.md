# Agente IA — Daniel (Persona 3 · QA / Pitch / Código de apoyo)

> **Repo:** `~/proyectos/ALIA` · **Producto:** ALIA  
> **Persona:** Daniel · tercer miembro del equipo

---

## PROMPT INICIAL

```
Eres el agente de Daniel para ALIA (hackatón Portoviejo).

REPO: ~/proyectos/ALIA

LEE:
1. LEEME-PRIMERO.md
2. docs/AGENTE-APOYO.md
3. docs/03-pitch/guion-pitch.md
4. docs/02-equipo/persona-3-pitch-qa.md

TU ROL (Daniel):
- MÓDULO DE CÓDIGO PROPIO: lib/readability.ts — la métrica de legibilidad Fernández-Huerta (evidencia ODS del pitch). La afinas, calibras y validas tú.
- QA TalkBack, documentos reales Portoviejo, cifras CONADIS, pitch, video respaldo
- TAMBIÉN puedes tocar el resto del código: bugs de QA, polish UI, apoyo frontend o backend
- Antes de editar un archivo de Andrea o Axel, avisa cuál vas a tocar

TAREAS:
1. Conseguir 2-3 documentos reales/anónimos Portoviejo (planilla agua, trámite)
2. Buscar cifras CONADIS discapacidad visual Ecuador/Manabí
3. QA con TalkBack en celular — y arreglar bugs que encuentres (con aviso)
4. Grabar video respaldo demo hora 5
5. Ayudar ensayo pitch 3 min

Confirma rol y empieza por documentos + CONADIS. Si hay bugs, corrígelos o pide ayuda.
```

---

## Tu rol

| Área | Responsabilidad |
|---|---|
| **Módulo propio: métrica de legibilidad** | `lib/readability.ts` — el índice Fernández-Huerta que sale en pantalla y en el pitch. Calibrarlo con textos reales y validar que original < claro siempre |
| **Documentos demo** | Conseguir papeles reales de Portoviejo para probar y presentar |
| **Datos CONADIS/INEC** | Cifras verificadas para el pitch |
| **QA TalkBack** | Probar la app como la usaría una persona ciega |
| **Pitch + video** | Slides, ensayo, video respaldo hora 5 |
| **Código de apoyo** | Arreglar bugs de QA, polish, ayudar en frontend o backend |

---

## Código — qué puedes tocar

Daniel **sí toca código**. Reglas para no chocar:

| Puedes | Regla |
|---|---|
| `lib/readability.ts` | **Módulo tuyo** — edita libre. Es la métrica del pitch: cuídala como evidencia |
| `docs/*`, slides | Dueño principal — edita libre |
| Cualquier otro archivo del repo | **Avisar antes** a Andrea (frontend) o Axel (backend) |
| Bugs encontrados en QA | Corregirlos tú o en pareja con quien sea dueño del archivo |
| Contrato JSON (`/api/narrate`, `/api/ask`) | **No cambiar campos** sin acordarlo con Andrea y Axel |

**Dueños principales (coordina con ellos):**
- Andrea → `app/page.tsx`, `components/*`, `lib/speech.ts`, `globals.css`
- Axel → `app/api/*`, `lib/openai.ts`
- Tú → `lib/readability.ts` (Axel solo la importa; si necesita otro campo, te lo pide)

---

## Tarea 1 — Documentos físicos para demo

Conseguir **2–3 papeles** de Portoviejo (sin datos personales visibles):

| Documento | Para demo |
|---|---|
| Planilla agua / EPAP | Pitch "cierren los ojos" |
| Aviso municipal / trámite | ODS 11 ciudades |
| Receta o aviso salud *(opcional)* | Salud + privacidad |

**Entregar a Axel** fotos claras para probar `/api/narrate` desde hora 1.

Marcar cuál es el **documento pre-probado** (el del pitch en vivo).

---

## Tarea 2 — Cifras CONADIS / INEC

Buscar en fuentes oficiales:

- Personas con discapacidad visual en **Ecuador**
- Si hay dato **Manabí** o nacional usable

**Entregar texto listo** para `docs/03-pitch/guion-pitch.md`:

> *"En Ecuador, [X] personas tienen discapacidad visual…"*

**No inventar cifras** — si no encuentras, decir "dato pendiente" al equipo.

---

## Tarea 3 — QA Checklist (TalkBack)

Usar **Android TalkBack** o **VoiceOver** en iPhone.

### Checklist rápido

- [ ] Botón "Fotografiar" tiene label y es activable
- [ ] Loading se anuncia por voz
- [ ] Resumen se escucha automáticamente
- [ ] Botón micrófono funciona
- [ ] Modo baja visión cambia contraste
- [ ] Métrica legibilidad es anunciada o visible
- [ ] App usable **sin mirar** (o arreglar lo que falla)

**Si encuentras un bug:** avisa en el grupo y **puedes corregirlo** en el archivo correspondiente (con aviso al dueño).

---

## Tarea 4 — Video respaldo (hora 5)

Grabar en celular **demo completa** (60–90 seg):

1. Foto documento
2. Escuchar narración
3. Pregunta voz
4. Mostrar legibilidad

Subir a Drive / AirDrop a Andrea y Axel. **Por si falla WiFi en pitch.**

---

## Tarea 5 — Pitch

Leer `docs/03-pitch/guion-pitch.md`. Ayudar a:

- Cronometrar 3 minutos
- Tener documento físico en mano del presentador
- Celular backup con video + URL Vercel

---

## Cronograma Daniel

| Hora | Acción |
|---|---|
| 0:00–0:45 | Clonar repo, `npm run dev`, verificar app |
| 0:45–2:00 | Buscar documentos + empezar CONADIS |
| 2:00–3:00 | Entregar fotos a Axel; **calibrar `lib/readability.ts`** con los textos reales (que original < claro siempre; ajustar etiquetas si hace falta) | 
| 3:00–4:00 | QA TalkBack — corregir o escalar bugs |
| 4:00–5:00 | Terminar CONADIS; ensayo pitch; apoyo en código si hace falta |
| 5:00–5:30 | **Grabar video respaldo** |
| 5:30–6:00 | QA final + presente en ensayo |

---

## Checklist final

- [ ] `lib/readability.ts` calibrada con documentos reales (original < claro siempre)
- [ ] 2+ documentos demo entregados
- [ ] 1+ cifra CONADIS verificada
- [ ] QA TalkBack documentado (y bugs corregidos o reportados)
- [ ] Video respaldo grabado
- [ ] Pitch ensayado 1 vez

---

## Mensaje para el grupo (cuando termines CONADIS)

> *"Cifra lista: [texto]. Documentos: [lista]. QA: [X bugs, Y corregidos]. Video: [sí/no]."*
