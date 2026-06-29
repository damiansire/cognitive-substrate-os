# Visión & Charter — índice

El **charter de visión** del proyecto (la especificación aspiracional de lo que el
sistema busca ser) era un solo archivo de ~2950 líneas en inglés, difícil de digerir.
Acá está **partido en 12 partes temáticas y traducido al español**: cada una arranca con
un **resumen** y debajo el contenido completo. Juntas cubren el charter entero, sin
pérdida de contenido.

> **Qué es esto (y qué no).** Describe el **destino**, no el estado actual. Para lo que
> está **construido hoy**, mirá [`../ARCHITECTURE.md`](../ARCHITECTURE.md) y la sección
> "Implemented vs. Roadmap" del [README](../../README.md).
>
> **Atribución.** Los conceptos fundacionales y la primera parte de este charter fueron
> creados por **Nir Feinstein** ([nirfeinste.in](https://www.nirfeinste.in/)). El borrador
> original estaba incompleto; acá se expandió y completó con todas las capas faltantes.

## Las 12 partes

| # | Parte | De qué trata |
|---|-------|--------------|
| 1 | [Norte y postura](./01-norte-y-postura.md) | El objetivo, el North Star, métricas de éxito y la postura de "construir, no describir". |
| 2 | [Confiabilidad y capacidades](./02-confiabilidad-y-capacidades.md) | La matemática de la confiabilidad y la escalera de adquisición de capacidades. |
| 3 | [Momentum y harness](./03-momentum-y-harness.md) | El motor de progreso compuesto: colas, ratchets, anti-estancamiento y harness. |
| 4 | [Principios y apuestas](./04-principios-y-apuestas.md) | Principios core y apuestas de diseño no-negociables (filesystem-first, etc.). |
| 5 | [Implementación y patrones](./05-implementacion-y-patrones.md) | Defaults recomendados, patrones de alto apalancamiento y forma canónica del repo. |
| 6 | [Capas, autonomía y coordinación](./06-capas-autonomia-coordinacion.md) | Capas del sistema, niveles de autonomía, gaps y coordinación multi-agente. |
| 7 | [Interfaz y UX](./07-interfaz-y-ux.md) | La doctrina completa de interfaz para el usuario final (modelo fractal, ask bar…). |
| 8 | [Dominios: proyecto/empresa/ciencia](./08-dominios-proyecto-empresa-ciencia.md) | Operar como SO de proyectos, empresas y ciencia; verificación. |
| 9 | [Seguridad y aprendizaje](./09-seguridad-y-aprendizaje.md) | Seguridad, shadow mode, aprendizaje activo e inteligencia externa. |
| 10 | [Portabilidad, costo y estándares](./10-portabilidad-costo-estandares.md) | Costo/performance, portabilidad, estándares abiertos y expansión. |
| 11 | [Ecosistema para estudiar](./11-ecosistema-para-estudiar.md) | Sistemas, repos y protocolos del ecosistema de los que aprender. |
| 12 | [Plan de construcción](./12-plan-de-construccion.md) | El BUILD ORDER (los 15 pasos que seguimos), primer milestone, evals y arranque. |

## Cómo se relaciona con lo construido

Cada milestone del trabajo (M1–M11) corresponde a pasos del **BUILD ORDER** (parte 12).
El mapa de qué está implementado vs. roadmap vive en
[`../ARCHITECTURE.md`](../ARCHITECTURE.md#runtime-capability-matrix).
