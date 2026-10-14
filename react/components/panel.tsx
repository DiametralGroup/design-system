"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

// DiametralGroup addition: `PanelProps` and the legacy `rows` flag, which
// writes the 0.x `.ds-panel--rows` modifier (tighter bottom padding).
export type PanelProps = React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  rows?: boolean
}

function Panel({
  className,
  size = "default",
  rows,
  ...props
}: PanelProps) {
  return (
    <div
      data-slot="panel"
      data-size={size}
      className={cn("ds-panel", rows && "ds-panel--rows", className)}
      {...props}
    />
  )
}

// DiametralGroup addition: `ruled` draws the bottom rule via the legacy
// `.ds-panel__header--ruled` modifier.
function PanelHeader({
  className,
  ruled,
  ...props
}: React.ComponentProps<"div"> & { ruled?: boolean }) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "ds-panel-header",
        ruled && "ds-panel__header--ruled",
        className
      )}
      {...props}
    />
  )
}

function PanelTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-title"
      className={cn("ds-panel-title", className)}
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-content"
      className={cn("ds-panel-content", className)}
      {...props}
    />
  )
}

// DiametralGroup addition: `ruled` draws the top rule via the legacy
// `.ds-panel__footer--ruled` modifier.
function PanelFooter({
  className,
  ruled,
  ...props
}: React.ComponentProps<"div"> & { ruled?: boolean }) {
  return (
    <div
      data-slot="panel-footer"
      className={cn(
        "ds-panel-footer",
        ruled && "ds-panel__footer--ruled",
        className
      )}
      {...props}
    />
  )
}

// A tight, dividing row for input-row content (settings toggles, key/value
// pairs) — the case v1's Panel handled with a `rows` boolean; here it is its
// own part instead of a variant flag.
function PanelRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-row"
      className={cn("ds-panel-row", className)}
      {...props}
    />
  )
}

export { Panel, PanelHeader, PanelTitle, PanelContent, PanelFooter, PanelRow }
