# Capacidades por dominio (proyecto, empresa, ciencia)

> **Resumen (es).** Qué significa operar como SO de proyectos complejos, de empresa y de ciencia; adquisición de conocimiento y world model; y los estándares de verificación.
>
> Parte 8 de 12 · [↩ Índice](./README.md)

---

CAPACIDADES DE SISTEMA OPERATIVO DE PROYECTOS COMPLEJOS

Correr una empresa es un ejemplo importante de un proyecto complejo de larga duración, pero no es el único.

La plataforma debería poder operar programas complejos como:
- productos de software
- programas de investigación
- programas de entrega a clientes
- programas de mantenimiento open-source
- programas de operaciones internas
- empresas

A través de todos ellos, el sistema debería soportar:
- admisión de objetivos y milestones
- descomposición en workstreams
- grafos de tareas y dependencias
- operaciones recurrentes
- seguimiento de KPIs y detección de anomalías
- colas de decisión con niveles de escalación
- seguimiento de presupuesto y costos
- mapeo de sistemas source-of-truth
- mapeo de stakeholders
- registros de riesgos
- seguimiento de incidentes
- captura de evidencia y artefactos
- generación proactiva del próximo paso
- continuidad de sesión de larga duración

Objetos de control útiles cross-domain incluyen:
- programas
- proyectos
- workstreams
- milestones
- KPIs
- sistemas source
- decisiones
- aprobaciones
- operaciones recurrentes
- presupuestos
- incidentes
- riesgos
- stakeholders
- entregables
- sistemas externos
- contratos
- handoffs

CAPACIDADES DE SISTEMA OPERATIVO DE EMPRESA

Correr bien una empresa es una instancia especializada y de alto riesgo del sistema operativo de proyectos complejos más amplio.

Para avanzar hacia “correr empresas”, el sistema debería con el tiempo soportar:
- admisión y planificación de proyectos
- operaciones recurrentes
- seguimiento de KPIs
- generación de dashboards
- detección de anomalías
- triage de inbox o tickets
- redacción de respuestas de soporte
- soporte de workflows de leads o pipeline
- preparación de reuniones
- generación de documentos
- resúmenes financieros
- asistencia de facturación
- categorización de gastos
- workflows básicos de compras (procurement)
- checklists de compliance
- ruteo de alertas
- generación proactiva de objetivos cuando el sistema detecta deriva, estancamiento, caídas u oportunidades perdidas
- pipelines de ciclo de vida como lead -> calificado -> onboarding -> activo -> expansión -> renovación
- niveles de decisión como auto-proceder, notificar-y-proceder, requerir aprobación y bloquear-hasta-humano
- cadencias recurrentes como dailies, retros semanales, reportes mensuales y planificación trimestral
- coordinación cross-workstream entre ingeniería, soporte, finanzas, crecimiento y operaciones
- reconciliación de fuentes entre CRM, billing, soporte, analytics, contratos y documentos internos antes de acciones de alta consecuencia
- acciones salientes escalonadas donde los borradores, las previews y las aprobaciones son normales antes del compromiso externo

Objetos de dominio útiles incluyen:
- proyectos
- equipos
- departamentos
- operaciones recurrentes
- KPIs
- eventos de ingreso o costo
- documentos
- reuniones
- incidentes
- leads
- tickets
- contratos

CAPACIDADES DE SISTEMA OPERATIVO DE CIENCIA

Para avanzar hacia “hacer ciencia de punta a punta”, el sistema debería con el tiempo soportar:
- admisión de preguntas
- búsqueda de literatura
- clustering y síntesis de literatura
- generación de hipótesis
- diseño de experimentos
- generación de grafos de tareas para experimentos
- ejecución de código y notebooks
- adquisición y validación de datasets
- versionado y linaje de datasets
- registro de experimentos con params, prompts, herramientas, artefactos, métricas y manifests de entorno exactos
- captura de reproducibilidad
- análisis de resultados
- generación de figuras y reportes
- crítica adversarial
- intentos de replicación
- mapeo de claim-a-evidencia
- generación de backlog para próximos experimentos

Objetos de dominio útiles incluyen:
- preguntas de investigación
- hipótesis
- experimentos
- datasets
- versiones de datasets
- métodos
- runs
- manifests de entorno
- métricas
- análisis
- reportes
- citas
- claims
- registros de reproducción

Para los workflows científicos, priorizá:
- procedencia (provenance)
- reproducibilidad
- reruns exactos a partir de código, datos, prompts y entorno versionados
- declaraciones de incertidumbre
- captura de artefactos
- colas de replicación para claims importantes
- separación entre hipótesis, método, resultado e interpretación

ADQUISICIÓN DE CONOCIMIENTO Y WORLD MODEL

El sistema debería construir de manera sostenida un world model de su entorno. Ese world model debería incluir:
- usuarios
- equipos
- proyectos
- repos
- máquinas
- herramientas
- documentos
- datasets
- sistemas externos
- objetivos
- tareas
- incidentes
- workflows recurrentes
- KPIs
- experimentos

Para cada entidad, preferí:
- identificadores durables
- timestamps
- propiedad (ownership)
- relaciones
- frescura (freshness)
- procedencia (provenance)

Si resulta útil, agregá un knowledge graph o índice buscable, pero mantené los archivos transparentes como fundamento.

ESTÁNDARES DE VERIFICACIÓN

Toda tarea no trivial debe definir:
- qué archivo, salida, comportamiento o cambio de estado se espera
- cómo verificarlo
- qué evidencia debe guardarse
- cómo se ve el fallo

Métodos de verificación posibles incluyen:
- tests
- chequeos de tipos
- lint
- salida de comandos
- llamadas a APIs
- interacción de browser
- comparación de screenshots
- interacción de desktop
- cambio de métrica
- existencia de documento
- checksum de artefacto
- aprobación humana

Ninguna tarea debería marcarse como completa únicamente porque el agente lo dice.
