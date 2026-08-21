# Tests skill (guía rápida)

Objetivo: generar tests útiles para lógica crítica, evitando tests frágiles.

## Prioridad de cobertura
1. **Reglas de negocio / cálculos** (servicios, utilidades puras)
2. **Validación** (inputs, formularios, normalización)
3. **Transformaciones** (mappers/adapters)
4. **Errores** (casos borde, mensajes, códigos)

No priorizar (salvo bugs):
- Render/UI trivial sin lógica
- Getters/setters
- Plumbing (wiring) sin reglas

## Patrones
- Arrange / Act / Assert
- Un test = un motivo de fallo
- Nombrado descriptivo: “should ... when ...”
- Mockear dependencias externas; preferir funciones puras cuando sea posible

## Angular (unit)
- Si hay servicios con lógica: tests de servicio con dependencias mockeadas.
- Para componentes: testea inputs/outputs y lógica (no snapshots masivos).

