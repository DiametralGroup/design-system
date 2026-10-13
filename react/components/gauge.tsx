"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

export interface GaugeThreshold {
  /** Value at or above which `color` applies (last matching wins). */
  at: number
  /** Arc color once this threshold is reached. */
  color: string
}

// A 270° radial gauge for one value, ported from v1's GaugeChart
// (css/components/charts.css, react/components/GaugeChart.js): a faint full
// track arc behind a colored value arc, sized by stroke-dasharray so the arc
// draws without any SVG arc-path recomputation as the value changes.
function Gauge({
  className,
  value,
  max = 100,
  size = 180,
  thickness = 16,
  label,
  color,
  thresholds,
  format,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: number
  max?: number
  size?: number
  thickness?: number
  label?: React.ReactNode
  /** Arc color override. Defaults to `var(--ds-chart-1)`. */
  color?: string
  thresholds?: GaugeThreshold[]
  format?: (value: number) => React.ReactNode
}) {
  const frac = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0
  const sweep = (270 * Math.PI) / 180
  const startAngle = (45 * Math.PI) / 180
  const cxy = size / 2
  const radius = (size - thickness) / 2
  const arcLen = sweep * radius
  const valueLen = frac * arcLen

  const point = (angle: number): [number, number] => [
    cxy - radius * Math.sin(angle),
    cxy + radius * Math.cos(angle),
  ]
  const [x1, y1] = point(startAngle)
  const [x2, y2] = point(startAngle + sweep)
  const track = `M ${x1},${y1} A ${radius},${radius} 0 1 1 ${x2},${y2}`

  const arcColor =
    color ??
    thresholds?.reduce<string | undefined>(
      (chosen, t) => (value >= t.at ? t.color : chosen),
      undefined
    ) ??
    "var(--ds-chart-1)"

  const centerText = format ? format(value) : Math.round(value)
  const ariaLabel = `${label ? `${label}: ` : ""}${Math.round(value)} of ${max}`

  return (
    <div
      data-slot="gauge"
      role="img"
      aria-label={ariaLabel}
      className={cn("ds-gauge", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="ds-gauge-svg"
      >
        <path
          d={track}
          fill="none"
          strokeWidth={thickness}
          className="ds-gauge-track"
        />
        <path
          d={track}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={`${valueLen} ${arcLen}`}
          style={{ stroke: arcColor, transition: "stroke-dasharray 0.3s ease" }}
        />
        <text
          x={cxy}
          y={label != null ? cxy - size * 0.02 : cxy}
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={size * 0.24}
          className="ds-gauge-value"
        >
          {centerText}
        </text>
        {label != null && (
          <text
            x={cxy}
            y={cxy + size * 0.18}
            dominantBaseline="central"
            textAnchor="middle"
            className="ds-gauge-label"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  )
}

export { Gauge }
