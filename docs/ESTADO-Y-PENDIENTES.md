# Estado honesto y pendientes

Este documento existe para no engañarnos. Resume **dónde está realmente el proyecto** y
**qué falta**, separado de la aspiración (que vive en [`vision/`](./vision/README.md)) y
de la descripción técnica de lo construido ([`ARCHITECTURE.md`](./ARCHITECTURE.md)).

## Lectura honesta del estado

**1. No es todavía "impresionar a DeepMind", y está bien.** DeepMind no se impresiona con
un AIOS — se impresiona con una cosa hecha rigurosamente. Lo que hay es una **base
excelente y honesta, no un sistema probado en producción**. La diferencia entre "compila
y testea" y "maneja una empresa de verdad" sigue siendo enorme, y el CHARTER lo pide. Eso
no es un defecto: es la distancia real.

**2. El CHARTER sigue siendo ~10x más grande que el sistema.** Se construyeron los **13
primeros pasos del BUILD ORDER**, pero las partes [7 (interfaz/UX)](./vision/07-interfaz-y-ux.md)
y [8 (empresa/ciencia)](./vision/08-dominios-proyecto-empresa-ciencia.md) del charter
describen un producto del que hoy no hay casi nada. Mientras `ARCHITECTURE.md` mantenga
esa honestidad, no es problema — pero **no hay que creerse el charter como si fuera el
estado actual**.

**3. Lo más valioso fue conceptual, no de código.** La decisión de **perseguir la base
honesta antes que la visión grande** es lo que separa un proyecto serio de un demo. El
techo de acá en adelante lo pone el **uso real**, no más arquitectura.

## Pendientes concretos (derivados de lo anterior)

### A. Probarlo en producción / uso real (del punto 1)
- [ ] Correr el loop de punta a punta en **un caso de uso real y chico** (no tests): un
      objetivo verdadero que produzca evidencia verificable.
- [ ] Endurecimiento para uso real: manejo de errores de red sostenidos, reanudación tras
      crash a mitad de tarea, límites de costo reales con una API key productiva.
- [ ] Medir las métricas que el charter pide sobre corridas reales (pass@1, costo-por-tarea,
      tasa de intervención) y no solo en simulación.

### B. Cerrar la brecha del CHARTER (del punto 2)
- [ ] **Parte 7 — Interfaz/UX**: hoy solo hay CLI + `dashboard.md`. Falta toda la doctrina
      de interfaz (ask bar, vistas core, control de altitud, UX de aprobación).
- [ ] **Parte 8 — Dominios empresa/ciencia**: hoy no hay capacidades específicas; son, por
      ahora, goals + skills genéricas.
- [ ] **Automatización desktop** (control de GUI): único ítem del BUILD ORDER 14 sin empezar;
      requiere entorno gráfico + lib nativa (ej. `nut.js`).

### C. Disciplina para que siga siendo serio (del punto 3)
- [ ] Antes de agregar capas nuevas del charter, exigir **un caso de uso real que las
      justifique** (evitar volver a "promete mucho, hace poco").
- [ ] Mantener `ARCHITECTURE.md` honesto en cada cambio: lo implementado vs. el roadmap.

### D. Higiene de pipeline (descubierto en auditoría del 2026-06-30 — resuelto el mismo día)
Estaba sin cubrir porque el BUILD ORDER original no lo pedía en ningún paso (ver
[`12-plan-de-construccion.md`](./vision/12-plan-de-construccion.md), ya actualizado con
una sección transversal de higiene de pipeline para que no se repita). Cerrado así:

- [x] **CI**: `.github/workflows/ci.yml` corre `typecheck` + `lint` + `format:check` +
      `test` en cada push/PR a `master`/`main`.
- [x] **Linter/formatter**: ESLint (flat config, `eslint.config.mjs`) + Prettier
      (`.prettierrc.json`) configurados en la raíz, cubriendo todo el monorepo. El
      `no-explicit-any` quedó en `warn` (hay ~30 usos preexistentes en bordes de SDK
      como Gemini/Docker/Playwright) — no bloquea CI, pero evita que se sumen más.
- [x] **Script `typecheck` roto**: era `"tsc --build --noEmit"`, incompatible con
      project references compuestas (composite necesita emitir `.d.ts` para que los
      paquetes downstream resuelvan tipos vía `dist/`). Pasó a `"tsc --build"` — el
      type-check ya ocurre durante el build mismo; un build exitoso garantiza tipos
      correctos en este setup.
- ~~Distinguir modo simulación vs. real en los reportes~~ — **no era un gap real**: el
  reporte (`packages/evals/src/report.ts:12`) ya incluye `**Modo:** simulación (sin API
  key)` / `en vivo`. La entrada anterior de este documento lo daba como pendiente por
  error; queda corregido acá.

Si replicás este proyecto desde cero, el plan actualizado ya cubre esto desde el primer
commit. Si seguís construyendo sobre este repo, el siguiente paso real (no de higiene)
es la sección A: probarlo contra un caso de uso real.

## Lo que SÍ está hecho (para contexto)

BUILD ORDER pasos 1–13 completos, browser (lectura + interactivo) del 14, y multi-worker +
multi-máquina configurable del 15. Detalle y matriz de capacidades en
[`ARCHITECTURE.md`](./ARCHITECTURE.md#runtime-capability-matrix).

> **En una frase:** el proyecto pasó de *"promete mucho, hace poco"* a *"promete lo que
> hace"*. Ese es el upgrade real. De acá en adelante, el límite es el uso, no la arquitectura.
