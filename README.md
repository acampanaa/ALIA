# Clarito 🎧📄

> **"Cualquier papel, en tus oídos"** — Hackathon Portoviejo · Reto: Accesibilidad con IA · ODS 10 y 11

Una web app para **personas ciegas y con baja visión**: fotografías cualquier documento impreso (trámite, planilla, receta, notificación) y Clarito te lo **explica en audio con lenguaje claro**, responde tus **preguntas por voz** y ofrece un **modo baja visión** con texto gigante de alto contraste.

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

- [`PLAN.md`](./PLAN.md) — cronograma de las 6 horas y reparto Andrea/Axel
- [`PITCH.md`](./PITCH.md) — guion del pitch y evidencia ODS
