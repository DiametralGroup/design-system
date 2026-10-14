"use client"

import { cn } from "../lib/utils.js"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn("ds-kbd", className)}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("ds-kbd-group", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
