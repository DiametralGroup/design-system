"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "../lib/utils.js"

// DiametralGroup addition: `number` applies the 0.x right-aligned numeric
// treatment (`.ds-input--number`); the props are exported by name.
type InputProps = React.ComponentProps<"input"> & {
  /** Right-aligned, fixed-width numeric field (`.ds-input--number`). */
  number?: boolean
}

function Input({ className, type, number, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "ds-input border border-transparent border-b-input px-0",
        number && "ds-input--number",
        className
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
