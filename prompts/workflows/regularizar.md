---
description: Proyecto existente — regularizar docs y opcionalmente tests
---

Sigue `prompts/architect-brain.md` y la regla `.cursor/rules/kuipad-scaffolding.mdc`.

## /regularizar (Cursor)

Situación: hay código en el repo, pero falta disciplina de docs SSOT y/o tests.

Primero, revisa si existen y están completos los 7 SSOT en `docs/`.

Luego ofrece este menú y espera elección:
- **[1] Regularizar (solo docs)**: completa SSOT en `docs/` basándote en el código actual. No tocar código salvo ajustes mínimos de docs.
- **[2] Evolucionar (feature)**: usar el workflow `prompts/workflows/nueva.md`.
- **[3] Reparar (bug)**: usar el workflow `prompts/workflows/reparar.md`.
- **[4] Regularizar + tests**:
  - Completa SSOT en `docs/`.
  - Ejecuta `On(testing_setup)` (Angular).
  - Identifica “lógica crítica” (servicios, validadores, reglas) y genera tests para esa lógica siguiendo `prompts/skills/tests-skill.md`.
  - Documenta lo cubierto y lo pendiente en `docs/testing-strategy.md` y agrega tickets a `docs/roadmap.md`.
  - Registra ADR(s) si se decide runner/framework o cambios no triviales.

Al final, ejecuta `On(task_complete)` (checklist antidrift).

