"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

// DiametralGroup addition: the tone union, named for callers.
export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "critical"
  | "neutral"
  | "info"

// Sets --tone for the dot and label to share; the six tones mirror
// tag/banner/alert's shared substrate (globals.css) so a status reading
// "danger" always means the same color everywhere in the system.
const statusVariants = cva("group/status ds-status", {
  variants: {
    tone: {
      success: "ds-status--success",
      warning: "ds-status--warning",
      danger: "ds-status--danger",
      critical: "ds-status--critical",
      neutral: "ds-status--neutral",
      info: "ds-status--info",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

function Status({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusVariants>) {
  return (
    <span
      data-slot="status"
      className={cn(statusVariants({ tone }), className)}
      {...props}
    />
  )
}

function StatusIndicator({
  className,
  pulse,
  ...props
}: React.ComponentProps<"span"> & { pulse?: boolean }) {
  return (
    <span
      data-slot="status-indicator"
      aria-hidden="true"
      className={cn("ds-status-indicator", className)}
      {...props}
    >
      {pulse && <span className="ds-status-indicator-ping" />}
    </span>
  )
}

function StatusLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="status-label"
      className={cn("ds-status-label", className)}
      {...props}
    />
  )
}

// DiametralGroup addition: the 0.x status *panel* (solid head, metric rows),
// renamed from `Status` so the inline indicator above keeps the name. Renders
// the legacy `.ds-status__*` / `.ds-metric` grammar from status-panel.css.
export interface StatusPanelProps extends React.ComponentProps<"div"> {
  status?: StatusTone
  kicker?: React.ReactNode
  heading?: React.ReactNode
  subtitle?: React.ReactNode
}

function StatusPanel({
  status = "neutral",
  kicker,
  heading,
  subtitle,
  className,
  children,
  ...rest
}: StatusPanelProps) {
  return (
    <div className={cn("ds-status", `ds-status--${status}`, className)} {...rest}>
      <div className="ds-status__head">
        {kicker != null ? <div className="ds-status__kicker">{kicker}</div> : null}
        {heading != null ? <div className="ds-status__title">{heading}</div> : null}
        {subtitle != null ? <div className="ds-status__subtitle">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  )
}

export interface MetricProps {
  label: React.ReactNode
  value: React.ReactNode
  variant?: "hero" | "sub"
  /** Sign of the value: > 0 colors it success, < 0 colors it danger. */
  sign?: number
  className?: string
}

function Metric({ label, value, variant, sign, className }: MetricProps) {
  const tone = (sign ?? 0) > 0 ? "is-pos" : (sign ?? 0) < 0 ? "is-neg" : null
  return (
    <div className={cn("ds-metric", variant && `ds-metric--${variant}`, className)}>
      <span className="ds-metric__k">{label}</span>
      <span className={cn("ds-metric__v", tone)}>{value}</span>
    </div>
  )
}

export {
  Status,
  StatusIndicator,
  StatusLabel,
  StatusPanel,
  Metric,
  statusVariants,
}
