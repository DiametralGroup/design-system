# ADR 0004 — UI SDK is the behaviour and agent substrate of the React layer

- **Status:** Accepted
- **Date:** 2026-11-26
- **Decided by:** the package owner, on the "agent ready" audit (this branch)
- **Applies from:** `2.0.0`
- **Amends:** [ADR 0001](./0001-base-ui-as-a-substrate.md) (Base UI as substrate) and
  [`direction.md`](../absorption/direction.md) decision 13 (peer `react >=18`)

## Context

Every app that consumes this package is built for an AI agent to operate, starting with
Calque, where people co-edit slides with one. Today an agent can only operate those apps
through screenshots and synthetic clicks.

[UI SDK](https://github.com/vercel-labs/ui) (`@ui-sdk/core` + `@ui-sdk/react`, Apache-2.0)
gives the same headless behaviours Base UI gives (focus, keyboard, ARIA, popups, selection)
**and** an agent bridge: `createAgent()` returns `snapshot` / `act` / `query`, every change
callback reports `details.source === "agent"`, an `allow` callback can refuse a step, and
`registerTools` exposes the three tools to a WebMCP browser agent.

The bridge only sees components built on UI SDK. Its own docs (`agents.md`, 0.1.0-beta.17):

> The snapshot includes ui-sdk components.

A Base UI component next to a UI SDK one is invisible to the agent, so the two cannot coexist
as alternatives: an app would pick per control and the agent would see a page with holes.

## Decision

1. **UI SDK replaces Base UI component by component, in place.** Each export keeps its name,
   its `.ds-*` classes and its `data-slot`, so no app changes an import and no token or CSS
   changes. Components UI SDK does not ship are wrapped with `definePrimitive` and an `agent`
   key. Purely presentational components are untouched.
2. **`@ui-sdk/core` and `@ui-sdk/react` are pinned to an exact version** (`0.1.0-beta.17`).
   The API is in beta; every bump is a deliberate change that re-runs the suites.
3. **The bridge ships from this package** as `@diametral/design-system/agent`, re-exported from
   the same `@ui-sdk/react` copy the components use, so an app cannot end up with two cores.
4. **The React peer range becomes `>=19`.** `@ui-sdk/react` requires React 19. This reverses
   `direction.md` decision 13; the CI consumer job now compiles against React 19.
5. **This repo owns the React layer.** `react/components/*.tsx` stop being "incoming's files
   plus marked additions" once a component moves to UI SDK; each moved file says so in its
   header. CSS stays generated from incoming as before.

## Consequences

- **Major version.** Dropping React 18 is breaking: the next release is `2.0.0`.
- **Mixed period.** Until the migration finishes, only migrated components are visible to an
  agent. `ADOPTION.md` lists the order and how to move the next one.
- **Two substrates for a while.** Base UI stays a dependency until its last import is gone,
  then it is removed (ADR 0001's founding case closes).
- **Beta risk.** A breaking change in UI SDK lands as a failed suite on the pinned bump, not
  in production.
- The CSS, tokens, web components and email layers are unaffected: they import nothing.
