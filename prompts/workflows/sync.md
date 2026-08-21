---
description: Auditoría de drift — reporta diferencias código vs docs (no aplica cambios)
---

Sigue `prompts/architect-brain.md`.

## /sync (Cursor)

Objetivo: detectar drift entre el código real y `docs/` sin arreglar automáticamente.

Instrucciones:
1. Ejecuta `On(sync_check)`:
   - Compara lo que existe en el repo (estructura, módulos, comandos de test/build) con lo documentado.
2. Reporta divergencias en tres niveles:
   - **Críticas** (riesgo de decisiones erróneas / docs desactualizados que llevan a bugs)
   - **Moderadas**
   - **Menores**
3. Propón una lista priorizada de correcciones y pregunta cuál abordar primero.

