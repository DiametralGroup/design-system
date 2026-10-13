"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

// Absorbs v1's Chip (css/components/chip.css): a boxed, tinted label, as
// opposed to Badge's bare typographic one. Chip's only axis was a boolean
// `warn`; here that becomes `tone="warning"`, folded into the same six-tone
// family status/banner/alert share instead of a second component.
const tagVariants = cva("ds-tag", {
  variants: {
    tone: {
      neutral: "ds-tag--neutral",
      success: "ds-tag--success",
      warning: "ds-tag--warning",
      danger: "ds-tag--danger",
      critical: "ds-tag--critical",
      info: "ds-tag--info",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

// DiametralGroup addition: the tone union, named for callers.
export type TagTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "critical"

// DiametralGroup additions: `status` (the 0.x name for `tone`, still mapped),
// `onRemove` (a trailing × button, the legacy `.ds-tag__remove`).
export interface TagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tagVariants> {
  /** @deprecated Renamed `tone`. Still accepted and still mapped. */
  status?: "info" | "success" | "warning" | "danger"
  /** Render a trailing × button; called when it is clicked. */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// DiametralGroup addition: forwardRef, so a ref reaches the <span> on React 18.
const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, tone, status, onRemove, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      data-slot="tag"
      className={cn(
        tagVariants({ tone: tone ?? status }),
        onRemove && "ds-tag--removable",
        className
      )}
      {...props}
    >
      {children}
      {onRemove ? (
        <button
          className="ds-tag__remove"
          type="button"
          aria-label="Remove"
          onClick={onRemove}
        >
          ×
        </button>
      ) : null}
    </span>
  )
})

export { Tag, tagVariants }
