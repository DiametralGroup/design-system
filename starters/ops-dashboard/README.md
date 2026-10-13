# Diametral Ops — example dashboard

A consulting-firm dashboard built only from `@diametral/design-system`. It is
[diamorval/diametral-ui-example](https://github.com/diamorval/diametral-ui-example)
moved onto this package: same pages, same code, with three lines changed.

| | diametral-ui-example | here |
| --- | --- | --- |
| stylesheet | `@import "diametral-ds/styles.tailwind.css";` | `@import "@diametral/design-system/tailwind.css";` |
| components | `from "diametral-ds"` | `from "@diametral/design-system/react"` |
| logo | `diametral-ds/assets/diametral-mark.svg` | `@diametral/design-system/assets/logo/diametral-mark.svg` |

## Run it

```bash
npm run build          # at the repo root first: the app installs the package from ../.. (file:)
cd starters/ops-dashboard
npm install
npm run dev
```

## Checks

`npm test` builds the app and runs two Playwright suites:

- `tests/smoke.spec.ts` — the original app's smoke test, unchanged: every page
  renders its heading with no console errors, the flat styling applies, dark
  mode, the command palette and navigation work.
- `tests/parity.spec.ts` — every page, light and dark, compared with a
  full-page screenshot of the original app built on `diametral-ds` 0.4.0
  (`tests/parity-baselines/`). Tolerance: 0.2% of pixels, for sub-pixel text
  antialiasing. The baselines come from the original app on Linux Chromium;
  never regenerate them from this one.

## Local-link notes

Because the package is linked from `../..` rather than installed from the
registry, two settings make the app resolve one copy of everything:
`resolve.dedupe` in `vite.config.ts` (React, recharts, Phosphor) and `paths`
in `tsconfig.json` (React 19 types — the repo root has React 18's). An app
installing `@diametral/design-system` from npm needs neither.
