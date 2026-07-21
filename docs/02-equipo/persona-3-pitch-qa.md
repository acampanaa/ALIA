# 🧑‍🤝‍🧑 Plan de DANIEL — QA / Pitch / Código de apoyo

> **Daniel** = Persona 3 del equipo. Además de pitch y QA, **puede tocar código** (bugs, polish, apoyo).

**Archivos donde eres dueño principal:** todo `docs/`, las slides, el video de respaldo.

**Código:** puedes editar cualquier archivo del repo para bugs de QA o apoyo — **avisa a Andrea o Axel** antes de tocar sus archivos.

## Tu misión

Que el pitch tenga **evidencia real** (cifras verificadas, métrica funcionando), que la demo tenga **plan B** (video de respaldo), que la app haya sido **probada como la usaría una persona ciega**, y que los **bugs de QA se corrijan** (tú o en pareja con quien sea dueño del archivo).

## Cronograma

| Hora | Tarea | ☐ |
|---|---|---|
| 0:00–1:00 | Conseguir 3–4 **documentos físicos reales** de Portoviejo (planilla de agua, trámite del GAD, receta, notificación escolar) — insumo de Axel y de la demo | ☐ |
| 1:00–2:30 | Verificar cifras: INEC Censo 2022 (discapacidad visual Ecuador/Manabí) y CONADIS (registros). Anotarlas con fuente en `docs/03-pitch/guion-pitch.md` | ☐ |
| 2:30–4:00 | Armar slides siguiendo `docs/03-pitch/guion-pitch.md`; preparar la historia de apertura | ☐ |
| 3:00 en adelante | QA continuo en celular real: cada deploy nuevo → TalkBack → **corregir bugs o avisar a Andrea/Axel** | ☐ |
| 5:00–5:45 | Dirigir el ensayo: cronometrar el pitch, **grabar el video de respaldo** de la demo completa | ☐ |
| 5:45–6:00 | Checklist final pre-pitch (ver `docs/03-pitch/guion-pitch.md`) | ☐ |

## Reglas

- Ninguna cifra entra a las slides sin fuente verificable (INEC/CONADIS). Mejor "más de X mil registradas" con fuente que un número inventado.
- El video de respaldo se graba con la app **deployada en Vercel**, no localhost.
- Antes de editar `app/page.tsx`, `components/*`, `lib/speech.ts` → avisa a **Andrea**.
- Antes de editar `app/api/*`, `lib/claude.ts`, `lib/readability.ts` → avisa a **Axel**.
- No cambiar el contrato JSON de las APIs sin acordarlo con Andrea y Axel.
