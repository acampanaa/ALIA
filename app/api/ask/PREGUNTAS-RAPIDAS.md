# Integración frontend — Preguntas rápidas

Esta mejora **no requiere cambios de backend**. Cada botón reutiliza el contrato actual de `POST /api/ask`.

## Botones iniciales

Mostrar estos botones únicamente cuando exista un documento procesado:

1. `¿Cuánto tengo que pagar?`
2. `¿Hasta cuándo tengo plazo?`
3. `¿Dónde debo pagar o ir?`

## Llamada a la API

Al tocar un botón, enviar el mismo contexto que se usa para la pregunta por voz:

```ts
const contexto = `${resultado.textoCompleto}\n\nResumen: ${resultado.resumenClaro}`;

await fetch("/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pregunta, contexto }),
});
```

La respuesta sigue siendo:

```json
{ "respuesta": "…prosa corta para escuchar…" }
```

## Accesibilidad y voz

- Botones táctiles de al menos 64 px, texto grande y foco visible.
- Al tocarlos, anunciar: `Pregunta seleccionada. Buscando la respuesta.`
- Mientras responde, deshabilitar los tres botones y el micrófono para evitar solicitudes simultáneas.
- Cuando llegue la respuesta, mostrarla, actualizar `aria-live` y narrarla con `hablar(respuesta)`.
- Si la información no aparece en el documento, conservar la respuesta honesta del backend; no ocultarla ni inventar un dato.

## Prueba manual

Con una planilla que incluya monto, plazo y lugar:

1. Tocar cada botón y comprobar que obtiene una respuesta basada en el documento.
2. Probar un documento sin lugar de pago: ALIA debe decir que no consta.
3. Navegar los botones con teclado y TalkBack sin mirar la pantalla.
