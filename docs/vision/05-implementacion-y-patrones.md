# Decisiones de implementación y patrones

> **Resumen (es).** Elecciones por defecto recomendadas, patrones de alto apalancamiento, el procedimiento operativo runtime-first, reglas de adaptación y la forma canónica del repo.
>
> Parte 5 de 12 · [↩ Índice](./README.md)

---

ELECCIONES DE IMPLEMENTACIÓN POR DEFECTO RECOMENDADAS

Si el runtime lo permite, preferí estos valores por defecto a menos que tengas una razón específica para no hacerlo:

1. Arquitectura del plano de control
- Usá un plano de control híbrido:
  - REST para CRUD, dashboards, historial, operaciones de administración e integración externa
  - WebSockets o canales de streaming para salida en vivo, despacho de tareas, intervenciones, alertas y presencia de máquinas
- Razón: los sistemas de agentes en vivo necesitan tanto estado consultable como actualizaciones por push

2. Topología de ejecución
- Usá una arquitectura hub-and-worker como forma escalable por defecto
- Poné el encolado durable y la política en el hub
- Poné la ejecución de herramientas en los workers, cerca del entorno real de la máquina
- Razón: esto te da un único lugar para visibilidad y política, manteniendo la ejecución cerca de archivos, navegadores, terminales y escritorios

3. Persistencia de cola
- Persistí las tareas en un almacén real antes de despacharlas
- Preferí un ciclo de vida explícito `goal -> task graph -> task assignment -> result`
- Nunca confíes solo en mensajes en memoria como tu cola
- Razón: los crashes, las reconexiones y los reintentos son normales, no excepcionales

4. Elección de base de datos
- Empezá con SQLite en modo WAL para un plano de control de un solo servidor
- Pasá a Postgres solo cuando la concurrencia, el hosting o la escala genuinamente lo exijan
- Razón: SQLite es operativamente más simple y sorprendentemente robusto para las etapas temprana y media de un sistema de agentes

5. División de estado
- Mantené el estado de indexación operativa y coordinación en almacenamiento estructurado:
  - tasks
  - sessions
  - agents
  - approvals
  - budgets
  - metrics
  - incidents
  - trust scores
- Mantené el estado canónico por proyecto en markdown o archivos visibles:
  - plan
  - tasks
  - knowledge
  - decisions
  - contract
  - status
  - handoff
  - failure notes
  - artifacts
  - runbooks
- Razón: los proyectos deberían sobrevivir a los cambios de runtime y ser continuables por cualquier agente compatible solo a partir de la carpeta, mientras que las máquinas igual necesitan estado de coordinación indexado

6. Modelo de polling
- Por defecto, reclamo de tareas basado en pull cada 30 segundos para workers persistentes
- Usá las notificaciones push solo como optimización, no como único mecanismo
- Razón: los workers basados en pull son más simples, más robustos ante desconexiones y se balancean de carga de forma natural

7. Bloqueo de tareas
- Bloqueá atómicamente una tarea antes del despacho
- Bloqueá solo tareas pendientes
- Desbloqueá solo al completar, ante un fallo explícito o por manejo de timeout
- Razón: la ejecución duplicada es una de las formas más fáciles de hacer que los sistemas multiagente parezcan capaces cuando en realidad están rotos

8. Aislamiento de codificación en paralelo worktree-first
- Cuando git esté disponible, preferí un worktree por tarea de codificación en paralelo, subtarea o carril propio de una máquina
- Usá un working tree compartido solo para trabajo serializado
- Razón: los worktrees hacen que la paralelización dentro del mismo proyecto sea mucho más segura que dejar que varios agentes muten un único checkout

9. Esquema de tareas
- Dale a las tareas algo más que una descripción
- Incluí campos como:
  - scope
  - mindset
  - context
  - skill tags
  - priority
  - risk level
  - budget
  - attempts
  - verification plan
  - artifacts
- Razón: las tareas de texto libre vagas empeoran mucho el ruteo, la revisión y el aprendizaje

10. Visibilidad de sesión
- Cada corrida de un agente debería crear una sesión visible que los humanos puedan inspeccionar después
- Razón: el trabajo invisible destruye la confianza y hace que depurar sea miserable

11. Timeout de ejecución de tareas
- Por defecto, un timeout duro de tarea de alrededor de 30 minutos a menos que la tarea justifique explícitamente más tiempo
- Razón: los agentes colgados malgastan dinero y confunden la orquestación

12. Profundidad de delegación
- Por defecto, una profundidad máxima de sub-delegación de alrededor de 5
- Razón: la recursión de agentes sin un techo duro se convierte en teatro de coordinación y explosiones de costo

13. Política de reintentos
- Reintentá una vez automáticamente ante un fallo de ejecución ordinario
- Después, cambiá de estrategia o escalá
- Razón: los reintentos ciegos y repetidos son un antipatrón común

14. Heartbeats y lógica de wake-up
- Usá heartbeats para metas de larga duración
- Hacé seguimiento de la vivacidad del orquestador y re-despachá el trabajo atascado al reconectar
- Razón: los sistemas de agentes de larga duración deben asumir que los procesos y las máquinas mueren

15. Buffering offline
- Si los workers se desconectan del hub, persistí los mensajes salientes localmente en disco y vaciálos al reconectar
- Poné un tope duro al tamaño de la cola
- Razón: la confiabilidad requiere sobrevivir a fallos de red transitorios sin crecimiento ilimitado

16. Balanceo de carga
- Empezá con un puntaje least-busy muy simple:
  - cantidad de agentes activos ponderada fuertemente
  - CPU ponderada de forma secundaria
- Razón: las heurísticas simples suelen superar a la planificación elaborada al principio porque son más fáciles de depurar

16. Modelo de aprobación
- Aplicá compuertas de aprobación antes del despacho, no solo después de la ejecución
- Combiná:
  - reglas de aprobación creadas explícitamente por el usuario
  - niveles de decisión automáticos basados en el contenido y el riesgo de la tarea
- Razón: las acciones riesgosas deberían pausarse antes de los efectos secundarios, no después de ellos

17. Modelo de confianza
- Hacé seguimiento de la confianza por usuario y por skill o dominio, no solo de forma global
- Promové la autonomía en base a resultados reales de tareas
- Razón: un sistema que es bueno testeando no es automáticamente bueno en deploys, finanzas o comunicación con clientes

18. Modelo de presupuesto
- Hacé seguimiento del presupuesto en múltiples capas:
  - por tarea
  - por meta
  - por máquina o worker
  - por mes
- Auto-pausá o requerí aprobación cuando se exceda
- Razón: las explosiones de costo suelen ocurrir de forma gradual y después de repente

19. QA de navegador y escritorio
- Usá un evaluador de QA dedicado y escéptico para los flujos de navegador
- Separá al constructor del evaluador
- Razón: los agentes constructores sobreestiman sistemáticamente la completitud

20. Ruteo por perfil
- Ruteá las tareas por skill tags hacia prompts y elecciones de modelo específicos de cada perfil
- Razón: el mismo modelo y el mismo prompt no deberían manejar de forma idéntica la planificación, la codificación, la revisión, el QA de navegador y la auto-mejora

21. Contexto reciente y valores por defecto del workspace
- Recordá las carpetas de proyecto recientes y las carpetas home/por defecto de la máquina
- Razón: la fricción del usuario importa; los sistemas de agentes deberían sentirse operativos, no sin estado

22. Espejo de progreso legible por humanos
- Reflejá el estado de la meta en markdown legible por humanos o artefactos de dashboard
- Razón: el estado debería ser visible sin tener que consultar filas crudas de la base de datos

23. Valores por defecto del loop de auto-mejora
- Corré una mejora acotada por vez
- Commiteá el cambio candidato
- Evaluálo
- Conservalo si mejora
- Revertilo si regresiona
- Corré el eval completo periódicamente y un eval delta en el medio
- Razón: este es uno de los pocos loops de auto-mejora que se mantiene comprensible bajo carga

24. Desempate por puntaje igual
- Si un cambio mantiene el mismo puntaje, preferí el sistema más simple
- Razón: la complejidad es un impuesto oculto y debería necesitar justificación

25. Monitoreo proactivo
- Escaneá continuamente los proyectos en vivo buscando:
  - tareas bloqueadas
  - demasiadas tareas en progreso
  - handoffs obsoletos
  - decisiones pendientes
  - endpoints de salud que fallan
  - desvío de KPI
  - repos sucios
- Convertí esas señales en metas proactivas
- Razón: un sistema capaz debería notar el trabajo descuidado sin esperar a que se lo digan

26. Archivos de control de negocio y ciencia
- Fomentá archivos durables para:
  - plan
  - decisions
  - KPIs
  - handoff
  - contract
  - runbooks
  - registros de experimentos
- Razón: el sistema se vuelve mucho más fuerte cuando el estado del proyecto y de la organización es legible en disco

27. Snapshots de contexto
- Construí un snapshot de contexto compacto para cada meta que contenga:
  - descripción de la meta
  - resumen del estado de las tareas
  - agentes activos
  - mejoras recientes
  - decisiones compartidas
  - estado del presupuesto
- Razón: esto mejora drásticamente la calidad de reanudación para el trabajo de larga duración

28. Degradación elegante
- Si dependencias opcionales como PTY, herramientas de navegador o APIs externas no están disponibles, degradá de forma limpia en lugar de crashear toda la plataforma de agentes
- Razón: la capacidad parcial es mejor que el fallo de la plataforma

29. Valor por defecto de seguridad
- Encriptá en reposo las claves de proveedor o secretos almacenados si el sistema los guarda
- Razón: las plataformas de agentes tienden a acumular muchas credenciales muy rápidamente

30. Ejecución local en la máquina
- Mantené la ejecución específica de máquina en la máquina que realmente tiene los archivos, la autenticación, el perfil de navegador o la sesión de escritorio necesarios
- Razón: demasiada abstracción remota se rompe cuando las tareas tocan entornos reales de usuario

PATRONES DE IMPLEMENTACIÓN QUE HAN DEMOSTRADO ALTO APALANCAMIENTO

Preferí estos patrones a menos que tengas evidencia en contra:

- Una sesión visible por tarea es mejor que la ejecución oculta en segundo plano.
- Un evaluador escéptico es mejor que la autocertificación.
- Un grafo de tareas es mejor que un inbox de mensajes vagos de agentes.
- Una cantidad pequeñísima de perfiles es mejor que docenas de “roles” superpuestos.
- Un plan en markdown más una cola estructurada es mejor que cualquiera de los dos por separado.
- Un loop de eval de un-cambio es mejor que reescrituras masivas de prompts.
- Una heurística simple de puntuación de máquinas es mejor que la complejidad prematura de planificación.
- La confianza por skill es mejor que un único interruptor global de autonomía.
- Las reglas de aprobación explícitas son mejores que esperar que el agente “sepa” qué es riesgoso.
- Las metas proactivas a partir de escaneos del estado del proyecto son mejores que la espera pasiva.
- Los archivos y snapshots reanudables son mejores que confiar en el contexto largo del modelo.
- El reintento con variación es mejor que los reintentos de repetir-el-mismo-comando.
- La simplificación por puntaje igual es mejor que la acumulación de complejidad.
- Las ramas de mejora en segundo plano son mejores que modificar a ciegas las instrucciones de producción.

PROCEDIMIENTO OPERATIVO RUNTIME-FIRST

FASE 0: DESCUBRIMIENTO DEL RUNTIME Y ALINEAMIENTO HUMANO

Antes de construir, hacé las preguntas mínimas de alto valor necesarias para evitar construir el sistema equivocado. Agrupá las preguntas de forma eficiente. Inferí todo lo que se pueda inferir. Preguntá solo por lo que falta o es peligroso asumir.

Debés determinar:
- qué tipo de runtime es este: agente de IDE, agente de codificación CLI, agente de navegador, agente de escritorio, agente de API con tool-calling, framework de orquestación, runner personalizado o híbrido
- si el sistema debería ser local-first, remote-first, hub-and-worker o híbrido
- qué sistemas operativos y máquinas deben soportarse
- qué capacidades existen ahora mismo: shell, filesystem, git, automatización de navegador, automatización de escritorio, red, scheduling, hooks, tareas en segundo plano, almacenamiento persistente, tool calling, delegación a sub-agentes, superficies de UI
- qué restricciones existen ahora mismo: presupuesto, sensibilidad de datos, compliance, requisitos de aprobación, entornos air-gapped, manejo de secretos, latencia, límites de deploy
- qué proveedores de modelos y APIs externas están permitidos
- si el hito inicial es coding-first, business-ops-first, science-first, general-computer-use-first, o amplio desde el día uno
- si hay un repositorio existente para extender o si deberías hacer scaffolding desde cero

Si el runtime ya expone estas respuestas, inferílas y preguntá solo por los huecos.
Si el workspace está vacío o casi vacío, tratá eso como un caso normal de bootstrap, no como un bloqueante.

Después producí un contrato de implementación que contenga:
- misión
- perfil del runtime
- primer hito
- no-objetivos para v1
- restricciones
- postura de seguridad
- métricas de prueba-de-progreso
- estrategia de verificación

FASE 1: CONSTRUIR UNA MATRIZ DE CAPACIDADES DEL RUNTIME

No te adaptes en base al nombre del producto. Adaptate en base a la forma de las capacidades.

Construí una matriz de capacidades con respuestas explícitas de sí, no, parcial o puntuadas para:
- acceso de lectura al repo
- acceso de escritura al repo
- acceso a shell
- búsqueda en el filesystem
- edición de archivos
- acceso a git
- acceso a la red
- capacidad de instalar paquetes
- disponibilidad de base de datos local
- control de navegador
- soporte de screenshots o visión
- control de entrada de escritorio
- soporte de tool-calling
- soporte de sub-agentes
- ejecución en segundo plano de larga duración
- ejecución por cron o programada
- soporte de webhooks o triggers por eventos
- almacenamiento persistente
- renderizado de UI o dashboard
- gestión de secretos
- controles de aprobación e interrupción
- soporte multi-máquina

Para cada capacidad faltante, decidí una de:
- emularla en el repo
- integrar un servicio externo
- diferirla de forma segura
- acotar el alcance explícitamente

REGLAS DE ADAPTACIÓN

Si el runtime ya es un runtime fuerte de codificación o agéntico:
- preferí envolverlo con tu harness, sistema de tareas, protocolo de archivos, evals y plano de control
- no reconstruyas su loop central a menos que haya una razón clara de confiabilidad o portabilidad

Si el runtime es un SDK o un entorno de orquestación de bajo nivel:
- construí los mismos contratos directamente en código
- preservá el mismo pack de archivos, protocolo de tareas y reglas de continuación que exigirías de un wrapper

Si el runtime es stateful y centrado en el repo:
- mantené planes, tareas, memoria, evals y reglas en el repo
- usá scripts y archivos como mecanismo principal de coordinación

Si el runtime es stateless o API-first:
- externalizá el estado agresivamente hacia archivos, bases de datos, colas y logs
- asumí que la conversación en sí es descartable

Si el runtime tiene acceso fuerte a shell y git pero orquestación débil:
- construí daemons de workers explícitos, cargadores de perfiles, colas y dashboards en el repo

Si el runtime tiene control de navegador o escritorio:
- tratá la capacidad de computer-use como un dominio de primera clase
- incluí evals de navegador y escritorio desde el principio

Si el runtime soporta plugins, skills, hooks, registries de herramientas o adaptadores de protocolo:
- usalos, pero mantené el sistema central portable para que pueda sobrevivir a una migración

Si al runtime le falta una capacidad requerida para el hito actual:
- hacé scaffolding de ella donde sea seguro
- de lo contrario, achicá el hito y declaralo claramente

FASE 2: ARTEFACTOS FUNDACIONALES

Creá y mantené estos artefactos temprano:
- AGENTS.md o una guía de operador equivalente
- REQUIREMENTS.md
- plan.md
- tasks.md
- knowledge.md
- memory.md
- FAILURE.md
- WORKFLOW.md
- contracts.md o contratos por tarea
- eval-harness
- loop de self-improve
- registry de skills o perfiles
- log de incidentes
- directorio de runbooks

Para cada proyecto real, creá también un pack canónico de archivos de proyecto.
Como mínimo incluí:
- `project.md` o `charter.md`
- `plan.md`
- `tasks.md` y, cuando sea útil, `tasks/`
- `knowledge.md`
- `decisions.md`
- `status.md`
- `handoff.md`
- `artifacts/`

No trates estos como documentación a posteriori.
Tratalos como el substrato operativo vivo del proyecto.

Si el runtime soporta superficies de UI, creá también:
- dashboard de máquinas
- tablero de tareas
- historial de sesiones
- feed de actividad
- vista de costos
- cola de aprobaciones
- vista de incidentes
- vista de KPI

FORMA CANÓNICA DEL REPO

Usá cualquier estructura que encaje con el codebase, pero si estás haciendo scaffolding desde cero, preferí algo como:
- /hub o /control-plane
- /workers
- /agents
- /skills
- /rules
- /evals
- /memory
- /docs
- /scripts
- /workflows
- /projects/<project-id>/project.md
- /projects/<project-id>/plan.md
- /projects/<project-id>/tasks.md o /projects/<project-id>/tasks/
- /projects/<project-id>/knowledge.md
- /projects/<project-id>/decisions.md
- /projects/<project-id>/status.md
- /projects/<project-id>/handoff.md
- /projects/<project-id>/artifacts/
- /incidents
- /.agent o /.system para estado en vivo cuando sea apropiado
