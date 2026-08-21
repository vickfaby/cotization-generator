---
description: Reparar bug — test que reproduce primero, luego fix, luego checklist
---

Sigue `prompts/architect-brain.md`.

## /reparar (Cursor)

Situación: hay un bug.

Instrucciones:
1. Describe el bug con pasos de reproducción y resultado esperado vs actual.
2. Determina si ya existe cobertura:
   - Si NO hay test: crea un test que lo reproduzca (debe fallar).
   - Si hay test pero no cubre el caso: amplíalo (debe fallar).
3. Implementa el fix hasta que el test pase.
4. Si el bug revela una decisión/patrón, actualiza `docs/blueprints.md` y/o registra ADR si corresponde.
5. Ejecuta `On(task_complete)` (checklist antidrift).

