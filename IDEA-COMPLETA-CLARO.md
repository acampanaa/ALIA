# CLARO — Contenido Legible y Accesible para Portoviejo

> **Documento de idea completa — Hackatón: Impacto global desde Portoviejo**
>
> **Propuesta de producto:** Plataforma de accesibilidad con IA para personas con discapacidad visual  
> **Equipo:** *(completar nombres)* · Portoviejo, Ecuador  
> **Estado:** Caso de estudio + spec para validación con agente IA y organizador

---

## Resumen ejecutivo (30 segundos)

**CLARO** convierte avisos, volantes e información pública — que hoy llegan como **imagen, PDF o texto complejo** — en **lectura fácil + audio**, y permite **preguntar por voz** sobre el contenido con respuestas que citan la fuente original.

Nace en **Portoviejo** para personas con **discapacidad visual** (baja visión y ceguera). Escala a cualquier territorio donde la información excluye a quien no puede leer.

**No es** un lector de pantalla genérico ni Google Translate. Es un **puente de acceso** entre información institucional no accesible y personas que necesitan escucharla y entenderla en lenguaje simple.

---

## 1. Público que englobamos (datos y perfiles)

### 1.1 Discapacidad foco del MVP

| Grupo | Descripción | Por qué entra en CLARO |
|---|---|---|
| **Personas con baja visión** | Disminución progresiva o parcial de la capacidad visual; dificultad para leer texto pequeño, bajo contraste o en pantalla | Necesitan **audio** y **texto simplificado con alto contraste** |
| **Personas con ceguera** (parcial o total) | No pueden leer volantes, PDFs escaneados ni imágenes de WhatsApp | Dependen de terceros; CLARO da **autonomía** con voz |
| **Adultos mayores con baja visión** | Solapamiento frecuente: edad + enfermedades (diabetes, cataratas) | Mismo flujo; beneficio colateral sin cambiar el producto |

### 1.2 Beneficiarios colaterales (sin ampliar scope técnico)

| Grupo | Cómo se beneficia |
|---|---|
| **Personas con baja alfabetización** | Lectura fácil les sirve igual |
| **Cuidadores y familiares** | Menos carga de “leer todo en voz alta” |
| **Población rural de Manabí** | Avisos que llegan solo por foto en WhatsApp |

### 1.3 Quién NO es el foco del MVP (declarar al jurado)

| Grupo | Motivo de exclusión en v1 |
|---|---|
| Personas sordas / hipoacúsicas | Requiere lengua de señas o subtitulado — otro producto |
| Discapacidad intelectual severa | Necesita pictogramas y UX especializada — fuera de tiempo |
| Discapacidad motriz | Problema de navegación física, no de comprensión de avisos |
| Accesibilidad web completa de portales gubernamentales | Scope de meses, no de hackatón |

---

## 2. Datos de contexto (validación del problema)

> **Nota:** Completar cifras oficiales antes del pitch con [INEC Ecuador](https://www.ecuadorencifras.gob.ec) (Censo 2022 — discapacidad) y [CONADIS](https://www.conadis.gob.ec). Abajo: marco cualitativo + placeholders para datos.

### 2.1 Ecuador y discapacidad visual

| Dato | Valor / fuente |
|---|---|
| Población con alguna discapacidad (Ecuador, Censo 2022) | *Completar: INEC — resultados Censo 2022, tabla discapacidad* |
| Prevalencia de discapacidad visual / dificultad para ver | *Completar: INEC — tipo de discapacidad* |
| Personas que no usan internet por barreras | ODS 4 / inclusión digital — *completar si hay dato Manabí* |

**Frase para pitch (ajustar con cifra real):**
> *"En Ecuador, más de [X] personas reportan dificultad para ver o usar información escrita. Muchos avisos de salud y servicios siguen llegando en formatos que excluyen a quien no lee con facilidad."*

### 2.2 Portoviejo y Manabí — contexto local

| Realidad local | Implicación para CLARO |
|---|---|
| Avisos de salud, educación y municipio en **volantes, fotos y PDFs** | Formato **no accesible** por defecto |
| Uso masivo de **WhatsApp** para comunicar trámites y citas | Las fotos borrosas son la “barrera digital” real |
| Envejecimiento poblacional en zonas urbanas de Manabí | Más personas con baja visión sin acceso a lectores especializados |
| Centros de salud y unidades educativas con comunicados impresos | Caso de uso demo **inmediato y creíble** |

### 2.3 Testimonio tipo (caso de estudio narrativo)

**Doña Elena, 68 años — Portoviejo**

- Vive sola parte del día; su hija trabaja.
- **Baja visión** por diabetes; ya no distingue letra pequeña.
- El centro de salud le manda por WhatsApp una **foto** del cronograma de controles.
- **Hoy:** espera horas a que alguien se la lea.
- **Con CLARO:** sube la foto, escucha el resumen, pregunta *“¿qué día me toca?”* y obtiene respuesta en voz y texto simple.

**Problema validado:** no es falta de smartphone — es **formato de información excluyente**.

---

## 3. Alineación con el reto de la hackatón

### 3.1 Pista

**Impacto global desde Portoviejo** — Solución nacida en Portoviejo que escala al mundo, ligada a la Agenda 2030.

### 3.2 ODS declarados

| ODS | Nombre | Cómo lo mueve CLARO |
|---|---|---|
| **ODS 10** *(principal)* | Reducir las desigualdades | Acceso equitativo a información para personas con discapacidad visual |
| **ODS 4** *(secundario)* | Educación de calidad e inclusión digital | Contenidos comprensibles (lectura fácil) y acceso digital por audio/voz |

**Eje temático del organizador:** *Accesibilidad con IA: audio descripciones, traducción, lectura fácil o interfaces por voz para personas con discapacidad.*

### 3.3 Requisitos del organizador — cómo los cumplimos

| Requisito | Cumplimiento CLARO |
|---|---|
| Declarar ODS principal | ODS 10 (+ ODS 4 secundario) |
| Validar problema con datos o testimonios | Sección 2 + caso Doña Elena + dato INEC *(completar)* |
| Prototipo utilizable extremo a extremo | Flujo: foto/texto → lectura fácil → audio → pregunta voz |
| Repositorio accesible con código | GitHub + README obligatorio |
| Usar OpenAI (GPT, Codex, Agents SDK opcional) | Ver sección 8 |
| README: ODS, métrica, escalabilidad, herramientas OpenAI | Plantilla sección 9 |
| Privacidad en datos sensibles | No almacenar datos de salud; procesamiento en sesión |
| Citar fuentes en salud/educación/seguridad | Badge “Fuente: documento original” en respuestas Q&A |

---

## 4. Propuesta de valor

| Antes (sin CLARO) | Con CLARO |
|---|---|
| Foto de volante ilegible | Texto extraído y simplificado |
| Esperar a un familiar | **Autonomía** en minutos |
| Jerga institucional | **Lectura fácil** (~6.º grado) |
| Solo lectura visual | **Audio** + interfaz por **voz** |
| “No entiendo qué me piden” | Preguntas: *“¿Qué día voy?”* con respuesta citada |

**Diferenciador vs ChatGPT pegando foto:** CLARO está diseñado para **accesibilidad** (lectura fácil, TTS, voz, alto contraste, citas al documento), no conversación genérica.

---

## 5. Identidad del producto

**CLARO** = *Contenido Legible y Accesible para Recursos de Portoviejo* (nombre provisional).

**Principio rector:**
> **Pocos módulos, extremo a extremo, accesibles.**

**CLARO NO es:**
- Traductor universal de 50 idiomas
- Lengua de señas
- Portal completo del municipio
- Diagnóstico médico

**CLARO SÍ es:**
- Puente entre **un aviso concreto** y **una persona que no puede leerlo**

---

## 6. Módulos del MVP (4 módulos — bien hechos)

```
[Entrada]     Usuario sube FOTO o pega TEXTO del aviso
      │
      ▼
[Módulo 1]    EXTRAER — entender el contenido original
      │
      ▼
[Módulo 2]    CLARIFICAR — lectura fácil + resumen + puntos clave
      │
      ▼
[Módulo 3]    ESCUCHAR — audio descripción / narración (TTS)
      │
      ▼
[Módulo 4]    PREGUNTAR — voz o texto → respuesta con cita a fuente
```

---

### Módulo 1 — Extraer contenido *(OBLIGATORIO)*

**Qué hace:** Recibe imagen (volante, captura WhatsApp) o texto pegado → devuelve texto estructurado del aviso.

**Entrada:**
- Imagen: JPG/PNG (foto de volante)
- Texto: copy-paste de comunicado

**Salida:**
- Texto extraído (OCR semántico si es imagen)
- Tipo detectado: `salud` | `educacion` | `municipal` | `general`
- Idioma: español (v1)

**OpenAI:** GPT-4o **Vision** (imagen) o GPT (texto)

**Demo:** Foto de cronograma vacunación / control diabetes — Portoviejo

---

### Módulo 2 — Lectura fácil *(OBLIGATORIO — corazón accesible)*

**Qué hace:** Transforma el texto en versión comprensible para personas con dificultad de lectura.

**Salida UI (obligatoria):**
- **Título** en lenguaje simple
- **Resumen** (3–5 líneas)
- **Puntos clave** (bullets): fechas, lugares, qué hacer
- **Nivel de lectura:** indicador “Lectura fácil”
- Tipografía grande, alto contraste (UI)

**Reglas de simplificación:**
- Oraciones cortas
- Sin jerga legal/médica sin explicar
- Fechas y horarios explícitos

**OpenAI:** GPT con **salida estructurada JSON**

---

### Módulo 3 — Escuchar *(OBLIGATORIO)*

**Qué hace:** Convierte resumen + puntos clave en audio.

**UI:**
- Botón grande **“Escuchar”** (accesible, mínimo 44px)
- Reproductor simple: play / pause
- Opcional: velocidad 0.8x / 1x / 1.2x

**OpenAI:** **TTS API** (voz natural en español)

**Por qué es crítico:** usuario con discapacidad visual **no depende de leer la pantalla**.

---

### Módulo 4 — Preguntar con voz *(OBLIGATORIO — demo “wow”)*

**Qué hace:** Usuario pregunta sobre el aviso; CLARO responde en lenguaje simple **citando el documento**.

**Entrada:**
- Voz (micrófono) → Whisper
- O texto en input accesible

**Ejemplos demo:**
- *“¿Qué día me toca el control?”*
- *“¿Dónde es el lugar?”*
- *“¿Qué documentos debo llevar?”*

**Salida:**
- Respuesta en texto simple + opción **escuchar respuesta**
- Badge: **Fuente: aviso original** (fragmento citado)
- Si no está en el documento: *“Esa información no aparece en el aviso. Te recomiendo llamar al [institución].”* — **nunca inventar**

**OpenAI:** **Whisper** + GPT con contexto del documento extraído

---

## 7. Lo que NO construimos (lista cerrada)

| Excluido | Motivo |
|---|---|
| Lengua de señas / avatar | Complejidad y tiempo |
| App nativa iOS/Android | Web responsive basta |
| Login / historial persistente | Privacidad + tiempo |
| Traducción multi-idioma completa | v1 solo ES; EN como “escala” en pitch |
| Accesibilizar sitios web enteros | Scope imposible |
| Diagnóstico o consejo médico | Solo interpretar el aviso, no medicina |
| Almacenar imágenes en servidor | Sesión local / no persistir datos sensibles |

---

## 8. Stack técnico y OpenAI (obligatorio documentar)

| Capa | Tecnología |
|---|---|
| Frontend | Next.js + Tailwind — **mobile-first, alto contraste, accesible** |
| Backend | API Routes Next.js |
| IA | **OpenAI API** (requerido por hackatón) |
| Deploy | Vercel |
| Repo | GitHub público |

### Herramientas OpenAI — uso en CLARO

| Herramienta | Uso | Módulo |
|---|---|---|
| **GPT-4o (texto)** | Lectura fácil, Q&A, JSON | 2, 4 |
| **GPT-4o Vision** | Extraer texto de fotos de volantes | 1 |
| **TTS API** | Narración del resumen | 3 |
| **Whisper API** | Entrada por voz | 4 |
| **Codex** | Desarrollo asistido durante hackatón | — |
| **Agents SDK** *(opcional)* | Orquestar pipeline extraer → simplificar → narrar → Q&A | Si hay tiempo |

### Endpoints API propuestos (contrato inicial)

```
POST /api/extract        → { image? | text? } → { rawText, docType }
POST /api/simplify       → { rawText } → { title, summary, keyPoints[] }
POST /api/speak          → { text } → audio stream o URL
POST /api/ask            → { question, documentContext } → { reply, citation }
```

*(Alternativa más simple: 2 endpoints `/api/process` y `/api/ask` si falta tiempo.)*

---

## 9. Métrica de impacto (para README y pitch)

**Indicador principal:**
> *Tiempo para acceder a información comprensible de un aviso institucional.*

| Métrica | Sin CLARO | Con CLARO | Cómo medirlo en demo |
|---|---|---|---|
| Tiempo hasta entender el aviso | Horas (depende de tercero) | **< 2 minutos** | Cronómetro en vivo |
| Autonomía | Requiere familiar | **Usuario solo** | Flujo demo sin ayuda |
| Comprensión | No accede | Lectura fácil + audio | Jurado escucha resumen |

**Indicador secundario (ODS 10):**
> *Reducción de barrera de acceso a información pública para personas con discapacidad visual.*

---

## 10. Escalabilidad: Portoviejo → mundo

| Fase | Territorio | Qué cambia |
|---|---|---|
| **v0 Hackatón** | Portoviejo | Demo con aviso salud/educación local |
| **v1** | Manabí | Plantillas por tipo de institución |
| **v2** | Ecuador | Integración CONADIS / centros de salud |
| **v3** | Global | Mismo pipeline en ES, EN, PT; cualquier aviso foto+texto |

**Mensaje pitch:**
> *“Si funciona para Doña Elena en Portoviejo, funciona para cualquier persona con baja visión que recibe un volante que no puede leer — en Nairobi, Madrid o Quito.”*

---

## 11. Flujo de demo (2 minutos — pitch)

```
[0:00–0:20]  PROBLEMA + ODS
  "Doña Elena no puede leer el aviso del centro de salud.
   ODS 10: igualdad de acceso a la información."

[0:20–0:35]  SOLUCIÓN
  "CLARO: foto → lectura fácil → audio → preguntas por voz."

[0:35–1:40]  DEMO EN VIVO
  1. Subir foto de volante (vacunación / control diabetes)
  2. Ver lectura fácil + puntos clave (texto grande)
  3. Botón Escuchar → audio
  4. Pregunta voz: "¿Qué día me toca?" → respuesta + fuente

[1:40–1:55]  IMPACTO + ESCALA
  "< 2 min autónomo. Nació en Portoviejo, escala a cualquier ciudad."

[1:55–2:00]  CIERRE
  "CLARO — porque la información debe ser para todos."
```

**Material demo:** 1 foto real o realista de aviso de salud/educación en Portoviejo (sin datos personales reales).

---

## 12. Privacidad y ética

- **No guardar** imágenes de documentos con datos de salud en servidor persistente
- Procesamiento en **sesión**; borrar al cerrar
- **No sustituir** consulta médica — disclaimer visible
- Respuestas Q&A **solo** sobre el documento cargado + cita obligatoria
- Evitar almacenar nombre, cédula u otros PII extraídos del aviso en logs

---

## 13. Definition of Done — MVP hackatón

### Funcional
- [ ] Subir foto O pegar texto → lectura fácil visible
- [ ] Botón Escuchar reproduce audio del resumen
- [ ] Pregunta (voz o texto) → respuesta con cita al aviso
- [ ] Flujo completo sin intervención manual del desarrollador

### Calidad
- [ ] UI alto contraste, botones grandes, mobile-first
- [ ] Loading states en cada paso
- [ ] No inventar información que no está en el aviso

### Entrega
- [ ] Repo GitHub público
- [ ] README con ODS, métrica, OpenAI tools, escalabilidad
- [ ] Desplegado en URL pública
- [ ] Demo ensayada 2+ veces

---

## 14. Equipo de 3 — reparto sugerido (borrador)

| Persona | Rol | Módulos |
|---|---|---|
| **Backend / IA** | APIs OpenAI, extract, simplify, ask, TTS | Módulos 1, 2, 4 API |
| **Frontend / UX accesible** | UI alto contraste, flujo, reproductor audio | Módulos 2 UI, 3, 4 UI |
| **Apoyo** | QA accesibilidad, pitch, dato INEC, pruebas voz | QA + GUION + buscar 1 cifra |

*(Ajustar nombres cuando el equipo confirme.)*

---

## 15. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Foto borrosa — OCR malo | Tener 2 avisos demo (uno limpio backup) |
| TTS lento | Pre-generar audio del caso demo |
| Alucinación en Q&A | Prompt estricto + solo contexto del doc |
| WiFi falla en demo | Audio y respuesta pre-cacheados como backup |
| Scope creep (traducción, señas) | Lista cerrada sección 7 |

---

## 16. Por qué esta idea puede funcionar (para el agente / jurado)

1. **Match directo** con eje “Accesibilidad con IA” del organizador  
2. **ODS claros** (10 + 4) con métrica medible en demo  
3. **Problema local creíble** (WhatsApp + volantes en Portoviejo)  
4. **Escala global obvia** (mismo problema en todo el mundo)  
5. **OpenAI nativo** (Vision + GPT + TTS + Whisper) — cumple requisito obligatorio  
6. **4 módulos acotados** — extremo a extremo en 6 horas  
7. **Impacto emocional** en demo (Doña Elena) — memorable para jurado  

---

## 17. Prompt para agente IA (copiar — validación de idea)

```
Analiza este documento: propuesta CLARO para hackatón "Impacto global desde Portoviejo".

Tareas:
1. Confirma si la idea es viable en ~6 horas con Next.js + OpenAI API.
2. Señala riesgos técnicos del MVP (4 módulos: extract, simplify, TTS, ask).
3. Sugiere si conviene 4 endpoints o 2 endpoints unificados.
4. Verifica alineación con ODS 10 y requisitos OpenAI del organizador.
5. NO ampliar scope (sin señas, sin multi-idioma, sin portal municipal completo).

Responde: viable sí/no, orden de implementación, y checklist Fase 0.
```

---

## 18. Próximos pasos del equipo

- [ ] Completar **1 dato INEC/CONADIS** en sección 2.1
- [ ] Elegir **1 aviso demo** (salud vs educación) y conseguir foto de prueba
- [ ] Confirmar nombre **CLARO** o alternativa
- [ ] Crear repo + README desde plantilla sección 9
- [ ] Repartir módulos entre 3 personas
- [ ] Ensayar demo 2 min

---

*Documento v1 — CLARO · Accesibilidad con IA · Portoviejo · ODS 10 + 4*  
*Para compartir con agente IA, compañeros y organizador.*
