# ALIA 🎧📄

> **A**ccesibilidad, **L**enguaje, **I**nclusión y **A**utonomía
> *Tecnología que se adapta a ti.*

> **"Cualquier papel, en tus oídos"** — Hackathon Portoviejo · Reto: Accesibilidad con IA · ODS 10 y 11

Una web app para **personas ciegas y con baja visión**: fotografías cualquier documento impreso (trámite, planilla, receta, notificación) y ALIA te lo **explica en audio con lenguaje claro**, responde tus **preguntas por voz** y ofrece un **modo baja visión** con texto gigante de alto contraste.

## El problema

Un documento impreso es completamente inaccesible para una persona ciega: los lectores de pantalla no funcionan con papel. Hoy dependen de que alguien más les lea sus documentos — perdiendo **autonomía y privacidad** sobre su salud, sus deudas y sus derechos.

## Cómo funciona

1. 📷 **Fotografía** el documento (o pega su texto)
2. 🧠 Claude (visión) lo identifica, lo **simplifica a lenguaje claro** y extrae los datos clave
3. 🔊 La app lo **narra en voz alta** (Web Speech API, en el navegador)
4. 🎤 Preguntas por voz: *"¿cuánto tengo que pagar?"* → respuesta hablada
5. 📊 Cada documento muestra su **índice de legibilidad antes/después** (Fernández-Huerta) — la evidencia de impacto ODS

## Correr el proyecto

```bash
cp .env.local.example .env.local   # y pon tu ANTHROPIC_API_KEY
npm install
npm run dev
```

Abrir http://localhost:3000 en **Chrome** (el reconocimiento de voz solo funciona en Chrome). Para probar la cámara desde el celular, hacer deploy en Vercel (o usar la IP local con HTTPS).

## Stack

- **Next.js 15** (App Router) + Tailwind CSS 4
- **API de Claude** (`claude-sonnet-5`) — visión + lenguaje claro + Q&A, con structured outputs
- **Web Speech API** — TTS y STT gratis en el navegador, español
- Deploy en **Vercel**

## Documentos del proyecto

| Archivo | Para qué |
|---|---|
| [`LEEME-PRIMERO.md`](./LEEME-PRIMERO.md) | **Empieza aquí** — onboarding del equipo y agentes IA |
| [`docs/01-proyecto/objetivo-y-funcionalidades.md`](./docs/01-proyecto/objetivo-y-funcionalidades.md) | Qué construimos y criterios de "hecho" |
| [`docs/01-proyecto/arquitectura-y-modulos.md`](./docs/01-proyecto/arquitectura-y-modulos.md) | Dueños por archivo + contrato JSON (no romper sin avisar) |
| [`docs/02-equipo/andrea-frontend.md`](./docs/02-equipo/andrea-frontend.md) | Plan hora a hora — Andrea (frontend) |
| [`docs/02-equipo/axel-backend.md`](./docs/02-equipo/axel-backend.md) | Plan hora a hora — Axel (backend/IA) |
| [`docs/02-equipo/persona-3-pitch-qa.md`](./docs/02-equipo/persona-3-pitch-qa.md) | Plan hora a hora — Daniel (QA, pitch, código de apoyo) |
| [`docs/03-pitch/guion-pitch.md`](./docs/03-pitch/guion-pitch.md) | Guión del pitch y evidencia ODS |
| [`docs/AGENTE-AXEL.md`](./docs/AGENTE-AXEL.md) | Instrucciones agente IA — Axel |
| [`docs/AGENTE-ANDREA.md`](./docs/AGENTE-ANDREA.md) | Instrucciones agente IA — Andrea |
| [`docs/AGENTE-APOYO.md`](./docs/AGENTE-APOYO.md) | Instrucciones agente IA — Daniel |
