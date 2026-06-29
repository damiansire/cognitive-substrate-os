# Ecosistema: sistemas para estudiar

> **Resumen (es).** Sistemas, repos y protocolos del ecosistema para estudiar y tomar ideas: referencias open-source, stacks de agentes, infraestructura de soporte, protocolos abiertos y meta-lecciones.
>
> Parte 11 de 12 · [↩ Índice](./README.md)

---

SISTEMAS INFORMADOS POR LA INVESTIGACIÓN PARA ESTUDIAR Y ROBARLES IDEAS

Las siguientes referencias se seleccionaron a partir de fuentes primarias vigentes al 28 de marzo de 2026. No están acá porque sean herramientas populares. Están acá porque demuestran públicamente arquitectura que importa para construir un sistema de agentes serio y auto-mejorante.

No las copies a ciegas (cargo-cult). Extraé patrones estructurales y adaptalos al runtime que realmente tenés.

Regla de selección:
- incluir sistemas que revelen ejecución durable, workflows, contratos tipados, memoria, evaluación, serving, protocolos o trazabilidad
- excluir sistemas que sean principalmente wrappers, productos de chat genéricos o cáscaras de UI sin arquitectura pública fuerte

REFERENCIAS DE ARQUITECTURA OPEN SOURCE

- LangGraph
  - Aprendé de su modelo de orquestación basado en grafos, ejecución durable, checkpointing, inspección de estado con human-in-the-loop, workflows de larga duración, memoria y orientación a trace/debug.
  - Robá la idea de que el control de flujo del agente muchas veces debería ser explícito, reanudable e inspeccionable en lugar de estar oculto en un único loop conversacional gigante.
  - Fuente: https://github.com/langchain-ai/langgraph

- Letta
  - Aprendé de los agentes con estado y memoria primero (memory-first), identidad de agente durable, bloques de memoria explícitos, y de tratar a los agentes como entidades persistentes en lugar de sesiones de chat descartables.
  - Robá la idea de que los agentes de larga vida deberían tener primitivas de estado y memoria de primera clase en lugar de depender de transcripciones de conversación siempre crecientes.
  - Fuente: https://github.com/letta-ai/letta

- Microsoft AutoGen
  - Aprendé de su arquitectura por capas: un núcleo de bajo nivel orientado a eventos, abstracciones de chat de más alto nivel, una capa de extensión, runtime local y distribuido, Studio para prototipar y Bench para evaluación.
  - Robá la idea de que un mismo sistema debería exponer múltiples niveles de abstracción en lugar de forzar a cada constructor al mismo estilo de orquestación.
  - Fuente: https://github.com/microsoft/autogen

- Microsoft Agent Framework
  - Aprendé de su separación explícita entre agentes y workflows, su routing type-safe, checkpointing, estado de sesión, middleware y soporte de human-in-the-loop.
  - Robá la idea de que el comportamiento abierto del agente y los workflows explícitos de grafo deberían coexistir en una sola plataforma, con los workflows manejando las partes donde el determinismo importa.
  - Fuente: https://learn.microsoft.com/en-us/agent-framework/overview/

- Semantic Kernel
  - Aprendé de su ecosistema de plugins, su framework de procesos para workflows de negocio, flexibilidad de modelos, postura de grado empresarial, soporte multimodal y enfoque de SDK multi-lenguaje.
  - Robá la idea de que los sistemas de agentes empresariales necesitan modelado de procesos y conectores de primera clase, no solo abstracciones de prompts.
  - Fuente: https://github.com/microsoft/semantic-kernel

- Google ADK
  - Aprendé de su diseño agnóstico de modelo y de deployment, su postura de software-engineering-first, su soporte de evaluación incorporado, su sistema de contexto consciente de artefactos, y su builder visual que genera código y YAML.
  - Robá la idea de que los builders visuales deberían generar artefactos de código fuente portables en lugar de convertirse en trampas opacas de no-code.
  - Fuentes: https://google.github.io/adk-docs/ y https://google.github.io/adk-docs/visual-builder/

- PydanticAI
  - Aprendé de sus salidas estructuradas type-safe, su capa de proveedores agnóstica de modelo, su integración con observabilidad y eval, sus paquetes de capacidades reutilizables, sus definiciones YAML/JSON y su soporte para interoperabilidad estilo MCP y A2A.
  - Robá la idea de que las interfaces tipadas, la validación y los hooks de eval deberían ser nativos, no agregados después.
  - Fuente: https://github.com/pydantic/pydantic-ai

- DSPy
  - Aprendé del programar-en-vez-de-promptear, los módulos de LM componibles, y la auto-mejora estilo optimizador o compilador contra conjuntos de evaluación.
  - Robá la idea de que la mejora de prompts y políticas debería tratarse como un problema de optimización medible, no como edición artesanal de prompts.
  - Fuente: https://github.com/stanfordnlp/dspy

- Mastra
  - Aprendé de combinar agentes abiertos con workflows explícitos de grafo, pausa y reanudación respaldadas por almacenamiento para human-in-the-loop, evals y observabilidad incorporados, y la autoría de servidores MCP.
  - Robá la idea de que la suspensión de workflows, las esperas de aprobación y la reanudabilidad deberían ser operaciones nativas del runtime.
  - Fuente: https://github.com/mastra-ai/mastra

- AgentScope y AgentScope Runtime
  - Aprendé de la ejecución asíncrona multi-agente, las primitivas de ruteo de mensajes como MsgHub y pipelines, y la separación entre el framework de autoría y el runtime de deployment con ejecución de herramientas en sandbox.
  - Robá la idea de que el runtime de producción, el sandboxing seguro y las superficies de autoría del desarrollador deberían ser capas distintas pero compatibles.
  - Fuentes: https://github.com/agentscope-ai/agentscope y https://github.com/agentscope-ai/agentscope-runtime

- OpenHands
  - Aprendé de un agente de software centrado en archivos con superficies de runtime explícitas, infraestructura de ejecución de tareas, y un motor central reutilizado a través de CLI, GUI, SDK y deployments hosteados.
  - Robá la idea de que el motor central de ejecución debería sobrevivir a través de las superficies y los modelos de deployment.
  - Fuente: https://github.com/OpenHands/OpenHands

SISTEMAS OPERATIVOS DE AGENTES Y STACKS DE METODOLOGÍA OPEN-SOURCE

- OpenClaw
  - Aprendé de una plataforma de agentes grande e integrada que combina un control plane, sesiones, operación de browser y desktop, skills, workflows, scheduling e interacción multi-superficie en un único sistema abierto.
  - Robá la idea de que una plataforma de agentes seria necesita una columna vertebral de orquestación durable que sirva a muchas superficies de interacción y modos de ejecución.
  - Fuente: https://github.com/openclaw/openclaw

- Hermes Agent
  - Aprendé de un loop de aprendizaje incorporado con creación autónoma de skills, auto-mejora de skills durante el uso, memoria y búsqueda cross-session, automatizaciones programadas, subagentes aislados y ejecución multi-backend.
  - Robá la idea de que la auto-mejora debería ocurrir tanto online durante el uso real como offline a través de evals, con memoria durable a través de sesiones y canales.
  - Fuente: https://github.com/NousResearch/hermes-agent

- Paperclip
  - Aprendé de convertir el trabajo del agente en primitivas explícitas de operaciones de negocio: empresas, equipos, inboxes, heartbeats, tickets, presupuestos, trabajos recurrentes, memoria con scope y gobernanza.
  - Robá la idea de que “correr una empresa con agentes” requiere objetos del control plane como presupuesto, escalación, propiedad y límites organizacionales, no solo chat más tareas.
  - Fuente: https://github.com/paperclipai/paperclip

- Superpowers
  - Aprendé de los workflows de software forzados por skills: clarificación de diseño, aislamiento por worktree, planes ejecutables diminutos, desarrollo dirigido por subagentes, TDD obligatorio, revisión estructurada y cierre de rama controlado.
  - Robá la idea de que la metodología de ingeniería de alto valor debería codificarse como skills y triggers ejecutables, no quedar como consejos en un manual.
  - Fuente: https://github.com/obra/superpowers

- gstack
  - Aprendé de un stack especialista agresivamente opinado, montado encima de un agente de coding: revisión de arquitectura, revisión de diseño, QA de browser, revisión de seguridad, flujo de release y skills locales del repo commiteadas.
  - Robá la idea de que un agente generalista se vuelve mucho más fuerte cuando se lo envuelve en procedimientos operativos especialistas con entrypoints y superficies de revisión claras.
  - Fuente: https://github.com/garrytan/gstack

- SWE-agent y mini-SWE-agent
  - Aprendé de la disciplina de benchmarks, el sandboxing, los navegadores de trayectorias, y la voluntad de mantener un agente baseline simple que sea fácil de razonar.
  - Robá la idea de que siempre deberías preservar un camino de agente mínimo, fuerte y fácil de evaluar, incluso si más adelante agregás orquestación más elaborada.
  - Fuentes: https://github.com/SWE-agent/SWE-agent y https://github.com/SWE-agent/mini-swe-agent

- CopilotKit
  - Aprendé de la UI generativa, el estado compartido entre agente y UI, y los patrones explícitos de interacción human-in-the-loop para aplicaciones agent-native.
  - Robá la idea de que la interacción agente-usuario debería tener un protocolo y un modelo de estado compartido, no solo una transcripción de chat.
  - Fuente: https://github.com/CopilotKit/CopilotKit

INFRAESTRUCTURA DE SOPORTE OPEN-SOURCE

- LiteLLM
  - Aprendé de poner un gateway unificado delante de muchos proveedores de modelos con presupuestos, logging, routing y comportamiento de fallback.
  - Robá la idea de que el acceso a modelos debería estar centralizado y ser consciente de políticas en lugar de estar disperso por todo el codebase.
  - Fuente: https://github.com/BerriAI/litellm

- Graphiti
  - Aprendé de la memoria de grafo de conocimiento consciente del tiempo (temporally-aware), el modelado bi-temporal, las actualizaciones incrementales y la recuperación híbrida sobre estado dinámico.
  - Robá la idea de que la memoria del agente debería representar hechos cambiantes a lo largo del tiempo, no solo anexar notas.
  - Fuente: https://github.com/getzep/graphiti

- Langfuse
  - Aprendé de la observabilidad centrada en traces, datasets, experimentos, gestión de prompts e instrumentación amigable con OpenTelemetry para sistemas de LLM.
  - Robá la idea de que los sistemas de agentes en producción necesitan traces unificados y datasets de eval, no logs desconectados.
  - Fuente: https://github.com/langfuse/langfuse

- Opik
  - Aprendé de combinar observabilidad, evaluación automatizada, scoring online, optimizadores y dashboards de producción en un único stack de eval abierto.
  - Robá la idea de que la evaluación debería continuar en producción y retroalimentar los loops de mejora.
  - Fuente: https://github.com/comet-ml/opik

- Invariant Guardrails
  - Aprendé de las reglas de política sobre traces y flujos de herramientas, más la aplicación pre- y post-call alrededor de las interacciones de LLM y MCP.
  - Robá la idea de que los chequeos de seguridad y política deberían ubicarse como una capa de aplicación dedicada alrededor del agente, no quedar enterrados solo en los prompts.
  - Fuente: https://github.com/invariantlabs-ai/invariant

- vLLM
  - Aprendé del serving de inferencia de alto throughput y de la separación de la infraestructura de serving de modelos respecto de la lógica del agente.
  - Robá la idea de que serving, routing y orquestación de ejecución deberían ser capas distintas.
  - Fuente: https://github.com/vllm-project/vllm

- E2B
  - Aprendé de los sandboxes aislados y seguros para código generado por IA, la ejecución self-hosted, y de tratar la ejecución de código como infraestructura en lugar de como algo secundario.
  - Robá la idea de que los agentes serios necesitan un sustrato de ejecución diseñado para código generado no confiable.
  - Fuente: https://github.com/e2b-dev/E2B

- Daytona
  - Aprendé de los sandboxes persistentes y elásticos con APIs programáticas de archivos, git, ejecución y LSP, diseñados específicamente para cargas de trabajo de código generado por IA.
  - Robá la idea de que los sandboxes de ejecución deberían ser rápidos de crear, durables cuando hace falta, y controlables a través de APIs de primera clase.
  - Fuente: https://github.com/daytonaio/daytona

- LlamaIndex
  - Aprendé de tratar a los conectores de datos, la indexación, la recuperación, los workflows y la interacción con el conocimiento como arquitectura de primera clase y no como agregados posteriores.
  - Robá la idea de que la plomería de datos y la recuperación de memoria son capacidades centrales del agente.
  - Fuente: https://github.com/run-llama/llama_index

- Haystack
  - Aprendé de los pipelines de RAG orientados a producción, las herramientas de evaluación y los stacks de recuperación componibles.
  - Robá la idea de que la calidad de la recuperación y la calidad de la evaluación deberían diseñarse como parte de la plataforma.
  - Fuente: https://github.com/deepset-ai/haystack

- Mem0
  - Aprendé de hacer de la memoria un servicio dedicado con primitivas de memoria de usuario, de sesión y de agente.
  - Robá la idea de que la memoria puede ser un subsistema explícito, no solo un archivo de notas.
  - Fuente: https://github.com/mem0ai/mem0

- agent-sandbox
  - Aprendé de una abstracción nativa de Kubernetes para sandboxes aislados, con estado, singleton, con identidad estable, persistencia, pausa y reanudación, warm pools y opciones de runtime vendor-neutral.
  - Robá la idea de que los runtimes de agentes en la nube merecen una abstracción de sandbox dedicada en lugar de ser forzados torpemente a patrones de deployment genéricos sin estado.
  - Fuente: https://github.com/kubernetes-sigs/agent-sandbox

- Temporal
  - Aprendé de la ejecución durable, reintentos, timers, checkpoints, versionado de workflows y orquestación de larga duración tolerante a fallos.
  - Robá la idea de que los workflows de agentes de alto riesgo muchas veces deberían construirse sobre un sustrato de workflow durable en lugar de código de reintentos ad hoc.
  - Fuente: https://github.com/temporalio/temporal

PROTOCOLOS ABIERTOS Y ESTÁNDARES COMPARTIDOS

- Model Context Protocol (MCP)
  - Aprendé del enfoque de protocolo para conectar agentes a herramientas, datos, prompts y recursos a través de una interfaz portable.
  - Robá la idea de que el acceso a capacidades debería estandarizarse para que tu sistema pueda moverse entre proveedores y runtimes.
  - Fuente: https://modelcontextprotocol.io/

- AGENTS.md y la Agentic AI Foundation
  - Aprendé del empuje hacia instrucciones de proyecto portables, gobernanza abierta y convenciones vendor-neutral para agentes de coding.
  - Robá la idea de que todo repo debería exponer una superficie de instrucciones estable y portable para cualquier agente compatible.
  - Fuentes: https://openai.com/index/agentic-ai-foundation y https://agents.md

SEÑALES DE ARQUITECTURA DE CÓDIGO CERRADO

- Claude Code y el Claude Agent SDK
  - Aprendé de los subagentes con contexto y permisos aislados, MCP como capa de integración de primera clase, configs de MCP con scope de proyecto, tareas recurrentes, múltiples superficies de trabajo, y de exponer el mismo agent loop como un SDK programable.
  - Robá la idea de que los sistemas de agentes deberían soportar contextos especialistas aislados, límites de permisos de herramientas, y un único loop compartido a través de las superficies de CLI, app, IDE, web y SDK.
  - Fuentes: https://code.claude.com/docs/en/overview , https://code.claude.com/docs/en/sub-agents , https://code.claude.com/docs/en/mcp , https://platform.claude.com/docs/en/agent-sdk/overview

- OpenAI Agents SDK, herramientas Responses/Agent, Deep Research y ChatGPT Agent
  - Aprendé de la disciplina de mantener las primitivas pequeñas: agentes, handoffs, guardrails, sesiones, human-in-the-loop, tracing, más búsqueda web incorporada, búsqueda de archivos y computer use.
  - Aprendé de Deep Research y del ChatGPT agent que la investigación asíncrona, el seguimiento de progreso, las citas, la interrumpibilidad y la posterior toma de acciones deberían coexistir en un único ecosistema de agentes.
  - Robá la idea de que el modo investigación y el modo acción son distintos pero componibles.
  - Fuentes: https://openai.github.io/openai-agents-python/ , https://openai.com/index/new-tools-for-building-agents/ , https://openai.com/index/introducing-deep-research/ , https://openai.com/index/introducing-chatgpt-agent/

- Devin / Cognition
  - Aprendé de la admisión de tareas cross-surface a través de web, Slack, tickets, CLI y API; la indexación automática de repos; el Q&A del codebase antes de la ejecución; las interfaces específicas de revisión; los loops de autofix contra bots de revisión y CI; los agentes programados; los agentes paralelos gestionados; y el Agent Trace para preservar el linaje del grafo de contexto.
  - Robá la idea de que los agentes de coding se vuelven mucho más poderosos cuando se los empareja con agentes de revisión, sesiones recurrentes y trazabilidad durable de por qué cambió el código.
  - Fuentes: https://cognition.ai/blog/how-cognition-uses-devin-to-build-devin , https://cognition.ai/blog/closing-the-agent-loop-devin-autofixes-review-comments , https://cognition.ai/blog/agent-trace , https://cognition.ai/blog/devin-can-now-schedule-devins

META-LECCIONES TRANSVERSALES DEL ECOSISTEMA

- Preservá un baseline de agente único fuerte antes de recurrir a topologías multi-agente complejas.
- Separá los agentes abiertos de los workflows explícitos.
- Construí memoria durable y checkpoints temprano.
- Hacé que la observabilidad, los traces y los evals sean de primera clase.
- Tratá la automatización de browser y desktop como dominios de infraestructura separados, con sus propias necesidades de confiabilidad.
- Emparejá los agentes generadores con agentes revisores o verificadores para el trabajo de mayor riesgo.
- Convertí las trayectorias exitosas recurrentes en skills, workflows o playbooks reutilizables.
- Favorecé los protocolos abiertos, las capas de adaptador y los archivos de instrucciones portables.
- Soportá la ejecución local-first, pero diseñá de modo que el mismo núcleo pueda escalar a workers en la nube.
- Rastreá no solo los resultados, sino también las trayectorias, los costos, los reintentos y las intervenciones humanas.
