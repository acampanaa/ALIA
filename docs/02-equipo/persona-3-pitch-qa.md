# 🧑‍🤝‍🧑 Plan de la PERSONA 3 — Pitch / Datos / QA

> **Si solo son Andrea y Axel:** estas tareas se reparten así — Axel absorbe pitch y datos (hora 4:00–5:00 de su plan) y Andrea absorbe el QA con TalkBack (hora 4:00–5:00 del suyo). Este archivo queda como guía de qué no puede faltar.

**Archivos que te pertenecen:** todo `docs/`, las slides, el video de respaldo.
**No tocas código** — tu valor está en que la demo y el pitch sean imparables.

## Tu misión

Que el pitch tenga **evidencia real** (cifras verificadas, métrica funcionando), que la demo tenga **plan B** (video de respaldo), y que la app haya sido **probada como la usaría una persona ciega**.

## Cronograma

| Hora | Tarea | ☐ |
|---|---|---|
| 0:00–1:00 | Conseguir 3–4 **documentos físicos reales** de Portoviejo (planilla de agua, trámite del GAD, receta, notificación escolar) — son el insumo de Axel y de la demo | ☐ |
| 1:00–2:30 | Verificar cifras: INEC Censo 2022 (discapacidad visual Ecuador/Manabí) y CONADIS (registros). Anotarlas con fuente en `docs/03-pitch/guion-pitch.md` | ☐ |
| 2:30–4:00 | Armar slides siguiendo `docs/03-pitch/guion-pitch.md`; preparar la historia de apertura | ☐ |
| 3:00 en adelante | QA continuo en celular real: cada vez que hay deploy nuevo, recorrer la app con TalkBack y reportar a Andrea | ☐ |
| 5:00–5:45 | Dirigir el ensayo: cronometrar el pitch, **grabar el video de respaldo** de la demo completa | ☐ |
| 5:45–6:00 | Checklist final pre-pitch (ver `docs/03-pitch/guion-pitch.md`) | ☐ |

## Reglas

- Ninguna cifra entra a las slides sin fuente verificable (INEC/CONADIS). Mejor "más de X mil registradas" con fuente que un número inventado.
- El video de respaldo se graba con la app **deployada en Vercel**, no localhost.
- QA se reporta por voz a la dueña del módulo (Andrea) — no editas código.
