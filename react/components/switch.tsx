"use client"

// Owned here since ADR 0004: built on UI SDK rather than incoming's Base UI
// switch, so the agent bridge can read and change it. Same export, same
// `.ds-switch` classes and `data-slot`s, same `data-checked`/`data-unchecked`.
import type { ComponentProps, ReactNode } from "react"
import {
  Switch as SwitchPrimitive,
  SwitchThumb,
} from "@ui-sdk/react/switch"

import { cn } from "../lib/utils.js"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive
      data-slot="switch"
      data-size={size}
      className={cn("peer ds-switch", className)}
      {...props}
    >
      <SwitchThumb data-slot="switch-thumb" className="ds-switch-thumb" />
    </SwitchPrimitive>
  )
}

// DiametralGroup addition: the props type, named for callers.
export type SwitchProps = Omit<
  ComponentProps<typeof SwitchPrimitive>,
  "className" | "children"
> & {
  className?: string
  children?: ReactNode
  size?: "sm" | "default"
}

export { Switch }
