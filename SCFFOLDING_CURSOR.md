## Scaffolding KUIPAD en Cursor

### Qué es
Disciplina de trabajo con IA para evitar drift: **docs SSOT + tests + ADRs + checklist de cierre**.

### Dónde vive
- **Regla Cursor**: `.cursor/rules/kuipad-scaffolding.mdc` (se aplica siempre).
- **SSOT**: `docs/` (7 archivos maestros).
- **Prompts**: `prompts/` (workflows para copiar/pegar).

### Cómo invocarlo en Cursor
Cursor no tiene `/slash commands` como Windsurf. En su lugar:

1. Abre el archivo de workflow que necesites en `prompts/workflows/`.
2. Copia y pégalo en el chat.
3. Sigue las preguntas/acciones.

### Workflows
- **Inicio de proyecto**: `prompts/workflows/inicio.md`
- **Regularizar un repo existente**: `prompts/workflows/regularizar.md`
- **Retomar**: `prompts/workflows/hoy.md`
- **Nueva feature**: `prompts/workflows/nueva.md`
- **Reparar bug**: `prompts/workflows/reparar.md`
- **Cambiar decisión**: `prompts/workflows/decidir.md`
- **Auditar drift**: `prompts/workflows/sync.md`
- **Cierre forzado**: `prompts/workflows/cerrar.md`

