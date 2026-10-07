"use client"

import * as React from "react"

import { cx } from "../lib/cx.js"

/* Signal — a status dot in front of its label, and the share bar that splits a
   population by the same tones (css/components/signal.css).
   ---------------------------------------------------------------------------
   The dot is aria-hidden: the label carries the meaning. With no children the
   signal is a bare dot (for `SignalRow`), so it then needs a `title` — the
   caller's accessible name for it. */
type SignalTone = "done" | "progress" | "blocked" | "warn" | "idle" | "empty"

function Signal({
  tone = "empty",
  square = false,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: SignalTone; square?: boolean }) {
  return (
    <span
      data-slot="signal"
      className={cx("ds-signal", `ds-signal--${tone}`, square && "ds-signal--square", className)}
      role={children ? undefined : "img"}
      {...props}
    >
      <span className="ds-signal__dot" aria-hidden="true" />
      {children}
    </span>
  )
}

function SignalRow({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="signal-row" className={cx("ds-signal-row", className)} {...props} />
}

type SignalBarSegment = { tone: SignalTone; value: number; label: string }

/* One role="img" for the whole bar: the aria-label spells the split out
   ("In progress 7, Done 3"), and `legend` repeats it as visible text. */
function SignalBar({
  segments,
  legend = true,
  className,
  ...props
}: React.ComponentProps<"div"> & { segments: SignalBarSegment[]; legend?: boolean }) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1
  const label = segments.map((s) => `${s.label} ${s.value}`).join(", ")
  return (
    <div data-slot="signal-bar-root" className={className} {...props}>
      <div className="ds-signal-bar" role="img" aria-label={label}>
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <span
              key={s.tone + s.label}
              className={cx("ds-signal-bar__seg", `ds-signal--${s.tone}`)}
              style={{ inlineSize: `${(100 * s.value) / total}%` }}
              title={`${s.label}: ${s.value}`}
            />
          ))}
      </div>
      {legend && (
        <div className="ds-signal-legend" aria-hidden="true">
          {segments.map((s) => (
            <Signal key={s.tone + s.label} tone={s.tone}>
              {s.label} <b className="ds-signal__count">{s.value}</b>
            </Signal>
          ))}
        </div>
      )}
    </div>
  )
}

export { Signal, SignalRow, SignalBar }
export type { SignalTone, SignalBarSegment }
