"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label data-slot="label" className={cn("ds-label", className)} {...props} />
  )
}

export { Label }
