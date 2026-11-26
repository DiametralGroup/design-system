# Adopting UI SDK: agent-ready components

Why: [ADR 0004](docs/adr/0004-ui-sdk-as-the-agent-substrate.md). The rule behind everything
below: **an agent only sees components built on UI SDK.** A Base UI component, a `<ds-*>`
element or a plain `<button>` is invisible to `snapshot()` and `act()`.

| Status | Components |
| --- | --- |
| Agent-ready | `Switch` |
| Next, in this order | `Button`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Select`, `Tabs`, `Dialog`, `AlertDialog`, `DropdownMenu` |

Start with `Button`: every action an agent takes ends on one.

Pinned: `@ui-sdk/core` and `@ui-sdk/react` at `0.1.0-beta.17`. The docs that match this version
ship in `node_modules/@ui-sdk/react/docs/`: start at `llms.txt`, then open
`components/<name>.md`. Read those docs rather than relying on memory, because the API is
still in beta.

## Move the next component

The pilot is `react/components/switch.tsx`. Copy its shape.

1. **Read the UI SDK page.** Open `node_modules/@ui-sdk/react/docs/components/<name>.md`, at
   Composition and Data Attributes. Compare the `data-*` state attributes with the selectors in
   `css/components/<name>.css`.
2. **Rewrite the file in place.** Same export name, same `ds-*` classes, same `data-slot`
   values. Map each old prop onto UI SDK's. Keep the exported props type compatible, so callers
   don't change. Replace the header comment with the "Owned here since ADR 0004" note.
3. **Don't touch CSS or tokens.** If UI SDK emits a state attribute the CSS doesn't select,
   bridge it in the component, not in `css/`. If a rule truly has to change, the component is
   not ready to move: raise it instead.
4. **Wrap what UI SDK doesn't ship** (stepper, wizard, kanban, data-table, …) with
   `definePrimitive` from `@ui-sdk/core`. Finish it with an `agent` key naming what an agent may
   call, for example `agent: { actions: ["goTo"] }`. See `docs/core.md`, *Define a Primitive*,
   and `docs/agents.md`, *The Agent Key*.
5. **Prove it.** Add an "Operated by an agent" demo to the component's docs page, and a
   `site/tests/<name>-agent-regress.spec.ts` covering keyboard, focus, ARIA, `snapshot`, `act`
   and one refused step. Copy `site/tests/switch-agent-regress.spec.ts`. Then run
   `npm run build`, then in `site/`: `npm run test:regress`, `test:a11y`, `test:visual`.

Pitfalls the pilot hit:

- **The same component can behave differently.** UI SDK's Switch never toggles on Enter (Enter
  submits the form); Space does. Read each page's Keyboard table, and record any change in the
  commit message.
- **The root element can change.** The Switch root went from `<span>` to `<button>`, and a
  visually hidden `<input data-slot="switch-input">` now follows it. Before and after
  screenshots catch this.
- **The HTML tab's markup gate rejects attributes nothing in `css/` styles.** Agent markers like
  `data-agent-hidden` go on the strip list in `site/plugins/markup-contract.ts`.
- **Demo chrome must not collide with labels.** An agent matches a label by its words. Put a
  demo's own buttons inside `data-agent-hidden`.

## Wire the bridge in an app (Calque)

Create the bridge once, in client code, from this package. It re-exports the same
`@ui-sdk/react` the components use, so there is a single core:

```ts
// agent.ts ("use client" in Next.js)
import { createAgent } from "@diametral/design-system/agent"

export const agent = createAgent({
  // Every step passes through here. Return false to refuse it, or a Promise
  // to ask the person first.
  allow: (step, { signal }) =>
    step.confirm ? confirmWithPerson(step.confirm, { signal }) : true,
})
```

`confirmWithPerson` is your own confirmation UI.

Mark what an agent must not do alone, in the markup. The marks only take effect on
agent-ready components: until `Button` moves, the agent cannot see it at all.

```tsx
<Button data-agent-confirm="Deletes the slide and its notes">Delete slide</Button>
<div data-agent-hidden>{/* chrome the agent should not see */}</div>
```

Tell agent edits apart from a person's, in the change callbacks the app already has:

```tsx
<Switch
  checked={autosave}
  onCheckedChange={(next, details) => {
    if (details.source === "agent") markAsAgentEdit("autosave")
    setAutosave(next)
  }}
/>
```

Call `details.cancel()` in the same callback to refuse a value after the fact.

**Model on your server.** Send `agentTools` to the model as tool definitions. Run each tool call
in the browser with `agent[tool](input)` and return the result. For the full
`useChat` / `onToolCall` loop, see `docs/agents.md`, *Run the Model on Your Server*.

```ts
import { agentTools } from "@diametral/design-system/agent"
// agentTools: [{ name: "snapshot" | "act" | "query", description, inputSchema }]
```

**Browser agents (WebMCP).** Register the same three tools with the browser:

```ts
import { registerTools } from "@diametral/design-system/agent"
import { agent } from "./agent"

// The bridge's allow already asks the person, so don't ask twice here.
const unregister = registerTools(agent, { allow: () => true })
```

In a browser without `document.modelContext`, this does nothing.

**Keep the agent current.** `agent.subscribe(change => …)` reports what the person changed
between turns. Send those changes with the next model call.

Checklist before an app screen ships:

1. Every control has a unique accessible name: a `Label`, a field title, or `aria-label`.
2. Every control the agent must use is a component on the Agent-ready list above.
3. Destructive actions carry `data-agent-confirm`, and secrets carry `data-agent-secret`.
4. App state flows through `on*Change` callbacks, not `onClick` or `onKeyDown`: agent changes
   call the component's API and never fire DOM events.
