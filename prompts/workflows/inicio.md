---
description: Proyecto nuevo — entrevista BMADT + SSOT + setup de tests
---

Sigue estrictamente `prompts/architect-brain.md`.

## /inicio (Cursor)

Contexto: vamos a iniciar un proyecto nuevo o “re-iniciar” la disciplina del proyecto actual.

Instrucciones:
1. Ejecuta `On(project_start)` y haz la entrevista **BMADT** con 5 preguntas **una por una** (B, M, A, D, T). No avances sin respuesta.
2. Con las respuestas, completa los docs SSOT en `docs/`:
   - `docs/prd.md`
   - `docs/architecture.md`
   - `docs/blueprints.md` (si hay convenciones)
   - `docs/user-stories.md`
   - `docs/roadmap.md`
   - `docs/testing-strategy.md`
   - `docs/decisions-log.md` (ADRs iniciales)
3. Ejecuta `On(testing_setup)` para Angular: deja el runner definido y un smoke test en verde.
4. No escribas código funcional hasta que el usuario apruebe los docs SSOT y el setup de tests.

