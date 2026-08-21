---
description: Cambiar una decisión — nueva ADR, marcar superseded, propagar cambios
---

Sigue `prompts/architect-brain.md`.

## /decidir (Cursor)

Situación: queremos cambiar una decisión pasada (stack, runner de tests, arquitectura, alcance de testing).

Instrucciones:
1. Identifica la decisión actual (referencia a ADR si existe).
2. Pregunta solo lo mínimo para definir el cambio (qué cambia y por qué).
3. Ejecuta `On(revisit_decision)`:
   - Crea una ADR nueva en `docs/decisions-log.md`.
   - Marca la ADR anterior como “Superseded by ADR-XXX” (sin borrar el histórico).
4. Propaga el cambio a los SSOT afectados:
   - `docs/architecture.md`
   - `docs/testing-strategy.md`
   - `docs/blueprints.md`
   - `docs/roadmap.md` (tickets de migración)
5. Si el cambio implica refactors/migraciones, crea tickets explícitos con criterios y plan.
6. Ejecuta `On(task_complete)` (checklist antidrift).

