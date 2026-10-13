"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

// DiametralGroup addition: the props type, named for callers.
export type TextareaProps = React.ComponentProps<"textarea">

// DiametralGroup addition: forwardRef, so a ref reaches the <textarea> on
// React 18 (the peer range starts there).
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, rows, style, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      rows={rows}
      // field-sizing-content makes the browser ignore `rows`, so re-create it as a
      // floor: `rows` line boxes plus --textarea-chrome (this element's own vertical
      // padding + border, which border-box min-height has to account for).
      style={
        rows
          ? {
              minHeight: `calc(${rows} * 1lh + var(--textarea-chrome))`,
              ...style,
            }
          : style
      }
      className={cn(
        "ds-textarea border border-transparent border-b-input py-3 [--textarea-chrome:calc(1.5rem+2px)]",
        className
      )}
      {...props}
    />
  )
})

export { Textarea }
