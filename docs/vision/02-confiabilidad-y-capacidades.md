# Confiabilidad y escalera de capacidades

> **Resumen (es).** Cómo se diseña para confiabilidad: la 'matemática' de componer pasos falibles en sistemas confiables, y la escalera por la que el sistema gana capacidades de forma medible.
>
> Parte 2 de 12 · [↩ Índice](./README.md)

---

MATEMÁTICA DE CONFIABILIDAD E INGENIERÍA DE HARNESS

Para flujos de trabajo de negocio serios, la confiabilidad se compone a lo largo de los pasos.

Pensá en términos de la marcha de los nueves:
- un flujo de trabajo puede verse impresionante con un 90% de confiabilidad por paso y aun así fallar demasiado seguido como para confiar en él
- cada nueve adicional de confiabilidad suele requerir un esfuerzo de ingeniería sustancial
- los flujos de trabajo largos de múltiples etapas multiplican el fallo, así que un comportamiento "bastante bueno" por paso a menudo está muy lejos de ser suficiente

No diseñes solo para demos. Diseñá para una ejecución repetida confiable.

Esto lleva a varias conclusiones duras:

1. Las skills son útiles, pero las skills por sí solas no alcanzan.
- Las skills son unidades portables de conocimiento de dominio, SOPs y guía procedimental
- Mejoran el rendimiento
- Pero las skills basadas solo en prompts siguen siendo probabilísticas
- Pueden saltarse pasos, alucinar, detenerse temprano o formatear salidas de forma inconsistente

2. Si algo debe ocurrir siempre, codificalo.
- Si un paso es obligatorio, no le pidas simplemente al modelo que lo recuerde
- Ponelo sobre rieles deterministas en el harness
- Hacelo cumplir en código, estado del flujo de trabajo, gates de validación, schemas, plantillas o políticas

3. Los flujos de trabajo complejos a menudo deberían convertirse en harness especializados.
- Usá harness de propósito general para trabajo abierto y amplio
- Usá harness especializados para flujos de trabajo repetidos, de alto valor y de múltiples etapas donde importa la confiabilidad
- Los ejemplos incluyen revisión de cumplimiento, auditorías, onboarding, reportes financieros, análisis de riesgo, evaluaciones de impacto y flujos de trabajo de contratos

4. Un harness especializado suele ser una máquina de estados.
- Tiene fases explícitas
- Hace seguimiento del estado actual
- Conoce los criterios de entrada y salida de cada fase
- Registra artefactos en cada etapa
- Puede reanudarse a mitad de ejecución tras un fallo o interrupción

5. Distinguí los planes fijos de los planes dinámicos.
- Usá planes fijos para flujos de trabajo estandarizados que deben seguir los mismos pasos siempre
- Usá planes dinámicos para trabajo abierto y ambiguo donde el plan debería evolucionar
- No dejes que un flujo de trabajo de negocio estandarizado se vuelva "creativo" cuando la repetibilidad importa más que la flexibilidad

6. Mantené el orquestador liviano.
- El agente principal o supervisor no debería cargar con todo el peso de tokens de cada subtarea
- Usá subagentes aislados para paquetes de trabajo acotados
- Dales contexto estrictamente acotado
- Usá modelos más baratos o más rápidos para tareas repetidas y acotadas cuando corresponda
- Mantené al orquestador enfocado en la coordinación, la síntesis y la interacción con el usuario

7. Paralelizá solo donde las dependencias lo permitan.
- El análisis independiente de cláusulas, el análisis de fragmentos de documentos, el análisis de páginas o la investigación por lotes pueden correr en paralelo
- Los pasos dependientes deberían permanecer secuenciados y con gate
- El paralelismo es para el throughput, no para crear la ilusión de sofisticación

8. Cada fase debería dejar un rastro de archivos o artefactos.
- Tratá al workspace como un scratchpad y un almacén de evidencia
- Cada etapa debería escribir archivos, reportes, salidas estructuradas o checkpoints
- Eso hace que el flujo de trabajo sea reanudable, inspeccionable y depurable

9. Usá schemas estructurados en los límites de fase.
- Salidas de clasificación
- cláusulas extraídas
- hallazgos de riesgo
- redlines
- resúmenes
- aprobaciones
- cada una debería validar contra un schema o un contrato explícito
- el texto libre por sí solo es demasiado débil para flujos de trabajo de alta confiabilidad

10. Agregá bucles de validación, no solo resúmenes finales.
- Validá los datos extraídos antes del análisis
- Validá el análisis contra playbooks o políticas
- Validá las salidas generadas antes de publicarlas
- Cuando sea posible, iterá automáticamente sobre los checks fallidos
- La confiabilidad proviene de bucles y gates, no solo de mejores prompts

11. Las salidas programáticas le ganan a las salidas de texto libre cuando importa la consistencia.
- Si el entregable final es un reporte, una planilla, un deck, un documento legal o un resumen ejecutivo que debe seguir una plantilla, generalo programáticamente a partir de datos intermedios validados
- No confíes en que el LLM improvise el formato final cada vez

12. La ejecución en sandbox es una capacidad central.
- Usá sandboxes o entornos de ejecución controlados para código, manipulación de archivos y herramientas riesgosas
- El harness debería controlar qué código puede correr, dónde corre y qué archivos puede afectar

13. El human-in-the-loop debería ocurrir en puntos significativos.
- Hacé preguntas aclaratorias cuando falte contexto crítico para el negocio
- Requerí aprobación para escrituras sensibles o efectos secundarios externos
- Dejá que los humanos guíen los harness especializados en puntos críticos sin forzar una supervisión constante

14. La gestión de contexto es parte del diseño del harness.
- Guardá las salidas grandes en archivos en lugar de meterlas en el contexto activo
- Resumí y recuperá bajo demanda
- Protegé la ventana de contexto principal de la degradación (rot)

15. Cuando la confiabilidad es el caso de negocio, optimizá primero para la repetibilidad y segundo para la elegancia.
- Un harness confiable, instrumentado y algo aburrido vale más que una demo autónoma hermosa pero inestable

16. Los efectos secundarios necesitan una capa de efectos idempotente.
- Los reintentos no alcanzan cuando el flujo de trabajo puede enviar emails, crear tickets, disparar deploys, postear mensajes, registrar gastos o modificar registros de negocio
- Toda acción con efectos secundarios debería llevar una clave de idempotencia, una identidad de efecto y una política de replay
- El sistema debería registrar si el efecto fue intentado, confirmado (committed), reintentado, compensado o saltado intencionalmente

17. Los flujos de trabajo externos de múltiples pasos necesitan acciones compensatorias.
- Si un flujo de trabajo muta múltiples sistemas, el harness debería registrar acciones compensatorias o vías de rollback para cada acción hacia adelante
- Un fallo parcial no debe dejar estado invisible a medio completar a lo largo de finanzas, CRM, soporte, cloud o sistemas de datos
- Pensá en sagas, no en optimismo de un solo tiro

18. Las esperas durables son una primitiva de primera clase.
- Los sistemas de alta confiabilidad deben poder pausar para una aprobación, información faltante, callbacks de webhook, momentos agendados, recuperación de rate-limit o relevo humano (takeover)
- La pausa debería preservar el estado exacto de la ejecución y reanudar desde ese punto
- Reconstruir el estado a partir del chat tras una pausa larga es demasiado frágil

19. Hacé checkpoint y caché a nivel de paso.
- Guardá suficiente estado después de cada fase significativa para que la ejecución pueda reiniciar desde el último buen checkpoint
- Cacheá las salidas intermedias validadas cuando el recálculo es costoso y lo bastante determinista
- Nunca obligues a un flujo de trabajo de larga duración a empezar de cero solo porque falló la fase siete

20. Hacé que el estado de la ejecución sea consultable desde el plano de control.
- Un humano o supervisor debería poder inspeccionar la fase actual, el waitpoint pendiente, el conteo de reintentos, el último checkpoint exitoso, la próxima acción planeada y los efectos externos ya confirmados
- La autonomía de alta confianza requiere una introspección de alta calidad

21. Poné en cuarentena el trabajo envenenado en lugar de dejar que se trabe (thrash).
- Las tareas que fallan repetidamente, los inputs externos malformados y las salidas de herramientas sospechosas deberían moverse a colas dead-letter o de cuarentena
- El replay debería ser explícito y rico en evidencia
- Las tormentas de reintentos silenciosas destruyen la confiabilidad y la confianza del operador

22. Trazá las trayectorias, no solo los resultados.
- Registrá spans para planes, llamadas a herramientas, elecciones de modelo, reintentos, esperas, validaciones, efectos secundarios y aprobaciones
- Evaluá las trazas además de las salidas finales
- Un sistema que llega a la respuesta correcta por una vía peligrosa todavía no es confiable

23. La automatización de browser necesita su propia pila de confiabilidad.
- Preferí acciones de browser con nombre por sobre scripts de DOM puntuales
- Observá antes de actuar
- Reutilizá la autenticación y las sesiones de forma segura
- Capturá capturas de pantalla y evidencia del DOM antes y después de acciones riesgosas
- Usá curado de selectores (selector healing), caché de acciones y previsualización antes de confirmar (preview-before-commit) donde sea posible

24. Los flujos de trabajo de negocio requieren reconciliación de fuentes.
- Para flujos de finanzas, operaciones, cumplimiento, clientes y proyectos, reconciliá las conclusiones y las acciones contra los sistemas autoritativos antes de mutar el estado externo
- No dejes que un único resumen del modelo le gane al libro mayor (ledger), al CRM, al sistema de tickets, a la fuente de analítica o al registro de contratos sin una política explícita

25. Los flujos de trabajo científicos requieren linaje y replicación.
- Hacé seguimiento de versiones de dataset, prompts, parámetros, revisión de código, manifiesto de entorno, métricas, artefactos y controles de seed o aleatoriedad
- Vinculá las afirmaciones a la evidencia
- Poné en cola intentos de replicación independientes para los hallazgos importantes
- Un sistema de ciencia sin reproducibilidad es solo un sistema persuasivo de escritura

26. Versioná prompts, políticas y flujos de trabajo como código.
- Tratá los prompts, playbooks, schemas y guardrails como artefactos versionados
- Desplegalos detrás de evals y rampas de confianza escalonadas
- Soportá el rollback cuando un prompt "mejor" silenciosamente vuelve al sistema menos confiable

27. La automatización es una técnica de confiabilidad, no solo una funcionalidad de conveniencia.
- Cuando un proceso importa y se repite, convertilo en una automatización en lugar de re-ejecutarlo ad hoc desde cero para siempre
- Las buenas automatizaciones combinan código determinista con IA solo donde se necesita juicio o síntesis
- Una automatización debería tener triggers o agendas explícitas, inputs y outputs tipados, pasos de validación, puntos de aprobación, captura de evidencia, monitoreo y vías de escalamiento
- Un prompt agendado sin contratos, checks y observabilidad no es automatización seria

ESCALERA DE ADQUISICIÓN DE CAPACIDADES

El sistema más capaz no se construye intentando automatizar todo con máxima autonomía el primer día.
Se construye subiendo una escalera de adquisición de capacidades.

Usá esta escalera por defecto:

1. Resolvé una vez.
- Conseguí que el sistema complete la tarea al menos una vez, con apoyo humano si hace falta.

2. Hacelo repetible.
- Capturá la trayectoria exitosa en memoria, archivos o un runbook.

3. Convertilo en una skill.
- Destilá el SOP, el conocimiento de dominio y las condiciones de disparo en una skill reutilizable o suplemento de perfil.

4. Convertí el trabajo repetido de alto valor en un flujo de trabajo.
- Agregá fases explícitas, inputs y outputs tipados, seguimiento de estado y checkpoints.

5. Convertí los flujos de trabajo críticos para la confiabilidad en harness especializados.
- Agregá rieles deterministas, gates de validación, plantillas, artefactos estructurados y salidas finales programáticas.

6. Agregá cobertura de evals.
- Agregá tests offline, tests de escenario y checks derivados de producción.

7. Agregá automatización.
- Convertí el proceso confiable en una unidad operativa repetible con código, IA donde se necesite, triggers o agendas, validación, aprobaciones, artefactos y monitoreo.

8. Agregá monitoreo e intervenciones.
- Vigilá la deriva (drift), los fallos, el trabajo estancado, los picos de costo o los supuestos obsoletos.

9. Agregá autonomía basada en confianza.
- Dejá que el sistema haga más por su cuenta solo después de que el éxito se mida en condiciones similares a producción.

10. Empaquetá la ganancia.
- Convertí el patrón exitoso en un activo reutilizable:
  - skill
  - flujo de trabajo
  - harness
  - plantilla
  - dashboard
  - eval
  - política

El sistema se vuelve "el más capaz" no cuando puede improvisar una ejecución impresionante, sino cuando puede absorber repetidamente nuevos dominios a través de esta escalera.
