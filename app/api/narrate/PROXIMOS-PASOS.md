# Integración frontend — Próximos pasos

`POST /api/narrate` ahora incluye el campo aditivo `proximosPasos`:

```json
{
  "proximosPasos": [
    "Paga doce dólares con cincuenta centavos.",
    "Hazlo hasta el quince de agosto.",
    "Acude a las oficinas de EPAP."
  ]
}
```

El backend solo incluye acciones explícitas del documento. Si no existen, devuelve `[]`.

## Uso en frontend

- Mostrar el bloque solo si `resultado.proximosPasos.length > 0`.
- Título sugerido: `Lo importante: qué debes hacer`.
- Presentar cada paso como texto grande y, al llegar el resultado, incluirlo en la narración después del resumen.
- No presentar estos pasos como consejo médico, legal o financiero: son instrucciones extraídas del documento original.
- Mantener el bloque accesible con HTML semántico y `aria-live` existente.

## Prueba manual

1. Planilla: debe devolver pagar, plazo y lugar.
2. Aviso informativo sin instrucciones: debe devolver una lista vacía.
3. Receta: debe repetir solo la indicación escrita, sin agregar recomendaciones médicas.
