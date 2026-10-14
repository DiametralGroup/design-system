"use client"

import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group"

import { cn } from "../lib/utils.js"

/* DiametralGroup addition: `orientation`, which lays the group out as a
   wrapping row by deduping incoming's literal `flex-col gap-3` through `cn`. */
export interface CheckboxGroupProps extends CheckboxGroupPrimitive.Props {
  orientation?: "vertical" | "horizontal"
}

function CheckboxGroup({
  className,
  orientation,
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cn(
        "ds-checkbox-group flex-col gap-3",
        orientation === "horizontal" && "flex-row flex-wrap gap-x-6",
        className
      )}
      {...props}
    />
  )
}

export { CheckboxGroup }
