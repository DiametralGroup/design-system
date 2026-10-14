"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts"

import { seriesColor } from "../lib/chart-series.js"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart.js"

// The finished line chart over v2's recharts primitives, standing in for v1's
// hand-rolled SVG LineChart (react/components/LineChart.js).
//
// v1's props map onto `ChartConfig` rather than surviving verbatim, because
// that object is already how v2 names and colours a series and how the tooltip
// and legend look their labels up:
//
//   v1 `series` / `name` / `color`  ->  one `config` entry per series, keyed by
//                                       the field name in each `data` row
//   v1 `data` (number[])            ->  `data`, row objects as recharts wants
//   v1 `labels` (string[])          ->  `xAxisKey`, the row field holding them
//   v1 `width` / `height`           ->  `className`; the container is responsive
//
// `dots` and `grid` survive as they were. Series with no colour of their own
// fall back to the `--ds-chart-*` ramp, so a config of bare labels still draws.
function LineChart({
  className,
  config,
  data,
  xAxisKey,
  grid = true,
  dots = true,
  legend,
  margin = { top: 8, right: 20, bottom: 0, left: 20 },
  valueAxis = false,
  valueFormatter,
  valueAxisWidth,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ChartContainer>, "config" | "children"> & {
  config: ChartConfig
  data: Record<string, unknown>[]
  /** Row field the x axis reads its categories from. Omitted, there is no axis. */
  xAxisKey?: string
  grid?: boolean
  dots?: boolean
  margin?: React.ComponentProps<typeof RechartsLineChart>["margin"]
  /** Defaults on once `config` names more than one series. */
  legend?: boolean
  /** Extra recharts children — a `ReferenceLine`, a second axis. */
  children?: React.ReactNode
  // DiametralGroup addition: an optional value (Y) axis.
  /** Draw a value (Y) axis. Off by default: the tooltip carries the figure. */
  valueAxis?: boolean
  /** Formats the value axis ticks. */
  valueFormatter?: (value: number) => string
  /** Width of the value axis; widen it for formatted amounts. */
  valueAxisWidth?: number
}) {
  const series = Object.keys(config)

  return (
    <ChartContainer
      config={config}
      className={className}
      {...props}
    >
      {/* The default side margins are what stop the first and last x tick from
          being clipped: recharts centres every tick on its point, including the
          two on the edges, and its surface is overflow:hidden. 20px clears a
          label of about five characters; a longer one wants a wider `margin`. */}
      <RechartsLineChart accessibilityLayer data={data} margin={margin}>
        {grid ? <CartesianGrid vertical={false} /> : null}
        {xAxisKey ? (
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // Recharts will happily print all 24 hours of a day on top of each
            // other. Thinning the run while pinning both ends keeps a dense
            // series readable without the caller having to count its points.
            interval="preserveStartEnd"
            minTickGap={16}
          />
        ) : null}
        {/* DiametralGroup addition: the optional value axis. */}
        {valueAxis ? (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            width={valueAxisWidth}
          />
        ) : null}
        <ChartTooltip content={<ChartTooltipContent />} />
        {(legend ?? series.length > 1) ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {series.map((key, i) => (
          <Line
            key={key}
            dataKey={key}
            stroke={seriesColor(key, i)}
            strokeWidth={2}
            dot={dots}
            activeDot={{ r: 4 }}
          />
        ))}
        {children}
      </RechartsLineChart>
    </ChartContainer>
  )
}

export { LineChart }
