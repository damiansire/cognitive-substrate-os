# Motor de momentum y harness

> **Resumen (es).** El motor que mantiene el progreso compuesto: colas de momentum, regla de selección del próximo trabajo, ratchets anti-retroceso, reglas anti-estancamiento y la librería de harness especializada.
>
> Parte 3 de 12 · [↩ Índice](./README.md)

---

MOTOR DE MOMENTUM Y BUCLE DE COMPOSICIÓN

El sistema no solo debe ser capaz. Debe mantener el momentum.

Muchos sistemas de agentes fallan no porque les falte inteligencia, sino porque se estancan una y otra vez:
- terminan una tarea y no preparan la siguiente
- descubren problemas pero no los convierten en backlog
- mejoran una vez pero no crean un bucle de composición
- esperan instrucciones de forma pasiva en lugar de apretar el sistema

Diseñá contra el estancamiento por defecto.

PRINCIPIO DE MOMENTUM

En todo momento, el sistema debería saber:
- qué está haciendo ahora
- qué debería hacer a continuación
- qué está bloqueado
- qué trabajo de mejora debería ocurrir en segundo plano
- qué bucles recurrentes mantienen al sistema mejorando incluso cuando no llega ninguna solicitud nueva del usuario

Si falta alguno de esos, el momentum está roto.

COLAS DE MOMENTUM POR DEFECTO

Mantené al menos estas colas vivas:

1. `now`
- el hito activo actual o la tarea de máxima prioridad

2. `next`
- el siguiente conjunto pequeño de tareas concretas listas para ejecutarse de inmediato

3. `blocked`
- tareas en espera de aprobaciones, información faltante, dependencias fallidas o capacidades ausentes

4. `improve`
- trabajo de automejora:
  - brechas en los evals
  - flujos de trabajo inestables (flaky)
  - fallos repetidos
  - skills faltantes
  - supuestos obsoletos
  - experimentos de inteligencia externa

5. `recurring`
- agendas, monitores, barridos y automatizaciones que mantienen al sistema vivo en el tiempo

El sistema nunca debería terminar una ejecución significativa con las cinco colas indefinidas.

REGLA DE SELECCIÓN DEL PRÓXIMO TRABAJO

Al elegir qué hacer a continuación, preferí el trabajo que maximice una o más de estas cosas:
- cierra el bucle central
- desbloquea muchas tareas futuras
- aumenta la confiabilidad
- crea apalancamiento reutilizable
- mejora la observabilidad
- reduce el costo del trabajo repetido
- aumenta la autonomía de forma segura
- convierte un éxito puntual en una capacidad repetible

Usá un orden de prioridad simple ante la duda:

1. desbloquear el hito actual
2. corregir brechas de confiabilidad o verificación
3. convertir el trabajo repetido en activos reutilizables
4. agregar cobertura de evals para fallos de alto valor
5. expandir la amplitud solo después de que el bucle esté estable

RATCHETS DE MOMENTUM

Todo éxito significativo debería avanzar como un ratchet (trinquete) en al menos una de estas formas:
- una nueva skill
- un flujo de trabajo más fuerte
- un harness especializado
- un nuevo eval
- una nueva plantilla
- un nuevo dashboard
- un nuevo monitor
- una nueva política
- un nuevo artefacto de memoria

Si una tarea tiene éxito pero no deja atrás ningún ratchet reutilizable, se está perdiendo parte del valor.

REGLAS ANTI-ESTANCAMIENTO

Cuando el momentum cae, reaccioná mecánicamente:

- Si está bloqueado por más de un intervalo corto:
  - descomponé el bloqueante
  - buscá la respuesta faltante más pequeña
  - trabajá en mejoras laterales no bloqueadas en paralelo

- Si el mismo fallo ocurre dos veces:
  - agregá un guardrail, test o política
  - no te limites a reintentar de nuevo y esperar

- Si una tarea de larga duración no muestra progreso visible en artefactos:
  - escribí salidas intermedias
  - hacé checkpoint del estado
  - mostrá un indicador de progreso más claro

- Si el sistema está esperando una tarea lenta:
  - llená el tiempo ocioso con trabajo de evals, limpieza de memoria, mejoras de dashboards, grooming del backlog o revisión de inteligencia externa

- Si el hito está "hecho" pero el próximo paso no está definido:
  - creá el próximo hito de inmediato
  - o abrí opciones explícitas para el usuario con recomendaciones

NUNCA TERMINES CON LAS MANOS VACÍAS

Al final de cada ejecución sustancial, dejá atrás:
- estado actualizado
- evidencia visible
- uno o más artefactos reutilizables
- un próximo paso claro
- al menos un candidato a mejora o tarea de seguimiento

Terminar solo con un resumen no es suficiente.

BUCLES DE COMPOSICIÓN EN SEGUNDO PLANO

El sistema debería ejecutar bucles continuos que compongan capacidad en el tiempo:

1. bucle de finalización de tareas
- después de cada tarea:
  - verificar
  - registrar
  - aprender
  - crear activos reutilizables

2. bucle de evals
- mejorar continuamente la calidad y la cobertura de las evaluaciones

3. bucle de fallos
- convertir errores repetidos en tests, políticas o restricciones del harness

4. bucle de inteligencia externa
- observar el mundo exterior en busca de mejores patrones, herramientas, modelos, protocolos y benchmarks

5. bucle de minería de flujos de trabajo
- detectar trayectorias exitosas repetidas y convertirlas en flujos de trabajo o skills

6. bucle de operaciones proactivas
- inspeccionar proyectos, empresas y workspaces en busca de trabajo bloqueado, planes obsoletos, desvíos de KPI o incidentes desatendidos

7. bucle de costos
- identificar pasos costosos y reemplazarlos por modelos más baratos, subagentes más acotados, artefactos cacheados o código determinista donde sea posible

8. bucle de confianza
- promover la autonomía cuando los resultados lo justifican y apretar los controles cuando no

Estos bucles son la forma en que el sistema se vuelve más capaz incluso entre funcionalidades importantes.

SESGO DE LAS PRIMERAS 72 HORAS

Al empezar desde cero, sesgá las primeras 72 horas de trabajo hacia la creación de momentum, no hacia el pulido.

La secuencia temprana por defecto debería ser:
- armar el andamiaje (scaffold) de los archivos centrales y el sistema de tareas
- probar una tarea de bucle cerrado de punta a punta
- hacer esa tarea visible en un dashboard o historial de sesión
- agregar un verificador
- agregar un eval
- agregar una vía de actualización de memoria
- agregar una vía de automejora
- agregar un bucle proactivo o recurrente
- definir los próximos tres hitos

Esto crea un sistema que puede seguir moviéndose en lugar de uno que espera otro gran empujón manual.

MÉTRICAS DE MOMENTUM

Hacé seguimiento no solo de métricas de éxito rezagadas (lagging), sino también de métricas de momentum anticipadas (leading):
- tiempo desde la finalización de una tarea hasta la siguiente tarea en cola
- número de activos reutilizables creados por hito
- número de fallos convertidos en evals o guardrails
- días desde la última mejora de evals
- días desde la última skill o flujo de trabajo reutilizable nuevo
- número de objetivos proactivos creados
- porcentaje de ejecuciones que terminan con próximas acciones explícitas
- porcentaje de flujos de trabajo importantes que tienen tanto un harness como evals

El objetivo no es el movimiento por el movimiento mismo. El objetivo es el movimiento hacia adelante compuesto, con confiabilidad creciente.

LIBRERÍA DE HARNESS ESPECIALIZADOS

El estado final no debería ser un único agente generalista gigante. Debería ser una plataforma que combine:
- un supervisor de propósito general para trabajo abierto
- un motor de tareas y flujos de trabajo
- una librería de harness especializados para flujos de trabajo recurrentes de alto valor

Por defecto, apuntá a construir una librería de harness con patrones como:

1. Harness de trabajo dinámico general
- Para tareas abiertas, trabajo de programación, investigación, planificación y ejecución mixta
- Usa planificación dinámica, uso de herramientas, memoria y verificación

2. Harness de programación y entrega
- Para corrección de bugs, trabajo de funcionalidades, refactors, migraciones y preparación de deploys
- Incluye tests, diffs, revisión, checks de CI, rollback y gating de release

3. Harness de investigación en browser
- Para investigación web profunda, comparación, sourcing y recolección de evidencia
- Usa subagentes aislados, captura de fuentes, resúmenes y validación de citas

4. Harness de documentos y contratos
- Para revisión de contratos, checks de cumplimiento, análisis de documentos, extracción de cláusulas, redlining y resúmenes ejecutivos
- Usa fases fijas, schemas, playbooks y salidas guiadas por plantillas

5. Harness de finanzas y reportería
- Para resúmenes financieros, análisis de variaciones, reportería de KPI, checks de presupuesto y salidas de estilo directorio (board)
- Usa métricas estructuradas, reconciliación de fuentes y reportes basados en plantillas

6. Harness de clientes y operaciones
- Para onboarding, triage de soporte, revisiones de salud de clientes, higiene de pipeline y operaciones recurrentes
- Usa SOPs, checks de políticas, deadlines y reglas de escalamiento

7. Harness de incidentes y recuperación
- Para caídas (outages), regresiones, eventos de seguridad y flujos de trabajo rotos
- Usa severidad, línea de tiempo, diagnóstico, rollback, mitigación y generación de postmortem

8. Harness de ciencia y experimentos
- Para revisión de literatura, planificación de experimentos, validación de datasets, pipelines de análisis y reportería
- Usa artefactos de reproducibilidad, procedencia, declaraciones de incertidumbre y seguimiento del estado de experimentos

9. Harness de proyectos complejos y operaciones de empresa
- Para programas de larga duración como operaciones de empresa, entrega a clientes, mantenimiento de open-source, operaciones internas y programas de investigación
- Usa workstreams, operaciones recurrentes, seguimiento de KPI, colas de decisión, detección de anomalías, pipelines de ciclo de vida, presupuestos y reglas de escalamiento

Todo harness especializado debería definir:
- condiciones de disparo (trigger)
- fases fijas versus dinámicas
- inputs requeridos
- preguntas aclaratorias si hacen falta
- disposición del workspace o sistema de archivos virtual
- schemas intermedios estructurados
- checks de validación por fase
- salidas finales y plantillas
- gates de aprobación
- lógica de reintento y fallback
- condiciones de parada
- actualizaciones de memoria
- evals para ese harness

Si un flujo de trabajo es repetido, de alto valor y sensible a la confiabilidad, eventualmente debería graduarse de "tarea de agente generalista" a esta librería de harness.
