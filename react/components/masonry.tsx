"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

// `columns` becomes a `--columns` custom property, so any integer works —
// same trick as `AspectRatio`'s `--ratio`, no responsive breakpoint list to
// maintain. Items break across CSS multi-column layout; `break-inside-avoid`
// keeps each child intact rather than splitting it across two columns.
function Masonry({
  columns = 3,
  className,
  ...props
}: React.ComponentProps<"div"> & { columns?: number }) {
  return (
    <div
      data-slot="masonry"
      style={{ "--columns": columns } as React.CSSProperties}
      className={cn("ds-masonry", className)}
      {...props}
    />
  )
}

export { Masonry }
