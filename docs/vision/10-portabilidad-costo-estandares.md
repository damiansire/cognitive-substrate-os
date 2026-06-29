# Portabilidad, costo, estándares y expansión

> **Resumen (es).** Estrategias de contexto/costo/performance, requisitos de portabilidad, apertura a estándares e integración, e ideas de expansión avanzada.
>
> Parte 10 de 12 · [↩ Índice](./README.md)

---

ESTRATEGIAS DE CONTEXTO, COSTO Y PERFORMANCE

Usá estas estrategias para hacer práctico el trabajo de larga duración:
- prefijos estables para las instrucciones de sistema
- recuperación dinámica solo de los skills y reglas relevantes
- ventanas de contexto locales a la tarea
- compresión de transcripts viejos en archivos durables
- modelos baratos para borradores y clasificación
- modelos fuertes para evaluación y razonamiento crítico
- streaming de resúmenes para humanos
- memoria de largo plazo basada en archivos en lugar de replay inflado del prompt

REQUISITOS DE PORTABILIDAD

El sistema debe ser capaz de sobrevivir a:
- cambios de modelo
- cambios de runtime
- cambios de IDE
- cambios de proveedor
- migración de solo-local a hub-and-worker
- migración de una sola máquina a multi-máquina

Para habilitar esto:
- aislá el código específico de cada proveedor detrás de adaptadores
- mantené los perfiles y reglas data-driven
- mantené los formatos de estado legibles y documentados
- evitá lógica de negocio que dependa de una única herramienta oculta

APERTURA A ESTÁNDARES E INTEGRACIÓN

Donde sea útil, diseñá de modo que el sistema pueda integrarse más adelante con:
- registries de herramientas
- ecosistemas de conectores
- protocolos agente-a-agente
- protocolos de contexto de modelo
- buses de eventos
- schedulers externos

No hagas que estas dependencias sean obligatorias si el runtime no las soporta.

IDEAS DE EXPANSIÓN AVANZADA

Una vez que el sistema central esté funcionando, considerá agregar capas avanzadas de construcción de capacidades como:
- un mapa de frontera de capacidades que muestre qué puede hacer el sistema por dominio, nivel de riesgo, nivel de autonomía y tasa de éxito
- extracción automática de skills a partir de trayectorias de tareas exitosas
- generación automática de evals a partir de fallos reales, incidentes y correcciones humanas
- compiladores de workflows que conviertan el trabajo repetido y exitoso en recetas reutilizables
- entornos de simulación o sandbox para testear workflows riesgosos antes de tocar sistemas de producción
- operaciones de negocio en shadow-mode donde el sistema propone acciones sin ejecutarlas
- programas científicos en shadow-mode donde el sistema genera hipótesis y planes antes de correr experimentos costosos
- agentes internos de red-team que atacan prompts, políticas y workflows para exponer modos de fallo
- perfiles de revisor o juez adversariales para cambios de alto riesgo
- mecanismos de consenso o votación cuando decisiones importantes se benefician de múltiples perspectivas
- snapshotting del entorno para que las tareas complejas puedan reanudarse limpiamente después de una interrupción
- aislamiento por worktree o rama por tarea cuando git está disponible
- cachés locales para documentación, investigación y consultas externas repetidas
- monitores de frescura de conocimiento que detecten hechos obsoletos y fuercen la revalidación
- constructores de cadenas de workflow que lancen automáticamente tareas de seguimiento después de triggers específicos
- detectores de anomalías para picos de costo, reintentos repetidos, atascos de cola y uso inusual de herramientas
- puntajes de confianza específicos por capacidad en lugar de un único puntaje de confianza global
- dashboards específicos de dominio para ingeniería, soporte, finanzas, crecimiento y ciencia
- grafos de entidades estructurados que vinculen personas, proyectos, documentos, tareas, KPIs, incidentes y experimentos
- herramientas de simulación de políticas para testear qué habría hecho el sistema bajo distintos ajustes de aprobación o confianza
- capas de invención de herramientas que envuelvan secuencias repetidas de shell o navegador en herramientas o macros reutilizables
- replay y crítica de trayectorias para que el sistema pueda aprender de rutas de ejecución completas, no solo de los resultados finales
- jobs de consolidación de memoria que periódicamente compriman logs episódicos en memoria semántica y procedural de mayor calidad
- rotación automática de benchmarks para que el sistema no haga overfitting a un conjunto de evals obsoleto
- descubrimiento proactivo de oportunidades que genere metas a partir de docs descuidados, repos obsoletos, tickets sin responder, cambios de KPI y huecos de experimentos

Tratá estas como expansiones opcionales después de que el sistema central esté estable. No las agregues prematuramente si reducirían la claridad, la observabilidad o la confiabilidad.
