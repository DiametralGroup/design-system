# @diametral/design-system

The official Diametral design system, published to npm as `@diametral/design-system` (see `package.json` for the version).

Build: `npm run build` (tokens → css → components → figma). Tests live in `site/` — `cd site && npm run test:visual`, `npm run test:a11y`.
Root is the published package; `site/` is the docs site — serve it locally with `cd site && npm run dev` (after `npm run build` at root, which `site/`'s `file:..` install needs).

For generating on-brand UI with `.ds-*` classes and `--ds-*` tokens, read `docs/for-claude.md`.
For adopting the system in an app that has its own styles, read `docs/migration.md`.

## The absorption

This repo is the **target** of an in-flight migration: `@diametral/ui` — a 119-component
React/CSS library living in `diamorval/design-system-diametral` under `packages/ui` — is
being absorbed into this package. `@diametral/ui` was never published to npm and is retired
by the absorption, not deprecated.

**Source ref.** Incoming's `main` is the model (2026-10-13 sync, see
`docs/absorption/audit-2026-10.md`). `css/components/*.css` are generated from it by
`node scripts/sync-incoming-css.mjs <incoming checkout>` — edit only the "DiametralGroup
additions" block of a generated file; `react/components/*.tsx` are incoming's files plus
marked additions. `starters/ops-dashboard` (incoming's example app on this package) must keep
passing its parity test. The earlier batches read the frozen `migration-source-v1` tag
([issue #171](https://github.com/diamorval/design-system-diametral/issues/171)).

**Reference material** lives in `docs/absorption/` (note: `docs/migration.md`, singular, is a
different document — the adoption guide):

| File | What it holds |
| --- | --- |
| `docs/absorption/batch-plan.md` | The 8 batches plus batch 0 in three parts; ordering rule; per-batch task lists. The executable plan. |
| `docs/absorption/inventory.md` | Every component in both libraries and how they correspond. |
| `docs/absorption/react-ledger.md` | Per-component React verdicts: source-wins, admit-outright, incumbent-holds, CSS-only. |
| `docs/absorption/css-ledger.md` | Per-file CSS verdicts: frozen, wholesale replacement, React-pinned hold, net-new. |

These four are **copies**, each carrying a provenance header naming the source commit. Correct
a measurement at the source and re-copy; editing a copy in place diverges it silently.
`docs/absorption/corrections.md` is the fifth file and is **not** a copy: it is where a batch
records a source defect it fixed forward, or a plan measurement execution proved wrong.
`docs/absorption/direction.md` is the sixth and is also not a copy: it records the 2026-09-04
policy reversal — **incoming is the model, the incumbent contributes additives only** — and
voids the ledgers' `frozen` and `incumbent-holds` verdicts. Read it before any ledger verdict.

**Planning history.** Every *what* and *in what order* decision is closed and recorded on the
source repo's tracker: [the migration map](https://github.com/diamorval/design-system-diametral/issues/151)
and its 17 children, then [the handoff map](https://github.com/diamorval/design-system-diametral/issues/168).
The batch queue itself lives here, as issues in this repo.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `LittleBigCode/design-system`, via the `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles and how they map to this repo's labels.
See `docs/agents/triage-labels.md`.
