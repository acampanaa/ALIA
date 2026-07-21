# Integración frontend — Modo enfoque

El modo enfoque usa `resultado.proximosPasos`; no requiere otra llamada a OpenAI ni cambios de backend.

## Objetivo

Presentar una sola acción del documento a la vez para reducir la carga de información y permitir que la persona avance a su ritmo.

## Cuándo mostrarlo

- Mostrar el botón `Modo enfoque` solo si `proximosPasos.length > 0`.
- Al tocarlo, iniciar en `proximosPasos[0]` y ocultar temporalmente el resumen largo, los datos clave y la lista completa de pasos.
- Si no hay pasos, no mostrar el botón.

## Controles mínimos

1. Texto grande: `Paso 1 de 3` y el contenido del paso actual.
2. `Escuchar este paso otra vez`.
3. `Siguiente paso` mientras haya otro paso.
4. `Volver al resumen` al terminar o cuando la persona lo solicite.

No añadir temporizadores, cuentas, recordatorios ni almacenamiento: el modo existe solo durante la lectura del documento actual.

## Voz y accesibilidad

- Al entrar, anunciar: `Modo enfoque. Paso 1 de N. [paso actual]`.
- Al avanzar, cancelar el audio anterior y anunciar solo el nuevo paso.
- Usar botones de al menos 64 px, foco visible y etiquetas claras para TalkBack.
- Mantener el paso actual en una región `aria-live="polite"`.
- No reproducir todo el resumen antes de cada paso; la persona controla el ritmo.

## Pruebas manuales

1. Planilla con tres pasos: avanzar hasta el final y volver al resumen.
2. Documento con un solo paso: no mostrar `Siguiente paso`.
3. Navegar sin mirar la pantalla con teclado o TalkBack.
4. Confirmar que salir del modo enfoque devuelve los controles normales: escuchar, preguntas rápidas, micrófono y nuevo documento.
