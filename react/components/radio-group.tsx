"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "../lib/utils.js"

function RadioGroup({
  className,
  name,
  ...props
}: RadioGroupPrimitive.Props) {
  // DiametralGroup addition: Base UI's `name` has no default, so every radio
  // renders name="". Default it to a generated id so a group works natively.
  const generatedName = React.useId()
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      name={name ?? generatedName}
      className={cn("ds-radio-group w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn("peer ds-radio-group-item", className)}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="ds-radio-group-indicator"
      >
        <span className="ds-radio-group-dot" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
