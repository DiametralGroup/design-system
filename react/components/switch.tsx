"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "../lib/utils.js"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn("peer ds-switch", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ds-switch-thumb"
      />
    </SwitchPrimitive.Root>
  )
}

// DiametralGroup addition: the props type, named for callers.
export type SwitchProps = SwitchPrimitive.Root.Props & { size?: "sm" | "default" }

export { Switch }
