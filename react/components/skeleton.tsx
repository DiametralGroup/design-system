"use client"

import { cn } from "../lib/utils.js"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("ds-skeleton", className)}
      {...props}
    />
  )
}

export { Skeleton }
