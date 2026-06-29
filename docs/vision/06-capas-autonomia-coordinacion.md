# Capas del sistema, autonomía y coordinación

> **Resumen (es).** Las capas a construir, los niveles de autonomía, cómo clasificar gaps, los patrones de coordinación multi-agente y los requisitos de interfaz humana.
>
> Parte 6 de 12 · [↩ Índice](./README.md)

---

CAPAS DEL SISTEMA A CONSTRUIR

CAPA A: PLANO DE CONTROL

Construí un plano de control que pueda convertirse en el centro de operaciones de cara al humano. Con el tiempo debería poder soportar:
- autenticación e identidad
- registro de máquinas
- registro de agentes
- historial de sesiones
- ingreso de objetivos
- visibilidad de la cola de tareas
- aprobaciones
- registros de auditoría
- seguimiento de costos
- niveles de confianza
- dashboards de proyectos
- workflows recurrentes
- vistas de incidentes
- memoria compartida del proyecto
- acceso a archivos y ejecución remota cuando esté disponible

CAPA B: TEJIDO DE EJECUCIÓN

Construí procesos worker o daemons que:
- consulten en busca de tareas reclamables
- filtren por habilidades y permisos
- operen en contextos de trabajo aislados cuando sea posible
- transmitan salida intermedia
- registren el uso de herramientas
- emitan métricas
- se recuperen ante crash o desconexión
- soporten modo persistente
- traspasen el estado a través de los reinicios

CAPA C: MOTOR DEL GRAFO DE TAREAS

Construí un motor de tareas donde:
- los objetivos se descompongan en tareas
- las tareas puedan depender de otras tareas
- las tareas puedan abrirse (fan out) y cerrarse (fan in)
- las tareas puedan crear sub-tareas
- las tareas puedan ser bloqueadas, reintentadas, escaladas o canceladas
- las tareas lleven una Definición de Hecho (Definition of Done) explícita
- las tareas almacenen evidencia y artefactos
- las tareas almacenen presupuesto, urgencia y nivel de política

Idealmente cada tarea debería llevar campos como:
- id
- goal_id
- project_id
- description
- skill_tags
- status
- depends_on
- owner
- reviewer
- priority
- risk_level
- budget_limit
- tokens_used
- attempts
- verification_plan
- evidence
- artifacts
- escalation_reason
- created_at
- updated_at

CAPA D: SISTEMA DE HABILIDADES Y PERFILES

No hardcodees la inteligencia en un único prompt gigante. Construí un sistema de perfiles.

Los perfiles deberían definir:
- qué tipos de tareas manejan
- qué herramientas pueden usar
- qué ruteo de modelos prefieren
- qué reglas aplican
- qué estándar de verificación usan
- qué reglas de escalado siguen

Los perfiles típicos incluyen:
- planner
- especificador de tareas
- generador de candidatos
- tester
- reviewer
- auditor de seguridad
- analista de investigación
- operador de browser
- operador de escritorio
- analista de documentos
- deployer
- evaluador de QA
- self improver (auto-mejorador)
- respondedor de incidentes
- coordinador
- operador financiero
- operador científico

Tratá los perfiles como packs de comportamiento cargables, no como identidades sagradas.

CAPA E: SISTEMA DE MEMORIA

Construí la memoria como un sistema en capas, no como un único archivo de notas genérico.

Usá al menos estos tipos de memoria:
- memoria caliente: contrato actual, plan actual, tareas actuales, bloqueos actuales
- memoria tibia: conocimiento del proyecto activo, decisiones de arquitectura, convenciones actuales
- memoria fría: sesiones archivadas, registros de incidentes, planes viejos, resultados históricos
- memoria episódica: qué pasó en runs específicas
- memoria semántica: hechos destilados, decisiones, reglas y conceptos estables
- memoria procedural: workflows reutilizables, habilidades, playbooks y checklists
- memoria de preferencias: preferencias del usuario, del equipo y del entorno
- memoria temporal: hechos con historial de reemplazo y metadatos de frescura

Si resulta útil, soportá:
- índice de conocimiento buscable
- enlaces de conocimiento relacionado
- procedencia sobre los hechos aprendidos
- puntajes de confianza y frescura
- promoción de memoria episódica a semántica

CAPA F: ADAPTADORES DE HERRAMIENTAS

El sistema debería normalizar las herramientas detrás de categorías de capacidad estables en lugar de atarse estrechamente a un único proveedor o protocolo.

Las categorías de capacidad incluyen:
- ejecución de shell
- lectura/escritura/edición/búsqueda de archivos
- operaciones de git
- búsqueda y fetch web
- navegación de browser e interacción con formularios
- entrada de escritorio y gestión de ventanas
- captura de pantalla y OCR
- consulta y migración de bases de datos
- procesamiento de documentos
- procesamiento de planillas
- acciones de email o mensajería
- acciones de calendario
- acciones de deployment
- monitoreo y alertas

Si una categoría de herramienta no está disponible de forma nativa:
- emulala donde sea seguro
- agregá un adaptador
- o acotá el milestone actual con honestidad

CAPA G: RUTEO DE MODELOS Y ECONOMÍA

Construí una capa de ruteo de modelos para que el sistema no trate todas las tareas por igual.

Debería soportar:
- modelos baratos para borradores, clasificación, etiquetado, resumen
- modelos más fuertes para planificación, depuración, revisión, chequeo adversarial y razonamiento difícil
- modelos distintos por perfil
- seguimiento de presupuesto por tarea, objetivo, proyecto y día
- pausa o aprobación cuando se exceden los presupuestos
- reintentos conscientes del costo

Registrá:
- tokens por tarea
- tokens por modelo
- costo por sesión
- costo por objetivo
- costo por dominio

CAPA H: GOBERNANZA, POLÍTICA Y CONFIANZA

Construí la aplicación de políticas como parte del sistema, no como algo agregado después.

Soportá:
- permisos basados en roles
- niveles de riesgo de las tareas
- gates de aprobación por acción
- progresión de confianza por habilidad o dominio
- manejo deny-first para acciones destructivas
- redacción de secretos
- auditabilidad de las acciones y de los resúmenes de razonamiento
- creación de incidentes ante violaciones de política o casi-incidentes

NIVELES DE AUTONOMÍA

Como mínimo soportá:
- supervisado: casi todas las acciones significativas necesitan aprobación humana
- guiado: las acciones de bajo riesgo pueden avanzar, las riesgosas se pausan
- autónomo: la mayor parte del trabajo de rutina puede avanzar dentro de la política y el presupuesto
- de confianza: operación de alta confianza en dominios acotados con auditoría posterior

La promoción debería ganarse a partir de los resultados, no declararse manualmente.

CAPA I: MOTOR DE EVALUACIÓN Y APRENDIZAJE

Este es el núcleo de la auto-mejora. Sin esto, el sistema es teatro.

Construí un programa de evaluación que incluya:
- tareas de programación
- tareas de revisión
- tareas de escritura de tests
- tareas de browser
- tareas de escritorio
- tareas de documentación
- tareas de investigación
- tareas de gestión de proyectos
- tareas de operación de negocio
- tareas de workflow científico
- tareas de horizonte largo
- tareas de inyección de fallas
- tareas de política y seguridad
- tareas de manejo de incertidumbre
- tareas de control de alcance
- tareas de entrada maliciosa o adversarial

Registrá:
- tasa de aprobación (pass rate)
- tasa de aprobación bajo runs repetidas
- tasa de aprobación por dominio
- tasa de aprobación por modelo
- tasa de aprobación por perfil
- tiempo hasta el éxito
- costo hasta el éxito
- frecuencia de intervención
- frecuencia de fallas silenciosas
- historial de regresiones
- cambios de confianza después de resultados del mundo real

El sistema no tiene permitido afirmar que mejoró sin evidencia de evals o de resultados en producción.

CAPA J: MOTOR DE AUTO-MEJORA

Construí la auto-mejora en dos modos:

Modo 1: aprendizaje inline después de cada tarea
- registrá qué funcionó
- registrá qué falló
- registrá qué frenó al sistema
- clasificá el gap
- actualizá la memoria
- actualizá el artefacto útil más pequeño
- agregá o revisá un eval si la falla expuso un punto ciego

Modo 2: loop de mejora en segundo plano
- elegí una hipótesis de mejora
- hacé un cambio acotado
- corré una porción representativa de evals
- compará contra el baseline
- conservalo si es mejor y seguro
- revertilo si es peor
- registrá el resultado

Nunca hagas cirugía gigante de prompts sin la protección de los evals.

CLASIFICACIÓN DE GAPS

Cada vez que el sistema falla, clasificá la falla como una o más de:
- habilidad faltante
- herramienta faltante
- permiso faltante
- memoria faltante
- mala descomposición
- mala verificación
- autonomía insegura
- mal ruteo de modelos
- sobrecarga de contexto
- observabilidad débil
- eval faltante
- falla de dependencia externa
- malos requerimientos humanos

Después elegí la reparación de mayor apalancamiento:
- agregar o refinar una habilidad
- construir o envolver una herramienta
- mejorar el especificador de tareas
- mejorar el contrato de verificación
- agregar estructura de memoria o recuperación
- revisar la política o el manejo de confianza
- agregar cobertura de evals
- mejorar el dashboard o los logs

CAPA K: OBSERVABILIDAD E INCIDENTES

Construí observabilidad profunda. Necesitás saber qué está haciendo el sistema, cuánto costó, qué falló y por qué.

Capturá:
- eventos del ciclo de vida de las tareas
- eventos del ciclo de vida de los agentes
- resúmenes de llamadas a herramientas
- aprobaciones solicitadas y otorgadas
- intervenciones y pausas
- costos
- salud de las máquinas
- salud de la cola
- tareas atascadas
- tormentas de reintentos
- incidentes y postmortems

Construí el manejo de incidentes con:
- creación de incidentes
- severidad
- línea de tiempo
- objetivos o tareas impactados
- causa raíz
- remediación
- mejora preventiva

CAPA L: GESTIÓN DE CONTEXTO

Los sistemas grandes fallan cuando dependen de contexto no declarado. Diseñá para el decaimiento del contexto.

Usá:
- recitación del plan
- archivos de handoff
- resúmenes compactos
- escrituras de estado estructuradas después de runs largas
- caminos de reanudación con sesión fresca
- próximas acciones explícitas
- contextos de tarea acotados

Cuando las sesiones se vuelven largas:
- escribí el estado en archivos
- resumí la situación actual
- reanudá desde los archivos en lugar de confiar en un historial largo de prompts

PATRONES DE COORDINACIÓN MULTI-AGENTE

Soportá múltiples patrones de coordinación, no solo uno:
- ejecución en solitario para tareas simples
- planner y luego ejecutor para tareas medianas
- planner, generador, evaluador para tareas de mayor riesgo
- generador versus reviewer adversarial para cambios riesgosos
- workers en paralelo para subtareas independientes
- coordinador más especialistas para objetivos amplios
- agentes proactivos en segundo plano para monitoreo y mejora

Soportá ambas escalas de paralelismo:
- paralelismo en una máquina, donde múltiples workers aislados corren en la misma computadora para subtareas independientes
- orquestación multi-máquina del mismo proyecto, donde múltiples instancias de agentes en distintas computadoras colaboran en un único proyecto compartido a través del mismo grafo de tareas y file pack

Reglas para el paralelismo:
- nunca tengas múltiples workers editando los mismos archivos a ciegas
- coordiná a través de tareas, propiedad (ownership), worktrees o branches aisladas
- cuando git esté disponible, por defecto asigná el trabajo de programación en paralelo a un git worktree por tarea propia o por carril propio de la máquina
- no dejes que múltiples agentes de programación en paralelo compartan un único working tree mutable a menos que el trabajo esté explícitamente serializado
- mergeá solo después de la verificación
- definí límites de concurrencia por proyecto y límites de workstream
- usá handoffs explícitos, recuperación de locks y referencias a artefactos cuando el trabajo se mueva entre máquinas
- mantené la carpeta del proyecto y el estado de las tareas lo suficientemente sincronizados como para que una máquina distinta pueda continuar sin contexto oculto

REQUISITOS DE LA INTERFAZ HUMANA

Los humanos deberían poder:
- ver qué máquinas existen
- ver qué agentes están corriendo
- inspeccionar las colas de tareas
- inspeccionar planes y conocimiento
- observar los streams de salida
- revisar evidencia
- aprobar o denegar acciones riesgosas
- detener o pausar agentes
- inspeccionar costos
- inspeccionar incidentes
- inspeccionar puntajes de confianza
- inspeccionar qué aprendió el sistema
