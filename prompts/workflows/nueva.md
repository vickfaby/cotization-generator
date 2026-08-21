---
description: Añadir funcionalidad — docs primero, luego código, luego checklist
---

Sigue `prompts/architect-brain.md` y ejecuta `On(task_start)` antes de tocar código.

## /nueva (Cursor)

Situación: vamos a añadir una funcionalidad o módulo.

Instrucciones:
1. Ejecuta `On(task_start)` (interrupción de seguridad).
2. Antes de tocar código:
   - Actualiza `docs/user-stories.md` (historia + criterios).
   - Actualiza `docs/roadmap.md` (nuevo ticket con definición de “done”).
   - Si aplica, actualiza `docs/blueprints.md` (patrón/restricción).
   - Si aplica, actualiza `docs/testing-strategy.md` (qué tests se van a escribir).
   - Si implica decisión no trivial, agrega ADR a `docs/decisions-log.md`.
3. Implementa la funcionalidad.
4. Escribe/actualiza tests acorde a `docs/testing-strategy.md`.
5. Al terminar, ejecuta `On(task_complete)` y muestra el checklist antidrift.

