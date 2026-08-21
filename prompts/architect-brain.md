# Architect-Brain (KUIPAD) — protocolos

Este archivo define los protocolos “On(...)” que los workflows invocan.
Está pensado para pegarse/seguirse desde el chat de Cursor.

## On(project_start) — Entrevista BMADT + generación SSOT

Objetivo: arrancar proyecto nuevo con documentación SSOT antes de escribir código funcional.

Reglas:
- Haz **5 preguntas** (BMADT) **de a una**, esperando la respuesta antes de la siguiente.
- Con las respuestas, completa/crea los docs en `docs/`.
- Registra ADRs iniciales en `docs/decisions-log.md`.
- No escribir código funcional hasta que el usuario apruebe los docs.

BMADT:
- **B (Beneficio)**: objetivo, usuarios, valor, métricas.
- **M (Mecanismo)**: stack, integraciones, constraints.
- **A (Alcance)**: módulos del MVP, fuera de alcance.
- **D (Datos)**: entidades y flujos críticos.
- **T (Testing)**: nivel (básico/estándar/exhaustivo) + tipo de tests.

## On(testing_setup) — Setup de tests (Angular)

Objetivo: dejar tests en verde antes del primer ticket funcional.

Guía (Angular):
- Preferir **Jest** para unit tests en Angular moderno si el proyecto ya lo soporta; si el repo ya está en **Karma**, mantenerlo salvo decisión explícita.
- Asegurar comando estable: `npm test` o `ng test` en CI/local.
- Ejecutar un smoke test (mínimo) y verificar que corre en verde.
- Documentar en `docs/testing-strategy.md` runner, ubicación de tests y convenciones.
- Registrar ADR si se cambia runner (Karma → Jest) o si se decide E2E (Playwright/Cypress).

## On(task_start) — Interrupción de seguridad

Antes de tocar código:
- Actualiza `docs/user-stories.md` y `docs/roadmap.md`.
- Revisa si debes actualizar `docs/blueprints.md` y `docs/testing-strategy.md`.
- Si hay decisión no trivial: crea ADR en `docs/decisions-log.md`.

## On(bugfix) — Reparar con test primero

Si no existe test que reproduzca el bug:
- Escribir test que falla (rojo).
- Implementar fix (verde).
- Actualizar docs afectados.

## On(revisit_decision) — Cambiar una decisión (ADRs inmutables)

- No editar ADR antigua (histórico).
- Crear nueva ADR con: contexto, decisión nueva, alternativas, consecuencias.
- Marcar ADR anterior como “Superseded by ADR-XXX”.
- Propagar cambios a docs afectados.

## On(sync_check) — Auditoría de drift (solo reporte)

- Comparar estado real del código vs `docs/`.
- Reportar divergencias en: críticas, moderadas, menores.
- No aplicar cambios automáticamente: proponer plan y pedir prioridades.

## On(task_complete) — Checklist antidrift (obligatorio)

Al cerrar una tarea, mostrar checklist con estos 7 docs:
- `docs/prd.md`
- `docs/architecture.md`
- `docs/blueprints.md`
- `docs/user-stories.md`
- `docs/roadmap.md`
- `docs/testing-strategy.md`
- `docs/decisions-log.md`

Cada uno debe marcarse:
- **Actualizado** (qué cambió), o
- **Sin cambios** (por qué).

