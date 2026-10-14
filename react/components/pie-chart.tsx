"use client"

import * as React from "react"
import { Pie, PieChart as RechartsPieChart } from "recharts"

import { withSliceColors } from "../lib/chart-series.js"
import { cn } from "../lib/utils.js"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart.js"

// The finished pie over v2's recharts primitives, standing in for v1's
// hand-rolled SVG PieChart (react/components/PieChart.js). v1's props land
// like this:
//
//   v1 `value` / `label`  ->  `valueKey` / `nameKey`, the row fields holding
//                              the number and the slice name
//   v1 `color`            ->  a `config` entry per slice name
//   v1 `legend`           ->  `legend`
//   v1 `size`             ->  `className`; the container is responsive, so the
//                              pie is sized by its box rather than a px number
//
// `nameKey` is also what the tooltip and legend look their labels up by, which
// is why a slice name that is not a `config` key renders a swatch and no text.
function PieChart({
  className,
  config,
  data,
  valueKey,
  nameKey,
  legend = true,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ChartContainer>, "config" | "children"> & {
  config: ChartConfig
  data: Record<string, unknown>[]
  /** Row field holding the slice's number. */
  valueKey: string
  /** Row field holding the slice's name — the key into `config`. */
  nameKey: string
  legend?: boolean
  /** Extra recharts children — a second `Pie`, a `ReferenceLine`. */
  children?: React.ReactNode
}) {
  return (
    <ChartContainer
      config={config}
      // A definite height is what `aspect-square` resolves the width against:
      // capping with `max-h-*` alone leaves both axes indefinite and the
      // container measures 0, so recharts never draws. aspect-square and h-64
      // stay literal Tailwind utilities — pie-chart/compact.tsx overrides h-64
      // with h-28, relying on tailwind-merge to dedupe against the component's
      // own default, and aspect-square itself has to dedupe against
      // ChartContainer's literal aspect-video default.
      className={cn("ds-pie-chart-root aspect-square h-64", className)}
      {...props}
    >
      <RechartsPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
        <Pie
          data={withSliceColors(data, nameKey)}
          dataKey={valueKey}
          nameKey={nameKey}
          outerRadius="90%"
        />
        {legend ? (
          <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
        ) : null}
        {children}
      </RechartsPieChart>
    </ChartContainer>
  )
}

export { PieChart }
