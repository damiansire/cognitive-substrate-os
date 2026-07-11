# Threat model del sandbox

Este documento cubre qué puede hacer un agente malicioso o mal instruido
dentro de `cognitive-substrate-os`, qué protege el sandbox actual, y qué NO
protege todavía. Se basa en el código real de `packages/governance` y
`packages/sandbox-*`, no en aspiración.

## Activos sensibles

- **Filesystem del host**: el motor es "filesystem-first" — todo el estado es
  un archivo en disco. Un escape de sandbox con capacidad de escritura fuera
  de las raíces permitidas puede modificar cualquier archivo accesible por el
  proceso del usuario que corre el engine.
- **Credenciales/tokens de API**: cualquier variable de entorno o archivo de
  config con la API key de Gemini u otros secretos, si un agente logra leerlos
  y exfiltrarlos (por ejemplo, vía una llamada de red no controlada).
- **Comandos de terminal**: `sandbox-terminal` expone ejecución de comandos —
  el vector de mayor impacto si no está bien acotado.
- **Egress de red**: `sandbox-browser` permite que un agente navegue/haga
  requests — el vector de exfiltración de datos si no hay allowlist.

## Vectores de ataque considerados y cubiertos (con test real)

Verificado en `packages/evals/src/cases.ts` (casos `adversarial-*`, trackeados
en git, no solo documentados):

- **Escape de sandbox por lectura fuera de raíz** (`adversarial-fs-read-escape`):
  intento de leer un archivo fuera de las raíces permitidas del sandbox de
  filesystem, con `../` u otra técnica de path traversal.
- **Escape de sandbox por escritura fuera de raíz**
  (`adversarial-fs-write-escape`): mismo vector, para escritura.
- **Inyección vía lectura de skills** (`adversarial-skill-read-injection`):
  intento de leer secretos fuera de las raíces designadas para skills.
- **Comando destructivo en terminal** (`adversarial-terminal-destructive`):
  confirma que un comando destructivo (ej. borrado masivo) queda bloqueado.
- **Gate de governance** (`adversarial-governance-gate`): confirma que el
  approval gate deniega/permite correctamente según corresponda.
- **Egress de browser** (`adversarial-browser-egress`): confirma que la
  allowlist de dominios se respeta.

## Vectores de ataque NO cubiertos todavía (gap real, no hipotético)

- **Límites de recursos** (CPU, memoria, tiempo de ejecución, tasa de
  llamadas): no existe ningún caso `adversarial-*` que fuerce agotamiento de
  recursos. Un agente en loop (o instruido para hacerlo) podría consumir CPU
  o memoria sin límite hoy. **(cso-2, pendiente)**
- **Locking de escrituras de estado concurrentes**: existe un mecanismo de
  "task claiming" (`packages/engine/src/claims.ts`, `fs.writeFileSync` con
  flag `wx` + TTL) para reclamar tareas, pero **no hay locking genérico de
  archivo** para el resto de las escrituras de estado, y el test existente
  (`behavioral-worker-claiming`) corre todo in-process y secuencial — no
  simula dos procesos reales escribiendo al mismo tiempo. Dos procesos del
  engine corriendo en paralelo sobre el mismo estado podrían corromperlo.
  **(cso-adn-1, pendiente)**
- **Aislamiento real (contenedor/WASM)**: el sandboxing hoy es manual en
  TypeScript (validación de paths, allowlists), no una primitiva de
  aislamiento del sistema operativo (contenedor de un solo uso, runtime WASM
  con límites de memoria/CPU impuestos por diseño). Los tests de arriba
  confirman que la lógica de validación funciona para los casos que cubre,
  pero no hay una segunda capa de aislamiento si esa lógica tiene un bug no
  cubierto por un test. **(cso-adn-2a, trabajo de días, Fase 4)**

## Cómo se actualiza este documento

Cuando se agregue un nuevo caso `adversarial-*` a
`packages/evals/src/cases.ts`, sumarlo a la lista de "cubiertos" de arriba.
Cuando se cierre cso-2 o cso-adn-1, mover ese ítem de "no cubiertos" a
"cubiertos" con la referencia al test que lo prueba.
