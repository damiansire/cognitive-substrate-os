# Confiabilidad, seguridad y aprendizaje

> **Resumen (es).** Estándares de confiabilidad y seguridad, shadow mode y rampa segura, el loop de aprendizaje activo, la inteligencia externa (news-to-improvement), la memoria de conocimiento externo y los targets de auto-mejora.
>
> Parte 9 de 12 · [↩ Índice](./README.md)

---

CONFIABILIDAD Y SEGURIDAD

Construí esto desde el principio:
- logging de auditoría
- reintentos con variación
- circuit breaker tras fallas similares repetidas
- checkpoint antes de acciones destructivas
- soporte de rollback
- idempotencia para efectos secundarios
- acciones compensatorias para mutaciones de múltiples sistemas
- validación de salidas
- detección de tareas atascadas
- guardrails de presupuesto
- manejo de rate-limit
- reporte de salud de máquina
- manejo de cola dead-letter o atascada
- waitpoints para aprobaciones y eventos externos
- redacción de secretos
- aplicación de permisos

Respuestas a fallas recomendadas:
- degradación elegante cuando falla una dependencia no crítica
- finalización parcial cuando algunas subtareas tienen éxito
- escalamiento cuando la falla repetida sugiere progreso bloqueado
- creación de incidente cuando se cruzan límites de seguridad o confiabilidad

SHADOW MODE Y RAMPA SEGURA

Para dominios de alto riesgo como deploys, envíos de email, acciones financieras, borrado de datos o efectos secundarios externos:
- empezá en modo de observación
- luego en modo de recomendación
- luego en modo draft-con-aprobación
- luego en autonomía acotada

Nunca saltes de sin validación a autonomía total en dominios sensibles.

LOOP DE APRENDIZAJE ACTIVO

El sistema no debería esperar pasivamente tareas del usuario para siempre. Debería aprender dónde están las brechas de capacidad.

Habilitá trabajo proactivo como:
- detectar correcciones humanas repetidas
- detectar fallas de tareas repetidas
- detectar proyectos estancados
- detectar workflows rotos
- detectar runbooks faltantes
- detectar incidentes sin dueño
- detectar caídas de KPI
- detectar caminos críticos sin tests

A partir de esas señales, generá:
- nuevos objetivos
- nuevas tareas
- nuevos evals
- nuevas skills
- nuevas políticas
- nuevos dashboards

LOOP DE INTELIGENCIA EXTERNA

El sistema también debería seguir aprendiendo del mundo exterior, no solo de sus propias fallas.

Construí un loop de inteligencia externa recurrente que monitoree:
- repos importantes de agentes e IA open-source con arquitectura relevante
- releases y changelogs de GitHub
- blogs de proveedores de modelos y actualizaciones de API
- ecosistemas de protocolos y herramientas como MCP y estándares agent-to-agent
- actualizaciones de benchmarks
- papers de investigación relevantes
- avisos de seguridad para dependencias y herramientas

Priorizá primero las fuentes open-source. Tratá el marketing de productos como evidencia débil a menos que conduzca a una idea arquitectónica concreta que valga la pena probar.
Solo ingresá un repo o proyecto al loop de aprendizaje si demuestra claramente uno o más de:
- ejecución durable
- control explícito de workflow o máquina de estados
- checkpointing y reanudabilidad
- contratos tipados de herramientas o datos
- arquitectura de memoria o recuperación
- ruteo de modelos o infraestructura de inferencia
- ejecución en sandbox
- loops de validación y eval
- aprobaciones humanas y visibilidad del control-plane
- trazabilidad, observabilidad o diseño de protocolo portable

Despriorizá o ignorá:
- wrappers finos alrededor de APIs de proveedores
- shells de chat genéricos
- productos de solo-UI con poca arquitectura pública
- demos de múltiples agentes impulsados por tendencias sin un diseño fuerte de estado, eval o confiabilidad
- lanzamientos de producto que no revelan patrones de implementación que valga la pena robar

El loop de inteligencia externa debería correr según un schedule y producir:
- un digest de cambios importantes
- una lista rankeada de ideas que valga la pena probar
- nuevos candidatos a eval
- nuevas skills o workflows que valga la pena crear
- cambios a ruteo de modelos, herramientas o estrategia de memoria
- advertencias de que supuestos existentes pueden estar quedando obsoletos

Categorías de feed recomendadas:
- runtimes de orquestación y motores de workflow open-source
- gateways de modelos e infraestructura de inferencia open-source
- sistemas de memoria, recuperación y artefactos open-source
- infraestructura de sandbox, navegador y ejecución open-source
- sistemas de eval, trace y observabilidad open-source
- sistemas de reproducibilidad científica, registro de experimentos y linaje de datos open-source
- protocolos abiertos y estándares de interoperabilidad
- papers de investigación sobre agentes, razonamiento de largo horizonte, uso de navegador, uso de herramientas, memoria y evaluación
- anuncios oficiales de proveedores que cambien materialmente las capacidades o los precios disponibles

Mantené un mapa vivo de subsistemas para:
- investigación e inteligencia web
- memoria y ensamblado de contexto
- planificación, tareas y workflows durables
- orquestación de múltiples agentes
- guardrails y aplicación de políticas
- evals, tracing y observabilidad
- capas de herramientas, auth e integración
- sandboxes de ejecución e infraestructura de navegador
- control planes y superficies de operaciones de cara al humano

PIPELINE DE NOTICIAS A MEJORA

No solo recolectes noticias. Convertilas en trabajo de mejora.

Para cada actualización externa relevante:
- capturá la fuente
- registrá la fecha
- extraé la afirmación arquitectónica
- estimá la relevancia para tu sistema
- decidí si implica:
  - un nuevo eval
  - una nueva skill
  - un nuevo playbook
  - un nuevo tool adapter
  - un nuevo workflow
  - un nuevo harness especializado
  - un nuevo perfil
  - una nueva política
  - un nuevo schema o contrato
  - una nueva vista de dashboard o control-plane
  - una nueva operación recurrente
  - un nuevo benchmark
  - un cambio en el roadmap
- si importa, creá un experimento acotado
- no adoptes ninguna afirmación externa en el sistema central sin un eval local, una corrida en shadow o una validación basada en replay
- conservá o descartá la idea según la evidencia

Ejemplos:
- un repo agrega un mejor patrón de estado de navegador -> creá un experimento de confiabilidad de navegador
- un proveedor de modelos agrega nuevas herramientas de computer-use -> agregá un benchmark controlado y una comparación de costo
- un proyecto de memoria lanza un mejor patrón de recuperación -> probalo en tareas de largo horizonte
- aparece un benchmark para un dominio que te importa -> agregalo a tu suite de evals
- un proyecto de company-ops lanza un mejor modelo de KPI o de cola de decisiones -> probalo como un objeto de control-plane y un cambio de dashboard
- un proyecto de workflow lanza un mejor patrón de pausa o reanudación -> probalo como un cambio de harness/runtime

MEMORIA DE CONOCIMIENTO EXTERNO

Mantené una capa de memoria dedicada para la inteligencia externa con campos como:
- fuente
- url
- fecha
- categoría
- afirmación
- relevancia
- confianza
- experimento sugerido
- estado
- resultado

Esta memoria debería facilitar responder:
- ¿Qué cambió en el ecosistema de agentes esta semana?
- ¿Qué ideas nuevas realmente mejoraron nuestro sistema?
- ¿Qué ideas populares rechazamos y por qué?
- ¿Qué supuestos en nuestra arquitectura están quedando obsoletos?

TARGETS DE AUTO-MEJORA

Permití que el sistema mejore:
- prompts
- skills
- playbooks
- reglas
- tool adapters
- automatizaciones
- harnesses especializados
- dashboards
- workflows
- política de descomposición de tareas
- objetos del control-plane
- suites de evals
- estructura de memoria
- ruteo de modelos
- lógica de reintentos
- políticas de seguridad
- documentación
- scripts de setup

Requerí una revisión más fuerte antes de que cambie:
- política de aprobaciones
- política de seguridad
- caminos de deployment
- reglas de acciones destructivas
- umbrales de confianza
