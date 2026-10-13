"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { seriesColor } from "../lib/chart-series.js"
import { cn } from "../lib/utils.js"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart.js"

/**
 * Each row's segments as percentages of that row's own total, which is what
 * makes every bar the same length and the comparison a comparison of shares.
 * A row that sums to zero stays at zero rather than dividing by it.
 */
function toShares(
  data: Record<string, unknown>[],
  segments: string[],
  labelKey?: string
) {
  return data.map((row) => {
    const total = segments.reduce(
      (sum, key) => sum + (Number(row[key]) || 0),
      0
    )
    const share: Record<string, unknown> = labelKey
      ? { [labelKey]: row[labelKey] }
      : {}
    for (const key of segments) {
      share[key] = total > 0 ? ((Number(row[key]) || 0) / total) * 100 : 0
    }
    return share
  })
}

// Flat proportional bars, standing in for v1's CSS-flex StackedBar
// (react/components/StackedBar.js). v1's props land like this:
//
//   v1 `segments` / `color`  ->  `config`, which is how v2 already keys a
//                                 series' label and colour
//   v1 `value` / `label`     ->  a `config` key per segment, and `labelKey`
//                                 for the row field naming the row
//   v1 `showLegend`          ->  `showLegend`, now drawn by `ChartLegend`
//
// This is the share chart, not the magnitude one: every row is normalised to
// its own total so the bars are the same length and only the split differs.
// When the absolute size of each row matters, `BarChart` with `stacked` keeps
// the raw values.
function StackedBar({
  className,
  config,
  data,
  labelKey,
  showLegend = true,
  margin = { top: 8, right: 8, bottom: 0, left: 8 },
  children,
  ...props
}: Omit<React.ComponentProps<typeof ChartContainer>, "config" | "children"> & {
  config: ChartConfig
  data: Record<string, unknown>[]
  /** Row field naming each row down the left. */
  labelKey?: string
  showLegend?: boolean
  margin?: React.ComponentProps<typeof BarChart>["margin"]
  /** Extra recharts children — a `ReferenceLine`, a second axis. */
  children?: React.ReactNode
}) {
  const segments = Object.keys(config)
  const shares = toShares(data, segments, labelKey)

  return (
    <ChartContainer
      config={config}
      className={cn("ds-stacked-bar-root h-40", className)}
      {...props}
    >
      <BarChart
        accessibilityLayer
        layout="vertical"
        data={shares}
        margin={margin}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        {labelKey ? (
          <YAxis
            type="category"
            dataKey={labelKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={80}
          />
        ) : (
          <YAxis type="category" hide />
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) =>
                `${config[name as string]?.label ?? name}: ${Math.round(Number(value))}%`
              }
            />
          }
        />
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {segments.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="stack"
            fill={seriesColor(key, i)}
          />
        ))}
        {children}
      </BarChart>
    </ChartContainer>
  )
}

export { StackedBar }
