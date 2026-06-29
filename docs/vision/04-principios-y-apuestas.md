# Principios y apuestas de diseño

> **Resumen (es).** Los principios core y las apuestas de diseño no-negociables: filesystem-first, doctrina de planificación, y las decisiones de arquitectura que no se transan.
>
> Parte 4 de 12 · [↩ Índice](./README.md)

---

PRINCIPIOS CORE

1. Basado en tareas, no en roles.
Todo objetivo debe descomponerse en tareas explícitas con etiquetas de habilidad y dependencias. Evitá la mitología organizacional fija como “el agente investigador” o “el agente CEO” a menos que sean apenas perfiles de habilidad cargables. La capacidad debería venir de tareas más habilidades, no de personas permanentes.

2. Ejecución basada en pull.
Los workers consultan una cola, reclaman el trabajo elegible, lo ejecutan, lo verifican y reportan. Esto escala mejor y sobrevive mejor a fallas parciales que una orquestación push fuertemente acoplada.

3. Carga dinámica de habilidades.
El comportamiento del agente debe ensamblarse a partir de perfiles, prompts, herramientas, políticas y recuperación, todo lo cual puede evolucionar con el tiempo.

4. Estado transparente.
El estado importante debe vivir en archivos inspeccionables o en almacenes durables, no solo dentro del contexto del modelo.

5. Completitud con verificación primero.
Nada está hecho hasta que el sistema corre los chequeos que prueban que está hecho.

6. Auto-mejora de un cambio.
Cuando se mejora a sí mismo, preferí un cambio, una porción de evals, una decisión. Evitá la rotación gigante de prompts.

7. Seguridad por diseño.
Separá la autonomía de bajo riesgo de las acciones de alto riesgo. Agregá checkpoints, rollbacks, registros de auditoría, aprobaciones, presupuestos y progresión de confianza.

8. Agnosticismo de runtime.
El sistema debe adaptarse al runtime que encuentre en lugar de asumir un producto, IDE o proveedor en particular.

9. Colaboración basada en archivos.
Los agentes en paralelo deberían coordinar a través de archivos durables, registros de tareas y logs, no solo a través de contexto oculto de prompts.

10. Estado del proyecto filesystem-first.
Todo proyecto significativo debería poder continuarse solo desde su carpeta. La carpeta del proyecto es el sustrato operativo durable. El historial de chat es opcional. Los archivos son obligatorios.

11. Loop de expansión de capacidades.
Toda falla debería tratarse como una pista sobre una habilidad, herramienta, memoria, eval, política o arquitectura faltante.

12. Legibilidad humana.
Los humanos necesitan dashboards, planes, evidencia y controles. Un sistema poderoso e invisible no es un modelo operativo aceptable.

13. Resiliencia a la migración.
Asumí que el runtime, el modelo, las herramientas o el proveedor pueden cambiar. Preservá la portabilidad.

SISTEMA OPERATIVO DE PROYECTO FILESYSTEM-FIRST

Tratá cada carpeta de proyecto como un sistema operativo durable para ese proyecto.

La regla es simple:
- cualquier agente compatible debería poder entrar a la carpeta
- inspeccionar los archivos
- entender el estado actual
- continuar el trabajo
- dejar la carpeta en un estado mejor y más actualizado

Esto significa:
- las conversaciones no son la memoria canónica del proyecto
- el contexto oculto de los prompts no es la memoria canónica del proyecto
- el historial de sesiones específico del proveedor no es la memoria canónica del proyecto
- los archivos del proyecto son la memoria canónica del proyecto

Para todo proyecto significativo, mantené un file pack canónico como por ejemplo:
- `project.md` o `charter.md`
- `plan.md`
- `tasks.md` y, cuando sea útil, un directorio `tasks/` con un archivo por tarea
- `knowledge.md`
- `decisions.md`
- `status.md`
- `handoff.md`
- `FAILURE.md`
- `artifacts/`
- `evals/`
- `runs/` o `logs/`
- archivos específicos del tipo de proyecto para operaciones de producto, investigación, empresa, entrega o open-source

Reglas del agente para este file pack:
- leer antes de actuar
- actualizar durante la ejecución, no solo al final
- escribir evidencia y artefactos a medida que se producen
- registrar decisiones cuando cambia el rumbo
- registrar fallas cuando fallan intentos importantes
- dejar un handoff explícito con próximas acciones, bloqueos y preguntas abiertas

Las bases de datos, colas, dashboards y planos de control están permitidos y suelen ser útiles.
Pero deberían reflejar, indexar, bloquear, buscar, visualizar o acelerar el estado del proyecto, no reemplazar a los archivos del proyecto como la única superficie de continuación durable.

DOCTRINA DEL SISTEMA DE PLANIFICACIÓN

El sistema de planificación debe ser lo bastante fuerte como para que los proyectos de larga duración no pierdan impulso ni coherencia.

No uses una única plantilla de planificación genérica para todos los tipos de proyecto.
Primero clasificá el modo del proyecto, después elegí el stack de planificación correcto.

Los modos de proyecto comunes incluyen:
- producto de software
- programa de investigación
- operaciones de empresa
- entrega a cliente
- mantenimiento open-source
- operaciones internas

Todo proyecto debería normalmente mantener múltiples capas de planificación enlazadas:
- capa de charter u objetivo
- capa de workstream
- capa de milestone o roadmap
- capa del grafo de tareas
- capa del foco de ejecución actual
- capa de operaciones recurrentes cuando corresponda
- registro de riesgos y registro de decisiones

Guía por modo de proyecto:
- Producto de software: arquitectura, backlog, plan de release, plan de QA, plan de migración, plan de incidentes
- Programa de investigación: preguntas, hipótesis, experimentos, datasets, métodos, cola de replicación, plan de análisis
- Operaciones de empresa: departamentos o workstreams, cadencias de KPIs, ops recurrentes, niveles de decisión, pipelines de ciclo de vida
- Entrega a cliente: alcance, entregables, deadlines, dependencias, aprobaciones de stakeholders, cadencia de comunicación
- Mantenimiento open-source: issues, roadmap, tren de releases, docs, tareas de comunidad, deuda de mantenimiento
- Operaciones internas: propiedad de servicios, runbooks, auditorías, chequeos recurrentes, preparación para incidentes, controles de costos

Usá correctamente tanto la planificación fija como la dinámica:
- planes fijos para workflows repetibles y harnesses especializados
- planes dinámicos para el descubrimiento abierto y el trabajo ambiguo
- planes rodantes (rolling) para proyectos de larga duración donde la información nueva cambia las prioridades

Los archivos de planificación deben ser archivos vivos.
El sistema debería actualizarlos continuamente a medida que la realidad cambia.
Si el plan cambió pero los archivos no, el sistema se está mintiendo a sí mismo.

APUESTAS DE DISEÑO NO-NEGOCIABLES

Si te ves forzado a elegir una arquitectura por defecto, elegí esta:
- un agente de ejecución generalista fuerte
- una capa explícita de grafo de tareas y workflow
- una capa de verificador o reviewer
- una capa durable de memoria y artefactos
- un plano de control para los humanos

No uses por defecto un enjambre de agentes hablándose entre sí. La mayoría de los sistemas debería comenzar con un baseline fuerte de un solo agente más workflows explícitos, y luego agregar patrones multi-agente solo donde claramente superen a un control de flujo más simple.
El estado final objetivo debería todavía soportar paralelismo controlado en una máquina y trabajo coordinado del mismo proyecto a través de múltiples máquinas, una vez que el baseline más simple sea confiable.

Usá por defecto estas opiniones fuertes:

1. Empezá con un baseline poderoso de un solo agente.
Usá un agente fuerte que pueda planificar, ejecutar y usar herramientas. Agregá más agentes solo cuando una de estas sea verdad:
- el trabajo es vergonzosamente paralelo
- un reviewer debería estar separado del autor
- la tarea es de larga duración y se beneficia de especialistas en segundo plano
- se requieren máquinas o entornos de herramientas distintos
A menudo es deseable que el usuario experimente una única superficie de agente universal mientras el sistema, internamente, rutea el trabajo a través de tareas, habilidades, playbooks, harnesses, políticas de modelos y capas de verificación.

2. Separá el razonamiento abierto de los workflows determinísticos.
Usá workflows para ruteo, reintentos, aprobaciones, timers, checkpoints y fan-out o fan-in. Usá agentes abiertos para el razonamiento ambiguo, la investigación y la resolución creativa de problemas.

3. Construí un grafo de tareas, no una transcripción de chat con efectos secundarios.
El estado real del sistema debería ser objetivos, tareas, eventos, artefactos, métricas, aprobaciones, incidentes y registros de conocimiento. El chat es solo una superficie sobre ese estado.

4. Hacé que el estado por proyecto sea file-first.
Usá markdown y archivos visibles en el repo como el estado canónico por proyecto para planificación, tareas, conocimiento, decisiones, handoffs y artefactos. Usá bases de datos o almacenes de estado estructurado para colas, eventos, sesiones, métricas, costos, aprobaciones e indexación operativa.

5. Hacé de la verificación una preocupación separada.
No dejes que el mismo paso no verificado produzca y certifique el resultado a la vez. Preferí planner o ejecutor -> verificador -> reviewer o aprobación para el trabajo significativo.

6. Hacé distintos el modo investigación y el modo acción.
El modo investigación debería optimizar para amplitud, calidad de citas, seguimiento de incertidumbre y visibilidad del progreso. El modo acción debería optimizar para seguridad de ejecución, aprobaciones, cambios de estado y rollback.

7. Tratá la automatización de browser y escritorio como infraestructura real.
No le pegues acciones de browser o escritorio a un sistema de programación como un truco. Necesitan su propia confiabilidad, persistencia de sesión, capacidad de reproducción (replayability) y métodos de verificación.

8. Tratá la memoria como una superficie de producto, no como un detalle de implementación.
La memoria debería ser inspeccionable, editable, buscable y versionada. Una buena memoria es una ventaja competitiva. La memoria oculta es un pasivo.

9. Favorecé las interfaces tipadas y los esquemas explícitos.
Las tareas, llamadas a herramientas, artefactos, decisiones y resultados de evals deberían tener todos estructura. Texto libre en todas partes se vuelve imposible de depurar.

10. Preferí adaptadores antes que lock-in.
Envolvé los proveedores de modelos, herramientas, backends de browser, capas de almacenamiento y runtimes de ejecución detrás de adaptadores, para poder intercambiarlos sin reescribir el sistema entero.

11. Local-first es el default correcto, escala-cloud es el camino de expansión correcto.
Asumí que los desarrolladores quieren primero estado local en el repo, scripts e inspeccionabilidad. Después diseñá de modo que los workers, schedulers, dashboards y tareas pesadas puedan moverse a infraestructura remota más adelante.

12. La mayoría de las ganancias vienen de mejores loops, no de prompts más grandes.
Las mayores mejoras de rendimiento suelen venir de specs de tareas más fuertes, mejores herramientas, verificación más limpia, memoria mejorada, dashboards más claros, evals más ajustados y mejor ruteo. No esperes que prompts gigantes por sí solos sostengan al sistema.

13. Todo éxito repetido debería convertirse en un activo reutilizable.
Promové las buenas trayectorias a habilidades, playbooks, macros, workflows o plantillas. El sistema debería convertir la competencia demostrada en apalancamiento reutilizable.

14. Toda falla repetida debería convertirse en un test o guardrail.
Si el sistema falla dos veces de forma similar, debería ser mucho más difícil que esa misma falla vuelva a ocurrir sin ser detectada.

15. Optimizá el loop completo antes de optimizar la amplitud.
Antes de expandir dominios, asegurate de que el sistema pueda ir de forma confiable de objetivo -> grafo de tareas -> ejecución -> verificación -> actualización de memoria -> aprendizaje -> visibilidad. Un sistema amplio pero roto es peor que uno angosto pero de loop cerrado.
