# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Al planificar una feature, crear especificaciones o diseñar la arquitectura de contratos. | spec-architect | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\spec-architect\SKILL.md |
| Al implementar código, crear componentes o refactorizar siguiendo specs. | worker-engineer | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\worker-engineer\SKILL.md |
| Antes de dar por terminada una tarea, al verificar código o correr auditoría de calidad. | strict-judge | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\strict-judge\SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\branch-pr\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\issue-creation\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\judgment-day\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\Tadeo Leon Ferense\.gemini\config\skills\go-testing\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### spec-architect
- Todo comportamiento funcional debe definirse en escenarios Gherkin (`Given-When-Then`) claros y verificables mediante tests.
- Definir interfaces TypeScript con tipos cerrados o esquemas Zod; prohibido usar `any`.
- En integraciones con servicios externos (ej. Google Gemini API), especificar formalmente el formato exacto (`camelCase` en Protobuf REST como `inlineData`, `mimeType`).
- Atomic Design estricto (`atoms/`, `molecules/`, `organisms/`) con variantes semánticas cerradas (`primary`, `secondary`, `success`, `danger`).
- Separar estrictamente componentes presentacionales (tontos) de componentes contenedores (con lógica/estado).

### worker-engineer
- TDD Estricto (Red-Green-Refactor): escribir primero el test, comprobar que falle, implementar el código mínimo para pasar y refactorizar.
- Mobile-First inquebrantable (`base:` -> `md:` -> `lg:`), viewport inicial compacto sin scroll innecesario y paginación adaptativa (máx 3 en mobile con "Ver más", 10 en desktop).
- Simetría matemática en múltiplos de 4px/8px; prohibido valores mágicos en `px` o alturas mínimas fijas (`min-h-[...]`), usar `h-fit`.
- Botones semánticos: entrada/aprobación `variant="success"` (`bg-emerald-600`), salida/peligro `variant="danger"` (`bg-rose-600`).
- Respetar si es Client-Only o Fullstack; nunca inventar dependencias fuera de `package.json`.

### strict-judge
- Compilación limpia obligatoria (`tsc --noEmit` con 0 errores).
- Linter y formato con 0 warnings y 0 errores.
- 100% de la suite de tests en verde.
- Auditar cumplimiento de Mobile-First, `h-fit`, paginación adaptativa y casing de payloads hacia APIs externas.
- Emitir veredicto `[APPROVED]` o `[REJECTED]` con stack trace y motivos técnicos exactos.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Agent.md | c:\Users\Tadeo Leon Ferense\Desktop\Repositorios\ecomerce\Agent.md | Especificación de UI/UX (Arquitectura Dual de Temas: Storefront Light vs Backoffice Claro/Táctico) y Estructura de Vistas (`StorefrontView.tsx`, `SecurityView.tsx`, `MarketingView.tsx`) |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
