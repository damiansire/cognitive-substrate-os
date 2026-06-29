# Interfaz y experiencia de usuario

> **Resumen (es).** La doctrina completa de interfaz para el usuario final: modelo fractal, ask bar universal, vistas core, control de altitud, divulgación progresiva, UX de aprobación y las experiencias por escala (tarea chica hasta multi-org).
>
> Parte 7 de 12 · [↩ Índice](./README.md)

---

DOCTRINA DE INTERFAZ PARA EL USUARIO FINAL

La interfaz no es una cáscara delgada alrededor del agente. La interfaz es parte de la inteligencia del sistema.

Si el usuario final no puede:
- pedir cualquier cosa en lenguaje natural
- ver qué está haciendo el sistema
- entender por qué lo está haciendo
- inspeccionar qué cambió
- intervenir cuando hace falta
- hacer zoom desde una tarea minúscula hasta todo el negocio

entonces el sistema no es en realidad lo bastante capaz como para un despliegue real.

Diseñá la interfaz alrededor de una promesa central:

PEDÍ CUALQUIER COSA. VE CUALQUIER COSA. CONTROLÁ CUALQUIER COSA QUE ESTÉS AUTORIZADO A CONTROLAR.

Esto significa que el usuario debería poder pedir:
- "arreglá este bug"
- "resumime qué pasó hoy"
- "por qué cayó la facturación"
- "qué objetivos están bloqueados"
- "mostrame todo el trabajo que toca al cliente X"
- "qué cambió en la última hora"
- "qué están haciendo los agentes ahora mismo"
- "qué es lo que más está costando"
- "qué decisiones me necesitan"
- "ejecutá el onboarding de nuevos leads cada mañana"
- "operá esta empresa hasta que yo te detenga"

y el sistema debería enrutar cada pedido a la combinación correcta de:
- respuesta
- plan
- tarea
- workflow
- automatización recurrente
- dashboard
- sesión en vivo
- cola de intervención
- vista de artefacto o archivo
- vista de empresa o portfolio

MODELO DE INTERFAZ FRACTAL

La interfaz debería escalar por alcance, no metiendo al usuario en un producto totalmente distinto.

Usá las mismas primitivas en cada nivel:
- ask
- estado
- plan
- tareas
- artefactos
- línea de tiempo
- evidencia
- costo
- aprobaciones
- memoria
- control

La diferencia entre una tarea minúscula y una operación enorme no es un modelo mental distinto. Es principalmente:
- alcance
- duración
- autonomía
- cantidad de actores
- cantidad de artefactos
- cantidad de métricas

El mismo usuario debería poder moverse con fluidez por estos niveles:

1. Nivel micro
- una respuesta
- un archivo
- un comando
- una acción de browser
- una tarea corta

2. Nivel de tarea
- una tarea delegada con un DoD
- una corrida de agente
- un resultado de verificación
- una traza de sesión

3. Nivel de objetivo
- múltiples tareas
- dependencias
- progreso
- bloqueos
- evidencia

4. Nivel de proyecto
- memoria compartida
- dashboards
- artefactos
- workflows recurrentes
- incidentes
- KPIs

5. Nivel de empresa
- departamentos
- pipelines
- operaciones recurrentes
- decisiones
- facturación y costo
- incidentes
- salud y riesgo

6. Nivel de portfolio
- muchas empresas o unidades de negocio
- cuellos de botella entre empresas
- asignación de capital
- asignación de personal o máquinas
- patrones compartidos
- riesgo y oportunidad de portfolio

Los usuarios no deberían tener que aprender una interfaz nueva en cada nivel.

ASK BAR UNIVERSAL

El sistema debería tener una sola superficie de ask universal. Este es el punto de entrada humano principal.

Esa ask bar debería aceptar:
- pedidos en lenguaje natural
- archivos
- capturas de pantalla
- URLs
- entradas estructuradas cuando estén disponibles
- restricciones de seguimiento como presupuesto, urgencia, tolerancia al riesgo o fecha límite

La ask bar debería inferir si el usuario quiere:
- una respuesta directa
- un borrador
- un plan
- una ejecución única
- un objetivo de larga duración
- una automatización recurrente
- un reporte de portfolio o de empresa

Si la ambigüedad importa, hacé una pregunta breve para clarificar. Si no, elegí la interpretación más reversible y arrancá.

La ask bar también debería soportar verbos de control explícitos como:
- responder
- explicar
- hacer
- monitorear
- automatizar
- agendar
- comparar
- inspeccionar
- detener
- reintentar
- escalar
- simplificar

LA SALIDA DEBERÍA COINCIDIR CON EL TRABAJO

No respondas cada pedido del usuario con un párrafo de texto de chat.

Elegí la superficie de respuesta que mejor coincida con el trabajo:
- para una pregunta factual: respuesta concisa con fuentes o evidencia
- para un cambio de código: diff, referencias de archivo, verificación y traza de sesión
- para una tarea única: tarjeta de tarea más sesión en vivo más evidencia final
- para un pedido de investigación: reporte, citas, artefactos y acciones de seguimiento
- para un problema de workflow: tablero, incidente, causa raíz y arreglo propuesto
- para un pedido de estado de empresa: dashboard, deltas de KPI, riesgos y decisiones necesarias
- para un proceso recurrente: tarjeta de automatización con agenda, alcance y política de aprobación
- para una pregunta de portfolio: resumen entre workspaces más links de drill-down

La mejor interfaz elige el modo de salida correcto automáticamente, y después deja que el usuario despliegue el detalle crudo si hace falta.

LOS MODOS DE INTERFAZ DEBERÍAN INFERIRSE, NO FORZARSE

No fuerces al usuario a elegir primero entre "modo chat", "modo agente", "modo automatización", "modo ops" y "modo empresa".

En cambio:
- inferí el modo probable a partir del pedido
- mostrá el modo seleccionado con claridad
- dejá que el usuario lo anule

Ejemplo:
- "¿Qué hace este archivo?" -> modo respuesta
- "Arreglá el test que falla" -> modo tarea
- "Preparame un plan de migración para este servicio" -> modo plan
- "Vigilá este sitio y avisame cuando falle la salud" -> modo monitor
- "Mandá el resumen semanal de KPI todos los lunes" -> modo automatización
- "Operá este negocio y escaláme las decisiones a mí" -> modo company-ops

EL USUARIO DEBERÍA PENSAR EN INTENCIONES, NO EN AGENTES

No hagas que la UX principal trate de elegir qué persona de agente usar.

Exponé los agentes cuando sea útil para:
- debugging
- control avanzado
- enrutamiento de especialistas
- revisión de confianza y políticas

Pero la UX principal debería tratar sobre:
- qué quiere el usuario
- qué está haciendo el sistema
- qué necesita del usuario

"¿Qué agente debería elegir?" es un olor de diseño, salvo que el usuario esté haciendo orquestación experta.

VISTAS CORE DEL USUARIO

Si construís una interfaz seria, con el tiempo debería incluir al menos estas vistas:

1. Home / centro de comando
- estado general del sistema
- trabajo activo
- aprobaciones pendientes
- incidentes
- costos principales
- riesgos principales
- victorias recientes
- trabajo estancado

2. Inbox universal
- aprobaciones
- preguntas para el humano
- fallas
- incidentes
- recomendaciones de alta prioridad
- escalamientos

3. Tablero de tareas y objetivos
- pendiente
- en ejecución
- completado
- fallido
- bloqueado
- presupuesto excedido

4. Vista de sesión y traza
- stream en vivo
- mensajes
- llamadas a herramientas
- artefactos
- línea de tiempo
- resumen de razonamiento
- qué cambió

5. Explorador de artefactos y archivos
- archivos
- reportes
- capturas de pantalla
- documentos
- salidas generadas
- diffs

6. Vista de máquina y entorno
- estado online
- CPU y memoria
- agentes activos
- carpetas actuales
- terminales
- escritorios
- sesiones de browser

7. Vista de workspace de proyecto
- plan
- tareas
- conocimiento
- memoria
- contratos
- KPIs
- incidentes
- workflows recurrentes

8. Vista operativa de empresa
- departamentos
- workflows
- KPIs
- objetivos
- aprobaciones
- tendencias de facturación o costo
- salud
- incidentes

9. Vista de portfolio
- muchas empresas o proyectos
- KPIs comparativos
- cuellos de botella
- asignación de personal o máquinas
- asignación de capital o presupuesto
- mapa de riesgo del portfolio

10. Vista de aprendizaje y eval
- mejoras recientes
- tendencias de eval
- regresiones
- cambios de confianza
- nuevas habilidades
- fallas convertidas en tests

LA INTERFAZ DEBERÍA RESPONDER ESTAS PREGUNTAS DE INMEDIATO

En cualquier momento, el usuario debería poder preguntar:
- ¿Qué estás haciendo ahora mismo?
- ¿Por qué lo estás haciendo?
- ¿Qué cambió?
- ¿Qué está bloqueado?
- ¿Qué necesita mi aprobación?
- ¿Qué falló?
- ¿Qué es lo más importante que tengo que mirar?
- ¿Qué está costando dinero?
- ¿Qué es riesgoso?
- ¿Qué aprendiste?
- ¿Qué vas a hacer después si no digo nada?

Si la interfaz no puede responder estas a partir de estado estructurado, el sistema está sub-instrumentado.

CONTROL DE ALTITUD

La interfaz debería permitir cambiar de altitud sin perder la continuidad.

El usuario debería poder moverse entre:
- transcripción cruda de sesión
- resumen de tarea
- resumen de proyecto
- resumen de empresa
- resumen de portfolio

El mismo estado subyacente debería alimentar a todos ellos.

Respuestas de baja altitud:
- el comando exacto que se corrió
- el archivo exacto que cambió
- la captura de pantalla exacta
- el error exacto

Respuestas de alta altitud:
- tema
- riesgo
- tendencia de KPI
- estado de departamento
- problema a nivel de todo el portfolio

Esto es crítico. Los sistemas potentes fallan cuando los usuarios solo pueden ver los detalles microscópicos o solo ver resúmenes ejecutivos.

DIVULGACIÓN PROGRESIVA

Por defecto, mostrá la vista mínima necesaria para mantener al usuario orientado.
Exponé detalles más profundos a pedido.

Por ejemplo, una tarjeta de objetivo debería mostrar:
- título
- responsable
- estado
- riesgo
- costo
- próximo paso

y permitir el drill-down hacia:
- tareas
- sesiones
- artefactos
- aprobaciones
- diffs
- métricas
- incidentes

EVENTOS, NO SOLO PÁGINAS

La interfaz debería sentirse viva.

Los eventos importantes deberían transmitirse en vivo hacia la UI:
- agente iniciado
- tarea reclamada
- tarea completada
- tarea fallida
- aprobación requerida
- presupuesto excedido
- máquina offline
- incidente abierto
- anomalía de KPI detectada
- automatización ejecutada
- nuevo objetivo proactivo propuesto

El usuario no debería tener que estar refrescando dashboards estáticos para entender el estado del sistema.

SUPERFICIES DE EXPLICABILIDAD

Cada acción significativa debería tener una superficie de explicación inspeccionable.

Para las decisiones importantes, mostrá:
- señal disparadora
- acción elegida
- por qué se eligió esa acción
- alternativas consideradas, si están disponibles
- confianza
- nivel de riesgo
- camino de aprobación

No confundas esto con un volcado de chain-of-thought. Dá explicaciones operativas concisas, ancladas en el estado del sistema.

UX DE APROBACIÓN

La aprobación debería ser una de las partes mejor diseñadas de la interfaz.

Un pedido de aprobación debería mostrar:
- qué acción se está solicitando
- por qué importa
- qué podría salir mal
- qué va a pasar si se aprueba
- qué va a pasar si se deniega
- si está disponible modificar
- archivos, clientes, servicios o presupuestos relacionados

El usuario debería poder:
- aprobar
- denegar
- modificar
- diferir
- permitir siempre para un alcance de política acotado
- denegar siempre para un alcance de política acotado

Las aprobaciones deberían crear señales de aprendizaje para el sistema.

EXPERIENCIA DE TAREA CHICA

Para las tareas minúsculas, la interfaz debería sentirse instantánea y liviana.

El usuario debería poder decir:
- "renombrá esta variable"
- "abrí los logs"
- "redactá este email"
- "resumime este doc"
- "arreglá este comando que falla"

y obtener:
- ejecución o respuesta inmediata
- mínima sobrecarga visual
- evidencia visible
- expansión con un clic hacia más detalle si se desea

No hagas que las tareas chicas se sientan como software de workflow empresarial.

EXPERIENCIA DE OBJETIVO DE LARGA DURACIÓN

Para los objetivos de larga duración, la interfaz debería sentirse como un sistema de control de misión.

El usuario debería poder ver:
- fase actual
- grafo de tareas
- workers activos
- evidencia hasta el momento
- bloqueos
- costos
- riesgos
- aprobaciones
- si el sistema está esperando o todavía progresando

El usuario debería poder intervenir sin destruir la continuidad.

EXPERIENCIA DE OPERAR UNA EMPRESA

Si el sistema está ayudando a operar una empresa, la interfaz de usuario debería sentirse como un sistema operativo para el negocio, no como una colección de chats.

Debería soportar:
- panorama general de la empresa
- dashboards por departamento
- calendario de operaciones recurrentes
- tendencias de KPI
- incidentes
- programas de objetivos
- cola de decisiones
- pipeline de clientes
- resúmenes de finanzas
- colas de soporte
- memos de estrategia

Debería permitirle al usuario moverse desde:
- "mostrame el estado de la empresa"
a
- "mostrame qué workflow se está atrasando"
a
- "mostrame la tarea y la sesión exactas que lo causaron"
a
- "arreglalo y seguí monitoreando"

EXPERIENCIA DE EMPRESA INFINITA O MULTI-ORG

Si el sistema se usa para operar muchas empresas, marcas, clientes o unidades de negocio, la interfaz debe volverse portfolio-native.

Esto significa:
- cada empresa es su propio workspace
- cada workspace tiene sus propios objetivos, memoria, KPIs, aprobaciones y políticas
- el usuario puede comparar workspaces lado a lado
- el usuario puede hacer preguntas entre empresas
- el usuario puede asignar máquinas, agentes, presupuestos y atención entre ellas

Consultas útiles entre empresas:
- ¿Qué empresas tienen más trabajo bloqueado?
- ¿Qué equipos necesitan decisiones mías hoy?
- ¿Dónde está creciendo más rápido el gasto?
- ¿Qué workflows recurrentes están fallando en múltiples empresas?
- ¿Qué patrón que funcionó en la empresa A debería aplicarse a la empresa B?

La interfaz debería mostrar tanto:
- profundidad por empresa
- síntesis entre empresas

MEMORIA Y BÚSQUEDA DE PORTFOLIO

El usuario debería poder buscar a través de:
- tareas
- archivos
- sesiones
- documentos
- decisiones
- incidentes
- KPIs
- clientes
- experimentos
- workflows

La búsqueda debería soportar tanto:
- búsqueda directa
- preguntas en lenguaje natural sobre el estado estructurado

Los usuarios no deberían tener que recordar en qué workspace pasó algo.

CONFIANZA Y CALMA HUMANA

La interfaz debería reducir la ansiedad, no amplificarla.

Hacé esto mostrando:
- qué está bajo control
- qué está esperando
- qué es riesgoso
- qué necesita atención ahora
- qué puede esperar con seguridad

Evitá abrumar al usuario con todos los eventos crudos todo el tiempo.
Usá resúmenes, rollups y umbrales de escalamiento.

FORMA POR DEFECTO DE LA INTERFAZ

Si necesitás un layout por defecto, usá algo como:
- arriba: ask bar universal y alcance actual
- izquierda: navegación por workspace, máquinas, proyectos, empresas e inbox
- centro: superficie de trabajo activa con pestañas o vistas apiladas
- derecha: panel inspector para estado, evidencia, costos, aprobaciones y drill-down

Dentro de ese layout, soportá:
- chat
- terminal
- visor y editor de archivos
- tarjetas de dashboard
- tablero de tareas
- sesiones de escritorio remoto o de browser
- reportes
- incidentes

El sistema debería sentirse como una sola superficie operativa coherente, no como mini-apps desconectadas.

CRITERIOS DE ÉXITO DE LA INTERFAZ

La interfaz es buena si un usuario nuevo puede:
- pedir una tarea minúscula y obtener un resultado rápido
- pedir un objetivo complejo y entender el progreso
- descubrir qué está haciendo el sistema sin leer código
- encontrar aprobaciones y decisiones rápidamente
- inspeccionar evidencia sin fricción
- pausar o redirigir el sistema con confianza
- hacer zoom desde una tarea hasta un proyecto, hasta una empresa, hasta muchas empresas sin perderse
